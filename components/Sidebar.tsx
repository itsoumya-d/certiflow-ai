"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Shield,
    LayoutDashboard,
    FileCheck,
    FolderOpen,
    Bot,
    Settings,
    HelpCircle,
    LogOut,
    Loader2,
    Eye,
    Users,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/frameworks", label: "Frameworks", icon: FileCheck },
    { href: "/evidence", label: "Evidence", icon: FolderOpen },
    { href: "/dashboard/people", label: "People", icon: Users },
    { href: "/agents", label: "AI Agents", icon: Bot },
    { href: "/auditor", label: "Auditor Portal", icon: Eye },
];

const bottomNavItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" });
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside className="sidebar">
            <Link href="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
                <div className="sidebar-logo-icon">
                    <Shield size={24} color="white" />
                </div>
                <span className="sidebar-logo-text">
                    CertiFlow<span className="text-gradient"> AI</span>
                </span>
            </Link>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                            style={{ position: 'relative' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: 'var(--radius-lg)',
                                        zIndex: -1,
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                            )}
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div
                style={{
                    borderTop: "1px solid var(--glass-border)",
                    paddingTop: "var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-1)",
                }}
            >
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <button
                    onClick={handleSignOut}
                    className="nav-item"
                    style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                    }}
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>

            {/* User Profile */}
            <div
                style={{
                    marginTop: "var(--space-4)",
                    padding: "var(--space-4)",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                }}
            >
                {status === "loading" ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            color: "var(--color-neutral-400)",
                        }}
                    >
                        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                    </div>
                ) : session?.user ? (
                    <>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "var(--radius-full)",
                                background:
                                    "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "var(--font-semibold)",
                                fontSize: "var(--text-sm)",
                            }}
                        >
                            {getInitials(session.user.name || "User")}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: "var(--font-medium)",
                                    fontSize: "var(--text-sm)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {session.user.name || "User"}
                            </div>
                            <div
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-neutral-400)",
                                    textTransform: "capitalize",
                                }}
                            >
                                {(session.user as unknown as { role?: string }).role || "User"}
                            </div>
                        </div>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="btn btn-primary btn-sm"
                        style={{ width: "100%" }}
                    >
                        Sign In
                    </Link>
                )}
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div
                style={{
                    marginTop: "var(--space-3)",
                    padding: "var(--space-2) var(--space-3)",
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-2)",
                }}
            >
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                    Press
                </span>
                <kbd
                    style={{
                        background: "var(--color-neutral-800)",
                        border: "1px solid var(--color-neutral-700)",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        fontSize: "var(--text-xs)",
                        fontFamily: "monospace",
                        color: "var(--color-primary-400)",
                    }}
                >
                    ?
                </kbd>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                    for shortcuts
                </span>
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
        </aside>
    );
}
