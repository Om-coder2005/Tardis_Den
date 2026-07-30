import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../computer/store/useSettingsStore';
import { useEnvironmentStore } from '../store/useEnvironmentStore';

interface Star {
  x: number;
  y: number;
  z: number;
  tw: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface Cloud {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
}

export const ParticleSystem: React.FC = () => {
  const { reducedMotion } = useSettingsStore();
  const { weather } = useEnvironmentStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Stars
    const starsCount = 600;
    const speed = 1.8;
    const spread = 5;
    const focal = 2;
    const twinkleAmount = 0.35;
    const size = 1.8;
    const reverseFly = true;

    const createStar = (): Star => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: Math.random(),
      tw: Math.random() * Math.PI * 2,
    });

    let stars: Star[] = Array.from({ length: starsCount }, createStar);

    // Rain
    const rainCount = 160;
    const createRainDrop = (initY = false): RainDrop => ({
      x: Math.random() * 2000 - 200,
      y: initY ? Math.random() * 1200 : -50,
      length: 15 + Math.random() * 20,
      speed: 12 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
    });

    let rainDrops: RainDrop[] = Array.from({ length: rainCount }, () => createRainDrop(true));

    // Clouds
    const cloudCount = 12;
    const createCloud = (initX = false): Cloud => ({
      x: initX ? Math.random() * 2000 : -300,
      y: Math.random() * 600,
      radius: 120 + Math.random() * 180,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.08 + Math.random() * 0.12,
    });

    let clouds: Cloud[] = Array.from({ length: cloudCount }, () => createCloud(true));

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

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Base background color according to weather
      if (weather === 'rain') {
        ctx.fillStyle = '#060B18';
      } else if (weather === 'cloudy') {
        ctx.fillStyle = '#0B1220';
      } else {
        ctx.fillStyle = '#02040A';
      }
      ctx.fillRect(0, 0, w, h);

      // 1. Render Stars (Always visible for clear/stars/cloudy, slightly dimmed during rain)
      ctx.fillStyle = '#FFFFFF';
      const cx = w / 2;
      const cy = h / 2;
      const starAlphaMultiplier = weather === 'rain' ? 0.3 : weather === 'cloudy' ? 0.6 : 1.0;

      for (const s of stars) {
        const depth = s.z * Math.max(0.01, Math.min(10, focal)) + 0.001;
        const px = cx + (s.x / depth) * w;
        const py = cy + (s.y / depth) * h;

        s.z += reverseFly ? speed * 0.0012 : -speed * 0.0012;
        if (s.z <= 0 || s.z > 1) {
          Object.assign(s, createStar());
        }

        s.tw += twinkleAmount * 0.05;
        const alpha = Math.max(0, 1 - s.z) * starAlphaMultiplier;
        const radius = Math.max(0.1, size) * (1 - s.z) * (1 + Math.sin(s.tw) * twinkleAmount);

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Render Clouds if weather === 'cloudy' or 'rain'
      if (weather === 'cloudy' || weather === 'rain') {
        for (const c of clouds) {
          c.x += c.speed;
          if (c.x - c.radius > w + 200) {
            Object.assign(c, createCloud(false));
          }

          const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
          grad.addColorStop(0, weather === 'rain' ? `rgba(60, 80, 110, ${c.opacity * 1.5})` : `rgba(180, 200, 230, ${c.opacity})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render Rain if weather === 'rain'
      if (weather === 'rain') {
        ctx.strokeStyle = 'rgba(175, 215, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        for (const r of rainDrops) {
          r.y += r.speed;
          r.x += 1.5; // Wind drift

          if (r.y > h + 50 || r.x > w + 200) {
            Object.assign(r, createRainDrop(false));
          }

          ctx.globalAlpha = r.opacity;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + 3, r.y + r.length);
          ctx.stroke();
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
  }, [reducedMotion, weather]);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
