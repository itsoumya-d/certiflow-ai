import fs from 'fs';
import path from 'path';

export interface CountryRule {
  id: string;
  name: string;
  jurisdiction: string;
  standard: string;
  what_it_decides: string;
  values: Record<string, unknown>;
  source_url: string;
  checked_on: string;
}

export interface ComplianceEvaluationResult {
  approved: boolean;
  ruleId?: string;
  reason?: string;
  source_url?: string;
}

const OFFICIAL_DOMAIN_PATTERNS: Record<string, { pattern: RegExp; description: string }> = {
  ca: {
    pattern: /\.(gc\.ca|canada\.ca)$/i,
    description: 'an official Canadian government domain (*.gc.ca or *.canada.ca)',
  },
  in: {
    pattern: /(^|\.)(gov\.in|nic\.in|rbi\.org\.in|cert-in\.org\.in)$/i,
    description: 'an official Indian government or statutory regulatory domain (*.gov.in, *.nic.in, *.cert-in.org.in, *.rbi.org.in)',
  },
};

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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse rules JSON for country '${norm}': ${msg}`);
  }

  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error(`Country pack '${norm}' must contain a non-empty array of rules.`);
  }

  const domainConfig = OFFICIAL_DOMAIN_PATTERNS[norm];
  if (!domainConfig) {
    throw new Error(`Country pack '${norm}' is not registered with an official domain verification pattern.`);
  }

  for (const rule of rules) {
    if (!rule.id || !rule.name || !rule.jurisdiction || !rule.source_url) {
      throw new Error(`Rule in country pack '${norm}' is missing required fields (id, name, jurisdiction, source_url).`);
    }
    if (!rule.source_url.startsWith('https://')) {
      throw new Error(`Rule '${rule.id}' source_url must use HTTPS: ${rule.source_url}`);
    }
    const hostname = new URL(rule.source_url).hostname;
    if (!domainConfig.pattern.test(hostname)) {
      throw new Error(`Rule '${rule.id}' source_url hostname '${hostname}' must be ${domainConfig.description}.`);
    }
  }

  return rules;
}

export function evaluateCompliancePolicy(
  action: string,
  payload: Record<string, unknown>,
  country: string = 'ca',
  options?: { packsDir?: string }
): ComplianceEvaluationResult {
  const norm = (country || '').trim().toLowerCase();
  const rules = loadCountryPack(norm, options?.packsDir);

  if (norm === 'ca') {
    if (action === 'store_pii') {
      const pipedaRule = rules.find((r) => r.id === 'CA-PIPEDA-007');
      if (pipedaRule) {
        if (!payload.encrypted) {
          return {
            approved: false,
            ruleId: pipedaRule.id,
            reason: 'PIPEDA Principle 7 requires encryption at rest and in transit for sensitive customer personal information.',
            source_url: pipedaRule.source_url,
          };
        }
      }
    }

    if (action === 'issue_invoice') {
      const craRule = rules.find((r) => r.id === 'CA-CRA-GST-001');
      if (craRule) {
        const amount = typeof payload.amountCAD === 'number' ? payload.amountCAD : 0;
        const threshold = typeof craRule.values.threshold_amount === 'number' ? craRule.values.threshold_amount : 150.0;
        const buyerName = typeof payload.buyerName === 'string' ? payload.buyerName.trim() : '';
        if (amount >= threshold && !buyerName) {
          return {
            approved: false,
            ruleId: craRule.id,
            reason: `CRA GST/HST Memorandum 15.1 requires the buyer's legal name on invoices equal to or exceeding CAD ${threshold.toFixed(2)}.`,
            source_url: craRule.source_url,
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
            source_url: cccsRule.source_url,
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
            source_url: tbsRule.source_url,
          };
        }
      }
    }
  }

  if (norm === 'in') {
    if (action === 'store_pii') {
      const dpdpRule = rules.find((r) => r.id === 'IN-DPDP-SEC8-PII');
      if (dpdpRule) {
        if (!payload.encrypted) {
          return {
            approved: false,
            ruleId: dpdpRule.id,
            reason: 'DPDP Act 2023 Section 8(5) requires reasonable security safeguards including encryption at rest and in transit.',
            source_url: dpdpRule.source_url,
          };
        }
      }
    }

    if (action === 'process_child_data') {
      const childRule = rules.find((r) => r.id === 'IN-DPDP-SEC9-CHILD');
      if (childRule) {
        const isChild = payload.isChild === true || (typeof payload.userAge === 'number' && payload.userAge < 18);
        if (isChild) {
          if (payload.tracking || payload.behavioralMonitoring || payload.targetedAdvertising) {
            return {
              approved: false,
              ruleId: childRule.id,
              reason: 'DPDP Act 2023 Section 9 strictly prohibits tracking, behavioral monitoring, or targeted advertising directed at children.',
              source_url: childRule.source_url,
            };
          }
          if (!payload.parentalConsent) {
            return {
              approved: false,
              ruleId: childRule.id,
              reason: 'DPDP Act 2023 Section 9 requires verifiable parental consent before processing child personal data.',
              source_url: childRule.source_url,
            };
          }
        }
      }
    }

    if (action === 'audit_log_retention') {
      const certRule = rules.find((r) => r.id === 'IN-CERTIN-DIR2022-LOGS');
      if (certRule) {
        const retentionDays = typeof payload.retentionDays === 'number' ? payload.retentionDays : 0;
        const minDays = typeof certRule.values.min_retention_days === 'number' ? certRule.values.min_retention_days : 180;
        if (retentionDays < minDays) {
          return {
            approved: false,
            ruleId: certRule.id,
            reason: `CERT-In Cyber Security Directions require system and audit logs to be retained for at least ${minDays} days.`,
            source_url: certRule.source_url,
          };
        }
      }
    }

    if (action === 'automated_scoring_decision') {
      const rbiRule = rules.find((r) => r.id === 'IN-RBI-ITGOV-2023-AI');
      if (rbiRule) {
        if (payload.impactLevel === 'high') {
          if (!payload.modelExplainabilityVerified) {
            return {
              approved: false,
              ruleId: rbiRule.id,
              reason: 'RBI Master Direction on IT Governance mandates model explainability and audit trail for automated scoring and decision systems.',
              source_url: rbiRule.source_url,
            };
          }
          if (!payload.humanAuditorApproved) {
            return {
              approved: false,
              ruleId: rbiRule.id,
              reason: 'RBI Master Direction on IT Governance requires human-in-the-loop oversight for high-risk automated decision systems.',
              source_url: rbiRule.source_url,
            };
          }
        }
      }
    }
  }

  return { approved: true };
}
