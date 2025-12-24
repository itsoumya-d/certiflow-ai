"use client";

import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import {
    Bot,
    Play,
    Pause,
    RefreshCw,
    Plus,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight,
    Settings,
    History,
    Zap,
    Eye,
    Terminal,
    Wifi,
    WifiOff,
} from "lucide-react";
import { useState, useEffect } from "react";

interface LiveAgent {
    id: string;
    name: string;
    status: "running" | "idle" | "paused" | "error";
    currentTask: string | null;
    progress: number;
    lastUpdate: string;
    tasksCompleted: number;
}

const staticAgents = [
    {
        id: "evidence-collector",
        name: "Evidence Collector",
        description:
            "Autonomously navigates cloud consoles and captures screenshots as evidence",
        status: "running",
        tasksCompleted: 142,
        tasksQueued: 8,
        lastRun: "2024-12-22T10:30:00Z",
        avgTaskTime: "2.3 min",
        capabilities: ["AWS Console", "GCP Console", "Azure Portal", "Okta Admin"],
    },
    {
        id: "control-verifier",
        name: "Control Verifier",
        description:
            "Validates security controls against policy requirements using deep analysis",
        status: "running",
        tasksCompleted: 89,
        tasksQueued: 3,
        lastRun: "2024-12-22T10:28:00Z",
        avgTaskTime: "4.1 min",
        capabilities: ["Policy Analysis", "Log Review", "Config Validation"],
    },
    {
        id: "document-analyzer",
        name: "Document Analyzer",
        description:
            "Extracts compliance-relevant information from uploaded documents",
        status: "idle",
        tasksCompleted: 56,
        tasksQueued: 0,
        lastRun: "2024-12-22T09:15:00Z",
        avgTaskTime: "1.8 min",
        capabilities: ["PDF Parsing", "OCR", "Entity Extraction", "Classification"],
    },
    {
        id: "remediation-agent",
        name: "Remediation Agent",
        description:
            "Suggests and applies fixes for common compliance gaps automatically",
        status: "paused",
        tasksCompleted: 23,
        tasksQueued: 5,
        lastRun: "2024-12-22T08:00:00Z",
        avgTaskTime: "5.2 min",
        capabilities: ["Auto-Fix", "Policy Generation", "Script Execution"],
    },
];

const recentTasks = [
    {
        id: 1,
        agent: "Evidence Collector",
        task: "Capture AWS S3 bucket encryption settings",
        status: "completed",
        duration: "1m 42s",
        timestamp: "2024-12-22T10:30:00Z",
    },
    {
        id: 2,
        agent: "Control Verifier",
        task: "Verify MFA enabled for all IAM users",
        status: "completed",
        duration: "3m 18s",
        timestamp: "2024-12-22T10:28:00Z",
    },
    {
        id: 3,
        agent: "Evidence Collector",
        task: "Screenshot GitHub branch protection rules",
        status: "running",
        duration: "0m 45s",
        timestamp: "2024-12-22T10:31:00Z",
    },
    {
        id: 4,
        agent: "Control Verifier",
        task: "Analyze CloudTrail logging configuration",
        status: "queued",
        duration: "-",
        timestamp: null,
    },
    {
        id: 5,
        agent: "Remediation Agent",
        task: "Generate access review template",
        status: "queued",
        duration: "-",
        timestamp: null,
    },
];

