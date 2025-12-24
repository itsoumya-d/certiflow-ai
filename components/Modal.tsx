"use client";

import { useState, useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: 400 },
        md: { maxWidth: 500 },
        lg: { maxWidth: 700 },
        xl: { maxWidth: 900 },
    };

    return (
        <div
            className="animate-fade-in"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-6)",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(4px)",
                }}
            />

            {/* Modal Content */}
            <div
                className="card animate-scale-in"
                style={{
                    position: "relative",
                    width: "100%",
                    ...sizeStyles[size],
                    padding: "var(--space-6)",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div
                        className="flex items-center justify-between"
                        style={{ marginBottom: "var(--space-6)" }}
                    >
                        {title && (
                            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-semibold)" }}>
                                {title}
                            </h3>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "none",
                                    borderRadius: "var(--radius-md)",
                                    padding: "var(--space-2)",
                                    color: "var(--color-neutral-400)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all var(--transition-fast)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                    e.currentTarget.style.color = "var(--color-neutral-200)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                    e.currentTarget.style.color = "var(--color-neutral-400)";
                                }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "primary";
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
}: ConfirmModalProps) {
    const variantStyles = {
        danger: "btn-danger",
        warning: "btn-warning",
        primary: "btn-primary",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p
                style={{
                    color: "var(--color-neutral-400)",
                    marginBottom: "var(--space-6)",
                    lineHeight: 1.6,
                }}
            >
                {message}
            </p>
            <div className="flex gap-3" style={{ justifyContent: "flex-end" }}>
                <button onClick={onClose} className="btn btn-secondary">
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`btn ${variantStyles[variant]}`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
