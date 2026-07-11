import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999] rounded-full will-change-transform"
      style={{
        width: 40,
        height: 40,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)',
        boxShadow: '0 0 20px rgba(6,182,212,0.3)',
      }}
    />
  );
};
