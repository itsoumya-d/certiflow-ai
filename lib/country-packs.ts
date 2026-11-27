import fs from 'fs';
import path from 'path';

export interface CountryRule {
  id: string;
  name: string;
  jurisdiction: string;
  standard: string;
  what_it_decides: string;
  values: Record<string, any>;
  source_url: string;
  checked_on: string;
}

export interface ComplianceEvaluationResult {
  approved: boolean;
  ruleId?: string;
  reason?: string;
  source_url?: string;
}

const OFFICIAL_DOMAIN_PATTERN = /\.(gc\.ca|canada\.ca)$/i;

export function loadCountryPack(country: string = 'ca', customBaseDir?: string): CountryRule[] {
  const norm = (country || '').trim().toLowerCase();
  if (!norm) {
    throw new Error('Country code cannot be empty.');
  }

  const baseDir = customBaseDir || path.resolve(process.cwd(), 'packs');
  const packPath = path.join(baseDir, norm, 'rules.json');

  if (!fs.existsSync(packPath)) {
    throw new Error(`Country pack '${norm}' not found at path: ${packPath}`);
  }

  const raw = fs.readFileSync(packPath, 'utf-8');
  let rules: CountryRule[];
  try {
    rules = JSON.parse(raw);
  } catch (err: any) {
    throw new Error(`Failed to parse rules JSON for country '${norm}': ${err.message}`);
  }

  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error(`Country pack '${norm}' must contain a non-empty array of rules.`);
  }

  for (const rule of rules) {
    if (!rule.id || !rule.name || !rule.jurisdiction || !rule.source_url) {
      throw new Error(`Rule in country pack '${norm}' is missing required fields (id, name, jurisdiction, source_url).`);
    }
    if (!rule.source_url.startsWith('https://')) {
      throw new Error(`Rule '${rule.id}' source_url must use HTTPS: ${rule.source_url}`);
    }
    const hostname = new URL(rule.source_url).hostname;
    if (!OFFICIAL_DOMAIN_PATTERN.test(hostname)) {
      throw new Error(`Rule '${rule.id}' source_url hostname '${hostname}' must be an official Canadian government domain (*.gc.ca or *.canada.ca).`);
    }
  }

  return rules;
}

export function evaluateCompliancePolicy(
  action: string,
  payload: any,
  country: string = 'ca',
  options?: { packsDir?: string }
): ComplianceEvaluationResult {
  const rules = loadCountryPack(country, options?.packsDir);

  if (action === 'store_pii') {
    const pipedaRule = rules.find((r) => r.id === 'CA-PIPEDA-007');
    if (pipedaRule) {
      if (!payload.encrypted) {
        return {
          approved: false,
          ruleId: pipedaRule.id,
          reason: 'PIPEDA Principle 7 requires encryption at rest and in transit for sensitive customer personal information.',
          source_url: pipedaRule.source_url
        };
      }
    }
  }

  if (action === 'issue_invoice') {
    const craRule = rules.find((r) => r.id === 'CA-CRA-GST-001');
    if (craRule) {
      const amount = payload.amountCAD || 0;
      const threshold = craRule.values.threshold_amount || 150.0;
      if (amount >= threshold && (!payload.buyerName || payload.buyerName.trim() === '')) {
        return {
          approved: false,
          ruleId: craRule.id,
          reason: `CRA GST/HST Memorandum 15.1 requires the buyer's legal name on invoices equal to or exceeding CAD ${threshold.toFixed(2)}.`,
          source_url: craRule.source_url
        };
      }
    }
  }

  if (action === 'privileged_admin_session') {
    const cccsRule = rules.find((r) => r.id === 'CA-CCCS-MFA-002');
    if (cccsRule) {
      if (!payload.mfaVerified) {
        return {
          approved: false,
          ruleId: cccsRule.id,
          reason: 'CCCS ITSG-33 mandates multi-factor authentication (MFA) verification for privileged admin sessions.',
          source_url: cccsRule.source_url
        };
      }
    }
  }

  if (action === 'automated_scoring_decision') {
    const tbsRule = rules.find((r) => r.id === 'CA-TBS-ADM-001');
    if (tbsRule) {
      if (payload.impactLevel === 'high' && !payload.humanAuditorApproved) {
        return {
          approved: false,
          ruleId: tbsRule.id,
          reason: 'TBS Directive on Automated Decision-Making requires human-in-the-loop review for high-impact decisions.',
          source_url: tbsRule.source_url
        };
      }
    }
  }

  return { approved: true };
}
