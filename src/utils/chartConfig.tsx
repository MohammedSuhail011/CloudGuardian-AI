import React, { useState, useEffect, useRef } from 'react';

const TOOLTIP_BG = '#0f1729';
const TOOLTIP_BORDER = '1px solid rgba(6, 182, 212, 0.3)';
const TOOLTIP_SHADOW = '0 0 24px rgba(6, 182, 212, 0.18)';
const TOOLTIP_RADIUS = '8px';

export const tooltipContentStyle: React.CSSProperties = {
  background: TOOLTIP_BG,
  border: TOOLTIP_BORDER,
  borderRadius: TOOLTIP_RADIUS,
  color: '#fff',
  fontSize: '12px',
  boxShadow: TOOLTIP_SHADOW,
  padding: '8px 12px',
  outline: 'none',
};

export const tooltipItemStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '12px',
};

export const tooltipLabelStyle: React.CSSProperties = {
  color: '#e2e8f0',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '2px',
};

export const tooltipCursorStyle = {
  stroke: 'rgba(6, 182, 212, 0.25)',
  strokeWidth: 1,
  strokeDasharray: '4 4',
};

export const defaultTooltipProps = {
  contentStyle: tooltipContentStyle,
  itemStyle: tooltipItemStyle,
  labelStyle: tooltipLabelStyle,
  cursor: tooltipCursorStyle,
};

export function PieActiveShape(props: {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number;
  startAngle?: number; endAngle?: number; fill?: string; payload?: { name: string; value: number };
  percent?: number; value?: number;
}) {
  const cx = props.cx ?? 0; const cy = props.cy ?? 0;
  const midAngle = props.midAngle ?? 0; const innerRadius = props.innerRadius ?? 0; const outerRadius = props.outerRadius ?? 0;
  const startAngle = props.startAngle ?? 0; const endAngle = props.endAngle ?? 0;
  const fill = props.fill ?? '#000'; const payload = props.payload ?? { name: '', value: 0 };
  const percent = props.percent ?? 0;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 6) * cos;
  const sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 12) * cos;
  const my = cy + (outerRadius + 12) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <defs>
        <filter id="pie-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="#e2e8f0" fontSize={11} fontWeight={600}>
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey + 14} textAnchor={textAnchor} fill="#94a3b8" fontSize={10}>
        {`${(percent * 100).toFixed(0)}% (${payload.value})`}
      </text>
      <path
        fill={fill}
        d={`
          M${cx + (innerRadius - 2) * Math.cos(-startAngle * RADIAN)},${cy + (innerRadius - 2) * Math.sin(-startAngle * RADIAN)}
           A${innerRadius - 2},${innerRadius - 2} 0 0,1 ${cx + (innerRadius - 2) * Math.cos(-endAngle * RADIAN)},${cy + (innerRadius - 2) * Math.sin(-endAngle * RADIAN)}
           L${cx + (outerRadius + 6) * Math.cos(-endAngle * RADIAN)},${cy + (outerRadius + 6) * Math.sin(-endAngle * RADIAN)}
           A${outerRadius + 6},${outerRadius + 6} 0 0,0 ${cx + (outerRadius + 6) * Math.cos(-startAngle * RADIAN)},${cy + (outerRadius + 6) * Math.sin(-startAngle * RADIAN)}
          Z
        `}
        style={{ filter: 'url(#pie-glow)' }}
        opacity={0.9}
      />
    </g>
  );
}

export function BarActiveShape(props: {
  fill?: string; x?: number; y?: number; width?: number; height?: number;
  index?: number;
}) {
  const fill = props.fill ?? '#000'; const x = props.x ?? 0; const y = props.y ?? 0;
  const width = props.width ?? 0; const height = props.height ?? 0;
  return (
    <g>
      <defs>
        <filter id="active-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Soft glow halo */}
      <rect
        x={x - 4} y={y - 8} width={width + 8} height={height + 12}
        rx={8} ry={8}
        fill={fill}
        opacity={0.2}
        filter="url(#active-glow)"
      />
      {/* Main highlighted bar */}
      <rect x={x - 1} y={y - 4} width={width + 2} height={height + 4} rx={5} ry={5} fill={fill} opacity={1} />
      {/* Top cap */}
      <rect x={x - 1} y={y - 4} width={width + 2} height={3} rx={4} fill="white" opacity={0.25} />
    </g>
  );
}

export function AnimatedBarShape(props: {
  x?: number; y?: number; width?: number; height?: number; fill?: string;
  index?: number;
}) {
  const x = props.x ?? 0; const y = props.y ?? 0;
  const width = props.width ?? 0; const height = props.height ?? 0;
  const fill = props.fill ?? '#000'; const index = props.index ?? 0;
  const [animHeight, setAnimHeight] = useState(0);
  const [animY, setAnimY] = useState(y + height);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      const delay = index * 80;
      const timer = setTimeout(() => {
        setAnimHeight(height);
        setAnimY(y);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setAnimHeight(height);
      setAnimY(y);
    }
  }, [y, height, index]);

  const filterId = `bar-glow-${index}`;

  return (
    <g>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`bar-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.5} />
        </linearGradient>
      </defs>
      {/* Glow layer */}
      <rect
        x={x - 2}
        y={animY}
        width={width + 4}
        height={animHeight}
        rx={6}
        fill={fill}
        opacity={0.15}
        style={{ transition: 'height 600ms cubic-bezier(0.34,1.56,0.64,1), y 600ms cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      {/* Main bar with gradient */}
      <rect
        x={x}
        y={animY}
        width={width}
        height={animHeight}
        fill={`url(#bar-grad-${index})`}
        rx={4}
        style={{ transition: 'height 600ms cubic-bezier(0.34,1.56,0.64,1), y 600ms cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      {/* Top cap highlight */}
      <rect
        x={x}
        y={animY}
        width={width}
        height={Math.min(3, animHeight)}
        rx={4}
        fill="white"
        opacity={0.2}
        style={{ transition: 'y 600ms cubic-bezier(0.34,1.56,0.64,1)' }}
      />
    </g>
  );
}

export function renderActiveDot(props: {
  cx?: number; cy?: number; fill?: string;
}) {
  const cx = props.cx ?? 0; const cy = props.cy ?? 0; const fill = props.fill ?? '#ef4444';
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={fill} opacity={0.15} />
      <circle cx={cx} cy={cy} r={5} fill={fill} opacity={0.4} />
      <circle cx={cx} cy={cy} r={3} fill={fill} />
    </g>
  );
}
