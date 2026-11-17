import React, { useEffect, useRef } from 'react';

/**
 * Animated petal choreography — high-performance lightweight canvas renderer.
 * Optimized for 60/120 FPS without thermal throttling or battery drain.
 * Pauses automatically when off-screen.
 */
export default function PetalCinema({ className = '', density = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        'ontouchstart' in window ||
        window.matchMedia('(pointer: coarse)').matches);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const maxPetals = isMobile ? Math.round(26 * density) : Math.round(52 * density);

    let width = 0;
    let height = 0;
    let alive = true;
    let visible = false;
    let raf = 0;
    let previous = 0;
    let elapsed = 0;
    let petals = [];

    const palette = [
      '#f296a8',
      '#cc748c',
      '#eab48c',
      '#bc647d',
      '#ffb3c6',
    ];

    function resize() {
      const r = canvas.getBoundingClientRect();
      width = Math.max(1, r.width);
      height = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(side) {
      const s = side === 0 ? 1 : -1;
      const origin = side === 0 ? 0.22 : 0.78;
      return {
        x: width * origin + (Math.random() - 0.5) * 40,
        y: height * (0.68 + Math.random() * 0.05),
        vx: s * (1.8 + Math.random() * 2.4),
        vy: -(3.0 + Math.random() * 3.5),
        air: 0.5 + Math.random() * 1.5,
        twist: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.14,
        size: 3.2 + Math.random() * 5.5,
        life: 0,
        ttl: 180 + Math.random() * 100,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    }

    function paint(p) {
      const opacity = Math.min(1, p.life / 20, Math.max(0, (p.ttl - p.life) / 50));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.twist);
      ctx.scale(1, 0.65 + 0.25 * Math.sin(p.life * 0.1));
      ctx.globalAlpha = opacity * 0.88;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(-p.size * 0.8, 0);
      ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.9, p.size * 0.8, -p.size, p.size, 0);
      ctx.bezierCurveTo(p.size * 0.52, p.size * 0.83, -p.size * 0.2, p.size * 0.66, -p.size * 0.8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function frame(t) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      if (reduce) {
        if (!previous) {
          previous = t;
          for (let i = 0; i < 20; i++) {
            const p = spawn(i % 2);
            p.x = Math.random() * width;
            p.y = Math.random() * height;
            paint(p);
          }
        }
        return;
      }

      const dt = Math.min(2.0, Math.max(0.2, (t - (previous || t)) / 16.67));
      previous = t;
      ctx.clearRect(0, 0, width, height);
      elapsed += dt;

      const spawnInterval = isMobile ? 8.0 / density : 5.5 / density;
      while (elapsed > spawnInterval) {
        elapsed -= spawnInterval;
        if (petals.length < maxPetals) {
          petals.push(spawn(0), spawn(1));
        }
      }

      petals = petals.filter((p) => {
        p.life += dt;
        p.vy += 0.04 * dt;
        p.vx += Math.sin(p.life * 0.03 + p.air) * 0.025 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.twist += p.spin * dt;

        if (p.life > p.ttl || p.y > height + 30 || p.x < -30 || p.x > width + 30) {
          return false;
        }
        paint(p);
        return true;
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        previous = 0;
        if (!visible) {
          ctx.clearRect(0, 0, width, height);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      petals = [];
    };
  }, [density]);

  return <canvas ref={ref} className={`petal-cinema ${className}`} aria-hidden="true" />;
}
