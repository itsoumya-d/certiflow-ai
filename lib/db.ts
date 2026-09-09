// In-memory compliance data store.
//
// This module is the single source of truth for the demo data exposed through
// the /api/health and /api/export endpoints. It is intentionally dependency-free
// (no database, no Prisma) so the app can build and run anywhere. Data is
// deterministic, which keeps exports and tests stable across runs.

export type ControlStatus = "passing" | "failing" | "pending";
export type EvidenceStatus = "verified" | "pending" | "analyzing" | "failed";
export type EvidenceCollector = "ai-agent" | "manual";
export type EvidenceType = "document" | "screenshot" | "configuration" | "log";
export type FrameworkStatus = "active" | "in-progress" | "not-started";

export interface ComplianceFramework {
    id: string;
    name: string;
    description: string;
    version: string;
    status: FrameworkStatus;
    color: string;
    lastAudit: string | null;
    nextAudit: string | null;
}

export interface ComplianceControl {
    controlId: string;
    frameworkId: string;
    name: string;
    description: string;
    category: string;
    status: ControlStatus;
    lastVerified: string | null;
    evidenceIds: string[];
}

export interface ComplianceEvidence {
    id: string;
    name: string;
    description: string;
    framework: string;
    controlId: string;
    type: EvidenceType;
    status: EvidenceStatus;
    collectedBy: EvidenceCollector;
    uploadedAt: string;
    verifiedAt: string | null;
}

export interface ComplianceOrganization {
    id: string;
    name: string;
    industry: string;
    employeeCount: number;
    primaryContact: string;
    createdAt: string;
}

export interface AuditLogEntry {
    id: string;
    action: string;
    actor: string;
    target: string;
    framework: string;
    timestamp: string;
}

export interface ComplianceStats {
    score: number;
    total: number;
    passing: number;
    failing: number;
    pending: number;
}

const frameworks: ComplianceFramework[] = [
    {
        id: "soc2",
        name: "SOC 2 Type II",
        description: "Service Organization Control 2 - Trust Services Criteria",
        version: "2017",
        status: "active",
        color: "#10b981",
        lastAudit: "2024-09-15",
        nextAudit: "2025-03-15",
    },
    {
        id: "iso27001",
        name: "ISO 27001:2022",
        description: "Information Security Management System",
        version: "2022",
        status: "active",
        color: "#3b82f6",
        lastAudit: "2024-06-20",
        nextAudit: "2025-06-20",
    },
    {
        id: "hipaa",
        name: "HIPAA",
        description: "Health Insurance Portability and Accountability Act",
        version: "2013",
        status: "in-progress",
        color: "#8b5cf6",
        lastAudit: null,
        nextAudit: "2025-04-01",
    },
    {
        id: "gdpr",
        name: "GDPR",
        description: "General Data Protection Regulation",
        version: "2018",
        status: "active",
        color: "#ec4899",
        lastAudit: "2024-11-01",
        nextAudit: "2025-11-01",
    },
    {
        id: "pci-dss",
        name: "PCI-DSS v4.0",
        description: "Payment Card Industry Data Security Standard",
        version: "4.0",
        status: "not-started",
        color: "#f59e0b",
        lastAudit: null,
        nextAudit: null,
    },
    {
        id: "nist",
        name: "NIST 800-53",
        description: "Security and Privacy Controls for Federal Systems",
        version: "Rev. 5",
        status: "not-started",
        color: "#06b6d4",
        lastAudit: null,
        nextAudit: null,
    },
];

