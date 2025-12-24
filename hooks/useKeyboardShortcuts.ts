"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    description: string;
    action: () => void;
}

/**
 * Hook for keyboard shortcuts
 * Usage:
 * ```
 * useKeyboardShortcuts([
 *   { key: 'd', ctrlKey: true, description: 'Go to Dashboard', action: () => router.push('/dashboard') }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            for (const shortcut of shortcuts) {
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
                const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

                if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        },
        [shortcuts]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Pre-configured navigation shortcuts hook
 * Provides: Ctrl+D (Dashboard), Ctrl+A (Agents), Ctrl+E (Evidence)
 */
export function useNavigationShortcuts() {
    const router = useRouter();

    useKeyboardShortcuts([
        {
            key: "d",
            ctrlKey: true,
            description: "Go to Dashboard",
            action: () => router.push("/dashboard"),
        },
        {
            key: "a",
            ctrlKey: true,
            shiftKey: true,
            description: "Go to Agents",
            action: () => router.push("/agents"),
        },
        {
            key: "e",
            ctrlKey: true,
            shiftKey: true,
            description: "Go to Evidence",
            action: () => router.push("/evidence"),
        },
        {
            key: "s",
            ctrlKey: true,
            shiftKey: true,
            description: "Go to Settings",
            action: () => router.push("/settings"),
        },
        {
            key: "/",
            description: "Focus Search",
            action: () => {
                const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]');
                searchInput?.focus();
            },
        },
        {
            key: "Escape",
            description: "Close Modal",
            action: () => {
                // Clicks any visible close button or overlay
                const closeBtn = document.querySelector<HTMLButtonElement>('[aria-label="Close"], .modal-close');
                closeBtn?.click();
            },
        },
    ]);
}

/**
 * Get all available shortcuts for display in help modal
 */
export function getShortcutsList(): { key: string; description: string }[] {
    return [
        { key: "Ctrl+D", description: "Go to Dashboard" },
        { key: "Ctrl+Shift+A", description: "Go to Agents" },
        { key: "Ctrl+Shift+E", description: "Go to Evidence" },
        { key: "Ctrl+Shift+S", description: "Go to Settings" },
        { key: "/", description: "Focus Search" },
        { key: "Esc", description: "Close Modal/Dialog" },
        { key: "?", description: "Show Keyboard Shortcuts" },
    ];
}
