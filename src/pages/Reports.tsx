import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Calendar, FileBarChart, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, type PieLabelRenderProps } from 'recharts';
import { useDataset } from '../store/DatasetContext';
import { tooltipContentStyle, tooltipCursorStyle, PieActiveShape, AnimatedBarShape } from '../utils/chartConfig';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

const severityColors: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
const providerColors: Record<string, string> = { AWS: '#ff9900', Azure: '#0089D6', GCP: '#EA4335' };

function generateReportContent(resources: { provider: string; service: string }[], analysis: { findings: { severity: string; riskScore: number; threat: string; provider: string; service: string; resourceName: string; description: string; recommendation: string }[]; riskScore: number; threatLevel: string; providerBreakdown: Record<string, { resources: number; threats: number }> }): string {
  const totalResources = resources.length;
  const findings = analysis.findings;
  const activeThreats = findings.filter(f => ['Critical', 'High', 'Medium'].includes(f.severity)).length;
  const criticalRisks = findings.filter(f => f.severity === 'Critical').length;
  const sumRisk = findings.reduce((s, f) => s + f.riskScore, 0);
  const avgRisk = findings.length > 0 ? sumRisk / findings.length : 0;
  const complianceScore = Math.max(0, Math.min(100, Math.round(100 - avgRisk)));

  return [
    `CLOUDCORE X - Security Posture Assessment`,
    `Generated: ${new Date().toLocaleString()}`,
    ``,
    `Overall Security Score: ${complianceScore}%`,
    `Total Resources Monitored: ${totalResources.toLocaleString()}`,
    `Active Threats: ${activeThreats}`,
    `Critical Risks: ${criticalRisks}`,
    `Threat Level: ${analysis.threatLevel}`,
    ``,
    `Provider Breakdown:`,
    ...Object.entries(analysis.providerBreakdown).map(([p, d]) => `  ${p}: ${d.resources} resources, ${d.threats} threats`),
    ``,
    `Severity Breakdown:`,
    `  Critical: ${findings.filter(f => f.severity === 'Critical').length}`,
    `  High: ${findings.filter(f => f.severity === 'High').length}`,
    `  Medium: ${findings.filter(f => f.severity === 'Medium').length}`,
    `  Low: ${findings.filter(f => f.severity === 'Low').length}`,
    ``,
    `Findings:`,
    ...findings.map(f => `  [${f.severity}] ${f.provider}/${f.service}: ${f.threat} on ${f.resourceName} (Risk: ${f.riskScore})`),
    ``,
    `--- End of Report ---`,
  ].join('\n');
}

function getProviderBreakdown(resources: { provider: string }[], analysis: { findings: { severity: string }[]; providerBreakdown: Record<string, { resources: number; threats: number }> }) {
  return Object.entries(analysis.providerBreakdown).map(([name, data]) => ({
    name,
    resources: data.resources,
    threats: data.threats,
    color: providerColors[name] || '#8b5cf6',
  }));
}

function getSeverityBreakdown(findings: { severity: string }[]) {
  const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  findings.forEach(f => { if (counts[f.severity] !== undefined) counts[f.severity]++; });
  return Object.entries(counts).map(([name, value]) => ({ name, value, color: severityColors[name] || '#888' }));
}

export const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<{ id: string; name: string; date: string; size: string; type: string }[]>([]);
  const { resources, analysis, datasetName } = useDataset();

  const hasData = resources.length > 0;
  const hasAnalysis = analysis !== null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newId = `REP-${Date.now().toString(36).toUpperCase()}`;
      const content = hasAnalysis
        ? generateReportContent(resources, analysis)
        : `CLOUDCORE X - Security Report\nGenerated: ${new Date().toLocaleString()}\n\nNo dataset loaded. Upload resources in Threat Dataset Tester first.\n\n--- End of Report ---`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security_Report_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      const sizeKB = Math.ceil(new Blob([content]).size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      const newReport = {
        id: newId,
        name: hasAnalysis ? 'Security Posture Assessment' : 'Empty Report',
        date: new Date().toISOString().split('T')[0],
        size: sizeStr,
        type: 'TXT',
      };
      setReports(prev => [newReport, ...prev]);
    }, 1500);
  };

  const providerData = hasAnalysis ? getProviderBreakdown(resources, analysis) : [];
  const severityBreakdown = hasAnalysis ? getSeverityBreakdown(analysis.findings) : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyber-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileBarChart className="text-neon-purple w-8 h-8" />
            Security Reports & History
          </h1>
          <p className="text-gray-400">Generate compliance documents and analyze risk trends from your dataset.</p>
        </div>
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          whileHover={!isGenerating ? { scale: 1.02 } : {}}
          whileTap={!isGenerating ? { scale: 0.98 } : {}}
          className="flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 px-6 py-3 rounded-lg font-bold text-white transition-opacity disabled:opacity-50"
        >
          {isGenerating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Filter className="w-5 h-5" /></motion.div> : <FileText className="w-5 h-5" />}
          {isGenerating ? 'Generating...' : 'Generate New Report'}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass-panel p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Risk & Provider Overview</h2>
          {hasAnalysis ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm text-gray-400 mb-3">Provider Resource & Threat Distribution</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={providerData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" horizontal={false} />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={60} />
                      <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursorStyle} />
                       <Bar dataKey="resources" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Resources"
                         isAnimationActive={false}
                         shape={AnimatedBarShape}
                       />
                        <Bar dataKey="threats" fill="#ef4444" radius={[0, 4, 4, 0]} name="Threats"
                         isAnimationActive={false}
                         shape={AnimatedBarShape}
                        />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-3">Severity Breakdown</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityBreakdown.filter(d => d.value > 0)} dataKey="value"
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                        animationDuration={800}
                        animationEasing="ease-out"
                        label={({ name, percent }: PieLabelRenderProps) => `${name || ''} ${(percent ?? 0) * 100 > 0 ? ((percent ?? 0) * 100).toFixed(0) + '%' : ''}`}
                        activeShape={PieActiveShape}
                      >
                        {severityBreakdown.filter(d => d.value > 0).map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursorStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Database className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No dataset loaded — upload resources in Threat Dataset Tester to see report data.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neon-cyan" /> Recent Reports
          </h2>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-neon-cyan/50 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white text-sm group-hover:text-neon-cyan transition-colors">{report.name}</h3>
                    <Download className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="font-mono text-neon-purple">{report.id}</span>
                    <span>{report.date} • {report.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileText className="w-8 h-8 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No reports generated yet. Click "Generate New Report" to create one from your dataset.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
