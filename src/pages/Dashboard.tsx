import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Lock, Eye, Zap, Clock, ArrowRight, FileText, Download, X, ChevronRight, Bug, Upload, Database, Cloud } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
const CyberGlobe = React.lazy(() => import('../components/3d/CyberGlobe').then(m => ({ default: m.CyberGlobe })));
import { StatCard } from '../components/dashboard/StatCard';
import { ThreatTimeline } from '../components/dashboard/ThreatTimeline';
import { LiveFeed } from '../components/dashboard/LiveFeed';
import { useDataset } from '../store/DatasetContext';
import { useNavigate } from 'react-router-dom';
import type { CloudProvider, Severity, FeedItem } from '../types/threatTester';
import { tooltipContentStyle, tooltipCursorStyle, PieActiveShape, AnimatedBarShape } from '../utils/chartConfig';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.94, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.96, y: 12, filter: 'blur(2px)', transition: { duration: 0.18 } },
};

function NoDataEmptyState({ message, actionLabel, actionLink }: { message: string; actionLabel?: string; actionLink?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Database className="w-12 h-12 text-gray-600 mb-4" />
      <p className="text-gray-500 text-sm mb-3">{message}</p>
      {actionLabel && (
        <button
          onClick={() => navigate(actionLink || '/threat-tester')}
          className="px-4 py-2 text-xs bg-neon-cyan/10 text-neon-cyan rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-center">
      <div>
        <BarChart className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

function ScanningRadar() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/30 animate-spin-slow" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-2 rounded-full border border-neon-cyan/20 animate-spin-slow" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      <div className="absolute inset-4 rounded-full border border-neon-purple/20 animate-spin-slow" style={{ animationDuration: '2s' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Shield className="w-10 h-10 text-neon-cyan animate-pulse-glow" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-neon-cyan to-transparent rounded-full animate-spin-slow origin-bottom" style={{ animationDuration: '2s' }} />
    </div>
  );
}

function ThreatHuntAnimation() {
  const [dots, setDots] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        const next = [...prev, { x: Math.random() * 100, y: Math.random() * 100, id: idRef.current++ }];
        return next.slice(-20);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 mx-auto rounded-xl bg-cyber-dark/80 border border-cyber-border overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMjBoMjBNMjAgMHYyMCIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan" />
      <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-transparent via-neon-cyan to-transparent" style={{ animation: 'scan 3s linear infinite', animationDelay: '1.5s' }} />
      <Eye className="absolute inset-0 m-auto w-8 h-8 text-neon-purple animate-pulse-glow z-10" />
      {dots.map(d => (
        <motion.div
          key={d.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] pointer-events-none z-20"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
        />
      ))}
    </div>
  );
}

function ReportProgress({ done }: { done: boolean }) {
  const steps = ['Scanning assets', 'Analyzing configurations', 'Generating findings', 'Compiling report'];
  return (
    <div className="space-y-3 w-full max-w-xs mx-auto">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0.3, x: -10 }}
          animate={done || i < 3 ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -10 }}
          transition={{ delay: i * 0.4 }}
          className="flex items-center gap-3 text-sm"
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            done || i < 3 ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'
          }`}>
            {(done || i < 3) && <CheckCircle className="w-4 h-4 text-neon-green" />}
          </div>
          <span className={done || i < 3 ? 'text-white' : 'text-gray-500'}>{s}</span>
        </motion.div>
      ))}
    </div>
  );
}

function AlertItem({ alert, i }: { alert: { severity: string; title: string; desc: string; time: string }; i: number }) {
  const sevColor = alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500';
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ x: 3 }}
      className="flex gap-3 p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-neon-cyan/30 transition-colors cursor-pointer"
    >
      <div className={`w-2 h-2 mt-1.5 rounded-full ${sevColor} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <span className="text-sm font-medium text-white truncate">{alert.title}</span>
          <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{alert.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 self-center" />
    </motion.div>
  );
}

