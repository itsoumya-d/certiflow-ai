"use client";

import Sidebar from "@/components/Sidebar";
import {
    HelpCircle,
    Search,
    Book,
    MessageCircle,
    ExternalLink,
    ChevronRight,
    Zap,
    Shield,
    Bot,
    FileCheck,
    Settings,
    Play,
} from "lucide-react";
import { useState } from "react";

const categories = [
    {
        id: "getting-started",
        name: "Getting Started",
        icon: Play,
        articles: [
            { title: "Quick Start Guide", time: "5 min" },
            { title: "Setting Up Your First Framework", time: "8 min" },
            { title: "Connecting Cloud Integrations", time: "10 min" },
            { title: "Understanding the Dashboard", time: "4 min" },
        ],
    },
    {
        id: "frameworks",
        name: "Compliance Frameworks",
        icon: Shield,
        articles: [
            { title: "SOC 2 Type II Overview", time: "12 min" },
            { title: "ISO 27001 Implementation", time: "15 min" },
            { title: "HIPAA Compliance Guide", time: "10 min" },
            { title: "Mapping Controls Across Frameworks", time: "8 min" },
        ],
    },
    {
        id: "agents",
        name: "AI Agents",
        icon: Bot,
        articles: [
            { title: "How AI Agents Work", time: "6 min" },
            { title: "Configuring Verification Workflows", time: "10 min" },
            { title: "Understanding Computer Use", time: "8 min" },
            { title: "Agent Troubleshooting", time: "5 min" },
        ],
    },
    {
        id: "evidence",
        name: "Evidence Collection",
        icon: FileCheck,
        articles: [
            { title: "Automatic Evidence Collection", time: "7 min" },
            { title: "Manual Evidence Upload", time: "4 min" },
            { title: "Evidence Expiration & Renewal", time: "5 min" },
            { title: "Auditor Evidence Export", time: "6 min" },
        ],
    },
    {
        id: "settings",
        name: "Settings & Integrations",
        icon: Settings,
        articles: [
            { title: "AWS Integration Setup", time: "10 min" },
            { title: "GitHub Integration Setup", time: "8 min" },
            { title: "Okta SSO Configuration", time: "12 min" },
            { title: "API Key Management", time: "5 min" },
        ],
    },
];

