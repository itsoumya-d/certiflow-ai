"use client";

import Sidebar from "@/components/Sidebar";
import { useParams } from "next/navigation";
import {
    Shield,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    ChevronRight,
    Play,
    Download,
    RefreshCw,
    Eye,
    FileCheck,
    Calendar,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Framework data
const frameworksData: Record<
    string,
    {
        name: string;
        description: string;
        version: string;
        auditDate: string;
        auditor: string;
        categories: Array<{
            name: string;
            controls: Array<{
                id: string;
                name: string;
                description: string;
                status: "passing" | "failing" | "pending";
                lastVerified: string | null;
                evidenceCount: number;
            }>;
        }>;
    }
> = {
    "soc-2": {
        name: "SOC 2 Type II",
        description: "Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, and Privacy",
        version: "2017",
        auditDate: "2025-03-15",
        auditor: "Deloitte",
        categories: [
            {
                name: "Common Criteria (CC)",
                controls: [
                    { id: "CC6.1", name: "Logical Access Security", description: "Entity implements logical access security software", status: "passing", lastVerified: "2024-12-22T10:30:00Z", evidenceCount: 5 },
                    { id: "CC6.2", name: "Authentication Mechanisms", description: "Authentication mechanisms are in place", status: "passing", lastVerified: "2024-12-22T09:15:00Z", evidenceCount: 3 },
                    { id: "CC6.3", name: "Access Authorization", description: "Authorization to access data is granted", status: "pending", lastVerified: null, evidenceCount: 0 },
                    { id: "CC6.7", name: "Data Transmission Security", description: "Transmission of data is protected", status: "passing", lastVerified: "2024-12-21T14:00:00Z", evidenceCount: 4 },
                    { id: "CC6.8", name: "Malicious Software Prevention", description: "Measures to prevent malicious software", status: "passing", lastVerified: "2024-12-22T11:00:00Z", evidenceCount: 2 },
                ],
            },
            {
                name: "Change Management (CC8)",
                controls: [
                    { id: "CC8.1", name: "Change Management Process", description: "Changes are authorized, tested, and approved", status: "passing", lastVerified: "2024-12-22T08:00:00Z", evidenceCount: 6 },
                ],
            },
            {
                name: "Monitoring (CC4)",
                controls: [
                    { id: "CC4.1", name: "Monitoring Activities", description: "Continuous monitoring of security controls", status: "failing", lastVerified: "2024-12-20T16:00:00Z", evidenceCount: 1 },
                    { id: "CC4.2", name: "Internal Control Evaluation", description: "Evaluation of internal controls", status: "pending", lastVerified: null, evidenceCount: 0 },
                ],
            },
            {
                name: "Risk Assessment (CC3)",
                controls: [
                    { id: "CC3.1", name: "Risk Assessment", description: "Entity identifies and assesses risks", status: "passing", lastVerified: "2024-12-19T10:00:00Z", evidenceCount: 3 },
                    { id: "CC3.2", name: "Risk Mitigation", description: "Risk mitigation strategies are implemented", status: "passing", lastVerified: "2024-12-19T11:30:00Z", evidenceCount: 4 },
                ],
            },
        ],
    },
    "iso-27001": {
        name: "ISO 27001:2022",
        description: "Information Security Management System - international security standard",
        version: "2022",
        auditDate: "2025-06-20",
        auditor: "BSI",
        categories: [
            {
                name: "Access Control (A.9)",
                controls: [
                    { id: "A.9.1.1", name: "Access Control Policy", description: "Access control policy established and reviewed", status: "passing", lastVerified: "2024-12-22T09:00:00Z", evidenceCount: 3 },
                    { id: "A.9.2.1", name: "User Registration", description: "Formal user registration and de-registration", status: "passing", lastVerified: "2024-12-21T15:00:00Z", evidenceCount: 4 },
                    { id: "A.9.4.1", name: "Information Access Restriction", description: "Access to information restricted", status: "pending", lastVerified: null, evidenceCount: 0 },
                ],
            },
            {
                name: "Cryptography (A.10)",
                controls: [
                    { id: "A.10.1.1", name: "Cryptographic Controls", description: "Policy on use of cryptographic controls", status: "passing", lastVerified: "2024-12-20T10:00:00Z", evidenceCount: 2 },
                    { id: "A.10.1.2", name: "Key Management", description: "Cryptographic key management", status: "failing", lastVerified: "2024-12-18T14:00:00Z", evidenceCount: 1 },
                ],
            },
        ],
    },
};

export default function FrameworkDetailPage() {
    const params = useParams();
    const frameworkId = params.id as string;
    const framework = frameworksData[frameworkId] || frameworksData["soc-2"];

    const [verifyingControl, setVerifyingControl] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(
        framework.categories[0]?.name || null
    );

    const allControls = framework.categories.flatMap((c) => c.controls);
    const passingCount = allControls.filter((c) => c.status === "passing").length;
    const failingCount = allControls.filter((c) => c.status === "failing").length;
    const pendingCount = allControls.filter((c) => c.status === "pending").length;
    const complianceScore = Math.round((passingCount / allControls.length) * 100);

    const handleVerify = async (controlId: string) => {
        setVerifyingControl(controlId);
        // Simulate verification
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setVerifyingControl(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "passing":
                return <CheckCircle2 size={16} color="var(--color-success)" />;
            case "failing":
                return <XCircle size={16} color="var(--color-error)" />;
            case "pending":
                return <Clock size={16} color="var(--color-warning)" />;
            default:
                return <AlertTriangle size={16} color="var(--color-neutral-400)" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "passing":
                return <span className="badge badge-success">Passing</span>;
            case "failing":
                return <span className="badge badge-error">Failing</span>;
            case "pending":
                return <span className="badge badge-warning">Pending</span>;
            default:
                return <span className="badge">Unknown</span>;
        }
    };

    return (
        <>
            <Sidebar />
            <main className="main-content">
                {/* Breadcrumb */}
                <Link
                    href="/frameworks"
                    className="flex items-center gap-2"
                    style={{
                        color: "var(--color-neutral-400)",
                        textDecoration: "none",
                        marginBottom: "var(--space-4)",
                        fontSize: "var(--text-sm)",
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Frameworks
                </Link>

                {/* Header */}
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "rgba(16, 185, 129, 0.15)",
                                    borderRadius: "var(--radius-xl)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Shield size={28} color="var(--color-primary-400)" />
                            </div>
                            <div>
                                <h1 className="page-title">{framework.name}</h1>
                                <p className="page-subtitle">{framework.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={`/api/export?format=csv&framework=${frameworkId}`}
                                className="btn btn-secondary"
                            >
                                <Download size={16} />
                                Export CSV
                            </a>
                            <button className="btn btn-primary">
                                <RefreshCw size={16} />
                                Verify All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="stats-grid stagger"
                    style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                >
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Compliance Score</span>
                            <Shield size={20} color="var(--color-primary-400)" />
                        </div>
                        <div className="stat-value" style={{ color: complianceScore >= 80 ? "var(--color-success)" : complianceScore >= 60 ? "var(--color-warning)" : "var(--color-error)" }}>
                            {complianceScore}%
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Passing</span>
                            <CheckCircle2 size={20} color="var(--color-success)" />
                        </div>
                        <div className="stat-value" style={{ color: "var(--color-success)" }}>
                            {passingCount}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Failing</span>
                            <XCircle size={20} color="var(--color-error)" />
                        </div>
                        <div className="stat-value" style={{ color: "var(--color-error)" }}>
                            {failingCount}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Pending</span>
                            <Clock size={20} color="var(--color-warning)" />
                        </div>
                        <div className="stat-value" style={{ color: "var(--color-warning)" }}>
                            {pendingCount}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Next Audit</span>
                            <Calendar size={20} color="var(--color-info)" />
                        </div>
                        <div className="stat-value" style={{ fontSize: "var(--text-lg)" }}>
                            {new Date(framework.auditDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                    </div>
                </div>

                {/* Controls by Category */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Controls by Category</h3>
                        <span className="badge">{allControls.length} Controls</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {framework.categories.map((category) => {
                            const isExpanded = expandedCategory === category.name;
                            const catPassing = category.controls.filter((c) => c.status === "passing").length;

                            return (
                                <div
                                    key={category.name}
                                    style={{
                                        border: "1px solid var(--glass-border)",
                                        borderRadius: "var(--radius-lg)",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "var(--space-4)",
                                            background: "rgba(255, 255, 255, 0.02)",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "inherit",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronRight
                                                size={18}
                                                style={{
                                                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                                    transition: "transform var(--transition-fast)",
                                                }}
                                            />
                                            <span style={{ fontWeight: "var(--font-medium)" }}>
                                                {category.name}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--color-neutral-400)",
                                                }}
                                            >
                                                ({category.controls.length} controls)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                style={{
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--color-success)",
                                                }}
                                            >
                                                {catPassing}/{category.controls.length} passing
                                            </span>
                                        </div>
                                    </button>

                                    {/* Controls List */}
                                    {isExpanded && (
                                        <div style={{ borderTop: "1px solid var(--glass-border)" }}>
                                            {category.controls.map((control) => (
                                                <div
                                                    key={control.id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        padding: "var(--space-4) var(--space-6)",
                                                        borderBottom: "1px solid var(--glass-border)",
                                                    }}
                                                >
                                                    <div className="flex items-center gap-4" style={{ flex: 1 }}>
                                                        {getStatusIcon(control.status)}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    style={{
                                                                        fontWeight: "var(--font-medium)",
                                                                        fontSize: "var(--text-sm)",
                                                                    }}
                                                                >
                                                                    {control.id}
                                                                </span>
                                                                <span style={{ fontSize: "var(--text-sm)" }}>
                                                                    {control.name}
                                                                </span>
                                                            </div>
                                                            <p
                                                                style={{
                                                                    fontSize: "var(--text-xs)",
                                                                    color: "var(--color-neutral-400)",
                                                                    marginTop: 2,
                                                                }}
                                                            >
                                                                {control.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        {control.lastVerified && (
                                                            <span
                                                                style={{
                                                                    fontSize: "var(--text-xs)",
                                                                    color: "var(--color-neutral-500)",
                                                                }}
                                                            >
                                                                Verified{" "}
                                                                {new Date(control.lastVerified).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                        {control.evidenceCount > 0 && (
                                                            <span
                                                                className="flex items-center gap-1"
                                                                style={{
                                                                    fontSize: "var(--text-xs)",
                                                                    color: "var(--color-neutral-400)",
                                                                }}
                                                            >
                                                                <FileCheck size={12} />
                                                                {control.evidenceCount}
                                                            </span>
                                                        )}
                                                        {getStatusBadge(control.status)}
                                                        <button
                                                            onClick={() => handleVerify(control.id)}
                                                            disabled={verifyingControl === control.id}
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ minWidth: 80 }}
                                                        >
                                                            {verifyingControl === control.id ? (
                                                                <>
                                                                    <RefreshCw
                                                                        size={14}
                                                                        style={{ animation: "spin 1s linear infinite" }}
                                                                    />
                                                                    Verifying
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play size={14} />
                                                                    Verify
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--space-6)",
                        marginTop: "var(--space-6)",
                    }}
                >
                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "var(--space-6)",
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                background: "rgba(16, 185, 129, 0.1)",
                                borderRadius: "var(--radius-lg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto var(--space-4)",
                            }}
                        >
                            <Zap size={24} color="var(--color-primary-400)" />
                        </div>
                        <h4 style={{ marginBottom: "var(--space-2)" }}>Run All Verifications</h4>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)" }}>
                            Launch AI agents to verify all controls
                        </p>
                    </div>

                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "var(--space-6)",
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                background: "rgba(59, 130, 246, 0.1)",
                                borderRadius: "var(--radius-lg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto var(--space-4)",
                            }}
                        >
                            <Eye size={24} color="var(--color-info)" />
                        </div>
                        <h4 style={{ marginBottom: "var(--space-2)" }}>View Evidence Trail</h4>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)" }}>
                            Browse all collected evidence
                        </p>
                    </div>

                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "var(--space-6)",
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                background: "rgba(139, 92, 246, 0.1)",
                                borderRadius: "var(--radius-lg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto var(--space-4)",
                            }}
                        >
                            <Download size={24} color="#8b5cf6" />
                        </div>
                        <h4 style={{ marginBottom: "var(--space-2)" }}>Generate Report</h4>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)" }}>
                            Export audit-ready documentation
                        </p>
                    </div>
                </div>

                <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
            </main>
        </>
    );
}
