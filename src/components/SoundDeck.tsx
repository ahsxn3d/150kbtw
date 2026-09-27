import React, { useState } from 'react';
import { Play, Pause, Volume1, Volume2, VolumeX, Radio, Music, Sparkles, Plus, Minus } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioContext';
import { RealtimeAudioVisualizer } from './RealtimeAudioVisualizer';

interface SoundDeckProps {
  onNotify?: (msg: string) => void;
}

export const SoundDeck: React.FC<SoundDeckProps> = ({ onNotify }) => {
  const {
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTime,
    setCurrentTime,
    totalDuration,
    trackTitle,
    artist,
    bpm,
    frequencyData,
    analyserRef,
  } = useAudioPlayer();

  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  return (
    <footer
      role="region"
      aria-label="Sound Deck"
      className="w-full shrink-0 border-t border-white/10 bg-[#09090b]/50 backdrop-blur-md px-4 py-2.5 z-40 transition-colors"
      style={{
        boxShadow: '0 -10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track Metadata */}
        <div className="flex items-center gap-3.5 w-full md:w-auto shrink-0">
          <div className="relative w-10 h-10 rounded-lg bg-neutral-900 border border-[#ff1e27]/40 flex items-center justify-center overflow-hidden shrink-0 group">
            <img
              src="/avatar.png"
              alt="150k Track Art"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isPlaying ? 'scale-110' : 'scale-100 opacity-90'
              }`}
            />
            <div
              className={`absolute inset-0 bg-[#ff1e27]/15 transition-opacity ${
                isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'
              }`}
            />
            {isPlaying && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#ff1e27] shadow-[0_0_6px_#ff1e27] animate-ping" />
            )}
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {trackTitle}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e27] animate-pulse" />
              <span>150K</span>
            </div>
          </div>
        </div>

        {/* Center Deck: Play Controls, Progress & Visualizer */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
          <div className="flex items-center gap-4">
            {/* Play / Pause Button */}
            <button
              onClick={() => {
                togglePlay();
              }}
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              className="relative group p-2.5 rounded-full bg-[#ff1e27] text-white hover:bg-[#ff333b] hover:shadow-[0_0_20px_rgba(255,30,39,0.6)] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            {/* 20-Bar Chunky Equalizer Component */}
            <div className="relative flex items-center bg-neutral-950/70 px-2.5 py-1 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <RealtimeAudioVisualizer
                height={28}
                barWidthClass="w-[4.5px] sm:w-[5px]"
                gapClass="gap-[3px]"
                barCount={20}
                className="w-[145px] sm:w-[160px]"
              />
            </div>
          </div>

          {/* Scrubber & Timers */}
          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-neutral-400">
            <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={totalDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff1e27] focus:outline-none"
              />
              <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#ff1e27]/80 to-[#ff1e27] rounded-lg pointer-events-none"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>
            <span className="w-9 text-left tabular-nums text-neutral-500">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Upgraded Cybernetic Volume & Status Deck */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-900/90 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] group/vol">
            {/* Mute / Unmute Button with Dynamic State Icon */}
            <button
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              className="p-1 text-neutral-400 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
              title={isMuted ? 'Click to unmute' : 'Click to mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-neutral-500 hover:text-[#ff1e27]" />
              ) : volume < 0.4 ? (
                <Volume1 className="w-4 h-4 text-[#ff1e27]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#ff1e27] drop-shadow-[0_0_8px_rgba(255,30,39,0.7)]" />
              )}
            </button>

            {/* Quick Step Decrement Button */}
            <button
              onClick={() => {
                if (isMuted) setIsMuted(false);
                setVolume(Math.max(0, Math.round((volume - 0.1) * 10) / 10));
              }}
              disabled={volume <= 0 && !isMuted}
              aria-label="Decrease Volume"
              className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Decrease by 10%"
            >
              <Minus className="w-3 h-3" />
            </button>

            {/* Tactical 10-Segment LED Meter */}
            <div
              className="flex items-center gap-[3px] py-1 cursor-pointer select-none"
              title={`Volume: ${isMuted ? '0%' : Math.round(volume * 100)}%`}
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const segValue = (i + 1) / 10;
                const active = !isMuted && volume >= segValue - 0.05;
                const isHovered = hoveredLevel !== null && hoveredLevel >= i + 1;
                const isPeak = i >= 8;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (isMuted) setIsMuted(false);
                      setVolume(segValue);
                    }}
                    onMouseEnter={() => setHoveredLevel(i + 1)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    aria-label={`Set volume to ${(i + 1) * 10}%`}
                    className={`w-1 sm:w-1.5 h-3.5 sm:h-4 rounded-[1px] transition-all duration-150 cursor-pointer ${
                      active || isHovered
                        ? isPeak
                          ? 'bg-gradient-to-t from-[#ff8533] to-[#ff1e27] shadow-[0_0_6px_#ff1e27]'
                          : 'bg-gradient-to-t from-[#ff1e27]/80 to-[#ff4d54] shadow-[0_0_5px_rgba(255,30,39,0.8)]'
                        : 'bg-neutral-800/80 hover:bg-neutral-700'
                    } ${isPlaying && active && i % 2 === 0 ? 'animate-pulse' : ''}`}
                    style={{
                      transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                    }}
                  />
                );
              })}
            </div>

            {/* Quick Step Increment Button */}
            <button
              onClick={() => {
                if (isMuted) setIsMuted(false);
                setVolume(Math.min(1, Math.round((volume + 0.1) * 10) / 10));
              }}
              disabled={volume >= 1 && !isMuted}
              aria-label="Increase Volume"
              className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Increase by 10%"
            >
              <Plus className="w-3 h-3" />
            </button>

            {/* Glowing Numerical & Decibel Digital Readout */}
            <div className="w-12 text-center pl-1 font-mono text-[11px] font-bold">
              {isMuted ? (
                <span className="text-neutral-500 uppercase tracking-tighter">MUTE</span>
              ) : (
                <span className="text-[#ff4d54] drop-shadow-[0_0_6px_rgba(255,30,39,0.4)]">
                  {Math.round(volume * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Live DSP Status Badge - Locked Static Dimensions Prevent Footer Layout Shifts */}
          <div className="hidden lg:flex items-center justify-center gap-1.5 w-[124px] h-[34px] shrink-0 px-2.5 py-1.5 rounded-xl bg-neutral-900/90 border border-white/5 text-[10px] font-mono text-neutral-400 select-none">
            <Radio
              className={`w-3.5 h-3.5 shrink-0 transition-all duration-300 ${
                isPlaying
                  ? 'text-[#ff1e27] opacity-100 animate-pulse drop-shadow-[0_0_6px_#ff1e27]'
                  : 'text-neutral-500 opacity-40'
              }`}
            />
            <span
              className={`font-semibold tracking-tight transition-colors duration-200 ${
                isPlaying ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {isPlaying ? 'LIVE DSP 96k' : 'DSP'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
