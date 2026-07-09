import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Calendar, FileBarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reportData = [
  { month: 'Jan', compliance: 85, risk: 45 },
  { month: 'Feb', compliance: 88, risk: 42 },
  { month: 'Mar', compliance: 87, risk: 46 },
  { month: 'Apr', compliance: 92, risk: 35 },
  { month: 'May', compliance: 94, risk: 30 },
  { month: 'Jun', compliance: 96, risk: 25 },
];

let reportContents: Record<string, string> = {
  'REP-2023-001': `CloudGuardian AI - Q2 Security Posture Assessment
Generated: 2023-07-01

Overall Security Score: 94%
Total Resources Monitored: 1,284
Active Threats: 23
Critical Risks: 4

Compliance Scores:
  - CIS: 87%
  - NIST: 72%
  - ISO 27001: 91%
  - SOC 2: 64%

Recent Activity:
  - DDoS mitigation triggered (12 Gbps blocked)
  - Malicious IP 185.220.101.x blocked on AWS WAF
  - Root login detected from unusual location
  - Encryption policy enforced on S3 bucket "prod-data"

Recommendations:
  1. Enable MFA for all IAM users
  2. Patch critical CVE-2024-21626 in containers
  3. Rotate access keys older than 90 days
  4. Review public S3 bucket configurations

--- End of Report ---`,

  'REP-2023-002': `CloudGuardian AI - Weekly Threat Intelligence
Generated: 2023-07-08

Threat Summary:
  - Total Threats Blocked: 147
  - Critical: 3
  - High: 18
  - Medium: 42
  - Low: 84

Top Attack Vectors:
  1. Port Scanning (34% of all events)
  2. Brute Force SSH (22%)
  3. SQL Injection Attempts (15%)
  4. DDoS Amplification (12%)
  5. API Abuse (10%)
  6. DNS Tunneling (7%)

Geographic Origin:
  - Russia: 28%
  - China: 22%
  - United States: 15%
  - Germany: 8%
  - Others: 27%

--- End of Report ---`,

  'REP-2023-003': `id,check,status,score,notes
CIS-1.1,Maintain inventory of assets,pass,100,All assets tracked
CIS-1.2,Track software inventory,pass,100,
CIS-2.1,Configure data access controls,fail,45,S3 bucket prod-data public
CIS-3.1,Secure network configurations,pass,85,
CIS-4.1,Maintain secure baseline images,pass,92,
CIS-5.1,Implement access control,pass,78,IAM role overprivileged
CIS-6.1,Maintain audit logging,fail,30,CloudTrail disabled in eu-west-1
CIS-7.1,Implement vulnerability management,pass,88,
CIS-8.1,Secure configuration,pass,95,
--- End of Report ---`,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function downloadReport(id: string, name: string, ext: string) {
  const content = reportContents[id] || `CloudGuardian AI - ${name}\nGenerated: ${new Date().toLocaleString()}\n\nNo data available.`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}.${ext.toLowerCase()}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const generatedReports = [
  { id: 'REP-2023-001', name: 'Q2 Security Posture Assessment', date: '2023-07-01', size: '2.4 MB', type: 'PDF' },
  { id: 'REP-2023-002', name: 'Weekly Threat Intelligence', date: '2023-07-08', size: '1.1 MB', type: 'PDF' },
  { id: 'REP-2023-003', name: 'CIS Benchmark Audit', date: '2023-07-09', size: '3.8 MB', type: 'CSV' },
];

export const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState(generatedReports);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newId = `REP-${Date.now().toString(36).toUpperCase()}`;
      const newReport = {
        id: newId,
        name: 'New Security Assessment',
        date: new Date().toISOString().split('T')[0],
        size: `${(1.5 + Math.random() * 3).toFixed(1)} MB`,
        type: 'PDF',
      };
      setReports(prev => [newReport, ...prev]);
      reportContents[newId] = `CloudGuardian AI - New Security Assessment\nGenerated: ${new Date().toLocaleString()}\n\nOverall Security Score: ${85 + Math.floor(Math.random() * 15)}%\nTotal Resources Monitored: ${1000 + Math.floor(Math.random() * 500)}\nActive Threats: ${10 + Math.floor(Math.random() * 30)}\nCritical Risks: ${Math.floor(Math.random() * 6)}\n\nCompliance Scores:\n  - CIS: ${70 + Math.floor(Math.random() * 25)}%\n  - NIST: ${65 + Math.floor(Math.random() * 30)}%\n  - ISO 27001: ${75 + Math.floor(Math.random() * 20)}%\n  - SOC 2: ${55 + Math.floor(Math.random() * 35)}%\n\nReport auto-generated on demand.\n--- End of Report ---`;
    }, 1500);
  };

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
          <p className="text-gray-400">Generate compliance documents and analyze historical risk trends.</p>
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
          <h2 className="text-xl font-semibold text-white mb-6">Historical Risk vs Compliance</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="compliance" stroke="#10b981" fillOpacity={1} fill="url(#colorCompliance)" />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
          <div className="space-y-4">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={() => downloadReport(report.id, report.name, report.type)}
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
        </motion.div>
      </div>
    </motion.div>
  );
};
