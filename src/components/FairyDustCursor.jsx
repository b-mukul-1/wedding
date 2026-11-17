import React, { useEffect, useRef } from 'react';

/**
 * FairyDustCursor: Disney / Tinker Bell-inspired golden stardust & sparkler trail.
 * High-performance: Only active on desktop devices with fine pointer (mouse/trackpad).
 * Completely bypassed on touchscreens to preserve mobile battery and eliminate heating.
 */
export default function FairyDustCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop mouse/fine pointers
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    let particles = [];
    let isRunning = false;
    let mouse = { x: -100, y: -100, prevX: -100, prevY: -100, speed: 0 };

    const colors = ['#ffffff', '#fff3c4', '#ffd700', '#fdbb2d', '#f69d3c', '#ff758c'];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function addParticles(x, y, count = 2) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.0 + 0.5;
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: Math.random() * 3.2 + 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.018,
          isStar: Math.random() > 0.45,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    function onPointerMove(e) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const dx = clientX - mouse.prevX;
      const dy = clientY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.prevX = clientX;
      mouse.prevY = clientY;

      const count = Math.min(4, Math.max(1, Math.floor(mouse.speed / 5)));
      addParticles(clientX, clientY, count);
    }

    function loop() {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.isStar) {
          drawStar(ctx, 0, 0, 4, p.size * 1.4, p.size * 0.4);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    resize();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  // Return null on touch devices
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(pointer: fine)').matches)
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fairy-dust-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
