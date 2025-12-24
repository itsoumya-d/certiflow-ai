import { Metadata } from "next";
import Link from "next/link";
import { Shield, CheckCircle2, ArrowRight, Clock, Zap, FileCheck } from "lucide-react";

// Framework-specific data
const frameworkData: Record<string, {
    name: string;
    fullName: string;
    description: string;
    auditTime: string;
    controlCount: string;
    benefits: string[];
}> = {
    "soc-2": {
        name: "SOC 2",
        fullName: "SOC 2 Type I & Type II",
        description: "Service Organization Control 2 is the gold standard for SaaS companies to demonstrate security, availability, processing integrity, confidentiality, and privacy controls.",
        auditTime: "7 days",
        controlCount: "116+",
        benefits: [
            "Close enterprise deals faster",
            "Build customer trust instantly",
            "Automate 95% of evidence collection",
            "Continuous monitoring and alerts",
        ],
    },
    "iso-27001": {
        name: "ISO 27001",
        fullName: "ISO/IEC 27001:2022",
        description: "The international standard for information security management systems (ISMS). Essential for companies operating in Europe and enterprise markets.",
        auditTime: "14 days",
        controlCount: "93+",
        benefits: [
            "Global recognition and trust",
            "Structured risk management",
            "Competitive advantage in EU markets",
            "Comprehensive security framework",
        ],
    },
    "hipaa": {
        name: "HIPAA",
        fullName: "Health Insurance Portability and Accountability Act",
        description: "Required for any organization handling protected health information (PHI). CertiFlow AI automates the complex technical and administrative safeguards.",
        auditTime: "10 days",
        controlCount: "78+",
        benefits: [
            "Protect patient data",
            "Avoid costly penalties",
            "Enable healthcare partnerships",
            "Automated BAA tracking",
        ],
    },
    "gdpr": {
        name: "GDPR",
        fullName: "General Data Protection Regulation",
        description: "The European Union's comprehensive data protection regulation. CertiFlow AI helps you demonstrate compliance with data subject rights and processing records.",
        auditTime: "7 days",
        controlCount: "45+",
        benefits: [
            "Avoid fines up to 4% of revenue",
            "Automated DPIA generation",
            "Data mapping and lineage",
            "Consent management tracking",
        ],
    },
    "pci-dss": {
        name: "PCI-DSS",
        fullName: "Payment Card Industry Data Security Standard",
        description: "Required for any organization that processes, stores, or transmits credit card data. CertiFlow AI maps your controls to all 12 PCI-DSS requirements.",
        auditTime: "14 days",
        controlCount: "264+",
        benefits: [
            "Accept card payments securely",
            "Reduce breach liability",
            "Automated scan scheduling",
            "Quarterly compliance checks",
        ],
    },
    "soc-1": {
        name: "SOC 1",
        fullName: "SOC 1 Type I & Type II (SSAE 18)",
        description: "For service organizations that impact their clients' financial reporting. Essential for payroll, financial services, and data center providers.",
        auditTime: "10 days",
        controlCount: "50+",
        benefits: [
            "Win financial services clients",
            "Demonstrate control effectiveness",
            "Satisfy auditor requirements",
            "Automated control testing",
        ],
    },
};

// Generate metadata for each framework page
export async function generateMetadata({
    params
}: {
    params: Promise<{ framework: string }>
}): Promise<Metadata> {
    const { framework } = await params;
    const data = frameworkData[framework];

    if (!data) {
        return {
            title: "Framework Not Found",
        };
    }

    return {
        title: `${data.name} Compliance Automation | Get Certified in ${data.auditTime}`,
        description: `Automate your ${data.name} compliance with CertiFlow AI. Get audit-ready in ${data.auditTime} with 95% automation. ${data.description}`,
        keywords: [
            `${data.name} compliance`,
            `${data.name} automation`,
            `${data.name} software`,
            `${data.name} certification`,
            `${data.name} audit`,
            "compliance automation",
            "GRC platform",
        ],
        openGraph: {
            title: `${data.name} Compliance Automation | CertiFlow AI`,
            description: `Get ${data.name} audit-ready in ${data.auditTime}. Automate evidence collection and control verification.`,
        },
    };
}

// Generate static paths for all frameworks
export async function generateStaticParams() {
    return Object.keys(frameworkData).map((framework) => ({
        framework,
    }));
}

export default async function FrameworkPage({
    params
}: {
    params: Promise<{ framework: string }>
}) {
    const { framework } = await params;
    const data = frameworkData[framework];

    if (!data) {
        return (
            <div style={{ padding: "var(--space-20)", textAlign: "center" }}>
                <h1>Framework Not Found</h1>
                <p>The requested compliance framework page does not exist.</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            {/* Hero Section */}
            <section
                style={{
                    padding: "var(--space-24) var(--space-6)",
                    background: "linear-gradient(180deg, var(--color-neutral-950) 0%, var(--color-neutral-900) 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background gradient orb */}
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        right: "-10%",
                        width: "600px",
                        height: "600px",
                        background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                    }}
                />

                <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
                            <Shield size={14} />
                            {data.fullName}
                        </div>

                        <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-6)" }}>
                            Get <span className="text-gradient">{data.name}</span> Certified in {data.auditTime}
                        </h1>

                        <p style={{ fontSize: "var(--text-xl)", color: "var(--color-neutral-400)", marginBottom: "var(--space-8)", maxWidth: "700px", margin: "0 auto var(--space-8)" }}>
                            {data.description}
                        </p>

                        <div className="flex gap-4" style={{ justifyContent: "center", marginBottom: "var(--space-12)" }}>
                            <Link href="/demo" className="btn btn-primary btn-lg">
                                Start Free Trial <ArrowRight size={18} />
                            </Link>
                            <Link href="/trust-center" className="btn btn-secondary btn-lg">
                                View Trust Center
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8" style={{ justifyContent: "center" }}>
                            <div>
                                <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)" }}>
                                    {data.auditTime}
                                </div>
                                <div style={{ color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                                    To Audit-Ready
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)" }}>
                                    {data.controlCount}
                                </div>
                                <div style={{ color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                                    Controls Mapped
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--font-bold)" }}>
                                    95%
                                </div>
                                <div style={{ color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                                    Automation Rate
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: "var(--space-20) var(--space-6)" }}>
                <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
                        Why Choose CertiFlow AI for {data.name}?
                    </h2>

                    <div className="grid grid-cols-2" style={{ gap: "var(--space-6)" }}>
                        {data.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "var(--radius-lg)",
                                        background: "rgba(16, 185, 129, 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <CheckCircle2 size={20} color="var(--color-primary-400)" />
                                </div>
                                <span style={{ fontSize: "var(--text-lg)" }}>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                style={{
                    padding: "var(--space-16) var(--space-6)",
                    background: "var(--glass-bg)",
                    borderTop: "1px solid var(--glass-border)",
                    textAlign: "center",
                }}
            >
                <div className="container" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <h2 style={{ marginBottom: "var(--space-4)" }}>
                        Ready to Get {data.name} Certified?
                    </h2>
                    <p style={{ color: "var(--color-neutral-400)", marginBottom: "var(--space-6)" }}>
                        Start your free trial today and see how CertiFlow AI can accelerate your compliance journey.
                    </p>
                    <Link href="/demo" className="btn btn-primary btn-lg">
                        Get Started Free <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
