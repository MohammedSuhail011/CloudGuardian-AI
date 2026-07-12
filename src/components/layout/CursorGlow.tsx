import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full"
      style={{
        willChange: 'transform',
        background: 'rgba(6,182,212,0.9)',
        boxShadow: '0 0 6px rgba(6,182,212,0.8), 0 0 15px rgba(6,182,212,0.5), 0 0 30px rgba(6,182,212,0.3)',
      }}
    />
  );
};