export default function AgentsPage() {
    const { success, error, info } = useToast();
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [liveAgents, setLiveAgents] = useState<LiveAgent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // SSE subscription for real-time updates
    useEffect(() => {
        const eventSource = new EventSource("/api/agents/status");

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLiveAgents(data.agents);
                setLastUpdate(new Date(data.timestamp));
            } catch (error) {
                console.error("Error parsing SSE data:", error);
            }
        };

        eventSource.onerror = () => {
            setIsConnected(false);
            eventSource.close();
            // Reconnect after 5 seconds
            setTimeout(() => {
                // Component will re-mount if still active
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "running":
                return "var(--color-success)";
            case "idle":
                return "var(--color-info)";
            case "paused":
                return "var(--color-warning)";
            case "error":
                return "var(--color-error)";
            default:
                return "var(--color-neutral-400)";
        }
    };

    const getTaskStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <span className="badge badge-success">Completed</span>;
            case "running":
                return <span className="badge badge-info">Running</span>;
            case "queued":
                return <span className="badge">Queued</span>;
            case "failed":
                return <span className="badge badge-error">Failed</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    // Merge live data with static agent info
    const agents = staticAgents.map((agent) => {
        const liveData = liveAgents.find((la) => la.name === agent.name);
        if (liveData) {
            return {
                ...agent,
                status: liveData.status,
                tasksCompleted: liveData.tasksCompleted,
                currentTask: liveData.currentTask,
                progress: liveData.progress,
            };
        }
        return agent;
    });

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">AI Agents</h1>
                            <p className="page-subtitle">
                                Manage autonomous compliance verification agents
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            {/* Connection Status */}
                            <div
                                className="flex items-center gap-2"
                                style={{
                                    padding: "var(--space-2) var(--space-3)",
                                    background: isConnected
                                        ? "rgba(34, 197, 94, 0.1)"
                                        : "rgba(239, 68, 68, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    fontSize: "var(--text-xs)",
                                }}
                            >
                                {isConnected ? (
                                    <>
                                        <Wifi size={14} color="var(--color-success)" />
                                        <span style={{ color: "var(--color-success)" }}>Live</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff size={14} color="var(--color-error)" />
                                        <span style={{ color: "var(--color-error)" }}>Offline</span>
                                    </>
                                )}
                            </div>
                            <button className="btn btn-secondary">
                                <RefreshCw size={16} />
                                Sync All
                            </button>
                            <button className="btn btn-primary">
                                <Plus size={16} />
                                Create Agent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div
                    className="stats-grid stagger"
                    style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                >
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Active Agents</span>
                            <Bot size={20} color="var(--color-primary-400)" />
                        </div>
                        <div className="stat-value">
                            {liveAgents.filter((a) => a.status === "running").length || agents.filter((a) => a.status === "running").length}
                        </div>
                        <div
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            of {liveAgents.length || agents.length} agents running
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Tasks Today</span>
                            <CheckCircle2 size={20} color="var(--color-success)" />
                        </div>
                        <div className="stat-value">
                            {liveAgents.reduce((sum, a) => sum + a.tasksCompleted, 0) || 47}
                        </div>
                        <div
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-success)",
                            }}
                        >
                            +12 from yesterday
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">In Queue</span>
                            <Clock size={20} color="var(--color-warning)" />
                        </div>
                        <div className="stat-value">16</div>
                        <div
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            Estimated: ~45 min
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Success Rate</span>
                            <Zap size={20} color="var(--color-accent-400)" />
                        </div>
                        <div className="stat-value">98.7%</div>
                        <div
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-neutral-400)",
                            }}
                        >
                            Last 7 days
                        </div>
                    </div>
                </div>

                {/* Live Activity Panel */}
                {liveAgents.filter((a) => a.status === "running" && a.currentTask).length > 0 && (
                    <div className="card" style={{ marginBottom: "var(--space-6)" }}>
                        <div className="card-header">
                            <div className="flex items-center gap-2">
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "var(--color-success)",
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                                <h3 className="card-title">Live Activity</h3>
                            </div>
                            {lastUpdate && (
                                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                                    Updated {lastUpdate.toLocaleTimeString()}
                                </span>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                            {liveAgents
                                .filter((a) => a.status === "running" && a.currentTask)
                                .map((agent) => (
                                    <div
                                        key={agent.id}
                                        style={{
                                            padding: "var(--space-4)",
                                            background: "rgba(255, 255, 255, 0.02)",
                                            borderRadius: "var(--radius-lg)",
                                        }}
                                    >
                                        <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-2)" }}>
                                            <div className="flex items-center gap-3">
                                                <Bot size={18} color="var(--color-primary-400)" />
                                                <span style={{ fontWeight: "var(--font-medium)", fontSize: "var(--text-sm)" }}>
                                                    {agent.name}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-primary-400)" }}>
                                                {agent.progress}%
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-300)", marginBottom: "var(--space-3)" }}>
                                            {agent.currentTask}
                                        </p>
                                        <div
                                            style={{
                                                height: 4,
                                                background: "var(--color-neutral-700)",
                                                borderRadius: "var(--radius-full)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: "100%",
                                                    width: `${agent.progress}%`,
                                                    background: "linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500))",
                                                    borderRadius: "var(--radius-full)",
                                                    transition: "width 0.5s ease-out",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--space-6)",
                    }}
                >
                    {/* Agents List */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Agent Fleet</h3>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-4)",
                            }}
                        >
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent.id)}
                                    style={{
                                        padding: "var(--space-4)",
                                        background:
                                            selectedAgent === agent.id
                                                ? "rgba(16, 185, 129, 0.1)"
                                                : "rgba(255, 255, 255, 0.02)",
                                        border:
                                            selectedAgent === agent.id
                                                ? "1px solid var(--color-primary-500)"
                                                : "1px solid transparent",
                                        borderRadius: "var(--radius-lg)",
                                        cursor: "pointer",
                                        transition: "all var(--transition-fast)",
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-between"
                                        style={{ marginBottom: "var(--space-2)" }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Bot size={20} color="var(--color-primary-400)" />
                                            <span style={{ fontWeight: "var(--font-medium)" }}>
                                                {agent.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    background: getStatusColor(agent.status),
                                                    animation:
                                                        agent.status === "running"
                                                            ? "pulse 2s infinite"
                                                            : "none",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--color-neutral-400)",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {agent.status}
                                            </span>
                                        </div>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--color-neutral-400)",
                                            marginBottom: "var(--space-3)",
                                        }}
                                    >
                                        {agent.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <span
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--color-neutral-300)",
                                                }}
                                            >
                                                <strong>{agent.tasksCompleted}</strong> completed
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--color-warning)",
                                                }}
                                            >
                                                <strong>{agent.tasksQueued}</strong> queued
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {agent.status === "running" ? (
                                                <button className="btn btn-ghost btn-sm">
                                                    <Pause size={14} />
                                                </button>
                                            ) : (
                                                <button className="btn btn-ghost btn-sm">
                                                    <Play size={14} />
                                                </button>
                                            )}
                                            <button className="btn btn-ghost btn-sm">
                                                <Settings size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Queue */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Tasks</h3>
                            <button className="btn btn-ghost btn-sm">
                                <History size={14} />
                                View All
                            </button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-3)",
                            }}
                        >
                            {recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    style={{
                                        padding: "var(--space-3)",
                                        background: "rgba(0, 0, 0, 0.2)",
                                        borderRadius: "var(--radius-md)",
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-between"
                                        style={{ marginBottom: "var(--space-2)" }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "var(--text-sm)",
                                                fontWeight: "var(--font-medium)",
                                            }}
                                        >
                                            {task.task}
                                        </span>
                                        {getTaskStatusBadge(task.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-400)",
                                            }}
                                        >
                                            {task.agent}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-500)",
                                            }}
                                        >
                                            {task.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Workflow Execution */}
                <div className="card" style={{ marginTop: "var(--space-6)" }}>
                    <div className="card-header">
                        <h3 className="card-title">Quick Verification Workflows</h3>
                        <span className="badge badge-info">
                            <Zap size={12} />
                            Powered by Computer Use
                        </span>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "var(--space-4)",
                        }}
                    >
                        {[
                            { id: "awsS3Encryption", name: "AWS S3 Encryption", icon: "🪣", controls: "CC6.1, CC6.7" },
                            { id: "awsMfa", name: "AWS MFA Check", icon: "🔐", controls: "CC6.1, CC6.2" },
                            { id: "githubBranchProtection", name: "GitHub Branches", icon: "🌿", controls: "CC8.1" },
                            { id: "oktaMfa", name: "Okta MFA Policy", icon: "🛡️", controls: "CC6.1, CC6.2" },
                        ].map((workflow) => (
                            <button
                                key={workflow.id}
                                className="btn btn-secondary"
                                style={{
                                    flexDirection: "column",
                                    padding: "var(--space-4)",
                                    height: "auto",
                                    alignItems: "flex-start",
                                    gap: "var(--space-2)",
                                }}
                                onClick={async () => {
                                    info(`Starting ${workflow.name} verification...`);
                                    try {
                                        const response = await fetch("/api/agents/execute", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ workflow: workflow.id }),
                                        });
                                        if (response.ok) {
                                            success(`${workflow.name} completed successfully!`);
                                        } else {
                                            error(`${workflow.name} failed. Check agent logs.`);
                                        }
                                    } catch (e) {
                                        console.error("Workflow execution failed:", e);
                                        error("Workflow execution failed. Please try again.");
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span style={{ fontSize: "var(--text-xl)" }}>{workflow.icon}</span>
                                    <span style={{ fontWeight: "var(--font-medium)" }}>{workflow.name}</span>
                                </div>
                                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                                    Controls: {workflow.controls}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Agent Capabilities Info */}
                <div className="card" style={{ marginTop: "var(--space-6)" }}>
                    <div className="card-header">
                        <h3 className="card-title">Powered by Gemini AI</h3>
                        <span className="badge badge-info">
                            <Zap size={12} />
                            1M Token Context
                        </span>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "var(--space-6)",
                        }}
                    >
                        <div
                            style={{
                                padding: "var(--space-4)",
                                background: "rgba(255, 255, 255, 0.02)",
                                borderRadius: "var(--radius-lg)",
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    background: "rgba(16, 185, 129, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "var(--space-3)",
                                }}
                            >
                                <Eye size={20} color="var(--color-primary-400)" />
                            </div>
                            <h4
                                style={{
                                    fontSize: "var(--text-sm)",
                                    marginBottom: "var(--space-2)",
                                }}
                            >
                                Computer Use
                            </h4>
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                Agents navigate cloud consoles like humans, capturing real-time
                                screenshots as evidence.
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "var(--space-4)",
                                background: "rgba(255, 255, 255, 0.02)",
                                borderRadius: "var(--radius-lg)",
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    background: "rgba(59, 130, 246, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "var(--space-3)",
                                }}
                            >
                                <Terminal size={20} color="var(--color-info)" />
                            </div>
                            <h4
                                style={{
                                    fontSize: "var(--text-sm)",
                                    marginBottom: "var(--space-2)",
                                }}
                            >
                                Deep Analysis
                            </h4>
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                Process entire policy documents and log files with 1M token
                                context window.
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "var(--space-4)",
                                background: "rgba(255, 255, 255, 0.02)",
                                borderRadius: "var(--radius-lg)",
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    background: "rgba(139, 92, 246, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "var(--space-3)",
                                }}
                            >
                                <RefreshCw size={20} color="#8b5cf6" />
                            </div>
                            <h4
                                style={{
                                    fontSize: "var(--text-sm)",
                                    marginBottom: "var(--space-2)",
                                }}
                            >
                                Continuous Loop
                            </h4>
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-neutral-400)",
                                }}
                            >
                                24/7 monitoring with automatic re-verification when controls
                                drift.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
