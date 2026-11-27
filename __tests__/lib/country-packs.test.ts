import path from 'path';
import { loadCountryPack, evaluateCompliancePolicy } from '@/lib/country-packs';

describe('Country Packs - Canada (CA)', () => {
  const packsDir = path.resolve(__dirname, '../../packs');

  test('loadCountryPack loads valid Canadian regulatory rules from packs/ca/rules.json', () => {
    const rules = loadCountryPack('ca', packsDir);
    expect(rules.length).toBeGreaterThanOrEqual(4);

    rules.forEach((rule) => {
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('name');
      expect(rule.jurisdiction).toBe('CA');
      expect(rule).toHaveProperty('standard');
      expect(rule).toHaveProperty('what_it_decides');
      expect(rule).toHaveProperty('values');
      expect(rule).toHaveProperty('source_url');
      expect(rule).toHaveProperty('checked_on');
      expect(rule.source_url).toMatch(/^https:\/\/[^/]+\.(gc\.ca|canada\.ca)/);
    });
  });

  test('evaluateCompliancePolicy enforces CRA GST/HST threshold (CAD 150)', () => {
    // Under 150 without buyer name -> approved
    const resUnder = evaluateCompliancePolicy('issue_invoice', { amountCAD: 149.99 }, 'ca', { packsDir });
    expect(resUnder.approved).toBe(true);

    // Over 150 without buyer name -> rejected
    const resOver = evaluateCompliancePolicy('issue_invoice', { amountCAD: 150.00, buyerName: '' }, 'ca', { packsDir });
    expect(resOver.approved).toBe(false);
    expect(resOver.ruleId).toBe('CA-CRA-GST-001');
    expect(resOver.reason).toContain('CAD 150.00');
    expect(resOver.source_url).toContain('canada.ca');

    // Over 150 with buyer name -> approved
    const resValid = evaluateCompliancePolicy('issue_invoice', { amountCAD: 500.00, buyerName: 'Wealthsimple Technologies Inc.' }, 'ca', { packsDir });
    expect(resValid.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces PIPEDA Principle 7 data encryption', () => {
    // Unencrypted PII -> rejected
    const unencrypted = evaluateCompliancePolicy('store_pii', { encrypted: false, userId: 'usr-123' }, 'ca', { packsDir });
    expect(unencrypted.approved).toBe(false);
    expect(unencrypted.ruleId).toBe('CA-PIPEDA-007');
    expect(unencrypted.source_url).toContain('priv.gc.ca');

    // Encrypted PII -> approved
    const encrypted = evaluateCompliancePolicy('store_pii', { encrypted: true, userId: 'usr-123' }, 'ca', { packsDir });
    expect(encrypted.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces CCCS ITSG-33 privileged access MFA', () => {
    // Unverified admin session -> rejected
    const unverified = evaluateCompliancePolicy('privileged_admin_session', { mfaVerified: false }, 'ca', { packsDir });
    expect(unverified.approved).toBe(false);
    expect(unverified.ruleId).toBe('CA-CCCS-MFA-002');
    expect(unverified.source_url).toContain('cyber.gc.ca');

    // MFA verified -> approved
    const verified = evaluateCompliancePolicy('privileged_admin_session', { mfaVerified: true }, 'ca', { packsDir });
    expect(verified.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces TBS Directive human oversight for high impact', () => {
    // High impact without human review -> rejected
    const unreviewed = evaluateCompliancePolicy('automated_scoring_decision', { impactLevel: 'high', humanAuditorApproved: false }, 'ca', { packsDir });
    expect(unreviewed.approved).toBe(false);
    expect(unreviewed.ruleId).toBe('CA-TBS-ADM-001');
    expect(unreviewed.source_url).toContain('tbs-sct.canada.ca');

    // High impact with human review -> approved
    const approved = evaluateCompliancePolicy('automated_scoring_decision', { impactLevel: 'high', humanAuditorApproved: true }, 'ca', { packsDir });
    expect(approved.approved).toBe(true);
  });

  test('loadCountryPack throws on unknown jurisdiction', () => {
    expect(() => loadCountryPack('xx', packsDir)).toThrow("Country pack 'xx' not found");
  });
});

describe('Country Packs - India (IN)', () => {
  const packsDir = path.resolve(__dirname, '../../packs');

  test('loadCountryPack loads valid Indian regulatory rules from packs/in/rules.json', () => {
    const rules = loadCountryPack('in', packsDir);
    expect(rules.length).toBeGreaterThanOrEqual(4);

    rules.forEach((rule) => {
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('name');
      expect(rule.jurisdiction).toBe('IN');
      expect(rule).toHaveProperty('standard');
      expect(rule).toHaveProperty('what_it_decides');
      expect(rule).toHaveProperty('values');
      expect(rule).toHaveProperty('source_url');
      expect(rule).toHaveProperty('checked_on');
      expect(rule.source_url).toMatch(/^https:\/\/[^/]+\.(gov\.in|nic\.in|rbi\.org\.in|cert-in\.org\.in)/);
    });
  });

  test('evaluateCompliancePolicy enforces DPDP Act 2023 Sec 8 PII encryption', () => {
    // Unencrypted PII -> rejected
    const unencrypted = evaluateCompliancePolicy('store_pii', { encrypted: false, userId: 'usr-in-1' }, 'in', { packsDir });
    expect(unencrypted.approved).toBe(false);
    expect(unencrypted.ruleId).toBe('IN-DPDP-SEC8-PII');
    expect(unencrypted.reason).toContain('DPDP Act 2023 Section 8(5)');
    expect(unencrypted.source_url).toContain('meity.gov.in');

    // Encrypted PII -> approved
    const encrypted = evaluateCompliancePolicy('store_pii', { encrypted: true, userId: 'usr-in-1' }, 'in', { packsDir });
    expect(encrypted.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces DPDP Act 2023 Sec 9 child data protection', () => {
    // Behavioral tracking of children -> rejected
    const trackingChild = evaluateCompliancePolicy(
      'process_child_data',
      { isChild: true, tracking: true, parentalConsent: true },
      'in',
      { packsDir }
    );
    expect(trackingChild.approved).toBe(false);
    expect(trackingChild.ruleId).toBe('IN-DPDP-SEC9-CHILD');
    expect(trackingChild.reason).toContain('tracking');

    // Child data without parental consent -> rejected
    const unconsented = evaluateCompliancePolicy(
      'process_child_data',
      { userAge: 14, tracking: false, parentalConsent: false },
      'in',
      { packsDir }
    );
    expect(unconsented.approved).toBe(false);
    expect(unconsented.ruleId).toBe('IN-DPDP-SEC9-CHILD');
    expect(unconsented.reason).toContain('parental consent');

    // Child data with consent and no tracking -> approved
    const consented = evaluateCompliancePolicy(
      'process_child_data',
      { userAge: 14, tracking: false, parentalConsent: true },
      'in',
      { packsDir }
    );
    expect(consented.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces CERT-In Directions 2022 180-day log retention', () => {
    // 90 days retention -> rejected
    const shortLog = evaluateCompliancePolicy('audit_log_retention', { retentionDays: 90 }, 'in', { packsDir });
    expect(shortLog.approved).toBe(false);
    expect(shortLog.ruleId).toBe('IN-CERTIN-DIR2022-LOGS');
    expect(shortLog.reason).toContain('180 days');
    expect(shortLog.source_url).toContain('cert-in.org.in');

    // 180 days retention -> approved
    const validLog = evaluateCompliancePolicy('audit_log_retention', { retentionDays: 180 }, 'in', { packsDir });
    expect(validLog.approved).toBe(true);
  });

  test('evaluateCompliancePolicy enforces RBI IT Governance 2023 explainability and human oversight', () => {
    // High impact without explainability -> rejected
    const noExplain = evaluateCompliancePolicy(
      'automated_scoring_decision',
      { impactLevel: 'high', modelExplainabilityVerified: false, humanAuditorApproved: true },
      'in',
      { packsDir }
    );
    expect(noExplain.approved).toBe(false);
    expect(noExplain.ruleId).toBe('IN-RBI-ITGOV-2023-AI');
    expect(noExplain.reason).toContain('model explainability');
    expect(noExplain.source_url).toContain('rbi.org.in');

    // High impact without human auditor approval -> rejected
    const noHuman = evaluateCompliancePolicy(
      'automated_scoring_decision',
      { impactLevel: 'high', modelExplainabilityVerified: true, humanAuditorApproved: false },
      'in',
      { packsDir }
    );
    expect(noHuman.approved).toBe(false);
    expect(noHuman.ruleId).toBe('IN-RBI-ITGOV-2023-AI');
    expect(noHuman.reason).toContain('human-in-the-loop');

    // High impact with both explainability and human approval -> approved
    const validDecision = evaluateCompliancePolicy(
      'automated_scoring_decision',
      { impactLevel: 'high', modelExplainabilityVerified: true, humanAuditorApproved: true },
      'in',
      { packsDir }
    );
    expect(validDecision.approved).toBe(true);
  });
});
