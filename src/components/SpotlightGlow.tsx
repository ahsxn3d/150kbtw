import React, { useEffect, useState } from 'react';

export const SpotlightGlow: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Background ambient crimson radial glow */}
      <div 
        className="absolute w-[600px] h-[600px] -top-40 -left-40 rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255,30,39,0.3) 0%, rgba(255,30,39,0.05) 50%, transparent 70%)'
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] bottom-0 -right-20 rounded-full blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,30,39,0.25) 0%, rgba(255,30,39,0.02) 60%, transparent 80%)'
        }}
      />

      {/* Dynamic Cursor-following spotlight glow */}
      {isHovering && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[100px] transition-opacity duration-300 pointer-events-none"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: 'radial-gradient(circle, rgba(255,30,39,0.12) 0%, rgba(255,30,39,0.03) 45%, transparent 70%)',
          }}
        />
      )}

    </div>
  );
};
