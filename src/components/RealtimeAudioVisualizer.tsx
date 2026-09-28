import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioContext';

interface RealtimeAudioVisualizerProps {
  className?: string;
  height?: number; // default 28
  barWidthClass?: string; // "w-[4.5px] sm:w-[5px]"
  gapClass?: string; // "gap-[3px]"
  barCount?: number; // EXACTLY 20 distinct bars
}

export const RealtimeAudioVisualizer: React.FC<RealtimeAudioVisualizerProps> = ({
  className = '',
  height = 28,
  barWidthClass = 'w-[4.5px] sm:w-[5px]',
  gapClass = 'gap-[3px]',
  barCount = 20,
}) => {
  const { isPlaying, analyserRef, currentVolume } = useAudioPlayer();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentBarsRef = useRef<number[]>(new Array(barCount).fill(2.0));
  const currentVolRef = useRef<number>(currentVolume);

  // Sync real-time master volume
  useEffect(() => {
    currentVolRef.current = currentVolume;
  }, [currentVolume]);

  useEffect(() => {
    let animId: number;
    const maxHeight = Math.max(14, height - 2);

    // Exact frequency boundaries for the 20 independent bars
    // Bars 0-3: 4 Bass bars (20Hz - 250Hz)
    // Bars 4-13: 10 Mids/Vocals bars (250Hz - 3500Hz)
    // Bars 14-19: 6 Treble bars (4000Hz - 14000Hz) with +2.0x compensation
    const barFrequencyRanges: { fLow: number; fHigh: number; gainComp: number }[] = [
      // Bars 1 to 4: Bass (20Hz - 250Hz)
      { fLow: 20, fHigh: 60, gainComp: 1.0 },
      { fLow: 60, fHigh: 110, gainComp: 1.0 },
      { fLow: 110, fHigh: 175, gainComp: 1.0 },
      { fLow: 175, fHigh: 250, gainComp: 1.0 },

      // Bars 5 to 14: Mids / Vocals (250Hz - 3500Hz)
      { fLow: 250, fHigh: 330, gainComp: 1.1 },
      { fLow: 330, fHigh: 440, gainComp: 1.15 },
      { fLow: 440, fHigh: 600, gainComp: 1.2 },
      { fLow: 600, fHigh: 820, gainComp: 1.25 },
      { fLow: 820, fHigh: 1120, gainComp: 1.3 },
      { fLow: 1120, fHigh: 1520, gainComp: 1.35 },
      { fLow: 1520, fHigh: 2050, gainComp: 1.4 },
      { fLow: 2050, fHigh: 2500, gainComp: 1.45 },
      { fLow: 2500, fHigh: 3000, gainComp: 1.5 },
      { fLow: 3000, fHigh: 3500, gainComp: 1.55 },

      // Bars 15 to 20: Treble / Highs (4000Hz - 14000Hz) with +2.0x gain compensation
      { fLow: 4000, fHigh: 5000, gainComp: 2.0 },
      { fLow: 5000, fHigh: 6300, gainComp: 2.0 },
      { fLow: 6300, fHigh: 7900, gainComp: 2.0 },
      { fLow: 7900, fHigh: 9800, gainComp: 2.0 },
      { fLow: 9800, fHigh: 11800, gainComp: 2.0 },
      { fLow: 11800, fHigh: 14000, gainComp: 2.0 },
    ];

    const loop = () => {
      const vol = currentVolRef.current;
      const currentBars = currentBarsRef.current;

      let dataArray: Uint8Array<ArrayBuffer> | null = null;
      let binCount = 0;
      let binHz = 21.53; // Default 44100 / 2048

      if (analyserRef.current && isPlaying && vol > 0) {
        const analyser = analyserRef.current;
        binCount = analyser.frequencyBinCount;
        dataArray = new Uint8Array(new ArrayBuffer(binCount));
        analyser.getByteFrequencyData(dataArray);

        const sampleRate = analyser.context?.sampleRate || 44100;
        const fftSize = analyser.fftSize || 2048;
        binHz = sampleRate / fftSize;
      }

      // Sample discrete bin ranges for each of the 20 bars independently
      for (let i = 0; i < barCount; i++) {
        let targetHeight = 2.0 * vol;

        if (isPlaying && vol > 0 && dataArray && binCount > 0) {
          const config = barFrequencyRanges[i] || { fLow: 200, fHigh: 1000, gainComp: 1.0 };
          const bStart = Math.max(0, Math.min(binCount - 1, Math.floor(config.fLow / binHz)));
          const bEnd = Math.max(bStart, Math.min(binCount - 1, Math.ceil(config.fHigh / binHz)));

          let peak = 0;
          let sum = 0;
          let count = 0;

          for (let b = bStart; b <= bEnd; b++) {
            const raw = dataArray[b];
            // Noise floor threshold: clamp below 15/255 to 0 so quiet noise does not trigger bars
            const val = raw < 15 ? 0 : raw;
            if (val > peak) peak = val;
            sum += val;
            count++;
          }

          if (peak > 0) {
            const avg = count > 0 ? sum / count : 0;
            // High dynamic range calculation
            const blended = peak * 0.7 + avg * 0.3;
            const normEnergy = Math.min(1.0, (blended / 255) * config.gainComp);

            const minH = 2.0;
            const dynamicRange = maxHeight - minH;
            targetHeight = (minH + Math.pow(normEnergy, 1.8) * dynamicRange) * vol;
          } else {
            // Below threshold or no energy in this specific band: sits completely flat (< 5% height)
            targetHeight = 2.0 * vol;
          }

          // Exact independent lerp: bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.25
          currentBars[i] += (targetHeight - currentBars[i]) * 0.25;
        } else {
          // Paused or muted: lerp down toward zero
          currentBars[i] += (0 - currentBars[i]) * 0.25;
        }

        // Direct DOM style update for optimal 60fps performance
        const barEl = barRefs.current[i];
        if (barEl) {
          barEl.style.height = `${Math.max(0, currentBars[i])}px`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, barCount, height]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-end justify-center select-none ${gapClass} ${className}`}
      style={{ height: `${height}px` }}
      aria-label="20-bar chunky equalizer"
    >
      {/* Exactly 20 distinct thick bars with flat bottoms and rounded-t-sm caps */}
      {Array.from({ length: barCount }).map((_, idx) => (
        <div
          key={idx}
          className={`relative h-full flex flex-col justify-end items-center ${barWidthClass}`}
        >
          <div
            ref={(el) => {
              barRefs.current[idx] = el;
            }}
            className="w-full rounded-t-sm rounded-b-none transition-[background] duration-150"
            style={{
              height: '2px',
              background: 'linear-gradient(0deg, #990a14 0%, #e11d48 55%, #ff2a38 100%)',
              boxShadow: '0 0 6px rgba(255, 30, 39, 0.45)',
            }}
          />
        </div>
      ))}
    </div>
  );
};
