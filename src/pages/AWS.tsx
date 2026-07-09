import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Shield, Database, Lock, Server, Activity, ArrowUpRight, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const awsResources = [
  { name: 'EC2 Instances', count: 245, risk: 'Medium', icon: Server, color: 'text-orange-500' },
  { name: 'S3 Buckets', count: 42, risk: 'High', icon: Database, color: 'text-green-500' },
  { name: 'IAM Roles', count: 128, risk: 'Low', icon: Lock, color: 'text-blue-500' },
  { name: 'Lambda Functions', count: 89, risk: 'Low', icon: Activity, color: 'text-orange-400' },
  { name: 'Security Groups', count: 312, risk: 'Critical', icon: Shield, color: 'text-red-500' },
  { name: 'CloudTrail', count: 5, risk: 'Low', icon: Cloud, color: 'text-teal-500' }
];

const threatTrend = [
  { time: '00:00', threats: 12 }, { time: '04:00', threats: 19 }, { time: '08:00', threats: 15 },
  { time: '12:00', threats: 45 }, { time: '16:00', threats: 32 }, { time: '20:00', threats: 28 },
  { time: '24:00', threats: 14 },
];

const severityData = [
  { name: 'Critical', value: 23, color: '#ef4444' },
  { name: 'High', value: 37, color: '#f97316' },
  { name: 'Medium', value: 28, color: '#eab308' },
  { name: 'Low', value: 12, color: '#22c55e' },
];

const monthlyCost = [
  { month: 'Jan', cost: 12400 }, { month: 'Feb', cost: 13800 }, { month: 'Mar', cost: 12100 },
  { month: 'Apr', cost: 15200 }, { month: 'May', cost: 14800 }, { month: 'Jun', cost: 16700 },
];

const complianceData = [
  {
    framework: 'CIS AWS Foundations', score: 83, color: '#ff9900',
    details: [
      { check: 'IAM Policies', pass: true }, { check: 'CloudTrail Logging', pass: true },
      { check: 'S3 Security', pass: false }, { check: 'VPC Flow Logs', pass: true },
      { check: 'RDS Security', pass: true },
    ],
  },
  {
    framework: 'AWS Well-Architected', score: 76, color: '#ec4899',
    details: [
      { check: 'Operational Excellence', pass: true }, { check: 'Security', pass: false },
      { check: 'Reliability', pass: true }, { check: 'Performance Efficiency', pass: false },
      { check: 'Cost Optimization', pass: true },
    ],
  },
  {
    framework: 'PCI DSS', score: 94, color: '#10b981',
    details: [
      { check: 'Network Security', pass: true }, { check: 'Access Control', pass: true },
      { check: 'Data Encryption', pass: true }, { check: 'Monitoring', pass: true },
      { check: 'Incident Response', pass: false },
    ],
  },
];

const alerts = [
  { time: '2m ago', text: 'S3 bucket my-public-bucket-123 has public read access', severity: 'High', type: 'Misconfiguration' },
  { time: '15m ago', text: 'Unusual IAM activity detected from IP 203.0.113.42', severity: 'Critical', type: 'Threat' },
  { time: '1h ago', text: 'EC2 instance i-0987654321 has 90% CPU utilization', severity: 'Medium', type: 'Performance' },
  { time: '3h ago', text: 'Security group sg-0a1b2c3d has unrestricted SSH access', severity: 'Critical', type: 'Misconfiguration' },
  { time: '6h ago', text: 'Root account MFA device is not configured', severity: 'High', type: 'Compliance' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const AWS = () => {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-cyber-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Cloud className="text-[#ff9900] w-8 h-8" />
            AWS Security Posture
          </h1>
          <p className="text-gray-400">Real-time threat monitoring across all Amazon Web Services resources.</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">82<span className="text-lg text-gray-500">/100</span></div>
          <div className="text-sm text-neon-cyan mt-1">Overall Security Score</div>
        </div>
      </motion.div>

      {/* Resource Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awsResources.map((resource) => (
          <motion.div
            key={resource.name}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="glass-panel p-6 relative overflow-hidden group hover:border-[#ff9900]/50 transition-colors"
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
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff9900]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </motion.div>

      {/* Threat Trend + Severity Pie */}
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
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-red-500" /> Spikes detected
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={threatTrend}>
              <defs>
                <linearGradient id="awsThreat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff9900" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff9900" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#0f1729',
                  border: '1px solid rgba(255,153,0,0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="threats" stroke="#ff9900" fill="url(#awsThreat)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          className="glass-panel p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Alert Severity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={severityData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0f1729',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {severityData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-gray-400">{s.name}</span>
                <span className="text-white ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Compliance Frameworks */}
      <motion.div
        variants={itemVariants}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Compliance Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceData.map((fw) => (
            <motion.div
              key={fw.framework}
              layout
              className="border border-cyber-border rounded-lg p-4 hover:border-[#ff9900]/30 transition-colors cursor-pointer"
              onClick={() => setExpandedComp(expandedComp === fw.framework ? null : fw.framework)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{fw.framework}</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold" style={{ color: fw.color }}>{fw.score}%</span>
                  {expandedComp === fw.framework ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                </div>
              </div>
              <div className="w-full h-1.5 bg-cyber-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: fw.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${fw.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <AnimatePresence>
                {expandedComp === fw.framework && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-1.5">
                      {fw.details.map((d) => (
                        <motion.div
                          key={d.check}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          {d.pass ? (
                            <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                          )}
                          <span className="text-gray-400">{d.check}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Cost Chart */}
      <motion.div
        variants={itemVariants}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Monthly Cost Analysis</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyCost}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,153,0,0.3)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Cost']}
            />
            <Bar dataKey="cost" fill="#ff9900" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Alerts Feed */}
      <motion.div
        variants={itemVariants}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
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
                selectedAlert === i ? 'border-[#ff9900]/50 bg-[#ff9900]/5' : 'border-cyber-border hover:border-[#ff9900]/30'
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
      </motion.div>

      {/* Top Misconfigurations */}
      <motion.div
        variants={itemVariants}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Top Misconfigurations</h2>
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
              {[
                { id: 'sg-0a1b2c3d4e5f6g7h8', issue: 'Unrestricted inbound traffic on port 3389', severity: 'Critical' },
                { id: 'my-public-bucket-123', issue: 'Bucket allows public read access', severity: 'High' },
                { id: 'i-0987654321fedcba', issue: 'Instance has broad IAM role attached', severity: 'Medium' },
              ].map((issue, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-cyber-border/50 hover:bg-cyber-dark/50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-sm text-neon-cyan">{issue.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{issue.issue}</td>
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
      </motion.div>
    </motion.div>
  );
};
