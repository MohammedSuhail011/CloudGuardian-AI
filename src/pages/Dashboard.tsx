import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Lock, Eye, Zap, Clock, ArrowRight, FileText, Download, X, ChevronRight, Bug } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { CyberGlobe } from '../components/3d/CyberGlobe';
import { CountUp } from '../components/layout/CountUp';

const threatData = [
  { time: '00:00', threats: 12 },
  { time: '04:00', threats: 19 },
  { time: '08:00', threats: 15 },
  { time: '12:00', threats: 45 },
  { time: '16:00', threats: 32 },
  { time: '20:00', threats: 28 },
  { time: '24:00', threats: 14 },
];

const resourceData = [
  { name: 'AWS', value: 45, color: '#f59e0b' },
  { name: 'Azure', value: 30, color: '#3b82f6' },
  { name: 'GCP', value: 25, color: '#10b981' },
];

const complianceData = [
  {
    framework: 'CIS', score: 87, color: '#06b6d4',
    details: [
      { check: 'Identity & Access', pass: true },
      { check: 'Logging & Monitoring', pass: true },
      { check: 'Networking', pass: false },
      { check: 'Data Protection', pass: true },
      { check: 'Incident Response', pass: true },
    ],
  },
  {
    framework: 'NIST', score: 72, color: '#8b5cf6',
    details: [
      { check: 'Risk Assessment', pass: true },
      { check: 'Access Control', pass: false },
      { check: 'Detection Processes', pass: true },
      { check: 'Recovery Planning', pass: false },
      { check: 'Protective Technology', pass: true },
    ],
  },
  {
    framework: 'ISO 27001', score: 91, color: '#10b981',
    details: [
      { check: 'Info Security Policy', pass: true },
      { check: 'Asset Management', pass: true },
      { check: 'Access Control', pass: true },
      { check: 'Cryptography', pass: false },
      { check: 'Compliance', pass: true },
    ],
  },
  {
    framework: 'SOC 2', score: 64, color: '#f59e0b',
    details: [
      { check: 'Security', pass: true },
      { check: 'Availability', pass: false },
      { check: 'Processing Integrity', pass: true },
      { check: 'Confidentiality', pass: false },
      { check: 'Privacy', pass: true },
    ],
  },
];

const recentEvents = [
  { time: '2 min ago', action: 'Threat blocked', detail: 'Malicious IP 185.220.101.x blocked on AWS WAF', user: 'Auto', color: 'bg-red-500' },
  { time: '15 min ago', action: 'Policy applied', detail: 'Encryption policy enforced on S3 bucket "prod-data"', user: 'Admin', color: 'bg-neon-cyan' },
  { time: '1 hr ago', action: 'Vulnerability scan', detail: 'Critical CVE-2024-21626 found in 3 containers', user: 'Scanner', color: 'bg-orange-500' },
  { time: '2 hr ago', action: 'Access granted', detail: 'IAM role "ci-deployer" created for CI/CD pipeline', user: 'Jarvis', color: 'bg-neon-purple' },
  { time: '4 hr ago', action: 'Certificate renewed', detail: 'SSL cert for *.cloudguardian.ai auto-renewed', user: 'System', color: 'bg-neon-green' },
];

const allActivityEvents = [
  { time: '32s ago', action: 'DDoS mitigation triggered', detail: 'AWS Shield blocked volumetric attack (12 Gbps)', user: 'Auto', color: 'bg-red-500' },
  { time: '2 min ago', action: 'Threat blocked', detail: 'Malicious IP 185.220.101.x blocked on AWS WAF', user: 'Auto', color: 'bg-red-500' },
  { time: '8 min ago', action: 'Root login detected', detail: 'Root user logged in from 203.0.113.42 (unusual location)', user: 'Alert', color: 'bg-orange-500' },
  { time: '15 min ago', action: 'Policy applied', detail: 'Encryption policy enforced on S3 bucket "prod-data"', user: 'Admin', color: 'bg-neon-cyan' },
  { time: '22 min ago', action: 'Container scanned', detail: 'Registry scan completed: 0 critical, 3 high findings', user: 'Scanner', color: 'bg-neon-green' },
  { time: '38 min ago', action: 'IAM key rotated', detail: 'Access key for "ci-deployer" rotated automatically', user: 'System', color: 'bg-neon-purple' },
  { time: '1 hr ago', action: 'Vulnerability scan', detail: 'Critical CVE-2024-21626 found in 3 containers', user: 'Scanner', color: 'bg-orange-500' },
  { time: '1 hr ago', action: 'WAF rule updated', detail: 'Rate-limiting rule deployed on production ALB', user: 'Admin', color: 'bg-neon-cyan' },
  { time: '2 hr ago', action: 'Access granted', detail: 'IAM role "ci-deployer" created for CI/CD pipeline', user: 'Jarvis', color: 'bg-neon-purple' },
  { time: '2 hr ago', action: 'Backup completed', detail: 'Snapshot taken for 12 EC2 volumes (7.4 TB total)', user: 'System', color: 'bg-neon-green' },
  { time: '3 hr ago', action: 'Firewall rule changed', detail: 'Inbound SSH restricted to 10.0.0.0/8 only', user: 'Jarvis', color: 'bg-neon-cyan' },
  { time: '4 hr ago', action: 'Certificate renewed', detail: 'SSL cert for *.cloudguardian.ai auto-renewed', user: 'System', color: 'bg-neon-green' },
  { time: '5 hr ago', action: 'Database patched', detail: 'RDS instance "prod-db-1" patched to MySQL 8.0.36', user: 'Admin', color: 'bg-neon-cyan' },
  { time: '6 hr ago', action: 'User deactivated', detail: 'Offboarded user "jsmith@company.com" removed from all groups', user: 'Jarvis', color: 'bg-yellow-500' },
  { time: '8 hr ago', action: 'Cost anomaly', detail: 'AWS bill projected 23% above budget for current month', user: 'Alert', color: 'bg-orange-500' },
];

