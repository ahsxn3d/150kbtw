import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <video
        src="/rocks-glow-with-autumn-fire.1920x1080.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-75 brightness-110 contrast-105 scale-100 transition-opacity duration-1000"
      />
      {/* 20% subtle blur and light obsidian tint for maximum video visibility with crisp HUD contrast */}
      <div className="absolute inset-0 bg-[#09090b]/35 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/50" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#09090b]/20 to-[#09090b]/70" />
    </div>
  );
};
