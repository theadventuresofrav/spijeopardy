import React, { useEffect, useRef } from 'react';
import { UserSettings } from '../types';

interface AmbientBackgroundProps {
  settings: UserSettings;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- AUDIO ENGINE REMOVED BY USER REQUEST ---
  /*
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  ... (Audio logic removed)
  */

  // --- VISUAL ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number, y: number, speed: number, size: number, opacity: number }[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.2 + Math.random() * 0.5,
        size: Math.random() * 2,
        opacity: Math.random() * 0.5
      });
    }

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Particles
      ctx.fillStyle = '#06b6d4'; // Cyan-500
      
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.globalAlpha = p.opacity * 0.3; // Subtle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Grid Lines (Scanlines)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      
      // Moving horizontal line
      const time = Date.now() * 0.0005;
      const scanY = (time * 100) % height;
      
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      animationFrame = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
