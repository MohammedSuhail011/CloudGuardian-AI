import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', duration = 2, decimals = 0 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    let rafId: number | null = null;
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current && !cancelled) {
          started.current = true;
          let startTime: number | null = null;
          const animate = (now: number) => {
            if (cancelled) return;
            if (!startTime) startTime = now;
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(eased * end);
            if (progress < 1) rafId = requestAnimationFrame(animate);
          };
          rafId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
};
