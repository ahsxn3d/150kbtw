import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioContext';

interface CircularAudioVisualizerProps {
  size?: number; // Canvas size (default 240)
  avatarSize?: number; // Inner avatar diameter (default 104)
  avatarSrc?: string;
  className?: string;
}

export const CircularAudioVisualizer: React.FC<CircularAudioVisualizerProps> = ({
  size = 240,
  avatarSize = 104,
  avatarSrc = '/avatar.png',
  className = '',
}) => {
  const { isPlaying, analyserRef, currentVolume } = useAudioPlayer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarWrapperRef = useRef<HTMLDivElement | null>(null);

  // Sync real-time master volume
  const currentVolRef = useRef<number>(currentVolume);
  useEffect(() => {
    currentVolRef.current = currentVolume;
  }, [currentVolume]);

  // Audio energy physics state
  const bassEnergyRef = useRef<number>(0);
  const midEnergyRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina high DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let animId: number;
    const cx = size / 2;
    const cy = size / 2;
    // Base radius: sits 6px outside the avatar perimeter when quiet
    const baseRadius = avatarSize / 2 + 6;

    // Strand density: 12 nested spline strands per band
    const strandsPerBand = 12;
    // Step resolution for smooth continuous orbital spline
    const angularSteps = 144;
    const stepAngle = (Math.PI * 2) / angularSteps;

    let lastTime = performance.now();
    let simTime = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;

      const vol = currentVolRef.current;

      // Extract authentic FFT frequency energy from AnalyserNode
      let targetBass = 0;
      let targetMid = 0;

      if (analyserRef.current && isPlaying && vol > 0) {
        const analyser = analyserRef.current;
        const binCount = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(new ArrayBuffer(binCount));
        analyser.getByteFrequencyData(dataArray);

        const sampleRate = analyser.context?.sampleRate || 44100;
        const fftSize = analyser.fftSize || 2048;
        const binHz = sampleRate / fftSize;

        // Band A FFT sampling: Low-end Bass & Kicks (20Hz - 250Hz, Bins ~1 to 12)
        const bBassStart = Math.max(0, Math.floor(20 / binHz));
        const bBassEnd = Math.min(binCount - 1, Math.ceil(250 / binHz));
        let bassMax = 0;
        let bassSum = 0;
        let bassCount = 0;
        for (let b = bBassStart; b <= bBassEnd; b++) {
          const raw = dataArray[b];
          const val = raw < 15 ? 0 : raw; // Noise floor threshold
          if (val > bassMax) bassMax = val;
          bassSum += val;
          bassCount++;
        }
        if (bassMax > 0) {
          const bassAvg = bassCount > 0 ? bassSum / bassCount : 0;
          const blendedBass = bassMax * 0.75 + bassAvg * 0.25;
          targetBass = Math.min(1.0, Math.pow(blendedBass / 255, 1.8) * 1.35);
        }

        // Band B FFT sampling: Midrange Vocals & Synth Leads (300Hz - 3500Hz, Bins ~14 to 160)
        const bMidStart = Math.max(0, Math.floor(300 / binHz));
        const bMidEnd = Math.min(binCount - 1, Math.ceil(3500 / binHz));
        let midMax = 0;
        let midSum = 0;
        let midCount = 0;
        for (let b = bMidStart; b <= bMidEnd; b++) {
          const raw = dataArray[b];
          const val = raw < 15 ? 0 : raw; // Noise floor threshold
          if (val > midMax) midMax = val;
          midSum += val;
          midCount++;
        }
        if (midMax > 0) {
          const midAvg = midCount > 0 ? midSum / midCount : 0;
          const blendedMid = midMax * 0.65 + midAvg * 0.35;
          targetMid = Math.min(1.0, Math.pow(blendedMid / 255, 1.6) * 1.45);
        }
      }

      // Smooth attack & crisp decay physics (smoothly contracts within 250ms when paused/muted)
      if (isPlaying && vol > 0) {
        const bassLerp = targetBass > bassEnergyRef.current ? 0.45 : 0.18;
        const midLerp = targetMid > midEnergyRef.current ? 0.42 : 0.22;
        bassEnergyRef.current += (targetBass - bassEnergyRef.current) * bassLerp;
        midEnergyRef.current += (targetMid - midEnergyRef.current) * midLerp;
        simTime += dt * (1.0 + bassEnergyRef.current * 0.6 + midEnergyRef.current * 0.4);
      } else {
        // Paused/muted: smooth 250ms contraction to calm resting ring
        bassEnergyRef.current += (0 - bassEnergyRef.current) * 0.18;
        midEnergyRef.current += (0 - midEnergyRef.current) * 0.18;
        simTime += dt * 0.3; // Serene idle motion
      }

      const bassEnergy = bassEnergyRef.current;
      const midEnergy = midEnergyRef.current;
      const t = simTime;

      // Dynamic expansion coupled directly to currentVolume
      // On kick hits, Band A flares outward smoothly by 25px to 35px
      const baseFlareA = (2.5 + bassEnergy * 32.0) * vol;
      const ribbonWidthA = (5.0 + bassEnergy * 16.0) * vol;

      // Band B: produces 5 to 7 faster ripples that undulate as vocals sing
      const baseFlareB = (2.0 + midEnergy * 24.0) * vol;
      const ribbonWidthB = (4.0 + midEnergy * 13.0) * vol;

      // Clear canvas with full high-DPI bounds
      ctx.clearRect(0, 0, size, size);

      // Neon Silk Composite Blending: intersections glow intensely like hot neon energy
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = 'rgba(255, 30, 50, 0.55)';
      ctx.shadowBlur = isPlaying && vol > 0 ? 8 : 4;

      // =========================================================================
      // 1. BAND A: DEEP CRIMSON BASS SWELL (2 to 3 large, deep undulating waves)
      // =========================================================================
      for (let s = 0; s < strandsPerBand; s++) {
        const u = (s / (strandsPerBand - 1)) - 0.5; // -0.5 to +0.5
        const strandAlpha = (0.28 + 0.38 * (1 - Math.abs(u) * 0.7)) * (0.35 + 0.65 * vol);

        ctx.beginPath();

        for (let i = 0; i <= angularSteps; i++) {
          const theta = i * stepAngle;

          // 2 to 3 large, deep undulating waves
          const waveA =
            Math.sin(2 * theta - t * 1.3) * 0.65 +
            Math.cos(3 * theta + t * 0.9) * 0.35;

          // Hyperbolic moiré twist & silk strand fanning
          const twistA = Math.cos(2 * theta - t * 1.1);
          const strandOffset =
            u * ribbonWidthA * (0.65 + 0.35 * twistA) +
            Math.sin(3 * theta + u * 2.4 - t * 1.6) * (2.0 + bassEnergy * 4.5);

          const r = baseRadius + waveA * baseFlareA + strandOffset;

          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.strokeStyle = `rgba(225, 29, 72, ${strandAlpha})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      // =========================================================================
      // 2. BAND B: ELECTRIC NEON RED / MID-TREBLE RIPPLE (5 to 7 faster ripples)
      // =========================================================================
      for (let s = 0; s < strandsPerBand; s++) {
        const v = (s / (strandsPerBand - 1)) - 0.5; // -0.5 to +0.5
        const isEdgeHighlight = s === strandsPerBand - 1;

        ctx.beginPath();

        for (let i = 0; i <= angularSteps; i++) {
          const theta = i * stepAngle;

          // 5 to 7 faster ripples that undulate as vocals sing
          const waveB =
            Math.sin(5 * theta + t * 2.1) * 0.55 +
            Math.cos(7 * theta - t * 1.4) * 0.45;

          // Silk strand fanning & interweaving with Band A
          const twistB = Math.sin(3 * theta + t * 1.5);
          const strandOffsetB =
            v * ribbonWidthB * (0.6 + 0.4 * twistB) +
            Math.cos(4 * theta + v * 2.8 + t * 1.8) * (1.8 + midEnergy * 3.8);

          const rB = baseRadius + waveB * baseFlareB + strandOffsetB;

          const xB = cx + Math.cos(theta) * rB;
          const yB = cy + Math.sin(theta) * rB;

          if (i === 0) {
            ctx.moveTo(xB, yB);
          } else {
            ctx.lineTo(xB, yB);
          }
        }

        ctx.closePath();

        if (isEdgeHighlight && isPlaying && vol > 0.1) {
          // Bright white-hot edge highlight
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * (0.4 + 0.6 * vol)})`;
          ctx.lineWidth = 1.35;
        } else {
          // Electric neon red strands
          const strandAlphaB = (0.32 + 0.38 * (1 - Math.abs(v) * 0.65)) * (0.35 + 0.65 * vol);
          ctx.strokeStyle = `rgba(255, 45, 60, ${strandAlphaB})`;
          ctx.lineWidth = 1.1;
        }

        ctx.stroke();
      }

      // Smooth central eye avatar scale pulse with bass transients
      if (avatarWrapperRef.current) {
        const scale = isPlaying && vol > 0 ? 1 + bassEnergy * 0.04 * vol : 1;
        avatarWrapperRef.current.style.transform = `scale(${scale})`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, size, avatarSize]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* High-DPI HTML5 Canvas Layered Behind Eye Avatar (z-0) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {/* Central Eye Avatar Container Layered Over Ribbons (z-10) */}
      <div
        ref={avatarWrapperRef}
        className="relative rounded-full z-10 flex items-center justify-center transition-transform duration-75"
        style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
      >
        {/* Pulsating Crimson Ring */}
        <div
          className="absolute -inset-1 rounded-full border border-[#ff1e27]/50 pointer-events-none transition-all duration-300"
          style={{
            boxShadow: isPlaying && currentVolume > 0
              ? `0 0 ${Math.round(14 + currentVolume * 14)}px rgba(255,30,39,${0.35 + currentVolume * 0.35}), inset 0 0 10px rgba(255,30,39,0.25)`
              : '0 0 6px rgba(255,30,39,0.2)',
          }}
        />

        {/* Circular Avatar Image with Solid Dark Border Cleanly Masking Center Void */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#08080a] border-2 border-white/20 shadow-2xl flex items-center justify-center relative">
          <img
            src={avatarSrc}
            alt="150k Official Logo"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.7)] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