const faqs = [
    {
        question: "How does CertiFlow AI collect evidence automatically?",
        answer:
            "Our AI agents use Gemini 2.5 Computer Use capabilities to navigate cloud consoles like a human would, taking screenshots and extracting configuration data as evidence.",
    },
    {
        question: "Is my data secure?",
        answer:
            "Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II certified and GDPR compliant. Your data is never shared with third parties.",
    },
    {
        question: "How fast can I get audit-ready?",
        answer:
            "Most organizations achieve audit-readiness within 7 days thanks to our AI-powered automation. Traditional methods typically take 2-3 months.",
    },
    {
        question: "Can I use CertiFlow AI for multiple frameworks?",
        answer:
            "Absolutely! CertiFlow AI supports 20+ frameworks including SOC 2, ISO 27001, HIPAA, GDPR, PCI-DSS, and more. Evidence is mapped across frameworks automatically.",
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">Help & Support</h1>
                            <p className="page-subtitle">
                                Find answers, guides, and contact our support team
                            </p>
                        </div>
                        <a
                            href="mailto:support@certiflow.ai"
                            className="btn btn-primary"
                        >
                            <MessageCircle size={16} />
                            Contact Support
                        </a>
                    </div>
                </div>

                {/* Search */}
                <div
                    className="card"
                    style={{
                        marginBottom: "var(--space-8)",
                        padding: "var(--space-8)",
                        textAlign: "center",
                        background:
                            "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(45, 212, 191, 0.05) 100%)",
                    }}
                >
                    <h2 style={{ marginBottom: "var(--space-4)" }}>How can we help?</h2>
                    <div
                        style={{
                            maxWidth: 500,
                            margin: "0 auto",
                            position: "relative",
                        }}
                    >
                        <Search
                            size={20}
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help articles..."
                            style={{
                                width: "100%",
                                padding: "var(--space-4) var(--space-4) var(--space-4) var(--space-12)",
                                background: "var(--color-neutral-800)",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "var(--radius-lg)",
                                color: "var(--color-neutral-100)",
                                fontSize: "var(--text-base)",
                            }}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--space-6)",
                        marginBottom: "var(--space-8)",
                    }}
                >
                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-4)",
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
                            }}
                        >
                            <Book size={24} color="var(--color-primary-400)" />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: 2 }}>Documentation</h4>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                Full API reference
                            </p>
                        </div>
                    </div>

                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-4)",
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
                            }}
                        >
                            <Zap size={24} color="var(--color-info)" />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: 2 }}>Status Page</h4>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                System health & uptime
                            </p>
                        </div>
                    </div>

                    <div
                        className="card"
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-4)",
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
                            }}
                        >
                            <MessageCircle size={24} color="#8b5cf6" />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: 2 }}>Community</h4>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                Join our Slack channel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Categories */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
                    <div>
                        <h3 style={{ marginBottom: "var(--space-4)" }}>Browse by Category</h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-4)",
                            }}
                        >
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <div key={category.id} className="card" style={{ padding: "var(--space-4)" }}>
                                        <div
                                            className="flex items-center gap-3"
                                            style={{ marginBottom: "var(--space-3)" }}
                                        >
                                            <Icon size={20} color="var(--color-primary-400)" />
                                            <h4>{category.name}</h4>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "var(--space-2)",
                                            }}
                                        >
                                            {category.articles.slice(0, 3).map((article, index) => (
                                                <a
                                                    key={index}
                                                    href="#"
                                                    className="flex items-center justify-between"
                                                    style={{
                                                        padding: "var(--space-2) var(--space-3)",
                                                        borderRadius: "var(--radius-md)",
                                                        textDecoration: "none",
                                                        color: "var(--color-neutral-300)",
                                                        fontSize: "var(--text-sm)",
                                                        transition: "background var(--transition-fast)",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.background = "transparent")
                                                    }
                                                >
                                                    <span>{article.title}</span>
                                                    <span
                                                        style={{
                                                            fontSize: "var(--text-xs)",
                                                            color: "var(--color-neutral-500)",
                                                        }}
                                                    >
                                                        {article.time}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                        <a
                                            href="#"
                                            className="flex items-center gap-1"
                                            style={{
                                                marginTop: "var(--space-3)",
                                                fontSize: "var(--text-sm)",
                                                color: "var(--color-primary-400)",
                                                textDecoration: "none",
                                            }}
                                        >
                                            View all <ChevronRight size={14} />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQs */}
                    <div>
                        <h3 style={{ marginBottom: "var(--space-4)" }}>Frequently Asked Questions</h3>
                        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    style={{
                                        borderBottom:
                                            index < faqs.length - 1
                                                ? "1px solid var(--glass-border)"
                                                : "none",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedFaq(expandedFaq === index ? null : index)
                                        }
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "var(--space-4) var(--space-6)",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            color: "inherit",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: "var(--font-medium)",
                                                fontSize: "var(--text-sm)",
                                            }}
                                        >
                                            {faq.question}
                                        </span>
                                        <ChevronRight
                                            size={16}
                                            style={{
                                                transform:
                                                    expandedFaq === index
                                                        ? "rotate(90deg)"
                                                        : "rotate(0deg)",
                                                transition: "transform var(--transition-fast)",
                                                flexShrink: 0,
                                                marginLeft: "var(--space-2)",
                                            }}
                                        />
                                    </button>
                                    {expandedFaq === index && (
                                        <div
                                            className="animate-fade-in"
                                            style={{
                                                padding: "0 var(--space-6) var(--space-4)",
                                                color: "var(--color-neutral-400)",
                                                fontSize: "var(--text-sm)",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Support Card */}
                        <div
                            className="card"
                            style={{
                                marginTop: "var(--space-6)",
                                textAlign: "center",
                                padding: "var(--space-8)",
                                background:
                                    "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
                            }}
                        >
                            <HelpCircle
                                size={40}
                                color="var(--color-info)"
                                style={{ margin: "0 auto var(--space-4)" }}
                            />
                            <h4 style={{ marginBottom: "var(--space-2)" }}>
                                Still need help?
                            </h4>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--color-neutral-400)",
                                    marginBottom: "var(--space-4)",
                                }}
                            >
                                Our support team typically responds within 2 hours
                            </p>
                            <a href="mailto:support@certiflow.ai" className="btn btn-primary">
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
