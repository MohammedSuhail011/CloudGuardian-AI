import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, AlertTriangle, Shield, Database } from 'lucide-react';
import { CountUp } from '../layout/CountUp';
import type { ThreatDetail, CriticalRisk } from '../../utils/useDashboardData';

interface StatCardProps {
  title: string;
  value: number | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  suffix: string;
  emptyMessage?: string;
  breakdown?: { label: string; value: number; color: string }[];
  threats?: ThreatDetail[];
  risks?: CriticalRisk[];
  complianceData?: { framework: string; score: number; color: string }[];
  onOpenDetails?: (title: string) => void;
}

function EmptyPanelContent({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Database className="w-8 h-8 text-gray-600 mb-3" />
      <p className="text-gray-500 text-sm">Upload a dataset in Threat Dataset Tester to view {title.toLowerCase()}.</p>
    </div>
  );
}

function ThreatsPanel({ threats }: { threats: ThreatDetail[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const filtered = threats.filter(t => {
    if (filter !== 'all' && t.severity !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter threats..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-cyber-dark/50 border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Critical', count: threats.filter(t => t.severity === 'critical').length, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'High', count: threats.filter(t => t.severity === 'high').length, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Medium', count: threats.filter(t => t.severity === 'medium').length, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Low', count: threats.filter(t => t.severity === 'low').length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active', count: threats.filter(t => t.status === 'active').length, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
          { label: 'Investigating', count: threats.filter(t => t.status === 'investigating').length, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} p-2.5 rounded-lg text-center border border-current/5`}>
            <div className={`text-lg font-bold ${s.color}`}>{s.count}</div>
            <div className="text-[10px] text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-cyber pr-1">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">No threats match your filter</p>
        )}
        {filtered.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-2.5 rounded-lg bg-cyber-dark/30 border border-cyber-border/50 hover:bg-cyber-dark/50 transition-colors group"
          >
            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
              t.severity === 'critical' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]' :
              t.severity === 'high' ? 'bg-orange-500' :
              t.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-white truncate">{t.title}</span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">{t.timeAgo}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{t.source}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RisksPanel({ risks }: { risks: CriticalRisk[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">Critical risks detected across your cloud infrastructure with automated remediation suggestions.</p>
      <div className="space-y-3">
        {risks.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-cyber-dark/40 border border-cyber-border/60 hover:border-neon-cyan/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                r.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{r.provider} · Risk Score: {r.score}/100</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    r.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {r.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{r.description}</p>
                <div className="mt-2.5 p-3 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10">
                  <div className="flex items-center gap-1.5 text-xs text-neon-cyan font-medium mb-1">
                    <Shield className="w-3.5 h-3.5" /> Remediation
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{r.remediation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ComplianceBreakdown({ data }: { data: { framework: string; score: number; color: string }[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.map((fw, i) => (
          <motion.div
            key={fw.framework}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{fw.framework}</span>
              <span className="text-white font-bold">{fw.score}%</span>
            </div>
            <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fw.score}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: fw.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const StatCard = React.memo<StatCardProps>(({
  title, value, icon: Icon, color, borderColor, suffix,
  threats, risks, complianceData, emptyMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderPanelContent = () => {
    if (title === 'Active Threats' && threats) return <ThreatsPanel threats={threats} />;
    if (title === 'Critical Risks' && risks) return <RisksPanel risks={risks} />;
    if (title === 'Compliance Score' && complianceData) return <ComplianceBreakdown data={complianceData} />;
    return <EmptyPanelContent title={title} />;
  };

  const panelTitle = title === 'Total Resources' ? 'Resource Breakdown'
    : title === 'Active Threats' ? 'Threat Details'
    : title === 'Critical Risks' ? 'Risk Remediation'
    : title === 'Compliance Score' ? 'Compliance Breakdown'
    : title;

  const isDisabled = value === null;

  return (
    <>
      <motion.button
        onClick={() => !isDisabled && setIsOpen(true)}
        whileHover={!isDisabled ? { scale: 1.02, y: -4 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`glass-panel p-6 relative overflow-hidden group border ${borderColor} w-full text-left ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
        style={{ outline: 'none' }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            boxShadow: !isDisabled ? `inset 0 0 30px ${color === 'text-neon-cyan' ? 'rgba(6,182,212,0.15)' : color === 'text-neon-purple' ? 'rgba(139,92,246,0.15)' : color === 'text-red-500' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}` : 'none',
          }}
        />
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
          <Icon className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <Icon className={`w-8 h-8 mb-4 ${color}`} />
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white">
            {value !== null ? <CountUp end={value} suffix={suffix} duration={2} /> : <span className="text-gray-500">—</span>}
          </p>
          {value === null && emptyMessage && (
            <p className="text-xs text-gray-500 mt-2">{emptyMessage}</p>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            onKeyDown={e => { if (e.key === 'Escape') setIsOpen(false); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl glass-panel p-0 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-5 border-b border-cyber-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${color.replace('text', 'bg')}/10`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{panelTitle}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 overflow-y-auto scrollbar-cyber flex-1">
                {renderPanelContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
