import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, AlertTriangle, CheckCircle, X, Search, Shield,
  Activity, Lock, Eye, ChevronRight, BarChart3, Server,
  PieChart, TrendingUp, Zap,
  Bug, Loader2, Cpu, HardDrive, Globe, BrainCircuit, FileJson,
  FileSpreadsheet, Printer, Target, Siren,
} from 'lucide-react';
import {
  PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLine,
  Line, Area, Legend,
} from 'recharts';
import type { CloudResource, ThreatFinding, AnalysisResult, CloudProvider, Severity, AIAnalysisResponse } from '../types/threatTester';
import { parseCSV, parseJSON, analyzeResources } from '../utils/threatAnalysis';
import { getSampleResources } from '../utils/sampleThreatData';

const severityColors: Record<Severity, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
const providerColors: Record<CloudProvider, string> = { AWS: '#ff9900', Azure: '#0089D6', GCP: '#EA4335' };
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function formatNumber(n: number): string { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

function getGrokApiKey(): string {
  try {
    const raw = localStorage.getItem('cyberweb-settings');
    if (raw) {
      const s = JSON.parse(raw);
      return s.grokKey || '';
    }
  } catch { /* ignore */ }
  return '';
}

export const ThreatTester = () => {
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadMsg, setUploadMsg] = useState({ type: '', text: '' });
  const [dragOver, setDragOver] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatFinding | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResponse | null>(null);
  const [aiApiKey, setAiApiKey] = useState(getGrokApiKey());
  const [aiModel, setAiModel] = useState('grok-2');
  const [tableSearch, setTableSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | ''>('');
  const [filterProvider, setFilterProvider] = useState<CloudProvider | ''>('');
  const [filterService, setFilterService] = useState('');
  const [sortKey, setSortKey] = useState<'severity' | 'riskScore' | 'resourceName'>('severity');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [riskTimeline, setRiskTimeline] = useState<{ label: string; score: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = getGrokApiKey();
    if (stored) setAiApiKey(stored);
  }, []);

  const processAndAnalyze = useCallback(async (res: CloudResource[], msg: string) => {
    setUploadMsg({ type: 'success', text: msg });
    setAnalysis(null);
    setAiResult(null);
    setShowAiPanel(false);
    setResources(res);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((p) => {
        const n = p + Math.random() * 9;
        return n >= 95 ? 95 : n;
      });
    }, 100);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const result = analyzeResources(res);
    clearInterval(interval);
    setScanProgress(100);
    await new Promise((r) => setTimeout(r, 200));
    setAnalysis(result);
    setRiskTimeline((prev) => [...prev, { label: `Scan ${prev.length + 1}`, score: result.riskScore }]);
    setIsScanning(false);
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'json' && ext !== 'csv') {
      setUploadMsg({ type: 'error', text: 'Only JSON and CSV files are supported.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = ext === 'csv' ? parseCSV(text) : parseJSON(text);
        if (parsed.length === 0) { setUploadMsg({ type: 'error', text: 'No valid resources found in file.' }); return; }
        processAndAnalyze(parsed, `Loaded ${parsed.length} resources from ${file.name}`);
    } catch (e) {
        setUploadMsg({ type: 'error', text: `Parse error: ${e instanceof Error ? e.message : 'Invalid format'}` });
      }
    };
    reader.readAsText(file);
  }, [processAndAnalyze]);

  const loadSampleData = useCallback(() => {
    const data = getSampleResources();
    processAndAnalyze(data, `Loaded ${data.length} demo resources (AWS, Azure, GCP)`);
  }, [processAndAnalyze]);

  const reAnalyze = useCallback(() => {
    if (resources.length === 0) return;
    processAndAnalyze(resources, `${resources.length} resources re-scanned`);
  }, [resources, processAndAnalyze]);

  const generateOfflineAnalysis = useCallback((a: AnalysisResult): AIAnalysisResponse => {
    const total = a.findings.length;
    const crit = a.findings.filter(f => f.severity === 'Critical').length;
    const high = a.findings.filter(f => f.severity === 'High').length;
    const med = a.findings.filter(f => f.severity === 'Medium').length;
    const low = a.findings.filter(f => f.severity === 'Low').length;
    const awsT = a.providerBreakdown.AWS?.threats || 0;
    const azT = a.providerBreakdown.Azure?.threats || 0;
    const gcpT = a.providerBreakdown.GCP?.threats || 0;
    const topThreats = a.findings.filter(f => f.severity === 'Critical' || f.severity === 'High').slice(0, 5);

    return {
      executiveSummary: `Security assessment completed for ${a.resources.length} cloud resources across ${Object.values(a.providerBreakdown).filter(p => p.resources > 0).length} provider(s). A total of ${total} security issues were identified: ${crit} critical, ${high} high, ${med} medium, and ${low} low severity. The overall risk score is ${a.riskScore}/100, indicating a "${a.threatLevel}" threat level. ${topThreats.length > 0 ? `Immediate attention required for: ${topThreats.map(t => t.threat).join(', ')}.` : 'No critical or high severity issues detected.'}`,

      threatAnalysis: `The scan detected ${total} misconfigurations across your cloud infrastructure. ${awsT > 0 ? `AWS accounts show ${awsT} issues including public S3 buckets, open security groups, and IAM misconfigurations. ` : ''}${azT > 0 ? `Azure resources have ${azT} issues such as open NSGs, disabled Defender for Cloud, and missing MFA. ` : ''}${gcpT > 0 ? `GCP projects have ${gcpT} issues including public Cloud Storage buckets, overly permissive IAM, and disabled audit logs. ` : ''}The most common patterns involve overly permissive access controls and disabled security monitoring services.`,

      businessImpact: `${a.riskScore >= 50 ? 'HIGH' : a.riskScore >= 30 ? 'MEDIUM' : 'LOW'} BUSINESS IMPACT. ${crit > 0 ? `Critical severity threats (${crit}) pose immediate risk of data breach, financial loss, and regulatory penalties. ` : ''}${high > 0 ? `High severity issues (${high}) could lead to unauthorized access, service disruption, and compliance violations. ` : ''}Estimated potential exposure affects ${a.findings.filter(f => f.severity === 'Critical' || f.severity === 'High').length} resources.`,

      attackScenarios: `Based on the identified vulnerabilities, potential attack scenarios include:\n1. Data Exfiltration: ${a.findings.some(f => f.threat.includes('Public') && f.severity === 'Critical') ? 'Attackers could exfiltrate sensitive data from publicly exposed storage buckets.' : 'Limited data exfiltration risk.'}\n2. Privilege Escalation: ${a.findings.some(f => f.service === 'IAM' && f.severity === 'Critical') ? 'Overly permissive IAM roles allow privilege escalation and lateral movement.' : 'IAM controls appear adequate.'}\n3. Network Intrusion: ${a.findings.some(f => f.threat.includes('Open') || f.threat.includes('NSG')) ? 'Open firewall rules and security groups expose services to internet-wide attacks.' : 'Network controls appear properly configured.'}\n4. Defense Evasion: ${a.findings.some(f => f.threat.includes('Disabled') || f.threat.includes('CloudTrail') || f.threat.includes('GuardDuty')) ? 'Disabled logging and monitoring services allow attackers to operate undetected.' : 'Monitoring services are enabled.'}`,

      riskPriorities: `Priority 1 (Immediate): ${crit > 0 ? `Address ${crit} critical findings — ${topThreats.slice(0, 3).map(t => t.threat).join(', ')}` : 'No critical issues.'}\nPriority 2 (Short-term): ${high > 0 ? `Remediate ${high} high severity findings` : 'No high severity issues.'}\nPriority 3 (Medium-term): ${med > 0 ? `Plan fixes for ${med} medium severity issues` : 'No medium severity issues.'}\nPriority 4 (Long-term): ${low > 0 ? `Schedule ${low} low severity items for next sprint` : 'No low severity issues.'}`,

      mitigationSteps: `Recommended remediation actions:\n1. ${crit > 0 ? `Immediately block public access on ${crit} critical resources` : 'Review and rotate all access keys'}\n2. Enable encryption at rest and in transit for all data storage services\n3. Implement MFA across all user accounts (${a.findings.some(f => f.threat.includes('MFA')) ? `${a.findings.filter(f => f.threat.includes('MFA')).length} users currently lack MFA` : 'MFA appears configured'})\n4. Enable security monitoring services (CloudTrail, GuardDuty, Defender for Cloud, Audit Logs)\n5. Implement least-privilege IAM policies and remove admin-level access\n6. Restrict network ingress to specific IP ranges using security groups and firewalls`,

      securityImprovements: `Recommended security architecture improvements:\n1. Implement a Cloud Security Posture Management (CSPM) tool for continuous monitoring\n2. Deploy infrastructure-as-code with built-in security scanning (e.g., Terraform + Checkov)\n3. Establish a Security Operations Center (SOC) workflow for incident response\n4. Implement automated remediation playbooks for common misconfigurations\n5. Regular security training for cloud engineering teams\n6. Conduct monthly compliance audits using CIS benchmarks`,

      complianceStatus: `Compliance assessment based on ${a.resources.length} resources:\n- Compliant: ${a.compliantCount} resources (${Math.round((a.compliantCount / a.resources.length) * 100)}%)\n- Non-Compliant: ${a.nonCompliantCount} resources (${Math.round((a.nonCompliantCount / a.resources.length) * 100)}%)\n${a.riskScore > 50 ? 'FAIL: Organization does not meet security baseline requirements. Immediate remediation required.' : a.riskScore > 25 ? 'WARNING: Partial compliance achieved. Improvement needed.' : 'PASS: Organization meets minimum security compliance requirements.'}`,

      overallPosture: `Overall Security Posture: ${a.threatLevel.toUpperCase()} RISK (Score: ${a.riskScore}/100).\n\nThe organization's cloud security posture requires ${a.riskScore >= 50 ? 'significant improvement with immediate action on critical and high severity findings.' : a.riskScore >= 25 ? 'moderate improvement with focus on high and medium severity issues.' : 'minor improvements to address low severity findings.'}\n\n${a.findings.length > 0 ? `Key areas of concern: ${[...new Set(a.findings.map(f => f.service))].slice(0, 5).join(', ')}.` : 'No security issues detected in this scan.'}\n\nRecommended next steps: ${a.riskScore >= 40 ? 'Schedule a security review within 1 week.' : 'Continue regular monitoring and monthly compliance scans.'}`,
    };
  }, []);

  const runOfflineAI = useCallback((a: AnalysisResult) => {
    setAiResult(generateOfflineAnalysis(a));
  }, [generateOfflineAnalysis]);

  useEffect(() => {
    if (analysis && !isScanning) {
      runOfflineAI(analysis);
    }
  }, [analysis, isScanning, runOfflineAI]);

  const sendToAI = useCallback(async () => {
    if (!analysis) return;
    if (!aiApiKey) { setAiResult(generateOfflineAnalysis(analysis)); return; }
    setAiLoading(true);
    setAiResult(null);

    const findingsSummary = analysis.findings.map((f) =>
      `[${f.severity}] ${f.provider}/${f.service}: ${f.threat} (CVSS ${f.cvssScore}) - ${f.resourceName}`
    ).join('\n');

    const prompt = `You are a cloud security AI analyst. Analyze findings and provide professional assessment.

Overall Risk Score: ${analysis.riskScore}/100, Threat Level: ${analysis.threatLevel}
Resources: ${analysis.resources.length}, Threats: ${analysis.findings.length}

Breakdown: AWS=${analysis.providerBreakdown.AWS?.threats || 0}, Azure=${analysis.providerBreakdown.Azure?.threats || 0}, GCP=${analysis.providerBreakdown.GCP?.threats || 0}

Findings:\n${findingsSummary}

Respond in JSON: {"executiveSummary":"...","threatAnalysis":"...","businessImpact":"...","attackScenarios":"...","riskPriorities":"...","mitigationSteps":"...","securityImprovements":"...","complianceStatus":"...","overallPosture":"..."}`;

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${aiApiKey}` },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: 'system', content: 'You are a professional cloud security analyst. Respond only in valid JSON.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 3000,
        }),
      });
      if (!response.ok) throw new Error(`API ${response.status}: ${(await response.text()).slice(0, 100)}`);
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      setAiResult(jsonMatch ? JSON.parse(jsonMatch[0]) : generateOfflineAnalysis(analysis));
    } catch {
      setAiResult(generateOfflineAnalysis(analysis));
    }
    setAiLoading(false);
  }, [analysis, aiApiKey, aiModel, generateOfflineAnalysis]);

  const exportData = useCallback((format: 'csv' | 'json' | 'pdf' | 'docx') => {
    if (!analysis) return;
    const d = new Date().toISOString().slice(0, 10);

    if (format === 'csv') {
      const headers = 'Resource Name,Provider,Service,Threat,Severity,Risk Score,Status,Recommendation';
      const rows = analysis.findings.map((f) =>
        `"${f.resourceName}","${f.provider}","${f.service}","${f.threat}","${f.severity}",${f.riskScore},"${f.status}","${f.recommendation}"`
      );
      const blob = new Blob([headers + '\n' + rows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `threat-report-${d}.csv`; a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'json') {
      const payload = { exportDate: d, ...analysis };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `threat-report-${d}.json`; a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const reportHTML = generateReportHTML(analysis, d);
    const ext = format === 'pdf' ? 'html' : 'doc';
    const mime = format === 'pdf' ? 'text/html' : 'application/msword';
    const blob = new Blob([reportHTML], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `threat-report-${d}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [analysis]);

  const filteredFindings = useMemo(() => {
    if (!analysis) return [];
    let list = analysis.findings;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter((f) =>
        f.resourceName.toLowerCase().includes(q) ||
        f.threat.toLowerCase().includes(q) ||
        f.service.toLowerCase().includes(q)
      );
    }
    if (filterSeverity) list = list.filter((f) => f.severity === filterSeverity);
    if (filterProvider) list = list.filter((f) => f.provider === filterProvider);
    if (filterService) list = list.filter((f) => f.service.toLowerCase().includes(filterService.toLowerCase()));
    list.sort((a, b) => {
      if (sortKey === 'severity') {
        const order = ['Critical', 'High', 'Medium', 'Low'];
        return sortDir === 'desc' ? order.indexOf(a.severity) - order.indexOf(b.severity) : order.indexOf(b.severity) - order.indexOf(a.severity);
      }
      if (sortKey === 'riskScore') return sortDir === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
      return sortDir === 'desc' ? b.resourceName.localeCompare(a.resourceName) : a.resourceName.localeCompare(b.resourceName);
    });
    return list;
  }, [analysis, tableSearch, filterSeverity, filterProvider, filterService, sortKey, sortDir]);

  const chartData = useMemo(() => {
    if (!analysis) return null;
    const severityCount = { Critical: 0, High: 0, Medium: 0, Low: 0 } as Record<Severity, number>;
    analysis.findings.forEach((f) => { severityCount[f.severity]++; });

    const providerThreats = (['AWS', 'Azure', 'GCP'] as CloudProvider[]).map((p) => ({
      name: p,
      threats: analysis.findings.filter((f) => f.provider === p).length,
      color: providerColors[p],
    }));

    const serviceThreats = Object.entries(analysis.serviceBreakdown)
      .map(([svc, data]) => ({ name: svc, threats: data.total, critical: data.critical, high: data.high, medium: data.medium, low: data.low }))
      .sort((a, b) => b.threats - a.threats)
      .slice(0, 10);

    const complianceData = [
      { name: 'Compliant', value: analysis.compliantCount, color: '#22c55e' },
      { name: 'Non-Compliant', value: analysis.nonCompliantCount, color: '#ef4444' },
    ];

    const timeline = riskTimeline.length > 0 ? riskTimeline : [{ label: 'Baseline', score: 0 }];

    const heatData = (['AWS', 'Azure', 'GCP'] as CloudProvider[]).map((p) => {
      const svcs = [...new Set(analysis.findings.filter((f) => f.provider === p).map((f) => f.service))];
      const services = svcs.map((svc) => ({
        service: svc,
        count: analysis.findings.filter((f) => f.provider === p && f.service === svc).length,
      }));
      return { provider: p, services };
    });

    return { severityCount, providerThreats, serviceThreats, complianceData, timeline, heatData };
  }, [analysis, riskTimeline]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-cyber-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bug className="text-neon-cyan w-8 h-8" />
            Threat Dataset Tester
          </h1>
          <p className="text-gray-400">Upload or generate sample cloud datasets to test the threat detection engine.</p>
        </div>
        <AnimatePresence>
          {uploadMsg.text && !isScanning && (
            <motion.div
              key="upload-msg"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 ${uploadMsg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}
            >
              {uploadMsg.type === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {uploadMsg.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-panel p-8 border-2 border-dashed cursor-pointer transition-all text-center relative overflow-hidden group ${dragOver ? 'border-neon-cyan bg-neon-cyan/5' : 'border-cyber-border hover:border-neon-cyan/50'}`}
          >
            <input ref={fileInputRef} type="file" accept=".json,.csv" hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Upload className="w-10 h-10 text-neon-cyan mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium mb-1">Drop your dataset here or click to browse</p>
            <p className="text-gray-500 text-sm">Supports JSON and CSV files</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><FileJson className="w-3 h-3" /> JSON</span>
              <span className="flex items-center gap-1"><FileSpreadsheet className="w-3 h-3" /> CSV</span>
              <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Up to 10K resources</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={loadSampleData}
            disabled={isScanning}
            className="glass-panel p-4 flex items-center gap-3 hover:border-neon-cyan/50 transition-colors group cursor-pointer text-left disabled:opacity-40"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Load Demo Dataset</p>
              <p className="text-gray-500 text-xs">42 realistic AWS/Azure/GCP resources</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={reAnalyze}
            disabled={resources.length === 0 || isScanning}
            className="glass-panel p-4 flex items-center gap-3 border-purple-500/30 hover:border-purple-500/60 transition-colors group cursor-pointer text-left disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className={`p-2 rounded-lg ${isScanning ? 'bg-yellow-500/20' : 'bg-purple-500/10'} border ${isScanning ? 'border-yellow-500/30' : 'border-purple-500/30'}`}>
              {isScanning ? <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" /> : <Shield className="w-5 h-5 text-purple-400" />}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{isScanning ? 'Scanning...' : 'Analyze Dataset'}</p>
              <p className="text-gray-500 text-xs">{resources.length ? `${resources.length} resources loaded` : 'Upload a dataset first'}</p>
            </div>
            {resources.length > 0 && !isScanning && <ChevronRight className="w-4 h-4 text-purple-400" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Scan Progress */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            key="scan-progress"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-neon-cyan animate-spin" />
                <span className="text-white text-sm font-medium">Scanning cloud resources...</span>
              </div>
              <span className="text-neon-cyan text-sm font-mono">{Math.round(scanProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-cyan"
                style={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Analyzing {resources.length} resources across 3 providers</span>
              <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && !isScanning && (
          <motion.div
            key="analysis-results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Resources', value: analysis.resources.length, icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
                { label: 'Total Threats', value: analysis.findings.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                { label: 'Critical', value: analysis.findings.filter(f => f.severity === 'Critical').length, icon: Siren, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                { label: 'High', value: analysis.findings.filter(f => f.severity === 'High').length, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
                { label: 'Medium', value: analysis.findings.filter(f => f.severity === 'Medium').length, icon: Shield, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
                { label: 'Low', value: analysis.findings.filter(f => f.severity === 'Low').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
                { label: 'Compliance Score', value: `${Math.round((analysis.compliantCount / Math.max(1, analysis.resources.length)) * 100)}%`, icon: Lock, color: 'text-neon-cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
                { label: 'Security Score', value: `${100 - analysis.riskScore}%`, icon: Shield, color: analysis.riskScore > 50 ? 'text-red-500' : 'text-green-500', bg: analysis.riskScore > 50 ? 'bg-red-500/10' : 'bg-green-500/10', border: analysis.riskScore > 50 ? 'border-red-500/30' : 'border-green-500/30' },
                { label: 'Assets Scanned', value: analysis.resources.length, icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
                { label: 'Providers', value: Object.values(analysis.providerBreakdown).filter(p => p.resources > 0).length, icon: Globe, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`glass-panel p-4 ${stat.border} relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded ${stat.bg}`}>
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-gray-500">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><PieChart className="w-4 h-4 text-neon-cyan" /> Threat Severity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie data={Object.entries(chartData!.severityCount).map(([k, v]) => ({ name: k, value: v, color: severityColors[k as Severity] }))}
                      dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {Object.entries(chartData!.severityCount).map(([k]) => (<Cell key={k} fill={severityColors[k as Severity]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-2 text-xs">
                  {Object.entries(chartData!.severityCount).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: severityColors[k as Severity] }} />{k}: {v}</span>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-neon-cyan" /> Threats by Provider</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData!.providerThreats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="threats" radius={[4, 4, 0, 0]}>
                      {chartData!.providerThreats.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-neon-cyan" /> Threats by Service</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData!.serviceThreats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 10 }} width={90} />
                    <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="threats" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-neon-cyan" /> Risk Score Timeline</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsLine data={chartData!.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.2)" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
                    <Area type="monotone" dataKey="score" fill="#06b6d4" fillOpacity={0.1} />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-neon-cyan" /> Compliance Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie data={chartData!.complianceData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {chartData!.complianceData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-neon-cyan" /> Threat Density by Provider</h3>
                <div className="space-y-3">
                  {chartData!.heatData.map(({ provider, services }) => (
                    <div key={provider}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: providerColors[provider as CloudProvider] }} />
                        <span className="text-xs text-gray-400 font-medium">{provider}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {services.map((s) => {
                          const intensity = s.count > 5 ? 'bg-red-500/60' : s.count > 3 ? 'bg-orange-500/50' : s.count > 1 ? 'bg-yellow-500/40' : 'bg-green-500/30';
                          return <div key={s.service} className={`px-2 py-1 rounded text-xs ${intensity} text-white/90`}>{s.service} <span className="font-bold">{s.count}</span></div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Risk Score */}
            <motion.div variants={itemVariants} className={`glass-panel p-6 border-l-4 ${analysis.riskScore >= 60 ? 'border-l-red-500' : analysis.riskScore >= 40 ? 'border-l-orange-500' : analysis.riskScore >= 20 ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Overall Risk Score</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-4xl font-bold ${analysis.riskScore >= 60 ? 'text-red-500' : analysis.riskScore >= 40 ? 'text-orange-500' : analysis.riskScore >= 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {analysis.riskScore}<span className="text-lg text-gray-500">/100</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${analysis.threatLevel === 'Critical' ? 'bg-red-500/20 text-red-500 border-red-500/50' : analysis.threatLevel === 'High' ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : analysis.threatLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-green-500/20 text-green-500 border-green-500/50'}`}>
                      {analysis.threatLevel} Threat Level
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Scan completed in {(analysis.scanDuration / 1000).toFixed(2)}s</span>
                </div>
              </div>
            </motion.div>

            {/* AI Risk Assessment */}
            <motion.div variants={itemVariants} className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-white">AI Risk Assessment</h2>
                  {!aiApiKey && <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full">Offline Mode</span>}
                </div>
                <button onClick={() => setShowAiPanel(!showAiPanel)} className="text-xs px-3 py-1.5 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors">
                  {showAiPanel ? 'Hide API Settings' : aiApiKey ? 'Change API Key' : 'Connect AI API'}
                </button>
              </div>
              <AnimatePresence>
                {showAiPanel && (
                  <motion.div key="ai-config" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                    <div className="flex flex-wrap items-end gap-3 p-4 bg-cyber-dark rounded-lg border border-cyber-border">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-400 block mb-1">API Key (Grok/OpenAI/Gemini via OpenRouter)</label>
                        <input type="password" value={aiApiKey} onChange={(e) => setAiApiKey(e.target.value)} placeholder="sk-... or xai-..." className="w-full bg-black/40 border border-cyber-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500" />
                      </div>
                      <div className="w-32">
                        <label className="text-xs text-gray-400 block mb-1">Model</label>
                        <select value={aiModel} onChange={(e) => setAiModel(e.target.value)} className="w-full bg-black/40 border border-cyber-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500">
                          <option value="grok-2">Grok-2</option>
                          <option value="grok-3">Grok-3</option>
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-4o-mini">GPT-4o-mini</option>
                          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                          <option value="openrouter/auto">OpenRouter Auto</option>
                        </select>
                      </div>
                      <button onClick={sendToAI} disabled={aiLoading || !aiApiKey || analysis.findings.length === 0}
                        className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm transition-colors flex items-center gap-1.5">
                        {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><BrainCircuit className="w-3.5 h-3.5" /> Run AI Analysis</>}
                      </button>
                      <p className="text-[10px] text-gray-600 w-full mt-1">Leave API key empty for offline mode (no API required). Results are auto-generated from scan data.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {aiLoading && (
                  <motion.div key="ai-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-8">
                    <div className="text-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" /><p className="text-sm text-gray-400">AI is analyzing your threats...</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
              {aiResult && !aiLoading && (
                <motion.div key="ai-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(aiResult).map(([key, value]) => (
                      <div key={key} className="bg-cyber-dark/50 border border-cyber-border rounded-lg p-4">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Threat Table */}
            <motion.div variants={itemVariants} className="glass-panel p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neon-cyan" /> Threat Findings
                  <span className="text-xs text-gray-500 font-normal">({filteredFindings.length} of {analysis.findings.length})</span>
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input type="text" placeholder="Search threats..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} className="pl-8 pr-3 py-1.5 bg-black/40 border border-cyber-border rounded text-sm text-white focus:outline-none focus:border-neon-cyan w-40" />
                  </div>
                  <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as Severity | '')} className="bg-black/40 border border-cyber-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan">
                    <option value="">All Severity</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value as CloudProvider | '')} className="bg-black/40 border border-cyber-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan">
                    <option value="">All Providers</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                  </select>
                  <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="bg-black/40 border border-cyber-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan">
                    <option value="">All Services</option>
                    {[...new Set(analysis.findings.map(f => f.service))].map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Export:</span>
                {(['csv', 'json', 'pdf', 'docx'] as const).map((fmt) => (
                  <button key={fmt} onClick={() => exportData(fmt)} className="text-xs px-2 py-1 rounded bg-cyber-dark border border-cyber-border hover:border-neon-cyan/50 text-gray-400 hover:text-white transition-colors uppercase">
                    {fmt === 'csv' ? <FileSpreadsheet className="w-3 h-3 inline mr-1" /> : fmt === 'json' ? <FileJson className="w-3 h-3 inline mr-1" /> : fmt === 'pdf' ? <Printer className="w-3 h-3 inline mr-1" /> : <FileText className="w-3 h-3 inline mr-1" />}
                    {fmt}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-cyber-border text-xs text-gray-400">
                      <th className="py-2 px-3 font-medium cursor-pointer hover:text-white" onClick={() => { setSortKey('resourceName'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Resource ↕</th>
                      <th className="py-2 px-3 font-medium">Provider</th>
                      <th className="py-2 px-3 font-medium">Service</th>
                      <th className="py-2 px-3 font-medium">Threat</th>
                      <th className="py-2 px-3 font-medium cursor-pointer hover:text-white" onClick={() => { setSortKey('severity'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Severity ↕</th>
                      <th className="py-2 px-3 font-medium cursor-pointer hover:text-white" onClick={() => { setSortKey('riskScore'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Score ↕</th>
                      <th className="py-2 px-3 font-medium">Status</th>
                      <th className="py-2 px-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFindings.map((f) => (
                      <motion.tr
                        key={f.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedThreat(selectedThreat?.id === f.id ? null : f)}
                        className={`border-b border-cyber-border/30 hover:bg-cyber-dark/50 transition-colors cursor-pointer ${selectedThreat?.id === f.id ? 'bg-cyber-dark/80' : ''}`}
                      >
                        <td className="py-2.5 px-3 text-sm text-white font-mono text-xs">{f.resourceName}</td>
                        <td className="py-2.5 px-3"><span className="text-xs font-medium" style={{ color: providerColors[f.provider] }}>{f.provider}</span></td>
                        <td className="py-2.5 px-3 text-xs text-gray-400">{f.service}</td>
                        <td className="py-2.5 px-3 text-xs text-gray-300 max-w-[200px] truncate">{f.threat}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${f.severity === 'Critical' ? 'text-red-500 bg-red-500/10' : f.severity === 'High' ? 'text-orange-500 bg-orange-500/10' : f.severity === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' : 'text-green-500 bg-green-500/10'}`}>{f.severity}</span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-white">{f.riskScore}</td>
                        <td className="py-2.5 px-3"><span className={`text-xs ${f.status === 'Open' ? 'text-red-500' : 'text-green-500'}`}>{f.status}</span></td>
                        <td className="py-2.5 px-3"><button className="text-xs text-neon-cyan hover:text-white transition-colors flex items-center gap-1">Details <Eye className="w-3 h-3" /></button></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredFindings.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No threats match your filters.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Threat Drawer */}
      <AnimatePresence>
        {selectedThreat && (
          <>
            <motion.div key="drawer-bg" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setSelectedThreat(null)} />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-cyber-dark border-l border-cyber-border z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Threat Details</h2>
                <button onClick={() => setSelectedThreat(null)} className="p-1 hover:bg-cyber-border rounded transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-5">
                <div className={`p-4 rounded-lg border ${selectedThreat.severity === 'Critical' ? 'bg-red-500/10 border-red-500/30' : selectedThreat.severity === 'High' ? 'bg-orange-500/10 border-orange-500/30' : selectedThreat.severity === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{selectedThreat.provider} / {selectedThreat.service}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedThreat.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : selectedThreat.severity === 'High' ? 'bg-orange-500/20 text-orange-500' : selectedThreat.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{selectedThreat.severity}</span>
                  </div>
                  <h3 className="text-white font-semibold">{selectedThreat.threat}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedThreat.resourceName}</p>
                </div>
                <DetailSection title="Description" text={selectedThreat.description} />
                <DetailSection title="Why It's Dangerous" text={selectedThreat.danger} />
                <div className="bg-cyber-dark/50 border border-cyber-border rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">CVSS Score</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-bold ${selectedThreat.cvssScore >= 9 ? 'text-red-500' : selectedThreat.cvssScore >= 7 ? 'text-orange-500' : selectedThreat.cvssScore >= 4 ? 'text-yellow-500' : 'text-green-500'}`}>{selectedThreat.cvssScore.toFixed(1)}</span>
                    <div className="flex-1 h-2 bg-cyber-dark rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(selectedThreat.cvssScore / 10) * 100}%`, background: selectedThreat.cvssScore >= 9 ? '#ef4444' : selectedThreat.cvssScore >= 7 ? '#f97316' : selectedThreat.cvssScore >= 4 ? '#eab308' : '#22c55e' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Possible Attacker Actions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedThreat.attackerActions.map((a, i) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">{a}</span>
                    ))}
                  </div>
                </div>
                {selectedThreat.mitreMapping && <DetailSection title="MITRE ATT&CK Mapping" text={selectedThreat.mitreMapping} />}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Fix Difficulty</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${selectedThreat.fixDifficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : selectedThreat.fixDifficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>{selectedThreat.fixDifficulty}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Remediation Steps</p>
                  <ol className="list-decimal list-inside space-y-1">{selectedThreat.remediationSteps.map((step, i) => (<li key={i} className="text-sm text-gray-300">{step}</li>))}</ol>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Recommendation</p>
                  <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg p-3"><p className="text-sm text-neon-cyan">{selectedThreat.recommendation}</p></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailSection = ({ title, text }: { title: string; text: string }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{title}</p>
    <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
  </div>
);

function generateReportHTML(analysis: AnalysisResult, date: string): string {
  const threatRows = analysis.findings.map((f) =>
    `<tr><td>${f.resourceName}</td><td>${f.provider}</td><td>${f.service}</td><td>${f.threat}</td><td>${f.severity}</td><td>${f.riskScore}</td><td>${f.recommendation}</td></tr>`
  ).join('\n');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Threat Report - ${date}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0e1a; color: #e2e8f0; padding: 40px; }
  h1 { color: #06b6d4; font-size: 24px; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
  h2 { color: #fff; font-size: 18px; margin-top: 30px; }
  .score { font-size: 48px; font-weight: bold; }
  .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
  th { background: #1e293b; color: #94a3b8; text-align: left; padding: 8px 12px; border: 1px solid #334155; }
  td { padding: 8px 12px; border: 1px solid #1e293b; color: #cbd5e1; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 11px; color: #64748b; }
</style></head><body>
<h1>CloudGuardian AI — Threat Assessment Report</h1>
<p class="meta">Generated: ${date} | Resources: ${analysis.resources.length} | Findings: ${analysis.findings.length}</p>
<div class="score" style="color:${analysis.riskScore >= 60 ? '#ef4444' : analysis.riskScore >= 40 ? '#f97316' : analysis.riskScore >= 20 ? '#eab308' : '#22c55e'}">${analysis.riskScore}<span style="font-size:18px;color:#64748b">/100</span></div>
<p style="color:#ef4444">Threat Level: ${analysis.threatLevel}</p>
<h2>Findings Summary</h2>
<table><thead><tr><th>Resource</th><th>Provider</th><th>Service</th><th>Threat</th><th>Severity</th><th>Score</th><th>Recommendation</th></tr></thead><tbody>${threatRows}</tbody></table>
<p style="margin-top:20px">Compliant: ${analysis.compliantCount} | Non-Compliant: ${analysis.nonCompliantCount}</p>
<div class="footer">CloudGuardian AI - Cyber Security Dashboard</div>
</body></html>`;
}
