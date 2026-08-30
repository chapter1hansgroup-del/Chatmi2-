import React, { useEffect, useRef } from 'react';
import { ScreenFxType } from '../types';
import { soundEffects } from '../utils/audio';

interface ScreenFxOverlayProps {
  activeFx: ScreenFxType | null;
  onComplete: () => void;
}

export const ScreenFxOverlay: React.FC<ScreenFxOverlayProps> = ({ activeFx, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activeFx) return;

    // Play corresponding sound effect
    if (activeFx === 'confetti') soundEffects.playCelebrationChime();
    else if (activeFx === 'rocket') soundEffects.playRocketSound();
    else if (activeFx === 'matrix' || activeFx === 'fire') soundEffects.playLaserSound();
    else if (activeFx === 'cash') soundEffects.playCashSound();
    else if (activeFx === 'hearts') soundEffects.playOrbChime();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 3800; // ms

    // Particle sets based on activeFx
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      vRot: number;
      char?: string;
    }

    const particles: Particle[] = [];

    if (activeFx === 'confetti') {
      const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
      for (let i = 0; i < 180; i++) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 200,
          y: height / 2 + 100,
          vx: (Math.random() - 0.5) * 18,
          vy: -Math.random() * 20 - 8,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
        });
      }
    } else if (activeFx === 'rocket') {
      // Rocket trail particles + main booster
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 60,
          y: height + Math.random() * 200,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 24 - 15,
          size: Math.random() * 6 + 2,
          color: Math.random() > 0.5 ? '#f97316' : '#eab308',
          alpha: 1,
          rotation: 0,
          vRot: 0,
        });
      }
    } else if (activeFx === 'matrix') {
      const chars = '01010101XYZ01アイウエオカキクケコサシスセソタチツテト';
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * -height,
          vx: 0,
          vy: Math.random() * 8 + 10,
          size: Math.random() * 12 + 12,
          color: '#22c55e',
          alpha: Math.random() * 0.8 + 0.2,
          rotation: 0,
          vRot: 0,
          char: chars[Math.floor(Math.random() * chars.length)],
        });
      }
    } else if (activeFx === 'fire') {
      for (let i = 0; i < 160; i++) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * width * 0.7,
          y: height + Math.random() * 40,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 12 - 6,
          size: Math.random() * 20 + 8,
          color: Math.random() > 0.4 ? '#ef4444' : '#f59e0b',
          alpha: 1,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
        });
      }
    } else if (activeFx === 'hearts') {
      const emojis = ['💖', '❤️', '✨', '🥰', '🔥', '💜'];
      for (let i = 0; i < 65; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 150,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 6 - 4,
          size: Math.random() * 18 + 18,
          color: '#ec4899',
          alpha: 1,
          rotation: (Math.random() - 0.5) * 0.5,
          vRot: (Math.random() - 0.5) * 0.05,
          char: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }
    } else if (activeFx === 'cash') {
      const cashSymbols = ['💵', '💰', '💸', '💎', '🚀'];
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * -height * 0.5,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 6 + 5,
          size: Math.random() * 16 + 20,
          color: '#10b981',
          alpha: 1,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
          char: cashSymbols[Math.floor(Math.random() * cashSymbols.length)],
        });
      }
    }

    // Render loop
    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const fadeProgress = elapsed / duration;
      const globalAlpha = fadeProgress > 0.75 ? 1 - (fadeProgress - 0.75) / 0.25 : 1;

      // Rocket ship graphic if active
      if (activeFx === 'rocket') {
        const rocketProgress = elapsed / (duration * 0.85);
        const rocketY = height - rocketProgress * (height + 300);
        const rocketX = width / 2;

        ctx.save();
        ctx.translate(rocketX, rocketY);
        ctx.font = '54px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚀', 0, 0);
        ctx.restore();
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (activeFx === 'confetti') {
          p.vy += 0.45; // gravity
          p.vx *= 0.98;
        } else if (activeFx === 'fire') {
          p.size *= 0.98;
          p.alpha *= 0.98;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha * globalAlpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.char) {
          ctx.font = `${p.size}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (activeFx === 'matrix') {
            ctx.fillStyle = p.color;
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 8;
          }
          ctx.fillText(p.char, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeFx, onComplete]);

  if (!activeFx) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none w-screen h-screen"
    />
  );
};
