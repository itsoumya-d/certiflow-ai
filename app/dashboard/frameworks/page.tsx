"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
    Shield,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

const frameworks = [
    {
        id: "soc2",
        name: "SOC 2 Type II",
        description: "Service Organization Control 2 - Trust Services Criteria",
        totalControls: 116,
        passingControls: 103,
        failingControls: 6,
        pendingControls: 7,
        lastAudit: "2024-09-15",
        nextAudit: "2025-03-15",
        status: "active",
        color: "#10b981",
    },
    {
        id: "iso27001",
        name: "ISO 27001:2022",
        description: "Information Security Management System",
        totalControls: 93,
        passingControls: 67,
        failingControls: 12,
        pendingControls: 14,
        lastAudit: "2024-06-20",
        nextAudit: "2025-06-20",
        status: "active",
        color: "#3b82f6",
    },
    {
        id: "hipaa",
        name: "HIPAA",
        description: "Health Insurance Portability and Accountability Act",
        totalControls: 54,
        passingControls: 24,
        failingControls: 8,
        pendingControls: 22,
        lastAudit: null,
        nextAudit: "2025-04-01",
        status: "in-progress",
        color: "#8b5cf6",
    },
    {
        id: "gdpr",
        name: "GDPR",
        description: "General Data Protection Regulation",
        totalControls: 72,
        passingControls: 58,
        failingControls: 4,
        pendingControls: 10,
        lastAudit: "2024-11-01",
        nextAudit: "2025-11-01",
        status: "active",
        color: "#ec4899",
    },
    {
        id: "pci-dss",
        name: "PCI-DSS v4.0",
        description: "Payment Card Industry Data Security Standard",
        totalControls: 264,
        passingControls: 0,
        failingControls: 0,
        pendingControls: 264,
        lastAudit: null,
        nextAudit: null,
        status: "not-started",
        color: "#f59e0b",
    },
    {
        id: "nist",
        name: "NIST 800-53",
        description: "Security and Privacy Controls for Federal Systems",
        totalControls: 325,
        passingControls: 0,
        failingControls: 0,
        pendingControls: 325,
        lastAudit: null,
        nextAudit: null,
        status: "not-started",
        color: "#06b6d4",
    },
];

export default function FrameworksPage() {
    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">Compliance Frameworks</h1>
                            <p className="page-subtitle">
                                Manage your compliance certifications and controls
                            </p>
                        </div>
                        <button className="btn btn-primary">
                            <Plus size={16} />
                            Add Framework
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div
                    className="flex items-center gap-4"
                    style={{ marginBottom: "var(--space-6)" }}
                >
                    <div
                        style={{
                            flex: 1,
                            position: "relative",
                        }}
                    >
                        <Search
                            size={18}
                            style={{
                                position: "absolute",
                                left: "var(--space-4)",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--color-neutral-400)",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search frameworks..."
                            style={{
                                width: "100%",
                                padding: "var(--space-3) var(--space-4) var(--space-3) var(--space-12)",
                                background: "var(--glass-bg)",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "var(--radius-lg)",
                                color: "var(--color-neutral-100)",
                                fontSize: "var(--text-sm)",
                            }}
                        />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {/* Frameworks Grid */}
                <div className="framework-grid stagger">
                    {frameworks.map((framework) => {
                        const progress = Math.round(
                            (framework.passingControls / framework.totalControls) * 100
                        );

                        return (
                            <div key={framework.id} className="framework-card">
                                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
                                    <div
                                        className="framework-icon"
                                        style={{
                                            background: `${framework.color}20`,
                                            marginBottom: 0,
                                        }}
                                    >
                                        <Shield size={24} color={framework.color} />
                                    </div>
                                    <span
                                        className={`badge ${framework.status === "active"
                                            ? "badge-success"
                                            : framework.status === "in-progress"
                                                ? "badge-warning"
                                                : "badge-info"
                                            }`}
                                    >
                                        {framework.status === "active"
                                            ? "Active"
                                            : framework.status === "in-progress"
                                                ? "In Progress"
                                                : "Not Started"}
                                    </span>
                                </div>

                                <h3 className="framework-name">{framework.name}</h3>
                                <p className="framework-description">{framework.description}</p>

                                {framework.status !== "not-started" && (
                                    <>
                                        <div className="framework-progress">
                                            <div
                                                className="framework-progress-bar"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="framework-stats" style={{ marginBottom: "var(--space-4)" }}>
                                            <span>
                                                {framework.passingControls}/{framework.totalControls}{" "}
                                                controls
                                            </span>
                                            <span style={{ fontWeight: "var(--font-semibold)" }}>
                                                {progress}%
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Control Status Breakdown */}
                                <div
                                    className="flex gap-4"
                                    style={{
                                        padding: "var(--space-3)",
                                        background: "rgba(0, 0, 0, 0.2)",
                                        borderRadius: "var(--radius-md)",
                                        marginBottom: "var(--space-4)",
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} color="var(--color-success)" />
                                        <span
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-300)",
                                            }}
                                        >
                                            {framework.passingControls} Passing
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} color="var(--color-error)" />
                                        <span
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-300)",
                                            }}
                                        >
                                            {framework.failingControls} Failing
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} color="var(--color-warning)" />
                                        <span
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-300)",
                                            }}
                                        >
                                            {framework.pendingControls} Pending
                                        </span>
                                    </div>
                                </div>

                                {/* Next Audit */}
                                {framework.nextAudit && (
                                    <div
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--color-neutral-400)",
                                            marginBottom: "var(--space-4)",
                                        }}
                                    >
                                        Next Audit:{" "}
                                        <span style={{ color: "var(--color-neutral-200)" }}>
                                            {new Date(framework.nextAudit).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/frameworks/${framework.id}`}
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        View Controls <ChevronRight size={14} />
                                    </Link>
                                    <Link
                                        href={`/frameworks/${framework.id === "soc2" ? "soc-2" : framework.id === "iso27001" ? "iso-27001" : framework.id}`}
                                        className="btn btn-ghost btn-sm"
                                        title="View Public SEO Page"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </>
    );
}
