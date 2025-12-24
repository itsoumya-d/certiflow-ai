/**
 * Export utilities for compliance data
 * Supports CSV and JSON export formats
 */

interface ExportColumn {
    header: string;
    key: string;
    formatter?: (value: unknown) => string;
}

/**
 * Convert data to CSV format
 */
export function toCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[]
): string {
    const headers = columns.map((col) => `"${col.header}"`).join(",");

    const rows = data.map((item) =>
        columns
            .map((col) => {
                const value = item[col.key];
                const formatted = col.formatter ? col.formatter(value) : String(value ?? "");
                // Escape quotes and wrap in quotes
                return `"${formatted.replace(/"/g, '""')}"`;
            })
            .join(",")
    );

    return [headers, ...rows].join("\n");
}

/**
 * Trigger browser download of a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[],
    filename: string
): void {
    const csv = toCSV(data, columns);
    downloadFile(csv, `${filename}.csv`, "text/csv");
}

/**
 * Export data as JSON file
 */
export function exportToJSON<T>(data: T, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, "application/json");
}

/**
 * Format date for export
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
}

/**
 * Format datetime for export
 */
export function formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().replace("T", " ").split(".")[0];
}

// Pre-defined column configurations for common exports
export const evidenceColumns: ExportColumn[] = [
    { header: "Name", key: "name" },
    { header: "Type", key: "type" },
    { header: "Framework", key: "framework" },
    { header: "Control ID", key: "control" },
    { header: "Collected By", key: "collectedBy" },
    { header: "Collected At", key: "collectedAt", formatter: (v) => formatDateTime(v as string) },
    { header: "Expires At", key: "expiresAt", formatter: (v) => formatDateTime(v as string) },
    { header: "Status", key: "status" },
];

export const agentColumns: ExportColumn[] = [
    { header: "Agent Name", key: "name" },
    { header: "Status", key: "status" },
    { header: "Current Task", key: "currentTask" },
    { header: "Tasks Completed", key: "tasksCompleted" },
    { header: "Last Update", key: "lastUpdate", formatter: (v) => formatDateTime(v as string) },
];

export const complianceReportColumns: ExportColumn[] = [
    { header: "Framework", key: "framework" },
    { header: "Total Controls", key: "totalControls" },
    { header: "Compliant", key: "compliant" },
    { header: "Non-Compliant", key: "nonCompliant" },
    { header: "In Progress", key: "inProgress" },
    { header: "Compliance %", key: "percentage", formatter: (v) => `${v}%` },
    { header: "Last Assessed", key: "lastAssessed", formatter: (v) => formatDate(v as string) },
];
