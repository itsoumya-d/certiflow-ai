"use client";

import Sidebar from "@/components/Sidebar";
import {
    Settings,
    User,
    Building2,
    Bell,
    Shield,
    Key,
    Link2,
    Palette,
    Save,
    ChevronRight,
    Plus,
    Trash2,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const integrations = [
    {
        id: "aws",
        name: "AWS",
        description: "Amazon Web Services",
        connected: true,
        lastSync: "2 hours ago",
    },
    {
        id: "gcp",
        name: "Google Cloud",
        description: "Google Cloud Platform",
        connected: true,
        lastSync: "1 hour ago",
    },
    {
        id: "azure",
        name: "Azure",
        description: "Microsoft Azure",
        connected: false,
        lastSync: null,
    },
    {
        id: "github",
        name: "GitHub",
        description: "Code repositories",
        connected: true,
        lastSync: "30 min ago",
    },
    {
        id: "okta",
        name: "Okta",
        description: "Identity management",
        connected: true,
        lastSync: "1 hour ago",
    },
    {
        id: "slack",
        name: "Slack",
        description: "Notifications",
        connected: false,
        lastSync: null,
    },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "organization", label: "Organization", icon: Building2 },
        { id: "integrations", label: "Integrations", icon: Link2 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "api", label: "API Keys", icon: Key },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">Settings</h1>
                            <p className="page-subtitle">
                                Manage your account and platform preferences
                            </p>
                        </div>
                        {saved && (
                            <div
                                className="flex items-center gap-2 animate-fade-in"
                                style={{
                                    color: "var(--color-success)",
                                    fontSize: "var(--text-sm)",
                                }}
                            >
                                <CheckCircle2 size={16} />
                                Changes saved
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "240px 1fr",
                        gap: "var(--space-6)",
                    }}
                >
                    {/* Settings Nav */}
                    <div className="card" style={{ padding: "var(--space-4)", height: "fit-content" }}>
                        <nav
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-1)",
                            }}
                        >
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`nav-item ${isActive ? "active" : ""}`}
                                        style={{
                                            background: isActive
                                                ? "rgba(16, 185, 129, 0.1)"
                                                : "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            width: "100%",
                                            textAlign: "left",
                                        }}
                                    >
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Settings Content */}
                    <div className="card">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="animate-fade-in">
                                <h3 style={{ marginBottom: "var(--space-6)" }}>Profile Settings</h3>

                                <div
                                    className="flex items-center gap-6"
                                    style={{ marginBottom: "var(--space-8)" }}
                                >
                                    <div
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: "var(--radius-full)",
                                            background:
                                                "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "var(--text-2xl)",
                                            fontWeight: "var(--font-bold)",
                                        }}
                                    >
                                        SD
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary btn-sm">
                                            Change Avatar
                                        </button>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "var(--space-4)",
                                        marginBottom: "var(--space-6)",
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "var(--text-sm)",
                                                color: "var(--color-neutral-300)",
                                                marginBottom: "var(--space-2)",
                                            }}
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Soumya"
                                            style={{
                                                width: "100%",
                                                padding: "var(--space-3) var(--space-4)",
                                                background: "var(--color-neutral-800)",
                                                border: "1px solid var(--glass-border)",
                                                borderRadius: "var(--radius-lg)",
                                                color: "var(--color-neutral-100)",
                                                fontSize: "var(--text-sm)",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "var(--text-sm)",
                                                color: "var(--color-neutral-300)",
                                                marginBottom: "var(--space-2)",
                                            }}
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Debnath"
                                            style={{
                                                width: "100%",
                                                padding: "var(--space-3) var(--space-4)",
                                                background: "var(--color-neutral-800)",
                                                border: "1px solid var(--glass-border)",
                                                borderRadius: "var(--radius-lg)",
                                                color: "var(--color-neutral-100)",
                                                fontSize: "var(--text-sm)",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "var(--space-6)" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="soumya@certiflow.ai"
                                        style={{
                                            width: "100%",
                                            padding: "var(--space-3) var(--space-4)",
                                            background: "var(--color-neutral-800)",
                                            border: "1px solid var(--glass-border)",
                                            borderRadius: "var(--radius-lg)",
                                            color: "var(--color-neutral-100)",
                                            fontSize: "var(--text-sm)",
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: "var(--space-6)" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Administrator"
                                        disabled
                                        style={{
                                            width: "100%",
                                            padding: "var(--space-3) var(--space-4)",
                                            background: "var(--color-neutral-900)",
                                            border: "1px solid var(--glass-border)",
                                            borderRadius: "var(--radius-lg)",
                                            color: "var(--color-neutral-400)",
                                            fontSize: "var(--text-sm)",
                                        }}
                                    />
                                </div>

                                <button onClick={handleSave} className="btn btn-primary">
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {/* Integrations Tab */}
                        {activeTab === "integrations" && (
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                                    <h3>Connected Integrations</h3>
                                    <button className="btn btn-primary btn-sm">
                                        <Plus size={14} />
                                        Add Integration
                                    </button>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--space-3)",
                                    }}
                                >
                                    {integrations.map((integration) => (
                                        <div
                                            key={integration.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "var(--space-4)",
                                                background: "rgba(255, 255, 255, 0.02)",
                                                borderRadius: "var(--radius-lg)",
                                                border: "1px solid var(--glass-border)",
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        background: integration.connected
                                                            ? "rgba(16, 185, 129, 0.1)"
                                                            : "var(--color-neutral-700)",
                                                        borderRadius: "var(--radius-md)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Link2
                                                        size={20}
                                                        color={
                                                            integration.connected
                                                                ? "var(--color-primary-400)"
                                                                : "var(--color-neutral-400)"
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: "var(--font-medium)",
                                                            marginBottom: 2,
                                                        }}
                                                    >
                                                        {integration.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "var(--text-xs)",
                                                            color: "var(--color-neutral-400)",
                                                        }}
                                                    >
                                                        {integration.description}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {integration.connected ? (
                                                    <>
                                                        <span
                                                            style={{
                                                                fontSize: "var(--text-xs)",
                                                                color: "var(--color-neutral-400)",
                                                            }}
                                                        >
                                                            Last sync: {integration.lastSync}
                                                        </span>
                                                        <span className="badge badge-success">Connected</span>
                                                        <button className="btn btn-ghost btn-sm">
                                                            <Settings size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn-secondary btn-sm">
                                                        Connect
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="animate-fade-in">
                                <h3 style={{ marginBottom: "var(--space-6)" }}>Notification Preferences</h3>

                                {[
                                    {
                                        title: "Compliance Alerts",
                                        description: "Get notified when controls fail or drift",
                                        enabled: true,
                                    },
                                    {
                                        title: "Evidence Expiration",
                                        description: "Reminders before evidence expires",
                                        enabled: true,
                                    },
                                    {
                                        title: "Agent Activity",
                                        description: "Updates on AI agent task completion",
                                        enabled: false,
                                    },
                                    {
                                        title: "Weekly Reports",
                                        description: "Summary of compliance status",
                                        enabled: true,
                                    },
                                    {
                                        title: "Audit Reminders",
                                        description: "Upcoming audit date notifications",
                                        enabled: true,
                                    },
                                ].map((pref, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                        style={{
                                            padding: "var(--space-4)",
                                            borderBottom:
                                                index < 4 ? "1px solid var(--glass-border)" : "none",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: "var(--font-medium)",
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {pref.title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--color-neutral-400)",
                                                }}
                                            >
                                                {pref.description}
                                            </div>
                                        </div>
                                        <label
                                            style={{
                                                position: "relative",
                                                display: "inline-block",
                                                width: 44,
                                                height: 24,
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                defaultChecked={pref.enabled}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    inset: 0,
                                                    backgroundColor: pref.enabled
                                                        ? "var(--color-primary-500)"
                                                        : "var(--color-neutral-600)",
                                                    borderRadius: "var(--radius-full)",
                                                    transition: "var(--transition-fast)",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        position: "absolute",
                                                        height: 18,
                                                        width: 18,
                                                        left: pref.enabled ? 23 : 3,
                                                        bottom: 3,
                                                        backgroundColor: "white",
                                                        borderRadius: "50%",
                                                        transition: "var(--transition-fast)",
                                                    }}
                                                />
                                            </span>
                                        </label>
                                    </div>
                                ))}

                                <button
                                    onClick={handleSave}
                                    className="btn btn-primary"
                                    style={{ marginTop: "var(--space-6)" }}
                                >
                                    <Save size={16} />
                                    Save Preferences
                                </button>
                            </div>
                        )}

                        {/* API Keys Tab */}
                        {activeTab === "api" && (
                            <div className="animate-fade-in">
                                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                                    <div>
                                        <h3 style={{ marginBottom: "var(--space-1)" }}>API Keys</h3>
                                        <p
                                            style={{
                                                color: "var(--color-neutral-400)",
                                                fontSize: "var(--text-sm)",
                                            }}
                                        >
                                            Manage API access for programmatic integrations
                                        </p>
                                    </div>
                                    <button className="btn btn-primary btn-sm">
                                        <Plus size={14} />
                                        Create Key
                                    </button>
                                </div>

                                <div
                                    style={{
                                        padding: "var(--space-4)",
                                        background: "rgba(255, 255, 255, 0.02)",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1px solid var(--glass-border)",
                                        marginBottom: "var(--space-4)",
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: "var(--font-medium)",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                Production Key
                                            </div>
                                            <code
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--color-neutral-400)",
                                                    background: "var(--color-neutral-900)",
                                                    padding: "var(--space-1) var(--space-2)",
                                                    borderRadius: "var(--radius-sm)",
                                                }}
                                            >
                                                cf_prod_••••••••••••••••
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="badge badge-success">Active</span>
                                            <button className="btn btn-ghost btn-sm">
                                                <Trash2 size={14} color="var(--color-error)" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: "var(--space-6)",
                                        background: "rgba(59, 130, 246, 0.1)",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1px solid rgba(59, 130, 246, 0.2)",
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontSize: "var(--text-sm)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        API Documentation
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-400)",
                                            marginBottom: "var(--space-3)",
                                        }}
                                    >
                                        Learn how to integrate CertiFlow AI into your workflows
                                    </p>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2"
                                        style={{
                                            color: "var(--color-info)",
                                            fontSize: "var(--text-sm)",
                                            textDecoration: "none",
                                        }}
                                    >
                                        View Documentation <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="animate-fade-in">
                                <h3 style={{ marginBottom: "var(--space-6)" }}>Security Settings</h3>

                                <div
                                    style={{
                                        padding: "var(--space-4)",
                                        background: "rgba(255, 255, 255, 0.02)",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1px solid var(--glass-border)",
                                        marginBottom: "var(--space-4)",
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: "var(--font-medium)",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                Two-Factor Authentication
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--color-neutral-400)",
                                                }}
                                            >
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                        <span className="badge badge-success">Enabled</span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: "var(--space-4)",
                                        background: "rgba(255, 255, 255, 0.02)",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1px solid var(--glass-border)",
                                        marginBottom: "var(--space-4)",
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: "var(--font-medium)",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                Session Timeout
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--color-neutral-400)",
                                                }}
                                            >
                                                Automatically log out after inactivity
                                            </p>
                                        </div>
                                        <select
                                            style={{
                                                padding: "var(--space-2) var(--space-4)",
                                                background: "var(--color-neutral-800)",
                                                border: "1px solid var(--glass-border)",
                                                borderRadius: "var(--radius-md)",
                                                color: "var(--color-neutral-100)",
                                                fontSize: "var(--text-sm)",
                                            }}
                                            defaultValue="30"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="btn btn-secondary">
                                    Change Password
                                </button>
                            </div>
                        )}

                        {/* Default: Organization Tab */}
                        {activeTab === "organization" && (
                            <div className="animate-fade-in">
                                <h3 style={{ marginBottom: "var(--space-6)" }}>Organization Settings</h3>

                                <div style={{ marginBottom: "var(--space-6)" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Demo Company"
                                        style={{
                                            width: "100%",
                                            padding: "var(--space-3) var(--space-4)",
                                            background: "var(--color-neutral-800)",
                                            border: "1px solid var(--glass-border)",
                                            borderRadius: "var(--radius-lg)",
                                            color: "var(--color-neutral-100)",
                                            fontSize: "var(--text-sm)",
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: "var(--space-6)" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-2)",
                                        }}
                                    >
                                        Primary Domain
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="demo.certiflow.ai"
                                        style={{
                                            width: "100%",
                                            padding: "var(--space-3) var(--space-4)",
                                            background: "var(--color-neutral-800)",
                                            border: "1px solid var(--glass-border)",
                                            borderRadius: "var(--radius-lg)",
                                            color: "var(--color-neutral-100)",
                                            fontSize: "var(--text-sm)",
                                        }}
                                    />
                                </div>

                                <button onClick={handleSave} className="btn btn-primary">
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === "appearance" && (
                            <div className="animate-fade-in">
                                <h3 style={{ marginBottom: "var(--space-6)" }}>Appearance</h3>

                                <div style={{ marginBottom: "var(--space-6)" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-neutral-300)",
                                            marginBottom: "var(--space-3)",
                                        }}
                                    >
                                        Theme
                                    </label>
                                    <div className="flex gap-3">
                                        {["Dark", "Light", "System"].map((theme) => (
                                            <button
                                                key={theme}
                                                className={`btn ${theme === "Dark" ? "btn-primary" : "btn-secondary"
                                                    }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <p
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        color: "var(--color-neutral-400)",
                                    }}
                                >
                                    More appearance options coming soon...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
