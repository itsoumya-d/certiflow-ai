"use client";

import { ReactNode } from "react";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal, useKeyboardShortcutsModal } from "./KeyboardShortcutsModal";

/**
 * Provider component that enables keyboard shortcuts throughout the app
 * Add this to your layout to enable shortcuts globally
 */
export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
    useNavigationShortcuts();
    const modal = useKeyboardShortcutsModal();

    return (
        <>
            {children}
            <KeyboardShortcutsModal isOpen={modal.isOpen} onClose={modal.close} />
        </>
    );
}
