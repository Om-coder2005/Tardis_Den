import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../computer/store/useSettingsStore';

interface Star {
  x: number;
  y: number;
  z: number;
  tw: number;
}

export const ParticleSystem: React.FC = () => {
  const { reducedMotion } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Parameters matching Framer Stars-Galaxy component
    const starsCount = 800;
    const speed = 1.8;
    const spread = 5;
    const focal = 2;
    const twinkleAmount = 0.35;
    const size = 1.8;
    const reverseFly = true;

    let animationFrameId: number;
    let stars: Star[] = [];

    const createStar = (): Star => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: Math.random(),
      tw: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    stars = Array.from({ length: starsCount }, createStar);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear with dark space background
      ctx.fillStyle = '#02040A';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#FFFFFF';
      const cx = w / 2;
      const cy = h / 2;

      for (const s of stars) {
        const depth = s.z * Math.max(0.01, Math.min(10, focal)) + 0.001;
        const px = cx + (s.x / depth) * w;
        const py = cy + (s.y / depth) * h;

        // Move stars forward / backward along Z axis
        s.z += reverseFly ? speed * 0.0012 : -speed * 0.0012;
        if (s.z <= 0 || s.z > 1) {
          Object.assign(s, createStar());
        }

        s.tw += twinkleAmount * 0.05;

        // Fade in as stars approach
        const alpha = Math.max(0, 1 - s.z);
        const radius = Math.max(0.1, size) * (1 - s.z) * (1 + Math.sin(s.tw) * twinkleAmount);

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block bg-[#02040A]" />
    </div>
  );
};