function CharacterSVG({ type }: { type: string }) {
  const commonProps = { viewBox: '0 0 64 64', className: 'w-14 h-14' };
  switch (type) {
    case 'scan':
      return (
        <svg {...commonProps} fill="none">
          <rect x="20" y="28" width="24" height="24" rx="5" fill="url(#sbot)" stroke="#67e8f9" strokeWidth="1.5" />
          <rect x="28" y="18" width="8" height="10" rx="3" fill="#0c4a6e" stroke="#67e8f9" strokeWidth="1" />
          <circle cx="32" cy="22" r="2.5" fill="#a5f3fc" />
          <line x1="32" y1="15" x2="32" y2="12" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="10" r="2" fill="#67e8f9" opacity="0.8" />
          <rect x="24" y="36" width="16" height="2" rx="1" fill="#0891b2" opacity="0.6" />
          <rect x="24" y="40" width="12" height="2" rx="1" fill="#0891b2" opacity="0.6" />
          <circle cx="25" cy="46" r="2" fill="#67e8f9" opacity="0.5" className="animate-pulse-glow" style={{ animationDuration: '1.5s' }} />
          <circle cx="39" cy="46" r="2" fill="#67e8f9" opacity="0.5" className="animate-pulse-glow" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
          <defs>
            <linearGradient id="sbot" x1="20" y1="28" x2="44" y2="52"><stop stopColor="#0891b2" /><stop offset="1" stopColor="#164e63" /></linearGradient>
          </defs>
        </svg>
      );
    case 'hunt':
      return (
        <svg {...commonProps} fill="none">
          <rect x="18" y="26" width="28" height="28" rx="8" fill="url(#agent)" stroke="#a78bfa" strokeWidth="1.5" />
          <ellipse cx="32" cy="30" rx="8" ry="6" fill="#2e1065" stroke="#c4b5fd" strokeWidth="1.2" />
          <path d="M27 28 Q32 24 37 28" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="28.5" cy="30" r="2.5" fill="#c4b5fd" />
          <circle cx="35.5" cy="30" r="2.5" fill="#c4b5fd" />
          <circle cx="28.5" cy="30" r="1" fill="#2e1065" />
          <circle cx="35.5" cy="30" r="1" fill="#2e1065" />
          <rect x="26" y="36" width="12" height="3" rx="1.5" fill="#6d28d9" opacity="0.7" />
          <rect x="22" y="42" width="20" height="2" rx="1" fill="#8b5cf6" opacity="0.4" />
          <rect x="22" y="46" width="14" height="2" rx="1" fill="#8b5cf6" opacity="0.4" />
          <circle cx="20" cy="32" r="1.5" fill="#a78bfa" opacity="0.6" className="animate-pulse-glow" style={{ animationDuration: '2s' }} />
          <circle cx="44" cy="32" r="1.5" fill="#a78bfa" opacity="0.6" className="animate-pulse-glow" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          <defs>
            <linearGradient id="agent" x1="18" y1="26" x2="46" y2="54"><stop stopColor="#6d28d9" /><stop offset="1" stopColor="#1e1b4b" /></linearGradient>
          </defs>
        </svg>
      );
    case 'report':
      return (
        <svg {...commonProps} fill="none">
          <rect x="18" y="26" width="28" height="28" rx="6" fill="url(#cyborg)" stroke="#34d399" strokeWidth="1.5" />
          <rect x="26" y="18" width="12" height="8" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
          <path d="M29 22h6M29 25h4" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="30" r="6" fill="#022c22" stroke="#34d399" strokeWidth="1.2" />
          <circle cx="32" cy="30" r="3" fill="#34d399" opacity="0.2" />
          <circle cx="32" cy="30" r="1.5" fill="#6ee7b7" />
          <rect x="22" y="38" width="20" height="2" rx="1" fill="#047857" opacity="0.6" />
          <rect x="24" y="42" width="12" height="2" rx="1" fill="#047857" opacity="0.6" />
          <rect x="22" y="46" width="8" height="2" rx="1" fill="#047857" opacity="0.6" />
          <line x1="26" y1="10" x2="26" y2="6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="10" x2="38" y2="6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="6" x2="38" y2="6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="4" r="1.5" fill="#6ee7b7" opacity="0.8" className="animate-pulse-glow" style={{ animationDuration: '1.2s' }} />
          <defs>
            <linearGradient id="cyborg" x1="18" y1="26" x2="46" y2="54"><stop stopColor="#047857" /><stop offset="1" stopColor="#022c22" /></linearGradient>
          </defs>
        </svg>
      );
    case 'alerts':
      return (
        <svg {...commonProps} fill="none">
          <rect x="18" y="26" width="28" height="28" rx="7" fill="url(#guard)" stroke="#fb923c" strokeWidth="1.5" />
          <path d="M26 30 L32 26 L38 30 L36 40 L32 44 L28 40 Z" fill="#431407" stroke="#fdba74" strokeWidth="1.2" />
          <circle cx="32" cy="33" r="4" fill="#fb923c" opacity="0.15" />
          <circle cx="32" cy="33" r="2.5" fill="#fdba74" />
          <path d="M30 38 Q32 42 34 38" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="22" y="42" width="20" height="2" rx="1" fill="#9a3412" opacity="0.6" />
          <rect x="24" y="46" width="12" height="2" rx="1" fill="#9a3412" opacity="0.6" />
          <rect x="28" y="24" width="2" height="3" rx="1" fill="#f97316" opacity="0.8" className="animate-pulse-glow" style={{ animationDuration: '0.8s' }} />
          <rect x="34" y="24" width="2" height="3" rx="1" fill="#f97316" opacity="0.8" className="animate-pulse-glow" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
          <defs>
            <linearGradient id="guard" x1="18" y1="26" x2="46" y2="54"><stop stopColor="#c2410c" /><stop offset="1" stopColor="#431407" /></linearGradient>
          </defs>
        </svg>
      );
    default:
      return null;
  }
}

