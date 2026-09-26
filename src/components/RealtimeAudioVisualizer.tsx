import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioContext';

interface RealtimeAudioVisualizerProps {
  className?: string;
  height?: number; // total container height in pixels, default 52
  barWidthClass?: string; // e.g. "w-2" or "w-1.5" or "w-1"
  gapClass?: string; // e.g. "gap-[3px]" or "gap-1"
  barCount?: number; // default 24
}

export const RealtimeAudioVisualizer: React.FC<RealtimeAudioVisualizerProps> = ({
  className = '',
  height = 52,
  barWidthClass = 'w-2',
  gapClass = 'gap-[3px]',
  barCount = 24,
}) => {
  const { isPlaying, analyserRef } = useAudioPlayer();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const peakRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth physics state
  const currentBarsRef = useRef<number[]>(new Array(barCount).fill(4));
  const peakValuesRef = useRef<number[]>(new Array(barCount).fill(4));

  useEffect(() => {
    let animId: number;
    let phase = 0;
    const bpm = 140;
    const beatFrequency = (bpm / 60) * Math.PI * 2; // radians per second
    let lastTime = performance.now();

    const minHeight = 4; // Flat baseline idle state (3px to 4px)
    const maxHeight = Math.max(16, height - 6); // Leave room for floating peak cap

    const loop = (currentTimeMs: number) => {
      const dt = Math.min(0.05, (currentTimeMs - lastTime) / 1000);
      lastTime = currentTimeMs;
      phase += dt * beatFrequency;

      // 1. Attempt to sample real frequency data from Web Audio Analyser
      let realDataAvailable = false;
      let dataArray: Uint8Array | null = null;
      let totalEnergy = 0;

      if (analyserRef.current && isPlaying) {
        const analyser = analyserRef.current;
        const binCount = analyser.frequencyBinCount;
        dataArray = new Uint8Array(binCount);
        analyser.getByteFrequencyData(dataArray);

        // Quick sum to check for non-zero signal (guard against CORS zeroing)
        for (let i = 0; i < Math.min(64, binCount); i++) {
          totalEnergy += dataArray[i];
        }
        if (totalEnergy > 10) {
          realDataAvailable = true;
        }
      }

      const currentBars = currentBarsRef.current;
      const peakValues = peakValuesRef.current;

      for (let i = 0; i < barCount; i++) {
        let targetHeight = minHeight;

        if (isPlaying) {
          if (realDataAvailable && dataArray) {
            // Frequency distribution:
            // Low frequencies (bass/kicks) on the left
            // Mid-frequencies (vocals/synth) in the center
            // Treble on the right
            const binCount = dataArray.length;
            const progress = i / (barCount - 1); // 0.0 to 1.0

            // Logarithmic mapping: lower bins occupy more visual real estate
            const startBin = Math.floor(Math.pow(progress, 1.8) * (binCount * 0.75));
            const endBin = Math.min(
              binCount - 1,
              Math.max(startBin + 1, Math.floor(Math.pow((i + 1) / barCount, 1.8) * (binCount * 0.75)))
            );

            let sum = 0;
            let peakInBand = 0;
            let count = 0;
            for (let b = startBin; b <= endBin; b++) {
              sum += dataArray[b];
              if (dataArray[b] > peakInBand) peakInBand = dataArray[b];
              count++;
            }
            const avg = count > 0 ? (sum / count) * 0.5 + peakInBand * 0.5 : 0;
            let normalized = avg / 255;

            // Perceptual boost for mids and treble to balance human hearing
            const eqBoost = 1.0 + Math.sin(progress * Math.PI) * 0.45 + progress * 0.5;
            normalized = Math.min(1.0, Math.pow(normalized * eqBoost, 0.85));

            targetHeight = minHeight + normalized * (maxHeight - minHeight);
          } else {
            // 2. Resilient Audio Fallback (Zero-CORS Failure Mode)
            // 140 BPM synchronized sine wave oscillators with simulated bass kicks and jitter
            const progress = i / (barCount - 1);
            
            // Bass kick pulse (concentrated on left 0-7)
            const bassEnvelope = Math.pow(Math.max(0, Math.sin(phase * 0.5)), 4);
            const bassContribution = (1 - progress) * bassEnvelope * 0.85;

            // Mid vocal/synth oscillation (center 6-17)
            const midWave = Math.sin(phase + i * 0.45) * 0.28 + Math.cos(phase * 1.5 - i * 0.3) * 0.2;
            const midContribution = Math.sin(progress * Math.PI) * (midWave + 0.45);

            // Treble flutter (right 16-23)
            const trebleWave = Math.sin(phase * 2.8 + i * 0.7) * 0.22 + 0.3;
            const trebleContribution = progress * trebleWave;

            // Dynamic randomized jitter
            const jitter = (Math.random() - 0.5) * 0.12;

            let simulatedNorm = bassContribution + midContribution + trebleContribution + jitter;
            simulatedNorm = Math.max(0.12, Math.min(0.98, simulatedNorm));

            targetHeight = minHeight + simulatedNorm * (maxHeight - minHeight);
          }

          // Smooth attack (fast response) and fluid decay
          if (targetHeight > currentBars[i]) {
            currentBars[i] = currentBars[i] + (targetHeight - currentBars[i]) * 0.75;
          } else {
            currentBars[i] = Math.max(minHeight, currentBars[i] - dt * (maxHeight * 1.8));
          }
        } else {
          // Paused: smoothly transition down to flat baseline idle state (3px to 4px)
          currentBars[i] = Math.max(minHeight, currentBars[i] - dt * (maxHeight * 2.5));
        }

        // Peak Falloff Physics:
        // Snaps to highest point instantly when frequency spikes
        // Slowly floats back down with simulated gravity/decay when volume drops
        if (currentBars[i] >= peakValues[i]) {
          peakValues[i] = currentBars[i]; // Instant snap
        } else {
          const gravity = isPlaying ? dt * 42 : dt * 55; // Gentle float down
          peakValues[i] = Math.max(currentBars[i], peakValues[i] - gravity);
        }

        // Update DOM directly for max 120fps performance without React re-render overhead
        const barEl = barRefs.current[i];
        const peakEl = peakRefs.current[i];

        if (barEl) {
          barEl.style.height = `${currentBars[i]}px`;
        }

        if (peakEl) {
          // Floating peak cap sits 2px above the bar
          const peakY = peakValues[i] + 3;
          peakEl.style.bottom = `${peakY}px`;
          peakEl.style.opacity = isPlaying && peakValues[i] > minHeight + 2 ? '0.95' : '0.4';
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
      className={`relative flex items-end justify-center select-none shadow-[0_0_20px_rgba(255,30,39,0.45)] px-1 rounded-xl ${gapClass} ${className}`}
      style={{ height: `${height}px` }}
      aria-label="Real-time reactive CS2 audio frequency visualizer"
    >
      {Array.from({ length: barCount }).map((_, idx) => (
        <div
          key={idx}
          className={`relative h-full flex flex-col justify-end items-center ${barWidthClass}`}
        >
          {/* Distinct Floating White Peak Cap with Soft Glow */}
          <div
            ref={(el) => (peakRefs.current[idx] = el)}
            className="absolute left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_6px_#fff] pointer-events-none transition-opacity duration-150"
            style={{ bottom: '7px' }}
          />

          {/* Vertical Bar with Rounded Caps and Red Gradient */}
          <div
            ref={(el) => (barRefs.current[idx] = el)}
            className={`w-full rounded-full bg-gradient-to-t from-red-700 via-red-500 to-red-400 transition-[background] duration-150`}
            style={{ height: '4px' }}
          />
        </div>
      ))}
    </div>
  );
};
