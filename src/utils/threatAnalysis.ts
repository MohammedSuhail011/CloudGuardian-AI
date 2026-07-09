import type { CloudResource, ThreatFinding, AnalysisResult, CloudProvider, Severity } from '../types/threatTester';

interface ThreatRule {
  threat: string;
  provider: CloudProvider[];
  service: string;
  severity: Severity;
  cvssScore: number;
  description: string;
  danger: string;
  attackerActions: string[];
  mitreMapping: string;
  recommendation: string;
  remediationSteps: string[];
  fixDifficulty: 'Easy' | 'Medium' | 'Hard';
  detect: (resource: CloudResource) => boolean;
}

const threatRules: ThreatRule[] = [
  {
    threat: 'Public S3 Bucket',
    provider: ['AWS'],
    service: 'S3',
    severity: 'Critical',
    cvssScore: 9.5,
    description: 'S3 bucket policy allows public read or write access to anyone on the internet.',
    danger: 'Anyone on the internet can read or write files in this bucket, leading to data exfiltration or malware injection.',
    attackerActions: ['List objects in the bucket', 'Download sensitive data', 'Upload malicious files', 'Use bucket for phishing hosting'],
    mitreMapping: 'T1530 (Data from Cloud Storage)',
    recommendation: 'Block all public access at bucket and account level using S3 Block Public Access.',
    remediationSteps: ['Enable S3 Block Public Access at account level', 'Remove bucket ACLs granting public access', 'Update bucket policy to deny Principal "*"', 'Enable S3 Object Ownership'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'S3' && (r.config.publicAccess === true || r.config.aclPublic === true),
  },
  {
    threat: 'Unencrypted S3 Bucket',
    provider: ['AWS'],
    service: 'S3',
    severity: 'High',
    cvssScore: 7.5,
    description: 'S3 bucket does not have default encryption enabled.',
    danger: 'Data at rest is stored in plaintext, exposing sensitive information if the bucket is compromised.',
    attackerActions: ['Access stored data without decryption', 'Exfiltrate data in plaintext'],
    mitreMapping: 'T1530 (Data from Cloud Storage)',
    recommendation: 'Enable S3 default encryption with SSE-S3 or SSE-KMS.',
    remediationSteps: ['Enable default encryption on the bucket', 'Use SSE-KMS for sensitive data', 'Apply bucket policy to deny unencrypted PUT requests'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'S3' && r.config.encrypted === false,
  },
  {
    threat: 'EC2 Security Group Open to 0.0.0.0/0',
    provider: ['AWS'],
    service: 'EC2',
    severity: 'Critical',
    cvssScore: 9.0,
    description: 'Security group rule allows inbound traffic from 0.0.0.0/0 on a non-HTTP/HTTPS port.',
    danger: 'Attackers can reach the instance from anywhere, enabling brute force, exploitation, or DDoS.',
    attackerActions: ['Port scan for open services', 'Brute force SSH/RDP credentials', 'Exploit vulnerable services'],
    mitreMapping: 'T1190 (Exploit Public-Facing Application)',
    recommendation: 'Restrict security group ingress to specific IP ranges only.',
    remediationSteps: ['Identify the open port', 'Determine required IP ranges', 'Replace 0.0.0.0/0 with specific CIDR', 'Test connectivity after change'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'EC2' && ((r.config.openPorts as number[]) || []).includes(22) && r.config.publicIp === true,
  },
  {
    threat: 'IAM User Without MFA',
    provider: ['AWS'],
    service: 'IAM',
    severity: 'High',
    cvssScore: 8.0,
    description: 'IAM user does not have multi-factor authentication enabled.',
    danger: 'Stolen or guessed passwords allow full account access without additional verification.',
    attackerActions: ['Phish user credentials', 'Password spraying', 'Use stolen credentials to access AWS console'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Enable MFA for all IAM users with console or programmatic access.',
    remediationSteps: ['Identify users without MFA', 'Force MFA enrollment via IAM policy', 'Use hardware or virtual MFA devices', 'Monitor MFA status regularly'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'IAM' && r.config.mfaEnabled === false && r.config.userType === 'HumanUser',
  },
  {
    threat: 'IAM Administrator Access',
    provider: ['AWS'],
    service: 'IAM',
    severity: 'Critical',
    cvssScore: 9.5,
    description: 'IAM entity has AdministratorAccess policy attached, granting full control over all AWS resources.',
    danger: 'Compromise of this entity gives an attacker complete control over the entire AWS account.',
    attackerActions: ['Create new admin users', 'Delete all resources', 'Exfiltrate all data', 'Modify billing'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Remove AdministratorAccess and implement least privilege policies.',
    remediationSteps: ['Review IAM permissions', 'Create scoped policies for specific roles', 'Remove AdministratorAccess', 'Use permission boundaries'],
    fixDifficulty: 'Hard',
    detect: (r) => r.service === 'IAM' && r.config.isAdmin === true,
  },
  {
    threat: 'Root Account Activity',
    provider: ['AWS'],
    service: 'IAM',
    severity: 'Critical',
    cvssScore: 10.0,
    description: 'AWS root account has been used for non-emergency operations.',
    danger: 'Root account has irreversible full access; its compromise is catastrophic and hard to detect.',
    attackerActions: ['Delete the AWS account', 'Close billing information', 'Escalate privileges'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Lock root account credentials and use IAM roles for all actions.',
    remediationSteps: ['Delete root access keys', 'Enable MFA on root account', 'Use Organizations SCP to restrict root', 'Monitor root activity via CloudTrail'],
    fixDifficulty: 'Medium',
    detect: (r) => r.service === 'IAM' && r.config.isRootAccount === true && r.config.recentActivity === true,
  },
  {
    threat: 'Open RDS Database',
    provider: ['AWS'],
    service: 'RDS',
    severity: 'High',
    cvssScore: 8.5,
    description: 'RDS instance is publicly accessible with ingress from 0.0.0.0/0.',
    danger: 'Database is exposed to the internet, risking data theft, SQL injection, and ransomware.',
    attackerActions: ['Brute force database credentials', 'Exploit database vulnerabilities', 'Exfiltrate customer data'],
    mitreMapping: 'T1190 (Exploit Public-Facing Application)',
    recommendation: 'Disable public accessibility and restrict security group ingress.',
    remediationSteps: ['Set PubliclyAccessible to false', 'Move database to private subnet', 'Use VPN or Direct Connect for access', 'Enable encryption in transit'],
    fixDifficulty: 'Medium',
    detect: (r) => r.service === 'RDS' && r.config.publiclyAccessible === true,
  },
  {
    threat: 'Disabled CloudTrail',
    provider: ['AWS'],
    service: 'CloudTrail',
    severity: 'High',
    cvssScore: 7.0,
    description: 'AWS CloudTrail is not enabled or is not logging in this region.',
    danger: 'All API activity goes unlogged, making incident investigation and forensics impossible.',
    attackerActions: ['Perform malicious API calls without detection', 'Maintain persistence undetected'],
    mitreMapping: 'T1562 (Impair Defenses)',
    recommendation: 'Enable CloudTrail in all regions with log file validation.',
    remediationSteps: ['Create a CloudTrail trail', 'Enable log file validation', 'Send logs to S3 bucket', 'Enable CloudTrail Insights'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'CloudTrail' && r.config.enabled === false,
  },
  {
    threat: 'Disabled GuardDuty',
    provider: ['AWS'],
    service: 'GuardDuty',
    severity: 'Medium',
    cvssScore: 6.0,
    description: 'GuardDuty threat detection service is not enabled.',
    danger: 'Intelligent threat detection for malicious activities is not available.',
    attackerActions: ['Perform reconnaissance undetected', 'Establish persistence without triggering alerts'],
    mitreMapping: 'T1562 (Impair Defenses)',
    recommendation: 'Enable GuardDuty in all supported regions.',
    remediationSteps: ['Enable GuardDuty', 'Configure trusted IP lists', 'Set up threat list', 'Integrate with Security Hub'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'GuardDuty' && r.config.enabled === false,
  },
  {
    threat: 'Public Storage Account',
    provider: ['Azure'],
    service: 'Storage',
    severity: 'Critical',
    cvssScore: 9.0,
    description: 'Azure Storage account allows public access from all networks.',
    danger: 'Storage account data is accessible from the public internet, risking data exposure.',
    attackerActions: ['Access storage containers', 'Download blobs and files', 'Upload malicious content'],
    mitreMapping: 'T1530 (Data from Cloud Storage)',
    recommendation: 'Restrict network access to specific VNets and IP addresses.',
    remediationSteps: ['Disable public network access', 'Enable Azure Firewall rules', 'Use Private Endpoints for access', 'Enable advanced threat protection'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'Storage' && r.config.publicAccess === true,
  },
  {
    threat: 'NSG Open to Internet',
    provider: ['Azure'],
    service: 'NSG',
    severity: 'Critical',
    cvssScore: 9.0,
    description: 'Network Security Group allows inbound traffic from "Any" or "Internet" on sensitive ports.',
    danger: 'Virtual machines are exposed to internet-wide scanning and attacks.',
    attackerActions: ['Scan for open management ports', 'Brute force credentials', 'Exploit vulnerable services'],
    mitreMapping: 'T1190 (Exploit Public-Facing Application)',
    recommendation: 'Restrict NSG inbound rules to specific source IP ranges.',
    remediationSteps: ['Review NSG inbound rules', 'Replace "Any" with specific IP ranges', 'Use NSG flow logs for analysis', 'Implement JIT VM access'],
    fixDifficulty: 'Medium',
    detect: (r) => r.service === 'NSG' && (r.config.openToInternet === true || r.config.anyInbound === true),
  },
  {
    threat: 'Disabled Defender for Cloud',
    provider: ['Azure'],
    service: 'Security Center',
    severity: 'High',
    cvssScore: 7.5,
    description: 'Microsoft Defender for Cloud is not enabled on subscriptions.',
    danger: 'Advanced threat detection, vulnerability assessment, and security recommendations are unavailable.',
    attackerActions: ['Exploit vulnerabilities without detection', 'Lateral movement without alerts'],
    mitreMapping: 'T1562 (Impair Defenses)',
    recommendation: 'Enable Defender for Cloud on all subscriptions.',
    remediationSteps: ['Navigate to Defender for Cloud', 'Enable Defender plans', 'Configure auto-provisioning', 'Set up email notifications'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'Security Center' && r.config.defenderEnabled === false,
  },
  {
    threat: 'Missing MFA (Azure)',
    provider: ['Azure'],
    service: 'Azure AD',
    severity: 'High',
    cvssScore: 8.0,
    description: 'Azure AD user does not have MFA configured or enforced.',
    danger: 'Compromised user credentials allow unauthorized access to Azure resources.',
    attackerActions: ['Password spray attacks', 'Phish credentials', 'Access Azure portal and resources'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Enable and enforce MFA for all Azure AD users.',
    remediationSteps: ['Configure Conditional Access policy for MFA', 'Enable security defaults', 'Enforce per-user MFA', 'Educate users on MFA setup'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'Azure AD' && r.config.mfaEnabled === false,
  },
  {
    threat: 'Public IP Exposure',
    provider: ['Azure'],
    service: 'Virtual Machines',
    severity: 'Medium',
    cvssScore: 6.5,
    description: 'Virtual machine has a public IP address attached directly.',
    danger: 'Direct public IP access bypasses network controls and increases attack surface.',
    attackerActions: ['Direct port scanning', 'DDoS targeting', 'Network reconnaissance'],
    mitreMapping: 'T1046 (Network Service Scanning)',
    recommendation: 'Remove public IPs from VMs and use Azure Load Balancer or Application Gateway.',
    remediationSteps: ['Note the public IP address', 'Associate it with Azure Firewall or Load Balancer', 'Remove NIC-level public IP', 'Route traffic through intermediary'],
    fixDifficulty: 'Medium',
    detect: (r) => r.service === 'Virtual Machines' && r.config.hasPublicIp === true,
  },
  {
    threat: 'Weak RBAC Permissions',
    provider: ['Azure'],
    service: 'IAM',
    severity: 'Medium',
    cvssScore: 6.0,
    description: 'Azure role assignment grants overly permissive rights (e.g., Owner, Contributor) without justification.',
    danger: 'Over-privileged users can delete infrastructure, access data, or modify security settings.',
    attackerActions: ['Escalate privileges using inherited roles', 'Delete or modify resources', 'Access sensitive data'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Replace broad roles with specific custom roles using least privilege.',
    remediationSteps: ['Review all role assignments', 'Identify overly broad assignments', 'Create custom roles with specific permissions', 'Use PIM for just-in-time access'],
    fixDifficulty: 'Hard',
    detect: (r) => r.service === 'IAM' && (r.config.role === 'Owner' || r.config.role === 'Contributor') && r.config.justified === false,
  },
  {
    threat: 'Public Cloud Storage Bucket (GCP)',
    provider: ['GCP'],
    service: 'Cloud Storage',
    severity: 'Critical',
    cvssScore: 9.5,
    description: 'GCS bucket has public access granted to allUsers or allAuthenticatedUsers.',
    danger: 'Anyone on the internet can read or write objects in the bucket, leading to data leaks.',
    attackerActions: ['List bucket contents', 'Download sensitive files', 'Upload malicious objects'],
    mitreMapping: 'T1530 (Data from Cloud Storage)',
    recommendation: 'Remove public IAM bindings from bucket and use signed URLs for temporary access.',
    remediationSteps: ['Remove allUsers/allAuthenticatedUsers bindings', 'Enable public access prevention', 'Use signed URLs for external sharing', 'Enable object versioning'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'Cloud Storage' && (r.config.publicAccess === true || r.config.allUsersAccess === true),
  },
  {
    threat: 'Overly Permissive IAM (GCP)',
    provider: ['GCP'],
    service: 'IAM',
    severity: 'Critical',
    cvssScore: 9.0,
    description: 'GCP IAM policy grants primitive roles (Owner, Editor) to a user or service account.',
    danger: 'Primitive roles grant broad permissions far beyond what is typically needed.',
    attackerActions: ['Create new resources', 'Delete existing infrastructure', 'Access all data', 'Modify IAM policies'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Replace primitive roles with predefined or custom roles following least privilege.',
    remediationSteps: ['Identify primitive role assignments', 'Create custom roles for specific needs', 'Migrate to least-privilege roles', 'Use IAM Recommender'],
    fixDifficulty: 'Hard',
    detect: (r) => r.service === 'IAM' && (r.config.role === 'Owner' || r.config.role === 'Editor') && r.config.primitiveRole === true,
  },
  {
    threat: 'Open Firewall Rules (GCP)',
    provider: ['GCP'],
    service: 'VPC',
    severity: 'High',
    cvssScore: 8.5,
    description: 'VPC firewall rule allows ingress from 0.0.0.0/0 on a high-risk port.',
    danger: 'VM instances are exposed to unrestricted internet traffic on sensitive ports.',
    attackerActions: ['Port scanning for vulnerable services', 'Exploit unpatched applications', 'DDoS amplification'],
    mitreMapping: 'T1190 (Exploit Public-Facing Application)',
    recommendation: 'Restrict firewall rules to specific source IP ranges and use IAP for SSH/RDP access.',
    remediationSteps: ['Identify overly permissive rules', 'Narrow source IP ranges', 'Use IAP for SSH/RDP', 'Enable VPC Flow Logs for monitoring'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'VPC' && r.config.openToInternet === true,
  },
  {
    threat: 'Disabled Audit Logs (GCP)',
    provider: ['GCP'],
    service: 'Logging',
    severity: 'High',
    cvssScore: 7.5,
    description: 'GCP audit logs are not enabled or are not being exported.',
    danger: 'Without audit logs, admin activity and data access cannot be tracked for security investigations.',
    attackerActions: ['Perform unauthorized actions without logging', 'Destroy evidence of compromise'],
    mitreMapping: 'T1562 (Impair Defenses)',
    recommendation: 'Enable all categories of audit logs and export them to a secure destination.',
    remediationSteps: ['Enable Admin Read and Data Access audit logs', 'Export logs to BigQuery or Cloud Storage', 'Set up log-based alerts', 'Monitor log delivery health'],
    fixDifficulty: 'Easy',
    detect: (r) => r.service === 'Logging' && r.config.auditLogsEnabled === false,
  },
  {
    threat: 'Service Account Misconfiguration (GCP)',
    provider: ['GCP'],
    service: 'IAM',
    severity: 'Medium',
    cvssScore: 6.5,
    description: 'GCP service account has broad permissions or is not using workload identity federation.',
    danger: 'Compromised service account keys can be used to access cloud resources from outside GCP.',
    attackerActions: ['Use leaked service account keys', 'Access GCP APIs as the service account', 'Lateral movement across projects'],
    mitreMapping: 'T1078 (Valid Accounts)',
    recommendation: 'Use workload identity federation instead of service account keys and limit permissions.',
    remediationSteps: ['Avoid creating service account keys', 'Use workload identity federation for on-prem', 'Grant minimal roles', 'Rotate keys regularly'],
    fixDifficulty: 'Hard',
    detect: (r) => r.service === 'IAM' && r.config.hasKey === true && r.config.broadPermissions === true,
  },
];

function detectProvider(resource: CloudResource): CloudProvider | null {
  if (resource.provider) return resource.provider;
  const svc = resource.service?.toLowerCase() || '';
  if (['s3', 'ec2', 'iam', 'lambda', 'rds', 'cloudtrail', 'guardduty', 'vpc'].includes(svc)) return 'AWS';
  if (['storage', 'nsg', 'azure ad', 'virtual machines', 'security center', 'key vault'].includes(svc)) return 'Azure';
  if (['cloud storage', 'compute engine', 'vpc', 'logging', 'cloud functions'].includes(svc)) return 'GCP';
  const tags = resource.tags || {};
  if (tags.provider === 'AWS' || tags.provider === 'Azure' || tags.provider === 'GCP') return tags.provider as CloudProvider;
  return null;
}

export function parseCSV(text: string): CloudResource[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const resources: CloudResource[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim());
    if (vals.length < 3) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { if (vals[idx] !== undefined) row[h] = vals[idx]; });
    try {
      resources.push({
        id: row.id || `resource-${i}`,
        name: row.name || row['resource name'] || `Resource ${i}`,
        provider: (row.provider || row.cloud || 'AWS') as CloudProvider,
        service: row.service || row['service type'] || 'Unknown',
        region: row.region || 'us-east-1',
        tags: {},
        config: row,
      });
    } catch { /* skip invalid rows */ }
  }
  return resources;
}

export function parseJSON(text: string): CloudResource[] {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : data.resources || data.data || [];
  return arr.map((item: Record<string, unknown>, i: number) => ({
    id: String(item.id || item.resourceId || item.ResourceId || `resource-${i}`),
    name: String(item.name || item.resourceName || item.ResourceName || item.Name || `Resource ${i}`),
    provider: (item.provider || item.cloudProvider || item.Provider || 'AWS') as CloudProvider,
    service: String(item.service || item.serviceType || item.Service || item.resourceType || item.ResourceType || 'Unknown'),
    region: String(item.region || item.Region || item.location || item.Location || 'us-east-1'),
    tags: (item.tags as Record<string, string>) || {},
    config: item as Record<string, unknown>,
  }));
}

export function analyzeResources(resources: CloudResource[]): AnalysisResult {
  const findings: ThreatFinding[] = [];
  const startTime = performance.now();

  for (const resource of resources) {
    const detectedProvider = detectProvider(resource);
    if (detectedProvider) resource.provider = detectedProvider;

    for (const rule of threatRules) {
      if (!rule.provider.includes(resource.provider)) continue;
      if (rule.service !== resource.service && rule.service !== 'IAM') continue;
      if (rule.service === 'IAM' && !resource.service.includes('IAM') && !resource.service.includes('Azure AD')) continue;

      try {
        if (rule.detect(resource)) {
          const riskScore = rule.severity === 'Critical' ? 30 : rule.severity === 'High' ? 20 : rule.severity === 'Medium' ? 10 : 5;
          findings.push({
            id: `threat-${findings.length + 1}`,
            resourceId: resource.id,
            resourceName: resource.name,
            provider: resource.provider,
            service: resource.service,
            threat: rule.threat,
            severity: rule.severity,
            riskScore,
            status: 'Open',
            recommendation: rule.recommendation,
            description: rule.description,
            cvssScore: rule.cvssScore,
            danger: rule.danger,
            attackerActions: rule.attackerActions,
            mitreMapping: rule.mitreMapping,
            remediationSteps: rule.remediationSteps,
            fixDifficulty: rule.fixDifficulty,
          });
        }
      } catch { /* skip rule on error */ }
    }
  }

  const duration = performance.now() - startTime;

  const providerSet: CloudProvider[] = ['AWS', 'Azure', 'GCP'];
  const providerBreakdown = {} as Record<CloudProvider, { resources: number; threats: number }>;
  providerSet.forEach(p => {
    providerBreakdown[p] = {
      resources: resources.filter(r => r.provider === p).length,
      threats: findings.filter(f => f.provider === p).length,
    };
  });

  const services = [...new Set(findings.map(f => f.service))];
  const serviceBreakdown: Record<string, { total: number; critical: number; high: number; medium: number; low: number }> = {};
  services.forEach(s => {
    const f = findings.filter(x => x.service === s);
    serviceBreakdown[s] = {
      total: f.length,
      critical: f.filter(x => x.severity === 'Critical').length,
      high: f.filter(x => x.severity === 'High').length,
      medium: f.filter(x => x.severity === 'Medium').length,
      low: f.filter(x => x.severity === 'Low').length,
    };
  });

  const totalRisk = findings.reduce((sum, f) => sum + f.riskScore, 0);
  const riskScore = Math.min(100, totalRisk);
  const threatLevel: Severity = riskScore >= 60 ? 'Critical' : riskScore >= 40 ? 'High' : riskScore >= 20 ? 'Medium' : 'Low';

  const compliantCount = resources.length - findings.length;
  const nonCompliantCount = findings.length;

  return {
    resources,
    findings,
    riskScore,
    threatLevel,
    providerBreakdown,
    serviceBreakdown,
    compliantCount: Math.max(0, compliantCount),
    nonCompliantCount,
    scanDuration: duration,
    timestamp: new Date().toISOString(),
  };
}