const quickActions = [
  { id: 'scan', label: 'Run Compliance Scan', icon: Shield, gradient: ['#0b2b4a', '#0a4d6e'], glowColor: '#06b6d4', desc: 'CIS/NIST benchmark audit' },
  { id: 'hunt', label: 'Threat Hunt', icon: Eye, gradient: ['#1e1035', '#3b1f6e'], glowColor: '#8b5cf6', desc: 'AI-powered anomaly detection' },
  { id: 'report', label: 'Generate Report', icon: FileText, gradient: ['#0a3d28', '#0f6e4a'], glowColor: '#10b981', desc: 'Export compliance report' },
  { id: 'alerts', label: 'Review Alerts', icon: AlertTriangle, gradient: ['#3d170a', '#6e2a0f'], glowColor: '#f97316', desc: 'Pending security alerts' },
];

const providerColors: Record<string, string> = { AWS: '#ff9900', Azure: '#0089D6', GCP: '#EA4335' };
const severityColors: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

function getActiveThreats(analysis: { findings: { severity: string }[] }): number {
  const activeSeverities = ['Critical', 'High', 'Medium'];
  return analysis.findings.filter(f => activeSeverities.includes(f.severity)).length;
}

function getComplianceScore(analysis: { findings: { severity: string; riskScore: number }[]; resources: unknown[] }): number {
  if (analysis.findings.length === 0) return 100;
  const sumRisk = analysis.findings.reduce((s, f) => s + f.riskScore, 0);
  const avgRisk = sumRisk / analysis.findings.length;
  const score = Math.max(0, Math.min(100, 100 - avgRisk));
  return Math.round(score);
}

function getProviderDistribution(resources: { provider: string }[]) {
  const counts: Record<string, number> = {};
  resources.forEach(r => { counts[r.provider] = (counts[r.provider] || 0) + 1; });
  const total = resources.length;
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
    count: value,
    color: providerColors[name] || '#8b5cf6',
  }));
}

function getTimelineFromFindings(findings: { id: string; severity: string; threat: string }[], resources: { config: Record<string, unknown> }[]) {
  const hasTimestamps = resources.some(r => r.config?.timestamp || r.config?.timestamp_utc || r.config?.detected_at);
  if (!hasTimestamps) return null;

  const buckets: Record<string, { time: string; threats: number; label: string; events: { severity: string; title: string }[] }> = {};
  const hourLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
  hourLabels.forEach(h => { buckets[h] = { time: h, threats: 0, label: h, events: [] }; });

  const labelMap: Record<string, string> = {
    '00:00': 'Midnight', '02:00': '2 AM', '04:00': '4 AM', '06:00': '6 AM',
    '08:00': '8 AM', '10:00': '10 AM', '12:00': 'Noon', '14:00': '2 PM',
    '16:00': '4 PM', '18:00': '6 PM', '20:00': '8 PM', '22:00': '10 PM', '24:00': 'Midnight',
  };

  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const totalThreats = findings.length;
  let idx = 0;
  for (const h of hourLabels) {
    if (buckets[h]) {
      const count = Math.round((totalThreats / hourLabels.length) * (0.5 + Math.random()));
      buckets[h].threats = idx === 0 ? count : Math.min(count, Math.round(totalThreats * 0.4));
      buckets[h].label = labelMap[h] || h;
      if (findings[idx]) {
        buckets[h].events.push({ severity: findings[idx].severity.toLowerCase(), title: findings[idx].threat.slice(0, 40) });
        idx = (idx + 1) % findings.length;
      }
    }
  }
  return Object.values(buckets);
}

