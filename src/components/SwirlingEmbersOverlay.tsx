import React, { useEffect, useRef } from 'react';

interface SwirlingEmbersOverlayProps {
  isPlaying: boolean;
  className?: string;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
}

const EMBER_COLORS = [
  'rgba(255, 30, 39, ',    // Vibrant crimson
  'rgba(255, 75, 45, ',    // Flame orange-red
  'rgba(255, 130, 35, ',   // Hot amber
  'rgba(255, 195, 75, ',   // Golden acoustic mote
];

export const SwirlingEmbersOverlay: React.FC<SwirlingEmbersOverlayProps> = ({
  isPlaying,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 420;
    const height = 440;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const maxEmbers = 42;
    const embers: Ember[] = [];

    const createEmber = (initialSpawn = false): Ember => {
      // Spawn along the outer perimeter (mostly bottom & sides of the card area)
      const side = Math.random();
      let x = width / 2;
      let y = height / 2;

      const cardLeft = 45;
      const cardRight = width - 45;
      const cardTop = 45;
      const cardBottom = height - 45;

      if (side < 0.5) {
        // Bottom perimeter
        x = cardLeft + Math.random() * (cardRight - cardLeft);
        y = initialSpawn ? cardTop + Math.random() * (cardBottom - cardTop) : cardBottom - 10 + Math.random() * 20;
      } else if (side < 0.75) {
        // Left perimeter
        x = cardLeft - 15 + Math.random() * 25;
        y = cardTop + Math.random() * (cardBottom - cardTop);
      } else {
        // Right perimeter
        x = cardRight - 10 + Math.random() * 25;
        y = cardTop + Math.random() * (cardBottom - cardTop);
      }

      const maxLife = 100 + Math.random() * 120;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.7 + Math.random() * 1.5), // Upward floating drift
        size: 1.2 + Math.random() * 2.4,
        alpha: 0,
        life: initialSpawn ? Math.random() * maxLife : 0,
        maxLife,
        color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
        wobbleSpeed: 0.02 + Math.random() * 0.04,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    };

    // Initialize initial batch
    for (let i = 0; i < maxEmbers; i++) {
      embers.push(createEmber(true));
    }

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Neon composite glow
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];
        p.life++;

        // Calculate smooth fade-in and fade-out life cycle
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = progress / 0.2;
        } else if (progress > 0.7) {
          p.alpha = Math.max(0, (1 - progress) / 0.3);
        } else {
          p.alpha = 1;
        }

        // Swirling acoustic wobble math
        p.x += p.vx + Math.sin(frame * p.wobbleSpeed + p.wobbleOffset) * 0.65;
        p.y += p.vy;

        // Render glowing ember
        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(p.alpha * 0.85).toFixed(3)})`;
          ctx.shadowColor = 'rgba(255, 50, 40, 0.8)';
          ctx.shadowBlur = p.size * 3.5;
          ctx.fill();
        }

        // Respawn when life ends or moves off-screen
        if (p.life >= p.maxLife || p.y < 10) {
          embers[i] = createEmber(false);
        }
      }

      frame++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 select-none z-0 ${
        isPlaying ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-[420px] h-[440px] pointer-events-none"
        style={{ width: '420px', height: '440px' }}
      />
    </div>
  );
};
