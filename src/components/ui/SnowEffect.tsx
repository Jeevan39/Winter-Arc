import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useApp();

  useEffect(() => {
    if (!settings.snowEffect) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle snowflake particles (35 particles max to keep 60fps low CPU)
    const particleCount = 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      density: Math.random() * 30 + 10,
      opacity: Math.random() * 0.45 + 0.15,
      speedY: Math.random() * 0.6 + 0.25,
      speedX: Math.random() * 0.4 - 0.2,
      swing: Math.random() * 2,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.01;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += Math.sin(angle + p.swing) * 0.3 + p.speedX;

        // Reset if off-screen
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) {
          p.x = -10;
        } else if (p.x < -10) {
          p.x = width + 10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = settings.theme === 'light' 
          ? `rgba(14, 165, 233, ${p.opacity * 0.6})` 
          : `rgba(224, 242, 254, ${p.opacity})`;
        ctx.shadowColor = settings.theme === 'light'
          ? 'rgba(14, 165, 233, 0.2)'
          : 'rgba(56, 189, 248, 0.3)';
        ctx.shadowBlur = p.radius * 2;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.snowEffect]);

  if (!settings.snowEffect) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
};
