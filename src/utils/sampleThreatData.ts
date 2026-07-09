import type { CloudResource } from '../types/threatTester';

const sampleResources: CloudResource[] = [
  // ===== AWS Resources =====
  { id: 'aws-s3-001', name: 'my-public-bucket', provider: 'AWS', service: 'S3', region: 'us-east-1', tags: { env: 'prod', team: 'engineering' }, config: { publicAccess: true, aclPublic: true, encrypted: false, versioning: false } },
  { id: 'aws-s3-002', name: 'logs-archive-bucket', provider: 'AWS', service: 'S3', region: 'us-west-2', tags: { env: 'prod', team: 'security' }, config: { publicAccess: false, aclPublic: false, encrypted: true, versioning: true } },
  { id: 'aws-s3-003', name: 'data-lake-bucket', provider: 'AWS', service: 'S3', region: 'eu-west-1', tags: { env: 'prod', team: 'data' }, config: { publicAccess: false, aclPublic: false, encrypted: false, versioning: true } },
  { id: 'aws-ec2-001', name: 'web-server-01', provider: 'AWS', service: 'EC2', region: 'us-east-1', tags: { env: 'prod', name: 'web' }, config: { publicIp: true, openPorts: [22, 80, 443], instanceType: 't3.large' } },
  { id: 'aws-ec2-002', name: 'db-server-01', provider: 'AWS', service: 'EC2', region: 'us-east-1', tags: { env: 'prod', name: 'database' }, config: { publicIp: false, openPorts: [3306], instanceType: 'r5.xlarge' } },
  { id: 'aws-ec2-003', name: 'bastion-host', provider: 'AWS', service: 'EC2', region: 'us-west-2', tags: { env: 'prod', name: 'bastion' }, config: { publicIp: true, openPorts: [22], instanceType: 't3.medium' } },
  { id: 'aws-iam-001', name: 'john.doe', provider: 'AWS', service: 'IAM', region: 'global', tags: { env: 'prod', type: 'user' }, config: { mfaEnabled: false, userType: 'HumanUser', isAdmin: false, passwordLastUsed: '2026-06-15' } },
  { id: 'aws-iam-002', name: 'deploy-bot', provider: 'AWS', service: 'IAM', region: 'global', tags: { env: 'prod', type: 'service' }, config: { mfaEnabled: true, userType: 'ServiceAccount', isAdmin: false, accessKeyAge: 120 } },
  { id: 'aws-iam-003', name: 'admin-user', provider: 'AWS', service: 'IAM', region: 'global', tags: { env: 'prod', type: 'user' }, config: { mfaEnabled: true, userType: 'HumanUser', isAdmin: true, adminPolicies: ['AdministratorAccess'] } },
  { id: 'aws-iam-004', name: 'root-account', provider: 'AWS', service: 'IAM', region: 'global', tags: { env: 'root', type: 'root' }, config: { isRootAccount: true, recentActivity: true, mfaEnabled: false, accessKeys: true } },
  { id: 'aws-rds-001', name: 'prod-mysql-db', provider: 'AWS', service: 'RDS', region: 'us-east-1', tags: { env: 'prod', type: 'mysql' }, config: { publiclyAccessible: true, encrypted: true, multiAz: true, port: 3306 } },
  { id: 'aws-rds-002', name: 'staging-pg-db', provider: 'AWS', service: 'RDS', region: 'us-east-1', tags: { env: 'staging', type: 'postgres' }, config: { publiclyAccessible: false, encrypted: true, multiAz: false, port: 5432 } },
  { id: 'aws-ct-001', name: 'management-trail', provider: 'AWS', service: 'CloudTrail', region: 'us-east-1', tags: { env: 'prod' }, config: { enabled: false, multiRegion: false, logValidation: false } },
  { id: 'aws-ct-002', name: 'audit-trail', provider: 'AWS', service: 'CloudTrail', region: 'us-west-2', tags: { env: 'prod' }, config: { enabled: true, multiRegion: true, logValidation: true } },
  { id: 'aws-gd-001', name: 'guardduty-monitor', provider: 'AWS', service: 'GuardDuty', region: 'us-east-1', tags: { env: 'prod' }, config: { enabled: false } },
  { id: 'aws-sg-001', name: 'web-sg', provider: 'AWS', service: 'EC2', region: 'us-east-1', tags: { env: 'prod' }, config: { publicIp: true, openPorts: [22, 3389], instanceType: 't3.medium' } },

  // ===== Azure Resources =====
  { id: 'az-stg-001', name: 'prodstorageaccount', provider: 'Azure', service: 'Storage', region: 'eastus', tags: { env: 'prod', team: 'platform' }, config: { publicAccess: true, encryption: true, softDelete: false, networkAcls: 'AllowAll' } },
  { id: 'az-stg-002', name: 'logstorageaccount', provider: 'Azure', service: 'Storage', region: 'westus', tags: { env: 'prod', team: 'security' }, config: { publicAccess: false, encryption: true, softDelete: true, networkAcls: 'DenyAll' } },
  { id: 'az-nsg-001', name: 'prod-nsg-web', provider: 'Azure', service: 'NSG', region: 'eastus', tags: { env: 'prod' }, config: { openToInternet: true, anyInbound: true, ruleCount: 12 } },
  { id: 'az-nsg-002', name: 'prod-nsg-db', provider: 'Azure', service: 'NSG', region: 'eastus', tags: { env: 'prod' }, config: { openToInternet: false, anyInbound: false, ruleCount: 8 } },
  { id: 'az-sc-001', name: 'defender-plan', provider: 'Azure', service: 'Security Center', region: 'global', tags: { env: 'prod' }, config: { defenderEnabled: false, tier: 'Free', autoProvisioning: false } },
  { id: 'az-sc-002', name: 'defender-standard', provider: 'Azure', service: 'Security Center', region: 'global', tags: { env: 'prod' }, config: { defenderEnabled: true, tier: 'Standard', autoProvisioning: true } },
  { id: 'az-aad-001', name: 'jane.smith@contoso.com', provider: 'Azure', service: 'Azure AD', region: 'global', tags: { type: 'user' }, config: { mfaEnabled: false, mfaEnforced: false, userType: 'Member', signInRisk: 'Medium' } },
  { id: 'az-aad-002', name: 'bob.johnson@contoso.com', provider: 'Azure', service: 'Azure AD', region: 'global', tags: { type: 'user' }, config: { mfaEnabled: true, mfaEnforced: true, userType: 'Member', signInRisk: 'Low' } },
  { id: 'az-vm-001', name: 'web-vm-01', provider: 'Azure', service: 'Virtual Machines', region: 'eastus', tags: { env: 'prod', role: 'web' }, config: { hasPublicIp: true, osType: 'Linux', vmSize: 'Standard_D2s_v3', managedDisks: true } },
  { id: 'az-vm-002', name: 'app-vm-02', provider: 'Azure', service: 'Virtual Machines', region: 'eastus', tags: { env: 'prod', role: 'app' }, config: { hasPublicIp: false, osType: 'Windows', vmSize: 'Standard_D4s_v3', managedDisks: true } },
  { id: 'az-iam-001', name: 'jane.smith@contoso.com', provider: 'Azure', service: 'IAM', region: 'global', tags: { type: 'user' }, config: { role: 'Owner', justified: false, scope: '/subscriptions/s1' } },
  { id: 'az-iam-002', name: 'deploy-sp', provider: 'Azure', service: 'IAM', region: 'global', tags: { type: 'serviceprincipal' }, config: { role: 'Contributor', justified: true, scope: '/subscriptions/s1/rg1' } },
  { id: 'az-kv-001', name: 'vault-prod-keys', provider: 'Azure', service: 'Key Vault', region: 'eastus', tags: { env: 'prod' }, config: { softDelete: true, purgeProtection: true, capacityPercent: 92 } },

  // ===== GCP Resources =====
  { id: 'gcp-gcs-001', name: 'my-public-bucket-gcp', provider: 'GCP', service: 'Cloud Storage', region: 'us-central1', tags: { env: 'prod' }, config: { publicAccess: true, allUsersAccess: true, uniformAccess: false, versioning: false } },
  { id: 'gcp-gcs-002', name: 'secure-data-bucket', provider: 'GCP', service: 'Cloud Storage', region: 'us-east1', tags: { env: 'prod' }, config: { publicAccess: false, allUsersAccess: false, uniformAccess: true, versioning: true } },
  { id: 'gcp-iam-001', name: 'svc-infra-deployer', provider: 'GCP', service: 'IAM', region: 'global', tags: { type: 'serviceaccount' }, config: { role: 'Editor', primitiveRole: true, hasKey: true, broadPermissions: true, keyAgeDays: 365 } },
  { id: 'gcp-iam-002', name: 'svc-logging-writer', provider: 'GCP', service: 'IAM', region: 'global', tags: { type: 'serviceaccount' }, config: { role: 'roles/logging.logWriter', primitiveRole: false, hasKey: false, broadPermissions: false } },
  { id: 'gcp-iam-003', name: 'admin@example.com', provider: 'GCP', service: 'IAM', region: 'global', tags: { type: 'user' }, config: { role: 'Owner', primitiveRole: true, hasKey: false, broadPermissions: true } },
  { id: 'gcp-vpc-001', name: 'default-vpc', provider: 'GCP', service: 'VPC', region: 'us-central1', tags: { env: 'default' }, config: { openToInternet: true, firewallRules: 5, vpcFlowLogs: false } },
  { id: 'gcp-vpc-002', name: 'prod-vpc', provider: 'GCP', service: 'VPC', region: 'us-east1', tags: { env: 'prod' }, config: { openToInternet: false, firewallRules: 12, vpcFlowLogs: true } },
  { id: 'gcp-log-001', name: 'audit-log-config', provider: 'GCP', service: 'Logging', region: 'global', tags: { env: 'prod' }, config: { auditLogsEnabled: false, logExport: false, retentionDays: 0 } },
  { id: 'gcp-log-002', name: 'prod-log-sink', provider: 'GCP', service: 'Logging', region: 'global', tags: { env: 'prod' }, config: { auditLogsEnabled: true, logExport: true, retentionDays: 365 } },
  { id: 'gcp-ce-001', name: 'web-instance-01', provider: 'GCP', service: 'Compute Engine', region: 'us-central1', tags: { env: 'prod', role: 'web' }, config: { hasPublicIp: true, osType: 'ubuntu-pro', machineType: 'e2-standard-2', confidentialComputing: false } },
  { id: 'gcp-ce-002', name: 'db-instance-01', provider: 'GCP', service: 'Compute Engine', region: 'us-east1', tags: { env: 'prod', role: 'db' }, config: { hasPublicIp: false, osType: 'ubuntu-pro', machineType: 'e2-highmem-4', confidentialComputing: false } },
  { id: 'gcp-func-001', name: 'event-processor', provider: 'GCP', service: 'Cloud Functions', region: 'us-central1', tags: { env: 'prod' }, config: { ingress: 'AllowAll', vpcConnector: false, minInstances: 1 } },
];

export function getSampleResources(): CloudResource[] {
  return JSON.parse(JSON.stringify(sampleResources));
}
