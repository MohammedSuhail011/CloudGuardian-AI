import type { CloudResource, AnalysisResult, CloudProvider, Severity } from '../types/threatTester';

const MAX_CONTEXT_CHARS = 6000;

export function buildChatContext(
  resources: CloudResource[],
  analysis: AnalysisResult | null,
  datasetName: string | null,
): string {
  if (!resources.length && !analysis) return '';

  const parts: string[] = [];

  // --- Dataset overview ---
  if (datasetName) {
    parts.push(`Dataset: "${datasetName}" (${resources.length} cloud resources scanned)`);
  } else {
    parts.push(`Cloud resources loaded: ${resources.length}`);
  }

  if (analysis) {
    // --- Risk score ---
    parts.push(`Overall risk score: ${analysis.riskScore}/100 (Level: ${analysis.threatLevel})`);
    parts.push(`Compliant resources: ${analysis.compliantCount} | Non-compliant: ${analysis.nonCompliantCount}`);

    // --- Provider breakdown ---
    const pb = analysis.providerBreakdown;
    const providerLines: string[] = [];
    (['AWS', 'Azure', 'GCP'] as CloudProvider[]).forEach(p => {
      if (pb[p].resources > 0 || pb[p].threats > 0) {
        providerLines.push(`  ${p}: ${pb[p].resources} resources, ${pb[p].threats} threats`);
      }
    });
    if (providerLines.length) {
      parts.push('Provider breakdown:');
      parts.push(providerLines.join('\n'));
    }

    // --- Severity breakdown ---
    const findings = analysis.findings;
    if (findings.length > 0) {
      const sevCounts: Record<Severity, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      findings.forEach(f => { sevCounts[f.severity]++; });
      parts.push(
        `Threats by severity: ${sevCounts.Critical} Critical, ${sevCounts.High} High, ${sevCounts.Medium} Medium, ${sevCounts.Low} Low`,
      );

      // --- Top findings (up to 10 most severe) ---
      const sorted = [...findings].sort((a, b) => {
        const order: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.severity] - order[b.severity] || b.cvssScore - a.cvssScore;
      });

      const top = sorted.slice(0, 10);
      parts.push(`Top findings (${top.length} of ${findings.length}):`);
      top.forEach(f => {
        parts.push(`  - [${f.severity}] ${f.threat} on ${f.resourceName} (${f.provider}/${f.service}) — CVSS ${f.cvssScore}`);
      });

      // --- Service breakdown (top 5) ---
      const sb = analysis.serviceBreakdown;
      const svcEntries = Object.entries(sb)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);
      if (svcEntries.length) {
        parts.push('Most affected services:');
        svcEntries.forEach(([svc, counts]) => {
          parts.push(`  ${svc}: ${counts.total} threats (${counts.critical}C/${counts.high}H/${counts.medium}M/${counts.low}L)`);
        });
      }
    } else {
      parts.push('No threat findings detected.');
    }
  }

  // --- File summary: first 5 resources with key config ---
  if (resources.length > 0) {
    const sample = resources.slice(0, 5);
    parts.push(`Resource sample (first ${sample.length} of ${resources.length}):`);
    sample.forEach(r => {
      const cfgKeys = Object.keys(r.config).slice(0, 5);
      const cfgSnippet = cfgKeys.length
        ? cfgKeys.map(k => `${k}=${JSON.stringify(r.config[k])}`).join(', ')
        : 'no config';
      parts.push(`  - ${r.name} (${r.provider}/${r.service}/${r.region}) — {${cfgSnippet}}`);
    });
  }

  const result = parts.join('\n');
  if (result.length > MAX_CONTEXT_CHARS) {
    return result.slice(0, MAX_CONTEXT_CHARS) + '\n[...truncated]';
  }
  return result;
}
