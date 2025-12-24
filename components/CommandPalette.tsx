"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Bot, Settings, LayoutDashboard, FolderOpen, Eye, Command, ArrowRight } from "lucide-react";

interface SearchResult {
    id: string;
    title: string;
    description: string;
    category: "page" | "action" | "evidence" | "agent";
    icon: React.ElementType;
    action: () => void;
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Define searchable items
    const allResults: SearchResult[] = [
        // Pages
        { id: "dashboard", title: "Dashboard", description: "View compliance overview", category: "page", icon: LayoutDashboard, action: () => router.push("/dashboard") },
        { id: "agents", title: "AI Agents", description: "Manage verification agents", category: "page", icon: Bot, action: () => router.push("/agents") },
        { id: "evidence", title: "Evidence Library", description: "Browse compliance evidence", category: "page", icon: FolderOpen, action: () => router.push("/evidence") },
        { id: "auditor", title: "Auditor Portal", description: "Read-only audit view", category: "page", icon: Eye, action: () => router.push("/auditor") },
        { id: "settings", title: "Settings", description: "Configure integrations", category: "page", icon: Settings, action: () => router.push("/settings") },

        // Actions
        { id: "upload", title: "Upload Evidence", description: "Add new compliance evidence", category: "action", icon: FileText, action: () => router.push("/evidence") },
        { id: "run-agent", title: "Run Verification", description: "Execute agent workflow", category: "action", icon: Bot, action: () => router.push("/agents") },
    ];

    // Filter results based on query
    const filteredResults = query.trim()
        ? allResults.filter(
            (item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
        )
        : allResults;

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open with Ctrl+K
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }

            // Close with Escape
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Navigation within results
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredResults[selectedIndex]) {
                        filteredResults[selectedIndex].action();
                        setIsOpen(false);
                    }
                    break;
            }
        },
        [filteredResults, selectedIndex]
    );

    if (!isOpen) return null;

    return (
        <div
            onClick={() => setIsOpen(false)}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "15vh",
                zIndex: 9999,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="animate-scale-in"
                style={{
                    background: "var(--color-neutral-900)",
                    border: "1px solid var(--color-neutral-700)",
                    borderRadius: "var(--radius-xl)",
                    width: "90%",
                    maxWidth: "560px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
            >
                {/* Search Input */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        padding: "var(--space-4)",
                        borderBottom: "1px solid var(--color-neutral-800)",
                    }}
                >
                    <Search size={20} color="var(--color-neutral-400)" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search pages, actions, or type a command..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "var(--color-neutral-50)",
                            fontSize: "var(--text-base)",
                        }}
                    />
                    <kbd
                        style={{
                            background: "var(--color-neutral-800)",
                            border: "1px solid var(--color-neutral-700)",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "var(--text-xs)",
                            color: "var(--color-neutral-400)",
                        }}
                    >
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                    {filteredResults.length === 0 ? (
                        <div
                            style={{
                                padding: "var(--space-6)",
                                textAlign: "center",
                                color: "var(--color-neutral-500)",
                            }}
                        >
                            No results found
                        </div>
                    ) : (
                        filteredResults.map((result, index) => {
                            const Icon = result.icon;
                            const isSelected = index === selectedIndex;

                            return (
                                <div
                                    key={result.id}
                                    onClick={() => {
                                        result.action();
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-3)",
                                        padding: "var(--space-3) var(--space-4)",
                                        cursor: "pointer",
                                        background: isSelected ? "rgba(16, 185, 129, 0.1)" : "transparent",
                                        borderLeft: isSelected ? "2px solid var(--color-primary-500)" : "2px solid transparent",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "var(--radius-md)",
                                            background: "var(--color-neutral-800)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Icon size={18} color="var(--color-primary-400)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "var(--font-medium)", fontSize: "var(--text-sm)" }}>
                                            {result.title}
                                        </div>
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>
                                            {result.description}
                                        </div>
                                    </div>
                                    {isSelected && <ArrowRight size={16} color="var(--color-neutral-500)" />}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderTop: "1px solid var(--color-neutral-800)",
                        display: "flex",
                        gap: "var(--space-4)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-neutral-500)",
                    }}
                >
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: "var(--color-neutral-800)", padding: "2px 4px", borderRadius: "3px" }}>↑↓</kbd>
                        Navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: "var(--color-neutral-800)", padding: "2px 4px", borderRadius: "3px" }}>↵</kbd>
                        Select
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd style={{ background: "var(--color-neutral-800)", padding: "2px 4px", borderRadius: "3px" }}>Ctrl+K</kbd>
                        Open
                    </span>
                </div>
            </div>
        </div>
    );
}
