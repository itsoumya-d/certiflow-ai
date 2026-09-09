"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import AnimatedScoreRing from "@/components/AnimatedScoreRing";
import { motion } from "framer-motion";
import {
    staggerContainer,
    staggerChild,
    fadeInUp,
    hoverLift,
} from "@/lib/animations";
import {
    Shield,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    FileCheck,
    Bot,
    ChevronRight,
} from "lucide-react";

const stats = [
    {
        label: "Compliance Score",
        value: "89%",
        change: "+3.2%",
        positive: true,
        icon: Shield,
    },
    {
        label: "Controls Passing",
        value: "142",
        change: "+8",
        positive: true,
        icon: CheckCircle2,
    },
    {
        label: "Open Issues",
        value: "6",
        change: "-2",
        positive: true,
        icon: AlertTriangle,
    },
    {
        label: "Days to Audit",
        value: "12",
        change: "On track",
        positive: true,
        icon: Clock,
    },
];

const frameworks = [
    { name: "SOC 2 Type II", progress: 89, controls: "103/116", status: "active" },
    { name: "ISO 27001", progress: 72, controls: "67/93", status: "active" },
    { name: "HIPAA", progress: 45, controls: "24/54", status: "in-progress" },
];

const activities = [
    {
        type: "success",
        title: "MFA Verification Complete",
        description: "Agent verified MFA enabled for all admin accounts",
        time: "2 min ago",
        icon: CheckCircle2,
    },
    {
        type: "warning",
        title: "Evidence Expiring Soon",
        description: "Penetration test report expires in 7 days",
        time: "15 min ago",
        icon: AlertTriangle,
    },
    {
        type: "info",
        title: "New Control Mapped",
        description: "CC6.1 - Logical Access Controls added to SOC 2",
        time: "1 hour ago",
        icon: FileCheck,
    },
    {
        type: "success",
        title: "Agent Task Complete",
        description: "AWS encryption verification passed",
        time: "2 hours ago",
        icon: Bot,
    },
];

export default function DashboardPage() {
    return (
        <>
            <Sidebar />
            <main className="main-content">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">Dashboard</h1>
                            <p className="page-subtitle">
                                Your compliance status at a glance
                            </p>
                        </div>
                        <motion.button
                            className="btn btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <RefreshCw size={16} />
                            Sync All
                        </motion.button>
                    </div>
                </motion.div>

                {/* Command Center Hero Section */}
                <motion.div
                    className="card card-premium relative"
                    style={{
                        marginBottom: "var(--space-8)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-12)",
                        padding: "var(--space-10)",
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/30 transition-all duration-500" />
                        <AnimatedScoreRing score={91} size={220} label="System Trust" />
                    </div>

                    <motion.div
                        style={{ flex: 1 }}
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-display mb-1">Command Center</h3>
                                <p className="text-neutral-400 text-sm tracking-wide">AUTONOMOUS AUDIT MODE: <span className="text-primary-400 font-bold animate-pulse-glow">ACTIVE</span></p>
                            </div>
                            <div className="flex gap-3">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Uptime</span>
                                    <span className="text-sm font-mono text-primary-400">99.99%</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Integrations</span>
                                    <span className="text-sm font-mono text-teal-400">24/24</span>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "var(--space-8)",
                            }}
                        >
                            {stats.slice(1).map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={staggerChild}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 rounded-lg bg-white/5">
                                                <Icon size={14} className="text-neutral-400" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-display font-bold">{stat.value}</span>
                                            <div
                                                className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.positive ? "text-success" : "text-error"}`}
                                            >
                                                {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                {stat.change}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "var(--space-6)",
                    }}
                >
                    {/* Frameworks Overview */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Active Frameworks</h3>
                            <Link href="/frameworks" className="btn btn-ghost btn-sm">
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-4)",
                            }}
                        >
                            {frameworks.map((framework, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "var(--space-4)",
                                        background: "rgba(255, 255, 255, 0.02)",
                                        borderRadius: "var(--radius-lg)",
                                    }}
                                >
                                    <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-3)" }}>
                                        <div className="flex items-center gap-3">
                                            <Shield size={20} color="var(--color-primary-400)" />
                                            <span style={{ fontWeight: "var(--font-medium)" }}>
                                                {framework.name}
                                            </span>
                                        </div>
                                        <span
                                            className={`badge ${framework.status === "active"
                                                ? "badge-success"
                                                : "badge-warning"
                                                }`}
                                        >
                                            {framework.status === "active" ? "Active" : "In Progress"}
                                        </span>
                                    </div>

                                    <div className="framework-progress">
                                        <div
                                            className="framework-progress-bar"
                                            style={{ width: `${framework.progress}%` }}
                                        />
                                    </div>

                                    <div className="framework-stats">
                                        <span>{framework.controls} controls</span>
                                        <span style={{ fontWeight: "var(--font-semibold)" }}>
                                            {framework.progress}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Activity</h3>
                            <span
                                className="status-indicator"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                <span className="status-dot success" />
                                Live
                            </span>
                        </div>

                        <div className="activity-feed">
                            {activities.map((activity, index) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={index} className="activity-item">
                                        <div className={`activity-icon ${activity.type}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-title">{activity.title}</div>
                                            <div className="activity-description">
                                                {activity.description}
                                            </div>
                                        </div>
                                        <div className="activity-time">{activity.time}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* AI Agents Status */}
                <div className="card" style={{ marginTop: "var(--space-6)" }}>
                    <div className="card-header">
                        <h3 className="card-title">AI Agents</h3>
                        <a href="/agents" className="btn btn-ghost btn-sm">
                            Manage Agents <ChevronRight size={14} />
                        </a>
                    </div>

                    <div className="agent-grid">
                        <div className="agent-card">
                            <div className="agent-header">
                                <div className="flex items-center gap-3">
                                    <Bot size={20} color="var(--color-primary-400)" />
                                    <span className="agent-name">Evidence Collector</span>
                                </div>
                                <div className="agent-status">
                                    <span className="status-dot success" />
                                    Running
                                </div>
                            </div>
                            <div className="agent-task">
                                Verifying database encryption settings in AWS RDS...
                            </div>
                            <div className="flex items-center justify-between">
                                <span
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--color-neutral-400)",
                                    }}
                                >
                                    12 tasks completed today
                                </span>
                                <button className="btn btn-ghost btn-sm">View Logs</button>
                            </div>
                        </div>

                        <div className="agent-card">
                            <div className="agent-header">
                                <div className="flex items-center gap-3">
                                    <Bot size={20} color="var(--color-accent-400)" />
                                    <span className="agent-name">Control Verifier</span>
                                </div>
                                <div className="agent-status">
                                    <span className="status-dot warning" />
                                    Waiting
                                </div>
                            </div>
                            <div className="agent-task">
                                Queued: Verify access control policies in Okta...
                            </div>
                            <div className="flex items-center justify-between">
                                <span
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--color-neutral-400)",
                                    }}
                                >
                                    8 tasks in queue
                                </span>
                                <button className="btn btn-ghost btn-sm">View Queue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