const controls: ComplianceControl[] = [
    // SOC 2
    { controlId: "CC6.1", frameworkId: "soc2", name: "Logical Access Security", description: "Entity implements logical access security software", category: "Common Criteria (CC)", status: "passing", lastVerified: "2024-12-22T10:30:00Z", evidenceIds: ["ev-001", "ev-002"] },
    { controlId: "CC6.2", frameworkId: "soc2", name: "Authentication Mechanisms", description: "Authentication mechanisms are in place", category: "Common Criteria (CC)", status: "passing", lastVerified: "2024-12-22T09:15:00Z", evidenceIds: ["ev-003"] },
    { controlId: "CC6.3", frameworkId: "soc2", name: "Access Authorization", description: "Authorization to access data is granted", category: "Common Criteria (CC)", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "CC6.7", frameworkId: "soc2", name: "Data Transmission Security", description: "Transmission of data is protected", category: "Common Criteria (CC)", status: "passing", lastVerified: "2024-12-21T14:00:00Z", evidenceIds: ["ev-004"] },
    { controlId: "CC6.8", frameworkId: "soc2", name: "Malicious Software Prevention", description: "Measures to prevent malicious software", category: "Common Criteria (CC)", status: "passing", lastVerified: "2024-12-22T11:00:00Z", evidenceIds: [] },
    { controlId: "CC7.3", frameworkId: "soc2", name: "Incident Response", description: "Security incidents are detected and responded to", category: "Operations (CC7)", status: "passing", lastVerified: "2024-12-20T12:00:00Z", evidenceIds: ["ev-005"] },
    { controlId: "CC8.1", frameworkId: "soc2", name: "Change Management Process", description: "Changes are authorized, tested, and approved", category: "Change Management (CC8)", status: "passing", lastVerified: "2024-12-22T08:00:00Z", evidenceIds: ["ev-006"] },
    { controlId: "CC4.1", frameworkId: "soc2", name: "Monitoring Activities", description: "Continuous monitoring of security controls", category: "Monitoring (CC4)", status: "failing", lastVerified: "2024-12-20T16:00:00Z", evidenceIds: ["ev-007"] },
    { controlId: "CC4.2", frameworkId: "soc2", name: "Internal Control Evaluation", description: "Evaluation of internal controls", category: "Monitoring (CC4)", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "CC3.1", frameworkId: "soc2", name: "Risk Assessment", description: "Entity identifies and assesses risks", category: "Risk Assessment (CC3)", status: "passing", lastVerified: "2024-12-19T10:00:00Z", evidenceIds: ["ev-008"] },
    { controlId: "CC3.2", frameworkId: "soc2", name: "Risk Mitigation", description: "Risk mitigation strategies are implemented", category: "Risk Assessment (CC3)", status: "passing", lastVerified: "2024-12-19T11:30:00Z", evidenceIds: [] },

    // ISO 27001
    { controlId: "A.9.1.1", frameworkId: "iso27001", name: "Access Control Policy", description: "Access control policy established and reviewed", category: "Access Control (A.9)", status: "passing", lastVerified: "2024-12-22T09:00:00Z", evidenceIds: ["ev-009"] },
    { controlId: "A.9.2.1", frameworkId: "iso27001", name: "User Registration", description: "Formal user registration and de-registration", category: "Access Control (A.9)", status: "passing", lastVerified: "2024-12-21T15:00:00Z", evidenceIds: [] },
    { controlId: "A.9.4.1", frameworkId: "iso27001", name: "Information Access Restriction", description: "Access to information restricted", category: "Access Control (A.9)", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "A.10.1.1", frameworkId: "iso27001", name: "Cryptographic Controls", description: "Policy on use of cryptographic controls", category: "Cryptography (A.10)", status: "passing", lastVerified: "2024-12-20T10:00:00Z", evidenceIds: ["ev-010"] },
    { controlId: "A.10.1.2", frameworkId: "iso27001", name: "Key Management", description: "Cryptographic key management", category: "Cryptography (A.10)", status: "failing", lastVerified: "2024-12-18T14:00:00Z", evidenceIds: [] },
    { controlId: "A.16.1.1", frameworkId: "iso27001", name: "Incident Management", description: "Responsibilities and procedures for incident management", category: "Incident Management (A.16)", status: "passing", lastVerified: "2024-12-17T09:00:00Z", evidenceIds: [] },

    // HIPAA
    { controlId: "164.308(a)(1)", frameworkId: "hipaa", name: "Security Management Process", description: "Risk analysis and risk management", category: "Administrative Safeguards", status: "passing", lastVerified: "2024-12-15T10:00:00Z", evidenceIds: [] },
    { controlId: "164.308(a)(3)", frameworkId: "hipaa", name: "Workforce Security", description: "Authorization and supervision of workforce", category: "Administrative Safeguards", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "164.312(a)(1)", frameworkId: "hipaa", name: "Access Control", description: "Technical policies for ePHI access", category: "Technical Safeguards", status: "passing", lastVerified: "2024-12-16T13:00:00Z", evidenceIds: [] },
    { controlId: "164.312(e)(1)", frameworkId: "hipaa", name: "Transmission Security", description: "Guard against unauthorized ePHI access during transmission", category: "Technical Safeguards", status: "failing", lastVerified: "2024-12-14T11:00:00Z", evidenceIds: [] },
    { controlId: "164.316(b)(1)", frameworkId: "hipaa", name: "Documentation", description: "Maintain written security policies", category: "Administrative Safeguards", status: "pending", lastVerified: null, evidenceIds: [] },

    // GDPR
    { controlId: "Art.5", frameworkId: "gdpr", name: "Principles of Processing", description: "Lawfulness, fairness and transparency", category: "Principles", status: "passing", lastVerified: "2024-12-10T10:00:00Z", evidenceIds: [] },
    { controlId: "Art.15", frameworkId: "gdpr", name: "Right of Access", description: "Data subject access requests are fulfilled", category: "Data Subject Rights", status: "passing", lastVerified: "2024-12-11T10:00:00Z", evidenceIds: [] },
    { controlId: "Art.30", frameworkId: "gdpr", name: "Records of Processing", description: "Maintain records of processing activities", category: "Accountability", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "Art.32", frameworkId: "gdpr", name: "Security of Processing", description: "Technical and organizational security measures", category: "Security", status: "passing", lastVerified: "2024-12-12T10:00:00Z", evidenceIds: [] },

    // PCI-DSS (not started)
    { controlId: "Req.1", frameworkId: "pci-dss", name: "Network Security Controls", description: "Install and maintain network security controls", category: "Network Security", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "Req.3", frameworkId: "pci-dss", name: "Protect Stored Account Data", description: "Protect stored account data", category: "Data Protection", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "Req.8", frameworkId: "pci-dss", name: "Identify Users and Authenticate", description: "Identify users and authenticate access", category: "Identity", status: "pending", lastVerified: null, evidenceIds: [] },

    // NIST (not started)
    { controlId: "AC-2", frameworkId: "nist", name: "Account Management", description: "Manage information system accounts", category: "Access Control", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "AU-2", frameworkId: "nist", name: "Event Logging", description: "Identify events that need logging", category: "Audit and Accountability", status: "pending", lastVerified: null, evidenceIds: [] },
    { controlId: "SC-8", frameworkId: "nist", name: "Transmission Confidentiality", description: "Protect the confidentiality of transmitted information", category: "System and Communications Protection", status: "pending", lastVerified: null, evidenceIds: [] },
];