const quickActions = [
  { id: 'scan', label: 'Run Compliance Scan', icon: Shield, gradient: ['#0b2b4a', '#0a4d6e'], glowColor: '#06b6d4', desc: 'CIS/NIST benchmark audit' },
  { id: 'hunt', label: 'Threat Hunt', icon: Eye, gradient: ['#1e1035', '#3b1f6e'], glowColor: '#8b5cf6', desc: 'AI-powered anomaly detection' },
  { id: 'report', label: 'Generate Report', icon: FileText, gradient: ['#0a3d28', '#0f6e4a'], glowColor: '#10b981', desc: 'Export compliance report' },
  { id: 'alerts', label: 'Review Alerts', icon: AlertTriangle, gradient: ['#3d170a', '#6e2a0f'], glowColor: '#f97316', desc: 'Pending security alerts' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

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
    case 'scan': // Scanner Bot
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
    case 'hunt': // Agent
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
    case 'report': // Cyborg with data screen
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
    case 'alerts': // Guardian
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

export const Dashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [huntResults, setHuntResults] = useState<{ found: number; time: string } | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null);

  const openModal = (id: string) => {
    setActiveModal(id);
    if (id === 'scan') { setScanProgress('idle'); setTimeout(() => setScanProgress('scanning'), 300); setTimeout(() => setScanProgress('done'), 3500); }
    if (id === 'hunt') { setHuntResults(null); setTimeout(() => setHuntResults({ found: Math.floor(Math.random() * 5) + 2, time: '12.4s' }), 3000); }
    if (id === 'report') { setReportDone(false); setTimeout(() => setReportDone(true), 3000); }
  };

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Command Center</h1>
            <p className="text-gray-400">Multi-Cloud Security Posture</p>
          </div>
          <div className="flex items-center gap-4">
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
          {[
            { title: 'Total Resources', value: 1284, icon: Server, color: 'text-neon-cyan', border: 'border-neon-cyan/30', suffix: '' },
            { title: 'Active Threats', value: 23, icon: Activity, color: 'text-neon-purple', border: 'border-neon-purple/30', suffix: '' },
            { title: 'Critical Risks', value: 4, icon: AlertTriangle, color: 'text-red-500', border: 'border-red-500/30', suffix: '' },
            { title: 'Compliance Score', value: 94, icon: CheckCircle, color: 'text-neon-green', border: 'border-neon-green/30', suffix: '%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`glass-panel-hover p-6 relative overflow-hidden group border ${stat.border}`}
            >
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                <stat.icon className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <stat.icon className={`w-8 h-8 mb-4 ${stat.color}`} />
                <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">
                  <CountUp end={stat.value} suffix={stat.suffix} duration={2} />
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2 glass-panel p-6 group"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Threat Activity Timeline</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
                <span className="text-xs font-mono text-neon-cyan bg-cyber-dark px-2 py-1 rounded">LIVE SEC.FEED</span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatData}>
                  <defs>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-panel p-1 rounded-xl overflow-hidden relative min-h-[300px] group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-card to-transparent z-10 pointer-events-none" />
            <CyberGlobe />
          </motion.div>
        </motion.div>

        {/* Cloud Distribution + Live Feed */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Cloud Distribution</h2>
            <div className="flex items-center justify-between h-64">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-4">
                {resourceData.map((item, i) => (
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
                    <span className="font-bold text-white">{item.value}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-6 overflow-hidden relative"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Live Threat Feed</h2>
            <div className="space-y-4">
              {[
                { time: '2m ago', alert: 'Unauthorized access attempt detected', level: 'high', source: 'AWS EC2' },
                { time: '15m ago', alert: 'S3 Bucket made public', level: 'critical', source: 'AWS S3' },
                { time: '1h ago', alert: 'Unusual outbound traffic spike', level: 'medium', source: 'Azure VM' },
                { time: '2h ago', alert: 'Failed login anomaly', level: 'low', source: 'GCP IAM' },
              ].map((feed, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4, borderColor: 'rgba(6, 182, 212, 0.5)' }}
                  className="flex gap-4 items-start p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border transition-colors"
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${
                    feed.level === 'critical' ? 'bg-red-500 animate-pulse' :
                    feed.level === 'high' ? 'bg-orange-500' :
                    feed.level === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-white">{feed.alert}</h4>
                      <span className="text-xs text-gray-500">{feed.time}</span>
                    </div>
                    <p className="text-xs text-gray-400">Source: <span className="text-neon-cyan font-mono">{feed.source}</span></p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Compliance Overview */}
        <motion.div variants={itemVariants}>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-neon-cyan" /> Security Posture Overview
              </h2>
              <div className="flex items-center gap-1 text-xs text-neon-cyan font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" /> ALL SYSTEMS MONITORED
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {complianceData.map((fw, i) => {
                  const isOpen = expandedCompliance === fw.framework;
                  return (
                    <motion.div
                      key={fw.framework}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.button
                        onClick={() => setExpandedCompliance(isOpen ? null : fw.framework)}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{fw.framework}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-gray-500 transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.span
                              key={fw.score}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-sm font-bold text-white"
                            >
                              {fw.score}%
                            </motion.span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 bg-cyber-dark rounded-full overflow-hidden relative cursor-pointer">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${fw.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                            className="h-full rounded-full relative"
                            style={{ backgroundColor: fw.color }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
                          </motion.div>
                        </div>
                      </motion.button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pb-1 pl-2 space-y-2">
                              {fw.details.map((d, j) => (
                                <motion.div
                                  key={d.check}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.05 }}
                                  className="flex items-center gap-2.5"
                                >
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, delay: j * 0.05 }}
                                  >
                                    {d.pass ? (
                                      <CheckCircle className="w-3.5 h-3.5 text-neon-green" />
                                    ) : (
                                      <X className="w-3.5 h-3.5 text-red-500" />
                                    )}
                                  </motion.div>
                                  <span className="text-xs text-gray-400">{d.check}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceData} onClick={(e) => { if (e && e.activeLabel) { const label = e.activeLabel as string; setExpandedCompliance(prev => prev === label ? null : label); } }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                    <XAxis dataKey="framework" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40} cursor="pointer">
                      {complianceData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.color}
                          opacity={expandedCompliance && expandedCompliance !== entry.framework ? 0.4 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions + Recent Events */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2 glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-cyan" /> Quick Actions
              </h2>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[10px] text-neon-cyan font-mono flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green" /> 4 ACTIVE
              </motion.div>
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
                    layoutId={`action-${action.id}`}
                    onClick={() => openModal(action.id)}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: quickActions.indexOf(action) * 0.08, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-2xl text-left text-white border border-white/10 hover:border-white/25 transition-all shadow-lg relative overflow-hidden group/card"
                    style={{
                      background: `linear-gradient(145deg, ${action.gradient[0]}, ${action.gradient[1]})`,
                      boxShadow: `0 4px 24px ${action.glowColor}40`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 group-hover/card:scale-[2] transition-transform duration-700 pointer-events-none" />

                    {/* Character */}
                    <div className="flex justify-center mb-3 relative">
                      <motion.div
                        animate={charAnim}
                        transition={{ repeat: Infinity, duration: action.id === 'report' ? 3 : 2.5, ease: "easeInOut" }}
                        className="relative"
                      >
                        <CharacterSVG type={action.id} />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -bottom-0.5 w-8 h-1.5 rounded-full bg-white/20 blur-sm"
                      />
                    </div>

                    <p className="font-bold text-sm leading-tight relative z-10 text-center">{action.label}</p>
                    <p className="text-[10px] opacity-60 mt-1 relative z-10 text-center">{action.desc}</p>

                    {/* Glow border on hover */}
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

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon-purple" /> Recent Activity
            </h2>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent" />
              <div className="space-y-0">
                {recentEvents.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-8 pb-6 last:pb-0"
                  >
                    <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-cyber-darker ${event.color} shadow-[0_0_8px_rgba(6,182,212,0.3)]`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{event.action}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{event.detail}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">{event.time}</p>
                        <p className="text-xs text-neon-cyan font-mono mt-0.5">{event.user}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.button
              onClick={() => setActiveModal('activity')}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-neon-cyan transition-colors border-t border-cyber-border pt-4 group"
            >
              <span>View All Activity</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key="modal-backdrop"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeModal}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              key={activeModal}
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg glass-panel p-0 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-cyber"
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
                          <p className="text-gray-400 text-sm mt-1">12 resources scanned, 0 critical findings</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Passed', value: 45, color: 'text-neon-green' },
                            { label: 'Warnings', value: 3, color: 'text-yellow-500' },
                            { label: 'Failed', value: 0, color: 'text-red-500' },
                            { label: 'Score', value: '94%', color: 'text-neon-cyan' },
                          ].map(s => (
                            <div key={s.label} className="p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border text-center">
                              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                              <div className="text-xs text-gray-400">{s.label}</div>
                            </div>
                          ))}
                        </div>
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
                          <p className="text-white font-semibold">Security_Report_Q2_2026.pdf</p>
                          <p className="text-xs text-gray-400 mt-1">2.4 MB • Ready to download</p>
                          <motion.button
                            onClick={() => {
                              const text = `CloudGuardian AI - Security Report Q2 2026\n\nGenerated: ${new Date().toLocaleString()}\n\nCompliance Scores:\n- CIS: 87%\n- NIST: 72%\n- ISO 27001: 91%\n- SOC 2: 64%\n\nOverall Security Score: 94%\nTotal Resources: 1,284\nActive Threats: 23\nCritical Risks: 4\n\nFindings: 12 resources scanned, 0 critical findings.\nThreats Identified: 2 (S3 Bucket Public Access, Unrestricted SSH)\n\n--- End of Report ---`;
                              const blob = new Blob([text], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'Security_Report_Q2_2026.txt';
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
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      {[
                        { label: 'Critical', count: 2, color: 'text-red-500', bg: 'bg-red-500/10' },
                        { label: 'High', count: 5, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { label: 'Medium', count: 8, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} p-3 rounded-lg text-center border border-current/10`}>
                          <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
                          <div className="text-xs text-gray-400">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        { severity: 'critical', title: 'RDP Port Exposed', desc: 'Security group sg-0a1b2c allows RDP from 0.0.0.0/0', time: '2m ago' },
                        { severity: 'critical', title: 'S3 Bucket Data Leak', desc: 'Bucket "prod-backup" has public read ACL enabled', time: '15m ago' },
                        { severity: 'high', title: 'IAM Role Overprivileged', desc: 'Role "ci-deployer" has AdministratorAccess attached', time: '1h ago' },
                        { severity: 'high', title: 'Unencrypted RDS Instance', desc: 'Database "users-db" does not have encryption enabled', time: '2h ago' },
                        { severity: 'medium', title: 'CloudTrail Disabled', desc: 'Region eu-west-1 has no active CloudTrail trail', time: '4h ago' },
                      ].map((alert, i) => (
                        <AlertItem key={i} alert={alert} i={i} />
                      ))}
                    </div>
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
                        <motion.div
                          initial={{ rotate: -20, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 12 }}
                        >
                          <Activity className="w-6 h-6 text-neon-cyan" />
                        </motion.div>
                        <div>
                          <motion.h3
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg font-bold text-white"
                          >
                            Activity Log
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xs text-gray-500 font-mono"
                          >
                            {allActivityEvents.length} events · last 8 hours
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
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
                      className="space-y-0"
                    >
                      {allActivityEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
                            visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
                          }}
                          className="relative pl-8 py-3 group hover:bg-cyber-dark/30 transition-colors rounded-lg -mx-2 px-2"
                        >
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, delay: i * 0.035 }}
                              className={`w-2.5 h-2.5 rounded-full ${event.color} shadow-[0_0_6px_rgba(6,182,212,0.5)]`}
                            />
                            {i < allActivityEvents.length - 1 && (
                              <div className="w-px h-6 bg-gradient-to-b from-cyber-border to-transparent" />
                            )}
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.035 + 0.1 }}
                                className="text-sm font-semibold text-white"
                              >
                                <span className="inline-block w-16 text-[10px] text-gray-500 font-mono mr-2">{event.time}</span>
                                {event.action}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.035 + 0.15 }}
                                className="text-xs text-gray-400 mt-0.5 ml-[4.5rem]"
                              >
                                {event.detail}
                              </motion.p>
                            </div>
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.035 + 0.2 }}
                              className="text-[10px] text-neon-cyan font-mono bg-neon-cyan/10 px-2 py-0.5 rounded-full shrink-0"
                            >
                              {event.user}
                            </motion.span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  <div className="p-4 border-t border-cyber-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-glow" />
                      LIVE STREAM
                    </div>
                    <button onClick={closeModal} className="px-4 py-2 text-sm bg-neon-cyan/10 text-neon-cyan rounded-lg font-medium hover:bg-neon-cyan/20 transition-colors border border-neon-cyan/30">Close</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
