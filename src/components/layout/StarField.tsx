import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  vx: number;
  vy: number;
}

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const STAR_COUNT = 120;
    const CONNECT_DIST = 180;
    let skip = 0;
    let lastFrame = 0;
    const frameInterval = 1000 / 50;
    const PATTERN_CYCLE = 6000;

    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        brightness: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
      });
    }

    // Constellation patterns — predefined index sets that form shapes
    const constellationDefs = [
      // Triangle
      [0, 1, 2, 0],
      // Pentagon-ish
      [3, 4, 5, 6, 7, 3],
      // Diamond
      [8, 9, 10, 11, 8],
      // Arrow / zigzag
      [12, 13, 14, 15, 16],
      // Big triangle
      [17, 18, 19, 17],
      // Cross pattern
      [20, 21, 22, 23, 24, 20],
    ];

    let startTime = Date.now();
    let paused = false;

    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (paused) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      skip = (skip + 1) % 3;

      ctx.clearRect(0, 0, w, h);
      const elapsed = (Date.now() - startTime) / 1000;

      // Update star positions
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;
      }

      // --- Phase 1: Draw proximity connections (throttled) ---
      if (skip === 0) {
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST) {
              const alpha = 0.06 * (1 - dist / CONNECT_DIST);
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // --- Phase 2: Constellation pattern lines (cycle through patterns) ---
      const cycleTime = elapsed % (PATTERN_CYCLE / 1000 * constellationDefs.length);
      const patternIndex = Math.floor(cycleTime / (PATTERN_CYCLE / 1000)) % constellationDefs.length;
      const patternProgress = (cycleTime % (PATTERN_CYCLE / 1000)) / (PATTERN_CYCLE / 1000);

      // Fade in/out
      const fadeAlpha = patternProgress < 0.15
        ? patternProgress / 0.15
        : patternProgress > 0.85
          ? (1 - patternProgress) / 0.15
          : 1;

      const pattern = constellationDefs[patternIndex];

      // Draw constellation lines
      ctx.lineWidth = 1;
      for (let i = 0; i < pattern.length - 1; i++) {
        const a = stars[pattern[i] % stars.length];
        const b = stars[pattern[i + 1] % stars.length];
        const alpha = 0.3 * fadeAlpha;

        // Gradient line
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(6, 182, 212, ${alpha})`);
        grad.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(6, 182, 212, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.stroke();

        // Traveling pulse along the line
        const pulseT = (elapsed * 0.5 + i * 0.3) % 1;
        const px = a.x + (b.x - a.x) * pulseT;
        const py = a.y + (b.y - a.y) * pulseT;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.7 * fadeAlpha})`;
        ctx.fill();
      }

      // Draw constellation vertex glow
      for (const idx of pattern) {
        const s = stars[idx % stars.length];
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.25 * fadeAlpha})`;
        ctx.fill();
      }

      // --- Phase 3: Draw all stars with twinkle ---
      for (const s of stars) {
        const twinkle = 0.5 + Math.sin(elapsed * s.twinkleSpeed + s.twinkleOffset) * 0.5;
        const alpha = s.brightness * (0.4 + twinkle * 0.6);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
        ctx.fill();

        // Glow around brighter stars
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.1})`;
          ctx.fill();
        }
      }
    };

    animId = requestAnimationFrame(draw);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
};
