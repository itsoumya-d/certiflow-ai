"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(
        (message: string, type: ToastType = "info", duration: number = 4000) => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((prev) => [...prev, { id, message, type, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== id));
                }, duration);
            }
        },
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    const { addToast, removeToast, toasts } = context;

    return {
        toasts,
        addToast,
        removeToast,
        success: (message: string, duration?: number) => addToast(message, "success", duration),
        error: (message: string, duration?: number) => addToast(message, "error", duration ?? 6000),
        warning: (message: string, duration?: number) => addToast(message, "warning", duration),
        info: (message: string, duration?: number) => addToast(message, "info", duration),
    };
}

function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: Toast[];
    removeToast: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={18} />;
            case "error":
                return <XCircle size={18} />;
            case "warning":
                return <AlertTriangle size={18} />;
            case "info":
                return <Info size={18} />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case "success":
                return {
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "var(--color-success)",
                };
            case "error":
                return {
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "var(--color-error)",
                };
            case "warning":
                return {
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "var(--color-warning)",
                };
            case "info":
                return {
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "var(--color-info)",
                };
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "var(--space-6)",
                right: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
                zIndex: 9999,
                pointerEvents: "none",
            }}
        >
            {toasts.map((toast) => {
                const styles = getStyles(toast.type);
                return (
                    <div
                        key={toast.id}
                        className="animate-fade-in"
                        style={{
                            ...styles,
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                            padding: "var(--space-4) var(--space-5)",
                            borderRadius: "var(--radius-lg)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                            minWidth: 300,
                            maxWidth: 400,
                            pointerEvents: "auto",
                        }}
                    >
                        <span style={{ color: styles.color }}>{getIcon(toast.type)}</span>
                        <span
                            style={{
                                flex: 1,
                                color: "var(--color-neutral-100)",
                                fontSize: "var(--text-sm)",
                            }}
                        >
                            {toast.message}
                        </span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--color-neutral-400)",
                                cursor: "pointer",
                                padding: 4,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
