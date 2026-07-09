import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX - 150}px`;
      el.style.top = `${e.clientY - 150}px`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999] rounded-full"
      style={{
        left: -200,
        top: -200,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
      }}
    />
  );
};
