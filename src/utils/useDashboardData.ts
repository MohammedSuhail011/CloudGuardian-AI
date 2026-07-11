export interface ThreatDetail {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  timestamp: string;
  timeAgo: string;
  remediation?: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface CriticalRisk {
  id: string;
  title: string;
  description: string;
  provider: string;
  severity: 'critical' | 'high';
  remediation: string;
  impact: string;
  score: number;
}

export interface TimelinePoint {
  time: string;
  threats: number;
  label: string;
  events: { severity: string; title: string }[];
}

export interface ThreatLocation {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: string;
  time: string;
  location: string;
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
