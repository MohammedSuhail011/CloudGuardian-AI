import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Server, Code, CheckCircle } from 'lucide-react';

export const AIAnalysis = () => {
  const [configText, setConfigText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = () => {
    if (!configText.trim()) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        threatLevel: 'CRITICAL',
        riskScore: 87,
        confidenceScore: 94,
        explanation: 'AI detected multiple public-facing S3 buckets and unrestricted security groups that allow broad inbound access. This pattern matches known reconnaissance techniques.',
        misconfigurations: [
          { id: 'M-1', title: 'S3 Bucket Public Access', service: 'AWS S3', impact: 'High' },
          { id: 'M-2', title: 'Unrestricted Port 22 (SSH)', service: 'EC2 Security Group', impact: 'Critical' },
        ],
        frameworks: {
          cis: ['1.20', '4.1'],
          mitre: ['T1190', 'T1082'],
          owasp: ['A1:2017-Injection', 'A5:2017-Broken Access Control']
        },
        remediation: [
          {
            step: 'Block public access on S3 buckets',
            command: 'aws s3api put-public-access-block --bucket my-bucket --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
          },
          {
            step: 'Restrict SSH access to trusted IPs only',
            command: 'aws ec2 authorize-security-group-ingress --group-id sg-1234567890abcdef0 --protocol tcp --port 22 --cidr 203.0.113.0/24'
          }
        ]
      });
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Zap className="text-neon-purple w-8 h-8" />
          Neural Configuration Analysis
        </h1>
        <p className="text-gray-400">Paste your Terraform, CloudFormation, or JSON configuration for AI-powered vulnerability scanning.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel p-6 flex flex-col h-[500px]"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-neon-cyan" /> Input Configuration
            </h2>
          </div>
          <textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            placeholder="Paste your configuration here..."
            className="flex-1 w-full bg-cyber-dark/80 border border-cyber-border rounded-lg p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan resize-none scrollbar-cyber transition-all"
            disabled={isAnalyzing}
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !configText.trim()}
            whileHover={!isAnalyzing && configText.trim() ? { scale: 1.01 } : {}}
            whileTap={!isAnalyzing && configText.trim() ? { scale: 0.99 } : {}}
            className="mt-4 w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden group"
          >
            {isAnalyzing ? 'ANALYZING NEURAL PATHWAYS...' : 'INITIATE DEEP SCAN'}
            <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-panel p-6 h-[500px] overflow-y-auto scrollbar-cyber relative"
        >
          <AnimatePresence mode="wait">
            {!isAnalyzing && !results && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4"
              >
                <Server className="w-16 h-16 opacity-50" />
                <p>Awaiting configuration data for analysis.</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="relative w-48 h-48 rounded-full border-2 border-cyber-border flex items-center justify-center overflow-hidden">
                  <ShieldAlert className="w-12 h-12 text-neon-cyan relative z-10 animate-pulse-glow" />
                  <div className="absolute top-1/2 left-1/2 w-full h-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(6,182,212,0)_0%,rgba(6,182,212,0.4)_50%,rgba(6,182,212,0.8)_100%)] origin-bottom-right animate-spin-slow" style={{ transformOrigin: '0 0' }} />
                  <div className="scan-line" />
                </div>
                <p className="mt-8 text-neon-cyan font-mono animate-pulse">Running MITRE ATT&CK heuristics...</p>
              </motion.div>
            )}

            {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div>
                    <h3 className="text-red-500 font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" />
                      {results.threatLevel} THREAT DETECTED
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Confidence Score: {results.confidenceScore}%</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-500">{results.riskScore}</div>
                    <div className="text-xs text-gray-400 uppercase">Risk Score</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm border-b border-cyber-border pb-2">AI Analysis</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{results.explanation}</p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm border-b border-cyber-border pb-2">Critical Misconfigurations</h4>
                  <ul className="space-y-2">
                    {results.misconfigurations.map((m: any) => (
                      <li key={m.id} className="flex items-center gap-3 text-sm bg-cyber-dark/50 p-2 rounded border border-cyber-border">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-gray-300">{m.title}</span>
                        <span className="ml-auto text-xs text-gray-500 font-mono">{m.service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm border-b border-cyber-border pb-2">Remediation Steps</h4>
                  <div className="space-y-4">
                    {results.remediation.map((r: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="space-y-2"
                      >
                        <div className="flex gap-2 items-start text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-neon-green mt-0.5" />
                          <span>{r.step}</span>
                        </div>
                        <div className="relative group">
                          <div className="absolute top-0 left-0 w-full h-full bg-neon-cyan/5 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                          <pre className="p-3 bg-cyber-dark rounded text-xs font-mono text-neon-cyan overflow-x-auto border border-cyber-border group-hover:border-neon-cyan/50 transition-colors">
                            {r.command}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
