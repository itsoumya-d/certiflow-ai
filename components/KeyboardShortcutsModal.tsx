"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { getShortcutsList } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
    const shortcuts = getShortcutsList();

    useEffect(() => {
        if (isOpen) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                    padding: "var(--space-6)",
                    maxWidth: "400px",
                    width: "90%",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
            >
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-5)" }}>
                    <div className="flex items-center gap-3">
                        <Keyboard size={20} color="var(--color-primary-400)" />
                        <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)" }}>
                            Keyboard Shortcuts
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-neutral-400)",
                            padding: "var(--space-1)",
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {shortcuts.map((shortcut) => (
                        <div
                            key={shortcut.key}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "var(--space-2) 0",
                                borderBottom: "1px solid var(--color-neutral-800)",
                            }}
                        >
                            <span style={{ color: "var(--color-neutral-300)", fontSize: "var(--text-sm)" }}>
                                {shortcut.description}
                            </span>
                            <kbd
                                style={{
                                    background: "var(--color-neutral-800)",
                                    border: "1px solid var(--color-neutral-700)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "var(--space-1) var(--space-2)",
                                    fontSize: "var(--text-xs)",
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--color-neutral-200)",
                                }}
                            >
                                {shortcut.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <p
                    style={{
                        marginTop: "var(--space-5)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-neutral-500)",
                        textAlign: "center",
                    }}
                >
                    Press <kbd style={{ background: "var(--color-neutral-800)", padding: "2px 6px", borderRadius: "4px" }}>?</kbd> anytime to show this help
                </p>
            </div>
        </div>
    );
}

/**
 * Hook that provides keyboard shortcuts modal state and the "?" shortcut trigger
 */
export function useKeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "?" &&
                !(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement)
            ) {
                setIsOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    };
}
