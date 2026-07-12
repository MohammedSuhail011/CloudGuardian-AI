import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimelinePoint } from '../../utils/useDashboardData';
import { renderActiveDot } from '../../utils/chartConfig';

const CustomTooltip = React.memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as TimelinePoint;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="px-4 py-3 rounded-lg"
      style={{
        background: '#0f1729',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 0 24px rgba(6, 182, 212, 0.18)',
      }}
    >
      <p className="text-xs text-gray-500 font-mono">{data.label} · {data.time}</p>
      <p className="text-lg font-bold text-red-500 mt-0.5">{data.threats} threats</p>
      {data.events.length > 0 && (
        <div className="mt-1.5 pt-1.5 border-t border-cyber-border space-y-0.5">
          {data.events.map((e, i) => (
            <p key={i} className={`text-[10px] font-mono ${
              e.severity === 'critical' ? 'text-red-400' :
              e.severity === 'high' ? 'text-orange-400' :
              e.severity === 'medium' ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              • {e.title}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
});

interface ThreatTimelineProps {
  data: TimelinePoint[];
  onPointClick?: (point: TimelinePoint) => void;
}

export const ThreatTimeline: React.FC<ThreatTimelineProps> = React.memo(({ data, onPointClick }) => {
  const [clickedPoint, setClickedPoint] = useState<TimelinePoint | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const activeIndexRef = useRef<number | null>(null);
  const [, forceUpdate] = useState(0);

  const enrichedData = useMemo(() =>
    data.map(p => ({ ...p, drawValue: 0 })),
    [data]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setIsDrawing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: any) => {
    if (e?.activePayload?.[0]) {
      const point = e.activePayload[0].payload as TimelinePoint;
      setClickedPoint(point);
      onPointClick?.(point);
    }
  };

  const dotRenderer = useCallback((props: any) => {
    const { cx, cy, index } = props;
    const isActive = activeIndexRef.current === index;
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={isActive ? 5 : 3}
        fill={isActive ? '#ef4444' : '#4a1c1c'}
        stroke={isActive ? '#06b6d4' : 'none'}
        strokeWidth={isActive ? 2 : 0}
        className="transition-all duration-200 cursor-pointer"
      />
    );
  }, []);

  return (
    <>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enrichedData}
            onMouseMove={(e) => {
              if (e?.activeTooltipIndex !== undefined) {
                activeIndexRef.current = e.activeTooltipIndex as number;
                forceUpdate(n => n + 1);
              }
            }}
            onMouseLeave={() => { activeIndexRef.current = null; forceUpdate(n => n + 1); }}
            onClick={handleClick}
          >
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6, 182, 212, 0.25)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorThreats)"
              activeDot={renderActiveDot}
              dot={dotRenderer}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {isDrawing && (
        <motion.div
          className="absolute inset-0 left-0 top-0 h-full pointer-events-none"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      <AnimatePresence>
        {clickedPoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setClickedPoint(null)}
            onKeyDown={e => { if (e.key === 'Escape') setClickedPoint(null); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md glass-panel p-0 overflow-hidden"
            >
              <div className="p-5 border-b border-cyber-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-neon-cyan" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Threats at {clickedPoint.time}</h3>
                    <p className="text-xs text-gray-500">{clickedPoint.label} · {clickedPoint.threats} events detected</p>
                  </div>
                </div>
                <button onClick={() => setClickedPoint(null)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-2">
                {clickedPoint.events.length === 0 && (
                  <p className="text-center text-gray-500 py-6 text-sm">No specific threat events recorded at this time window.</p>
                )}
                {clickedPoint.events.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      e.severity === 'critical' ? 'bg-red-500' :
                      e.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm text-white">{e.title}</span>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-cyber-border flex justify-end">
                <button onClick={() => setClickedPoint(null)} className="px-4 py-2 text-sm bg-neon-cyan/10 text-neon-cyan rounded-lg font-medium hover:bg-neon-cyan/20 transition-colors border border-neon-cyan/30">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
