import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId: number | null = null;
    const move = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
        rafId = null;
      });
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999] rounded-full will-change-transform"
      style={{
        width: 200,
        height: 200,
        background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
      }}
    />
  );
};
