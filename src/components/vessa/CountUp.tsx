import React, { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
}

/** Số chạy từ 0 đến value (easeOutExpo). Tôn trọng prefers-reduced-motion. */
export const CountUp: React.FC<Props> = ({ value, decimals = 0, duration = 1100 }) => {
  const [display, setDisplay] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return <span className="tabular-nums">{display.toFixed(decimals)}</span>;
};
