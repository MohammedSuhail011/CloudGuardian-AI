export type CloudProvider = 'AWS' | 'Azure' | 'GCP';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ThreatStatus = 'Open' | 'Resolved';

export type FixDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface CloudResource {
  id: string;
  name: string;
  provider: CloudProvider;
  service: string;
  region: string;
  tags: Record<string, string>;
  config: Record<string, unknown>;
}

export interface ThreatFinding {
  id: string;
  resourceId: string;
  resourceName: string;
  provider: CloudProvider;
  service: string;
  threat: string;
  severity: Severity;
  riskScore: number;
  status: ThreatStatus;
  recommendation: string;
  description: string;
  cvssScore: number;
  danger: string;
  attackerActions: string[];
  mitreMapping: string;
  remediationSteps: string[];
  fixDifficulty: FixDifficulty;
}

export interface AnalysisResult {
  resources: CloudResource[];
  findings: ThreatFinding[];
  riskScore: number;
  threatLevel: Severity;
  providerBreakdown: Record<CloudProvider, { resources: number; threats: number }>;
  serviceBreakdown: Record<string, { total: number; critical: number; high: number; medium: number; low: number }>;
  compliantCount: number;
  nonCompliantCount: number;
  scanDuration: number;
  timestamp: string;
}

export interface RiskTimelinePoint {
  label: string;
  score: number;
}

export interface ExportPayload {
  analysis: AnalysisResult;
  format: 'csv' | 'json' | 'pdf' | 'docx';
}

export interface FeedItem {
  id: string;
  time: string;
  alert: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detail: string;
  provider: string;
  timestamp: number;
  riskScore?: number;
  dismissed?: boolean;
}

export interface AIAnalysisResponse {
  executiveSummary: string;
  threatAnalysis: string;
  businessImpact: string;
  attackScenarios: string;
  riskPriorities: string;
  mitigationSteps: string;
  securityImprovements: string;
  complianceStatus: string;
  overallPosture: string;
}