const evidence: ComplianceEvidence[] = [
    { id: "ev-001", name: "IAM Access Review Q4", description: "Quarterly access review export", framework: "SOC 2", controlId: "CC6.1", type: "document", status: "verified", collectedBy: "ai-agent", uploadedAt: "2024-12-22T10:25:00Z", verifiedAt: "2024-12-22T10:30:00Z" },
    { id: "ev-002", name: "MFA Enforcement Screenshot", description: "MFA configuration in identity provider", framework: "SOC 2", controlId: "CC6.1", type: "screenshot", status: "verified", collectedBy: "ai-agent", uploadedAt: "2024-12-22T10:20:00Z", verifiedAt: "2024-12-22T10:30:00Z" },
    { id: "ev-003", name: "Authentication Policy", description: "Approved authentication policy document", framework: "SOC 2", controlId: "CC6.2", type: "document", status: "verified", collectedBy: "manual", uploadedAt: "2024-12-22T09:10:00Z", verifiedAt: "2024-12-22T09:15:00Z" },
    { id: "ev-004", name: "TLS Configuration Export", description: "TLS termination configuration", framework: "SOC 2", controlId: "CC6.7", type: "configuration", status: "verified", collectedBy: "ai-agent", uploadedAt: "2024-12-21T13:55:00Z", verifiedAt: "2024-12-21T14:00:00Z" },
    { id: "ev-005", name: "Incident Response Runbook", description: "IR runbook and last tabletop notes", framework: "SOC 2", controlId: "CC7.3", type: "document", status: "verified", collectedBy: "manual", uploadedAt: "2024-12-20T11:55:00Z", verifiedAt: "2024-12-20T12:00:00Z" },
    { id: "ev-006", name: "Change Approval Ticket", description: "Sample change approval record", framework: "SOC 2", controlId: "CC8.1", type: "document", status: "verified", collectedBy: "ai-agent", uploadedAt: "2024-12-22T07:55:00Z", verifiedAt: "2024-12-22T08:00:00Z" },
    { id: "ev-007", name: "CloudTrail Monitoring Alert", description: "Alert configuration screenshot", framework: "SOC 2", controlId: "CC4.1", type: "screenshot", status: "pending", collectedBy: "manual", uploadedAt: "2024-12-20T15:55:00Z", verifiedAt: null },
    { id: "ev-008", name: "Risk Register", description: "Annual risk assessment register", framework: "SOC 2", controlId: "CC3.1", type: "document", status: "verified", collectedBy: "manual", uploadedAt: "2024-12-19T09:55:00Z", verifiedAt: "2024-12-19T10:00:00Z" },
    { id: "ev-009", name: "Access Control Policy ISO", description: "ISO access control policy", framework: "ISO 27001", controlId: "A.9.1.1", type: "document", status: "verified", collectedBy: "manual", uploadedAt: "2024-12-22T08:55:00Z", verifiedAt: "2024-12-22T09:00:00Z" },
    { id: "ev-010", name: "Key Management Procedure", description: "Cryptographic key management procedure", framework: "ISO 27001", controlId: "A.10.1.1", type: "document", status: "analyzing", collectedBy: "ai-agent", uploadedAt: "2024-12-20T09:55:00Z", verifiedAt: null },
];

