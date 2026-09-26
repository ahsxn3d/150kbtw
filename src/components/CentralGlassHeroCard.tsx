import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Play, Pause, Music, Radio } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioContext';
import { RealtimeAudioVisualizer } from './RealtimeAudioVisualizer';

interface CentralGlassHeroCardProps {
  onNotify?: (msg: string) => void;
}

export const CentralGlassHeroCard: React.FC<CentralGlassHeroCardProps> = ({ onNotify }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 160, y: 200 });

  const { isPlaying, togglePlay, trackTitle } = useAudioPlayer();

  // Motion values for smooth 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for buttery smooth physics
  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);
  const scale = useSpring(isHovered ? 1.03 : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({ x: mouseX, y: mouseY });

    // Normalized coordinates (-0.5 to 0.5) for Framer Motion tilt
    const normX = mouseX / rect.width - 0.5;
    const normY = mouseY / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    togglePlay();
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Outer ambient liquid crimson back-glow */}
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#ff1e27]/30 via-red-600/15 to-transparent blur-3xl pointer-events-none transition-opacity duration-500"
        style={{ opacity: isHovered || isPlaying ? 0.95 : 0.5 }}
      />

      {/* Main 3D Tilted Smoked Glass Hero Card Container - Translucent Glass */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-80 sm:w-84 h-[350px] rounded-3xl backdrop-blur-xl bg-neutral-950/45 border border-white/15 shadow-[0_0_50px_rgba(255,30,39,0.25)] flex flex-col items-center justify-between p-4 cursor-pointer group transition-colors duration-300 overflow-hidden"
      >
        {/* Isolated inner clipping container for Specular Glare & Highlights */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-10">
          {/* Dynamic Specular Spotlight Glare Overlay (Tracks cursor) */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.18), rgba(255, 30, 39, 0.12) 40%, transparent 80%)`,
            }}
          />

          {/* Ambient Top Diagonal Bevel Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Card Header: CS2 BENCHMARK + OP // 150K_EYE Tag FITTED INSIDE CARD */}
        <div
          className="w-full flex items-center justify-between z-20 shrink-0"
          style={{ transform: 'translateZ(25px)' }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/70 border border-white/10 text-[10px] font-mono text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e27] animate-pulse" />
            <span className="tracking-wider uppercase font-semibold text-white">CS2 BENCHMARK</span>
          </div>

          {/* OP // 150K_EYE Live Indicator fitted neatly inside card */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#09090b]/80 border border-[#ff1e27]/50 text-[10px] font-mono text-white shadow-[0_0_12px_rgba(255,30,39,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e27] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e27] shadow-[0_0_6px_#ff1e27]" />
            </span>
            <span className="font-bold tracking-wider text-white">OP // 150K_EYE</span>
          </div>
        </div>

        {/* Center: Official 150k Avatar Image (Shorter, Compact Size) with Pulsating Crimson Ring */}
        <div
          className="relative flex items-center justify-center my-auto z-20 py-0.5"
          style={{ transform: 'translateZ(45px)' }}
        >
          {/* Animated Pulsating Crimson Ring (Outer Wave) */}
          <div
            className="absolute -inset-3 rounded-full border border-[#ff1e27]/40 pointer-events-none transition-all duration-700"
            style={{
              boxShadow:
                isPlaying || isHovered
                  ? '0 0 30px rgba(255,30,39,0.7), inset 0 0 15px rgba(255,30,39,0.4)'
                  : '0 0 15px rgba(255,30,39,0.3)',
              animation: 'pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Animated Pulsating Crimson Ring (Inner Glow) */}
          <div
            className="absolute -inset-1.5 rounded-full border-2 border-[#ff1e27] pointer-events-none transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(255,30,39,0.85), inset 0 0 12px rgba(255,30,39,0.5)',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />

          {/* Shorter Compact Avatar (w-28 h-28 / w-30 h-30) */}
          <div className="relative w-28 h-28 sm:w-30 sm:h-30 rounded-full overflow-hidden bg-[#08080a] border-2 border-white/20 shadow-2xl flex items-center justify-center">
            <img
              src="/avatar.png"
              alt="150k Official Avatar"
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 select-none pointer-events-none"
            />
            {/* Inner subtle vignette */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.7)] pointer-events-none" />
          </div>
        </div>

        {/* Bottom Section: Real-Time Audio Frequency Visualizer + Play Button */}
        <div
          className="w-full flex flex-col items-center gap-2 z-20 shrink-0"
          style={{ transform: 'translateZ(35px)' }}
        >
          {/* Real-Time Reactive Audio Frequency Visualizer with 24 Bars & Floating Peak Caps */}
          <div className="w-full flex items-center justify-center px-1">
            <RealtimeAudioVisualizer
              height={46}
              barWidthClass="w-2"
              gapClass="gap-[3px]"
              className="w-full max-w-[280px]"
            />
          </div>

          {/* Interactive Play / Audio Control Badge (No Toast Notifications) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className={`w-full py-1.5 px-3 rounded-2xl flex items-center justify-between border transition-all duration-200 cursor-pointer ${
              isPlaying
                ? 'bg-[#ff1e27] border-[#ff4d54] text-white shadow-[0_0_20px_rgba(255,30,39,0.6)]'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border-white/10 hover:border-[#ff1e27]/50 text-neutral-200'
            }`}
            title="Click to toggle anthem audio playback"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isPlaying ? 'bg-white text-[#ff1e27]' : 'bg-[#ff1e27] text-white'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current translate-x-0.5" />
                )}
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-[11px] font-bold truncate">
                  {isPlaying ? 'Now Playing' : 'Play Stream Anthem'}
                </span>
                <span className="block text-[10px] font-mono opacity-90 truncate">
                  {trackTitle}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono">
              <Music className={`w-3 h-3 ${isPlaying ? 'animate-bounce' : 'opacity-60'}`} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