function getFeedItems(findings: { id: string; severity: string; threat: string; description: string; provider: string; service: string; riskScore: number }[]): FeedItem[] {
  const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = { Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low' };
  const order = ['Critical', 'High', 'Medium', 'Low'];
  return [...findings].sort((a, b) => {
    const sevDiff = order.indexOf(a.severity) - order.indexOf(b.severity);
    if (sevDiff !== 0) return sevDiff;
    return (b.riskScore ?? 0) - (a.riskScore ?? 0);
  }).map(f => ({
    id: f.id,
    time: 'now',
    alert: f.threat,
    level: severityMap[f.severity] || 'low',
    source: `${f.provider} ${f.service}`,
    detail: f.description || f.threat,
    provider: f.provider,
    riskScore: f.riskScore,
    timestamp: Date.now(),
  }));
}

export const Dashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [huntResults, setHuntResults] = useState<{ found: number; time: string } | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null);
  const [globeVisible, setGlobeVisible] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);
  const { resources, analysis, datasetName, isAnalyzing } = useDataset();
  const navigate = useNavigate();

  useEffect(() => {
    const el = globeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGlobeVisible(true); }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openModal = (id: string) => {
    setActiveModal(id);
    if (id === 'scan') { setScanProgress('idle'); setTimeout(() => setScanProgress('scanning'), 300); setTimeout(() => setScanProgress('done'), 3500); }
    if (id === 'hunt') { setHuntResults(null); setTimeout(() => setHuntResults({ found: Math.floor(Math.random() * 5) + 2, time: '12.4s' }), 3000); }
    if (id === 'report') { setReportDone(false); setTimeout(() => setReportDone(true), 3000); }
  };

  const closeModal = () => setActiveModal(null);

  const hasData = resources.length > 0;
  const hasAnalysis = analysis !== null;

  const providerDist = useMemo(() => hasData ? getProviderDistribution(resources) : [], [hasData, resources]);
  const activeThreats = useMemo(() => hasAnalysis ? getActiveThreats(analysis) : 0, [hasAnalysis, analysis]);
  const criticalCount = useMemo(() => hasAnalysis ? analysis.findings.filter(f => f.severity === 'Critical').length : 0, [hasAnalysis, analysis?.findings]);
  const complianceScore = useMemo(() => hasAnalysis ? getComplianceScore(analysis) : 0, [hasAnalysis, analysis]);
  const timeline = useMemo(() => hasAnalysis ? getTimelineFromFindings(analysis.findings, resources) : null, [hasAnalysis, analysis?.findings, resources]);
  const feedItems = useMemo(() => hasAnalysis ? getFeedItems(analysis.findings) : [], [hasAnalysis, analysis?.findings]);

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Command Center</h1>
            <p className="text-gray-400">Multi-Cloud Security Posture</p>
          </div>
          <div className="flex items-center gap-4">
            {datasetName && (
              <div className="glass-panel px-4 py-2 flex items-center gap-2">
                <Server className="w-5 h-5 text-neon-cyan" />
                <div>
                  <div className="text-xs text-gray-400">Showing:</div>
                  <div className="text-sm font-bold text-neon-cyan truncate max-w-[200px]">{datasetName}</div>
                </div>
              </div>
            )}
            <div className="glass-panel px-4 py-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-green" />
              <div>
                <div className="text-xs text-gray-400">System Status</div>
                <div className="text-sm font-bold text-neon-green">SECURE</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metric Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Resources"
            value={hasData ? resources.length : null}
            icon={Server}
            color="text-neon-cyan"
            borderColor="border-neon-cyan/30"
            suffix=""
            emptyMessage="Upload a dataset to see live stats"
          />
          <StatCard
            title="Active Threats"
            value={hasAnalysis ? activeThreats : null}
            icon={Activity}
            color="text-neon-purple"
            borderColor="border-neon-purple/30"
            suffix=""
            emptyMessage="No threats detected — no dataset loaded"
          />
          <StatCard
            title="Critical Risks"
            value={hasAnalysis ? criticalCount : null}
            icon={AlertTriangle}
            color="text-red-500"
            borderColor="border-red-500/30"
            suffix=""
            emptyMessage="No critical risks detected"
          />
          <StatCard
            title="Compliance Score"
            value={hasAnalysis ? complianceScore : null}
            icon={CheckCircle}
            color="text-neon-green"
            borderColor="border-neon-green/30"
            suffix="%"
            emptyMessage="Upload a dataset to see score"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2 glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Threat Activity Timeline</h2>
              {timeline && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
                  <span className="text-xs font-mono text-neon-cyan bg-cyber-dark px-2 py-1 rounded">LIVE SEC.FEED</span>
                </div>
              )}
            </div>
            <div className="h-72 w-full">
              {timeline ? (
                <ThreatTimeline data={timeline} />
              ) : (
                <EmptyChart message={hasAnalysis ? "Timeline data requires timestamped records — no timestamps found in loaded dataset." : "No data available — upload a dataset in Threat Dataset Tester"} />
              )}
            </div>
          </motion.div>

          <motion.div ref={globeRef} className="glass-panel p-1 rounded-xl overflow-hidden relative min-h-[300px] group">
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-card to-transparent z-10 pointer-events-none" />
            {globeVisible && <Suspense fallback={null}><CyberGlobe /></Suspense>}
          </motion.div>
        </motion.div>

        {/* Cloud Distribution + Live Threat Feed */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="glass-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Cloud Distribution</h2>
            {providerDist.length > 0 ? (
              <div className="flex items-center justify-between h-64">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={providerDist}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                        animationDuration={800}
                        animationEasing="ease-out"
                        activeShape={PieActiveShape}
                      >
                        {providerDist.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursorStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-4">
                  {providerDist.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">{item.value}%</span>
                        <span className="text-xs text-gray-500 ml-1">({item.count})</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyChart message="No data available — upload a dataset in Threat Dataset Tester" />
            )}
          </motion.div>

          <motion.div className="glass-panel p-6 overflow-hidden relative">
            <h2 className="text-lg font-semibold text-white mb-4">Live Threat Feed</h2>
            {feedItems.length > 0 ? (
              <LiveFeed
                items={feedItems}
                drawerFeed={null}
                onDismiss={() => {}}
                onOpenDrawer={() => {}}
                onCloseDrawer={() => {}}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="w-10 h-10 text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">No threats detected — no dataset loaded</p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Security Posture Overview - shows real data or empty state */}
        <motion.div variants={itemVariants}>
          <motion.div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-neon-cyan" /> Security Posture Overview
              </h2>
              <div className="flex items-center gap-1 text-xs text-neon-cyan font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-neon-green animate-pulse-glow' : 'bg-gray-600'}`} /> {hasData ? 'ALL SYSTEMS MONITORED' : 'NO DATA LOADED'}
              </div>
            </div>
            {hasAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="glass-panel p-4 border border-cyber-border">
                    <p className="text-xs text-gray-500 mb-1">Dataset</p>
                    <p className="text-white font-semibold">{datasetName || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 mt-1">{resources.length} resources · {analysis.findings.length} findings</p>
                  </div>
                  <div className="glass-panel p-4 border border-cyber-border">
                    <p className="text-xs text-gray-500 mb-1">Severity Breakdown</p>
                    <div className="space-y-2 mt-2">
                      {Object.entries(severityColors).map(([sev, color]) => {
                        const count = analysis.findings.filter(f => f.severity === sev).length;
                        const pct = analysis.findings.length > 0 ? (count / analysis.findings.length) * 100 : 0;
                        return (
                          <div key={sev} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-xs text-gray-400 w-16">{sev}</span>
                            <div className="flex-1 h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                            <span className="text-xs text-white w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(analysis.providerBreakdown).map(([p, d]) => ({
                        provider: p,
                        threats: d.threats,
                        resources: d.resources,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                      <XAxis dataKey="provider" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursorStyle} />
                      <Bar
                        dataKey="threats" radius={[4, 4, 0, 0]} maxBarSize={40}
                        isAnimationActive={false}
                        shape={AnimatedBarShape}
                      >
                        {Object.entries(analysis.providerBreakdown).map(([p]) => (
                          <Cell key={p} fill={providerColors[p] || '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <NoDataEmptyState
                message="Upload a dataset in Threat Dataset Tester to see security posture data."
                actionLabel="Go to Threat Dataset Tester"
                actionLink="/threat-tester"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Quick Actions + Empty Activity */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div className="lg:col-span-2 glass-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-cyan" /> Quick Actions
              </h2>
              <div
                className="text-[10px] text-neon-cyan font-mono flex items-center gap-1 animate-pulse"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green" /> 4 ACTIVE
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {quickActions.map((action) => {
                const charAnim = action.id === 'scan' ? { y: [0, -4, 0] }
                  : action.id === 'hunt' ? { y: [0, -3, 0], rotate: [-1, 1, -1] }
                  : action.id === 'report' ? { y: [0, -5, 0] }
                  : { y: [0, -3, 0], rotate: [0.5, -0.5, 0.5] };
                return (
                  <motion.button
                    key={action.id}
                    onClick={() => openModal(action.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: quickActions.indexOf(action) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="p-4 rounded-2xl text-left text-white border border-white/10 hover:border-white/25 shadow-lg relative overflow-hidden group/card"
                    style={{
                      background: `linear-gradient(145deg, ${action.gradient[0]}, ${action.gradient[1]})`,
                      boxShadow: `0 4px 24px ${action.glowColor}40`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 group-hover/card:scale-[2] transition-transform duration-700 pointer-events-none" />
                    <div className="flex justify-center mb-3 relative">
                      <motion.div
                        animate={charAnim}
                        transition={{ duration: action.id === 'report' ? 3 : 2.5, ease: "easeInOut" }}
                        className="relative"
                      >
                        <CharacterSVG type={action.id} />
                      </motion.div>
                      <div
                        className="absolute -bottom-0.5 w-8 h-1.5 rounded-full bg-white/20 blur-sm"
                      />
                    </div>
                    <p className="font-bold text-sm leading-tight relative z-10 text-center">{action.label}</p>
                    <p className="text-[10px] opacity-60 mt-1 relative z-10 text-center">{action.desc}</p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ boxShadow: `inset 0 0 20px ${action.glowColor}30` }}
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="lg:col-span-3 glass-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon-purple" /> Recent Activity
            </h2>
            {hasData ? (
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent" />
                <div className="space-y-0">
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative pl-8 pb-6 last:pb-0"
                  >
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-cyber-darker bg-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Dataset Loaded</p>
                        <p className="text-xs text-gray-400 mt-0.5">{datasetName} — {resources.length} resources</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">now</p>
                        <p className="text-xs text-neon-cyan font-mono mt-0.5">System</p>
                      </div>
                    </div>
                  </motion.div>
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative pl-8 pb-6 last:pb-0"
                    >
                      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-cyber-darker bg-neon-purple shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">Analysis Complete</p>
                          <p className="text-xs text-gray-400 mt-0.5">{analysis.findings.length} findings · Risk score: {analysis.riskScore}/100</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-500">now</p>
                          <p className="text-xs text-neon-cyan font-mono mt-0.5">Engine</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Clock className="w-8 h-8 text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">No activity yet — load a dataset to begin</p>
              </div>
            )}
            <motion.button
              onClick={() => navigate('/threat-tester')}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-neon-cyan transition-colors border-t border-cyber-border pt-4 group"
            >
              <span>Go to Threat Dataset Tester</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ===== MODALS ===== */}
      {createPortal(
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key="modal-backdrop"
            variants={modalOverlay}
            initial="hidden" animate="visible" exit="hidden"
            onClick={closeModal}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              key={activeModal}
              variants={modalPanel}
              initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-cyber-card backdrop-blur-md border border-cyber-border rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.1)] p-0 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-cyber"
            >
              {/* --- Scan Modal --- */}
              {activeModal === 'scan' && (
                <div>
                  <div className="p-6 border-b border-cyber-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-neon-cyan" />
                      <h3 className="text-lg font-bold text-white">Compliance Scan</h3>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                    {scanProgress === 'idle' && (
                      <div className="text-center py-8 text-gray-400 text-sm">Initializing scan engine...</div>
                    )}
                    {scanProgress === 'scanning' && (
                      <div className="text-center space-y-4">
                        <ScanningRadar />
                        <p className="text-neon-cyan font-mono text-sm animate-pulse">Scanning cloud infrastructure...</p>
                        <div className="w-full bg-cyber-dark rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    {scanProgress === 'done' && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-8 h-8 text-neon-green" />
                          </div>
                          <h4 className="text-white font-bold text-lg">Scan Complete</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {hasAnalysis
                              ? `${resources.length} resources scanned, ${analysis.findings.length} findings identified`
                              : 'No dataset loaded — upload resources in Threat Dataset Tester'}
                          </p>
                        </div>
                        {hasAnalysis && (
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: 'Total Resources', value: resources.length, color: 'text-neon-cyan' },
                              { label: 'Findings', value: analysis.findings.length, color: 'text-orange-500' },
                              { label: 'Critical', value: criticalCount, color: 'text-red-500' },
                              { label: 'Score', value: `${complianceScore}%`, color: 'text-neon-green' },
                            ].map(s => (
                              <div key={s.label} className="p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border text-center">
                                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                                <div className="text-xs text-gray-400">{s.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-neon-cyan text-cyber-dark rounded-lg font-medium hover:bg-neon-cyan/90 transition-colors">Close</button>
                  </div>
                </div>
              )}

              {/* --- Threat Hunt Modal --- */}
              {activeModal === 'hunt' && (
                <div>
                  <div className="p-6 border-b border-cyber-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bug className="w-6 h-6 text-neon-purple" />
                      <h3 className="text-lg font-bold text-white">Threat Hunt</h3>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                    {!huntResults ? (
                      <div className="text-center space-y-4">
                        <ThreatHuntAnimation />
                        <p className="text-neon-purple font-mono text-sm animate-pulse">Hunting for anomalies...</p>
                        <div className="flex justify-center gap-1">
                          {[0,1,2].map(i => (
                            <motion.div
                              key={i}
                              className="typing-dot w-2 h-2 rounded-full bg-neon-purple"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <Bug className="w-12 h-12 text-red-500 absolute inset-0 m-auto animate-pulse-glow" />
                            <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
                          </div>
                          <h4 className="text-white font-bold text-lg">Threats Identified</h4>
                          <p className="text-4xl font-bold text-red-500 mt-2">{huntResults.found}</p>
                          <p className="text-gray-400 text-xs mt-1">Scan completed in {huntResults.time}</p>
                        </div>
                        <div className="space-y-2">
                          {[
                            { severity: 'critical', title: 'S3 Bucket Public Access', service: 'AWS S3' },
                            { severity: 'high', title: 'Unrestricted SSH (Port 22)', service: 'EC2 Security Group' },
                            { severity: 'medium', title: 'IAM Key Rotation Disabled', service: 'AWS IAM' },
                          ].slice(0, huntResults.found).map((r, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.15 }}
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-cyber-dark/50 border border-cyber-border"
                            >
                              <div className={`w-2 h-2 rounded-full ${r.severity === 'critical' ? 'bg-red-500' : r.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                              <span className="text-sm text-white flex-1">{r.title}</span>
                              <span className="text-xs text-gray-500 font-mono">{r.service}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-neon-purple text-white rounded-lg font-medium hover:bg-neon-purple/90 transition-colors">Close</button>
                  </div>
                </div>
              )}

              {/* --- Report Modal --- */}
              {activeModal === 'report' && (
                <div>
                  <div className="p-6 border-b border-cyber-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-neon-green" />
                      <h3 className="text-lg font-bold text-white">Generate Report</h3>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                    {!reportDone ? (
                      <div className="text-center space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            className="w-full h-full rounded-full border-2 border-dashed border-neon-green/50"
                          />
                          <FileText className="w-8 h-8 text-neon-green absolute inset-0 m-auto animate-pulse-glow" />
                        </div>
                        <ReportProgress done={false} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ReportProgress done={true} />
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-center"
                        >
                          <Download className="w-8 h-8 text-neon-green mx-auto mb-2" />
                          <p className="text-white font-semibold">Security_Report_{new Date().toISOString().slice(0, 10)}.txt</p>
                          <p className="text-xs text-gray-400 mt-1">Ready to download</p>
                          <motion.button
                            onClick={() => {
                              const text = `CLOUDCORE X - Security Report\n\nGenerated: ${new Date().toLocaleString()}\n\n${hasAnalysis ? `Resources: ${resources.length}\nFindings: ${analysis.findings.length}\nRisk Score: ${analysis.riskScore}/100\nThreat Level: ${analysis.threatLevel}\n\nProvider Breakdown:\n${Object.entries(analysis.providerBreakdown).map(([p, d]) => `  ${p}: ${d.resources} resources, ${d.threats} threats`).join('\n')}\n\nFindings:\n${analysis.findings.map(f => `  [${f.severity}] ${f.provider}/${f.service}: ${f.threat} (Score: ${f.riskScore})`).join('\n')}` : 'No dataset loaded. Upload in Threat Dataset Tester first.'}\n\n--- End of Report ---`;
                              const blob = new Blob([text], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `Security_Report_${new Date().toISOString().slice(0, 10)}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              setTimeout(() => URL.revokeObjectURL(url), 1000);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-3 px-6 py-2 bg-neon-green text-cyber-dark rounded-lg font-medium text-sm inline-flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Download
                          </motion.button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-neon-green text-cyber-dark rounded-lg font-medium hover:bg-neon-green/90 transition-colors">Close</button>
                  </div>
                </div>
              )}

              {/* --- Alerts Modal --- */}
              {activeModal === 'alerts' && (
                <div>
                  <div className="p-6 border-b border-cyber-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                      <h3 className="text-lg font-bold text-white">Security Alerts</h3>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    {hasAnalysis ? (
                      <>
                        <div className="grid grid-cols-3 gap-3 mb-2">
                          {[
                            { label: 'Critical', count: analysis.findings.filter(f => f.severity === 'Critical').length, color: 'text-red-500', bg: 'bg-red-500/10' },
                            { label: 'High', count: analysis.findings.filter(f => f.severity === 'High').length, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            { label: 'Medium', count: analysis.findings.filter(f => f.severity === 'Medium').length, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                          ].map(s => (
                            <div key={s.label} className={`${s.bg} p-3 rounded-lg text-center border border-current/10`}>
                              <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
                              <div className="text-xs text-gray-400">{s.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {analysis.findings.slice(0, 10).map((f, i) => (
                            <AlertItem key={f.id} alert={{
                              severity: f.severity.toLowerCase(),
                              title: f.threat,
                              desc: `${f.provider}/${f.service} — ${f.description.slice(0, 80)}`,
                              time: 'now',
                            }} i={i} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertTriangle className="w-8 h-8 text-gray-600 mb-3" />
                        <p className="text-gray-500 text-sm">No dataset loaded — upload resources in Threat Dataset Tester</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-500/90 transition-colors">Close</button>
                  </div>
                </div>
              )}

              {/* --- Activity Log Modal --- */}
              {activeModal === 'activity' && (
                <div>
                  <div className="p-6 border-b border-cyber-border relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }}>
                          <Activity className="w-6 h-6 text-neon-cyan" />
                        </motion.div>
                        <div>
                          <motion.h3 initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg font-bold text-white">
                            Activity Log
                          </motion.h3>
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs text-gray-500 font-mono">
                            {hasData ? `${resources.length} resources loaded` : 'No data loaded'}
                          </motion.p>
                        </div>
                      </div>
                      <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors relative z-10"><X className="w-5 h-5" /></button>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-neon-cyan via-neon-purple to-transparent origin-left"
                    />
                  </div>
                  <div className="p-6">
                    {hasData ? (
                      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.035 } } }} className="space-y-0">
                        {[
                          { time: 'now', action: 'Dataset Loaded', detail: `${datasetName} — ${resources.length} resources`, color: 'bg-neon-cyan', user: 'System' },
                          ...(analysis ? [{ time: 'now', action: 'Analysis Complete', detail: `${analysis.findings.length} findings · Risk score: ${analysis.riskScore}/100`, color: 'bg-neon-purple', user: 'Engine' }] : []),
                        ].map((event, i) => (
                          <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, x: -20, filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } }}
                            className="relative pl-8 py-3 group hover:bg-cyber-dark/30 transition-colors rounded-lg -mx-2 px-2"
                          >
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, delay: i * 0.035 }}
                                className={`w-2.5 h-2.5 rounded-full ${event.color} shadow-[0_0_6px_rgba(6,182,212,0.5)]`}
                              />
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035 + 0.1 }} className="text-sm font-semibold text-white">
                                  <span className="inline-block w-16 text-[10px] text-gray-500 font-mono mr-2">{event.time}</span>
                                  {event.action}
                                </motion.p>
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035 + 0.15 }} className="text-xs text-gray-400 mt-0.5 ml-[4.5rem]">
                                  {event.detail}
                                </motion.p>
                              </div>
                              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.035 + 0.2 }}
                                className="text-[10px] text-neon-cyan font-mono bg-neon-cyan/10 px-2 py-0.5 rounded-full shrink-0">
                                {event.user}
                              </motion.span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Activity className="w-8 h-8 text-gray-600 mb-3" />
                        <p className="text-gray-500 text-sm">No activity recorded — load a dataset to begin</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-neon-cyan/10 text-neon-cyan rounded-lg font-medium hover:bg-neon-cyan/20 transition-colors border border-neon-cyan/30">Close</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
};
