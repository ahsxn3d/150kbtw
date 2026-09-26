import React, { useState, useRef, useEffect } from 'react';

export const EyeAvatar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);

      // Parallax 3D tilt (max ~15deg)
      const maxDist = 600;
      const clampedDist = Math.min(dist, maxDist);
      const factor = clampedDist / maxDist;
      
      const tiltX = -(deltaY / maxDist) * 14;
      const tiltY = (deltaX / maxDist) * 14;
      setTilt({ x: tiltX, y: tiltY });

      // Pupil gaze tracking (max ~18px radius)
      const maxGaze = 18;
      const angle = Math.atan2(deltaY, deltaX);
      const gazeDist = Math.min(dist * 0.04, maxGaze);
      setPupilOffset({
        x: Math.cos(angle) * gazeDist,
        y: Math.sin(angle) * gazeDist,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 select-none"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-60 transition-opacity duration-300"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle, rgba(255,30,39,0.55) 0%, rgba(255,30,39,0.15) 50%, transparent 75%)' 
            : 'radial-gradient(circle, rgba(255,30,39,0.35) 0%, rgba(255,30,39,0.08) 50%, transparent 75%)'
        }}
      />

      {/* Main 3D Tilted Glass Capsule */}
      <div
        className="relative w-full h-full rounded-full p-2.5 transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(10,10,14,0.7) 40%, rgba(255,30,39,0.1) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 25px rgba(255,30,39,0.2), 0 0 0 1px rgba(255,255,255,0.15)'
        }}
      >
        {/* Chromatic aberration layer (Cyan Shift) */}
        <div 
          className="absolute inset-2.5 rounded-full pointer-events-none opacity-40 mix-blend-screen"
          style={{
            transform: 'translate(-1.5px, -1px)',
            border: '1.5px solid rgba(0, 240, 255, 0.4)',
          }}
        />

        {/* Chromatic aberration layer (Magenta/Crimson Shift) */}
        <div 
          className="absolute inset-2.5 rounded-full pointer-events-none opacity-50 mix-blend-screen"
          style={{
            transform: 'translate(1.5px, 1px)',
            border: '1.5px solid rgba(255, 30, 39, 0.6)',
          }}
        />

        {/* Inner Chamber */}
        <div className="relative w-full h-full rounded-full bg-[#08080a] flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
          {/* Subtle radar sweep line */}
          <div className="absolute inset-0 origin-center animate-[spin_8s_linear_infinite] pointer-events-none opacity-20">
            <div 
              className="w-1/2 h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,30,39,0.3) 100%)'
              }}
            />
          </div>

          {/* Tactical Crosshair Rings & Markings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
            {/* Outer concentric tick ring */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,30,39,0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
            
            {/* Cardinal Crosshairs */}
            <line x1="100" y1="8" x2="100" y2="24" stroke="#ff1e27" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="176" x2="100" y2="192" stroke="#ff1e27" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="100" x2="24" y2="100" stroke="#ff1e27" strokeWidth="2" strokeLinecap="round" />
            <line x1="176" y1="100" x2="192" y2="100" stroke="#ff1e27" strokeWidth="2" strokeLinecap="round" />

            {/* Micro Reticles */}
            <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(255,30,39,0.4)" strokeWidth="1" strokeDasharray="12 6" />
          </svg>

          {/* Mouse-reactive Gaze Iris & Core Eye */}
          <div
            className="relative flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            }}
          >
            {/* Outer Iris Aperture Blades Glow */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#ff1e27] shadow-[0_0_35px_rgba(255,30,39,0.8),inset_0_0_20px_rgba(255,30,39,0.6)] flex items-center justify-center bg-neutral-950">
              {/* Concentric red iris mesh */}
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'radial-gradient(circle, #ff1e27 0%, #aa0007 55%, #2a0003 100%)',
                  boxShadow: '0 0 25px rgba(255,30,39,0.9), inset 0 0 15px #ffffff80'
                }}
              >
                {/* Intense Central Pupil */}
                <div 
                  className={`rounded-full bg-black border border-red-500/50 transition-all duration-200 ${
                    isHovered ? 'w-9 h-9 shadow-[0_0_15px_#000]' : 'w-7 h-7'
                  } flex items-center justify-center`}
                >
                  {/* Cybernetic red central target dot */}
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                </div>

                {/* Glare specular highlight across iris */}
                <div 
                  className="absolute top-1.5 left-2 w-7 h-3 rounded-full -rotate-45 pointer-events-none opacity-70"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Glass Lens Specular Arc */}
          <div 
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 60%)'
            }}
          />

          {/* Lower Glass Edge Highlight */}
          <div 
            className="absolute bottom-1 w-24 h-1 rounded-full pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-[#ff1e27] to-transparent"
          />
        </div>
      </div>

      {/* Floating 150k Telemetry Badge underneath */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#09090b]/90 border border-[#ff1e27]/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e27] animate-ping" />
        <span className="text-[11px] font-mono font-bold tracking-wider text-white">
          OP // 150K_EYE
        </span>
      </div>
    </div>
  );
};
