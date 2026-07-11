import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Shield, Database, Lock, Server, Activity, ArrowUpRight, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronRight, BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDataset } from '../store/DatasetContext';
import { tooltipContentStyle, tooltipCursorStyle, PieActiveShape } from '../utils/chartConfig';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Compute Engine': Server, 'Cloud Storage': Database, IAM: Lock, 'Cloud Functions': Activity,
  VPC: Cloud, 'Cloud Armor': Shield, Logging: Activity, '': Server,
};

const serviceColors: Record<string, string> = {
  'Compute Engine': 'text-blue-500', 'Cloud Storage': 'text-green-500', IAM: 'text-red-500',
  'Cloud Functions': 'text-yellow-500', VPC: 'text-blue-400', 'Cloud Armor': 'text-teal-500',
  Logging: 'text-orange-500',
};

const providerColor = '#EA4335';

function computeSecurityScore(analysis: { findings: { riskScore: number }[] } | null): number {
  if (!analysis || analysis.findings.length === 0) return 0;
  const sumRisk = analysis.findings.reduce((s, f) => s + f.riskScore, 0);
  const avgRisk = sumRisk / analysis.findings.length;
  return Math.max(0, Math.min(100, Math.round(100 - avgRisk)));
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Database className="w-8 h-8 text-gray-600 mb-3" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export const GCP = () => {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const { resources, analysis } = useDataset();

  const hasData = resources.length > 0;
  const hasAnalysis = analysis !== null;

  const gcpResources = useMemo(() => hasData
    ? resources.filter(r => (r.provider || '').toUpperCase() === 'GCP')
    : [], [hasData, resources]);
  const gcpFindings = useMemo(() => hasAnalysis
    ? analysis.findings.filter(f => f.provider === 'GCP')
    : [], [hasAnalysis, analysis?.findings]);

  const serviceGroups = useMemo(() => {
    const groups: { name: string; count: number; risk: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [];
    const seenServices = new Set<string>();
    for (const res of gcpResources) {
      const svc = res.service || 'Unknown';
      if (seenServices.has(svc)) continue;
      seenServices.add(svc);
      const count = gcpResources.filter(r => r.service === svc).length;
      const svcFindings = gcpFindings.filter(f => f.service === svc);
      const hasCritical = svcFindings.some(f => f.severity === 'Critical');
      const hasHigh = svcFindings.some(f => f.severity === 'High');
      const hasMedium = svcFindings.some(f => f.severity === 'Medium');
      const risk = hasCritical ? 'Critical' : hasHigh ? 'High' : hasMedium ? 'Medium' : svcFindings.length > 0 ? 'Low' : 'Low';
      groups.push({
        name: svc,
        count,
        risk,
        icon: serviceIcons[svc] || Server,
        color: serviceColors[svc] || 'text-gray-400',
      });
    }
    return groups;
  }, [gcpResources, gcpFindings]);

  const severityData = useMemo(() => {
    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    gcpFindings.forEach(f => {
      if (severityCounts[f.severity] !== undefined) severityCounts[f.severity]++;
    });
    return [
      { name: 'Critical', value: severityCounts.Critical, color: '#ef4444' },
      { name: 'High', value: severityCounts.High, color: '#f97316' },
      { name: 'Medium', value: severityCounts.Medium, color: '#eab308' },
      { name: 'Low', value: severityCounts.Low, color: '#22c55e' },
    ];
  }, [gcpFindings]);

  const alerts = useMemo(() => gcpFindings.map(f => ({
    time: 'now',
    text: `${f.threat} — ${f.resourceName}`,
    severity: f.severity,
    type: f.service,
  })), [gcpFindings]);

  const securityScore = useMemo(() => hasAnalysis ? computeSecurityScore(analysis) : 0, [hasAnalysis, analysis]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-cyber-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Cloud className="text-[#EA4335] w-8 h-8" />
            GCP Security Posture
          </h1>
          <p className="text-gray-400">Real-time threat monitoring across all Google Cloud Platform resources.</p>
        </div>
        <div className="text-right">
          {hasAnalysis ? (
            <>
              <div className="text-4xl font-bold text-white">{securityScore}<span className="text-lg text-gray-500">/100</span></div>
              <div className="text-sm text-neon-cyan mt-1">Overall Security Score</div>
            </>
          ) : (
            <div className="text-sm text-gray-500 mt-1">Load a dataset to see security score</div>
          )}
        </div>
      </motion.div>

      {!hasData ? (
        <EmptySection message="No dataset loaded — upload a dataset in Threat Dataset Tester to see GCP resources." />
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceGroups.length === 0 ? (
              <div className="col-span-full"><EmptySection message="No GCP resources found in the loaded dataset." /></div>
            ) : serviceGroups.map((resource) => (
              <motion.div
                key={resource.name}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="glass-panel p-6 relative overflow-hidden group hover:border-[#EA4335]/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-cyber-dark rounded-lg border border-cyber-border">
                    <resource.icon className={`w-6 h-6 ${resource.color}`} />
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                    resource.risk === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/50' :
                    resource.risk === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/50' :
                    resource.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' :
                    'bg-green-500/10 text-green-500 border-green-500/50'
                  }`}>
                    {resource.risk} Risk
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{resource.name}</h3>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-300">{resource.count}</div>
                  <button className="flex items-center gap-1 text-xs text-neon-cyan hover:text-white transition-colors">
                    View Details <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#EA4335]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              variants={itemVariants}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="glass-panel p-6 lg:col-span-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">24h Threat Trend</h2>
              </div>
              <EmptySection message="Timeline data requires timestamped records — no timestamps found in loaded dataset." />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="glass-panel p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Alert Severity</h2>
              {gcpFindings.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityData.filter(d => d.value > 0)}
                        dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                        animationDuration={800}
                        animationEasing="ease-out"
                        activeShape={PieActiveShape}
                      >
                        {severityData.filter(d => d.value > 0).map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursorStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {severityData.filter(d => d.value > 0).map((s) => (
                      <div key={s.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        <span className="text-gray-400">{s.name}</span>
                        <span className="text-white ml-auto">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptySection message="No findings for GCP resources." />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Compliance Frameworks</h2>
            <EmptySection message="Compliance framework data (CIS/NIST/ISO 27001/SOC 2) is not available from dataset analysis. Upload compliance-specific data in Threat Dataset Tester to populate this section." />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Monthly Cost Analysis</h2>
            <EmptySection message="Cost data is not available from the loaded dataset. Upload billing data with cost metrics to populate this section." />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedAlert(selectedAlert === i ? null : i)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAlert === i ? 'border-[#EA4335]/50 bg-[#EA4335]/5' : 'border-cyber-border hover:border-[#EA4335]/30'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full shrink-0 ${
                      alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                      alert.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold ${
                          alert.severity === 'Critical' ? 'text-red-500' :
                          alert.severity === 'High' ? 'text-orange-500' : 'text-yellow-500'
                        }`}>{alert.severity}</span>
                        <span className="text-xs text-gray-500">|</span>
                        <span className="text-xs text-gray-500">{alert.type}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{alert.text}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptySection message="No GCP alerts — no findings detected in the loaded dataset." />
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Top Misconfigurations</h2>
            {gcpFindings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-cyber-border text-sm text-gray-400">
                      <th className="py-3 px-4 font-medium">Resource ID</th>
                      <th className="py-3 px-4 font-medium">Issue</th>
                      <th className="py-3 px-4 font-medium">Severity</th>
                      <th className="py-3 px-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gcpFindings.slice(0, 10).map((issue, idx) => (
                      <motion.tr
                        key={issue.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-b border-cyber-border/50 hover:bg-cyber-dark/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm text-neon-cyan">{issue.resourceId}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{issue.threat}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${issue.severity === 'Critical' ? 'text-red-500 bg-red-500/10' : issue.severity === 'High' ? 'text-orange-500 bg-orange-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-xs bg-cyber-dark border border-cyber-border hover:border-neon-cyan px-3 py-1.5 rounded text-white transition-colors">
                            Remediate
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptySection message="No misconfigurations detected for GCP resources." />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
