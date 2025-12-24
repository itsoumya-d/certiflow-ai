"use client";

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";

interface ExportButtonProps {
    onExport: (format: "csv" | "json") => Promise<void>;
    label?: string;
    disabled?: boolean;
}

/**
 * Export button with dropdown for format selection
 */
export function ExportButton({ onExport, label = "Export", disabled = false }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: "csv" | "json") => {
        setIsExporting(true);
        setIsOpen(false);
        try {
            await onExport(format);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                className="btn btn-secondary"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || isExporting}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
            >
                {isExporting ? (
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                    <Download size={16} />
                )}
                {label}
            </button>

            {isOpen && (
                <>
                    <div
                        style={{ position: "fixed", inset: 0, zIndex: 10 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="animate-fade-in"
                        style={{
                            position: "absolute",
                            top: "calc(100% + var(--space-2))",
                            right: 0,
                            background: "var(--color-neutral-800)",
                            border: "1px solid var(--color-neutral-700)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            boxShadow: "var(--shadow-lg)",
                            zIndex: 20,
                            minWidth: 160,
                        }}
                    >
                        <button
                            onClick={() => handleExport("csv")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-3)",
                                padding: "var(--space-3) var(--space-4)",
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                color: "var(--color-neutral-100)",
                                cursor: "pointer",
                                fontSize: "var(--text-sm)",
                                textAlign: "left",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-neutral-700)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <FileSpreadsheet size={16} color="var(--color-success)" />
                            Export as CSV
                        </button>
                        <button
                            onClick={() => handleExport("json")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-3)",
                                padding: "var(--space-3) var(--space-4)",
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                color: "var(--color-neutral-100)",
                                cursor: "pointer",
                                fontSize: "var(--text-sm)",
                                textAlign: "left",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-neutral-700)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <FileText size={16} color="var(--color-info)" />
                            Export as JSON
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Quick export button for single format
 */
export function QuickExportButton({
    onClick,
    format,
    label,
    disabled = false,
}: {
    onClick: () => void;
    format: "csv" | "json" | "pdf";
    label?: string;
    disabled?: boolean;
}) {
    const icons = {
        csv: FileSpreadsheet,
        json: FileText,
        pdf: FileText,
    };
    const colors = {
        csv: "var(--color-success)",
        json: "var(--color-info)",
        pdf: "var(--color-error)",
    };
    const Icon = icons[format];

    return (
        <button
            className="btn btn-secondary btn-sm"
            onClick={onClick}
            disabled={disabled}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
        >
            <Icon size={14} color={colors[format]} />
            {label || `Export ${format.toUpperCase()}`}
        </button>
    );
}