const organizations: ComplianceOrganization[] = [
    {
        id: "org-1",
        name: "Demo Company",
        industry: "B2B SaaS",
        employeeCount: 42,
        primaryContact: "security@certiflow.ai",
        createdAt: "2024-01-01T00:00:00Z",
    },
];

const auditLogs: AuditLogEntry[] = [
    { id: "log-001", action: "evidence.verified", actor: "ai-agent", target: "ev-001", framework: "SOC 2", timestamp: "2024-12-22T10:30:00Z" },
    { id: "log-002", action: "evidence.uploaded", actor: "soumya@certiflow.ai", target: "ev-008", framework: "SOC 2", timestamp: "2024-12-19T09:55:00Z" },
    { id: "log-003", action: "control.verified", actor: "ai-agent", target: "CC6.7", framework: "SOC 2", timestamp: "2024-12-21T14:00:00Z" },
    { id: "log-004", action: "evidence.uploaded", actor: "demo@certiflow.ai", target: "ev-010", framework: "ISO 27001", timestamp: "2024-12-20T09:55:00Z" },
    { id: "log-005", action: "control.failed", actor: "ai-agent", target: "CC4.1", framework: "SOC 2", timestamp: "2024-12-20T16:00:00Z" },
    { id: "log-006", action: "report.exported", actor: "auditor@certiflow.ai", target: "soc2", framework: "SOC 2", timestamp: "2024-12-18T12:00:00Z" },
    { id: "log-007", action: "evidence.uploaded", actor: "demo@certiflow.ai", target: "ev-009", framework: "ISO 27001", timestamp: "2024-12-22T08:55:00Z" },
    { id: "log-008", action: "control.verified", actor: "ai-agent", target: "A.9.2.1", framework: "ISO 27001", timestamp: "2024-12-21T15:00:00Z" },
];

export function getFrameworks(): ComplianceFramework[] {
    return frameworks;
}

export function getControlsByFramework(frameworkId: string): ComplianceControl[] {
    return controls.filter((control) => control.frameworkId === frameworkId);
}

export function getEvidence(): ComplianceEvidence[] {
    return evidence;
}

export function getOrganization(id: string): ComplianceOrganization | null {
    return organizations.find((organization) => organization.id === id) ?? null;
}

export function getAuditLogs(limit = 50): AuditLogEntry[] {
    return auditLogs.slice(0, limit);
}

export function getComplianceStats(): ComplianceStats {
    const total = controls.length;
    const passing = controls.filter((control) => control.status === "passing").length;
    const failing = controls.filter((control) => control.status === "failing").length;
    const pending = controls.filter((control) => control.status === "pending").length;

    return {
        score: total > 0 ? Math.round((passing / total) * 100) : 0,
        total,
        passing,
        failing,
        pending,
    };
}

export const db = {
    getFrameworks,
    getControlsByFramework,
    getEvidence,
    getOrganization,
    getAuditLogs,
    getComplianceStats,
};
