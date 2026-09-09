"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import { ExportButton } from "@/components/ExportButton";
import { exportToCSV, exportToJSON, evidenceColumns } from "@/lib/export";
import {
    FolderOpen,
    Upload,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    Image,
    Video,
    Link2,
    Bot,
    ChevronDown,
    Download,
    Eye,
    MoreVertical,
    X,
    Loader2,
} from "lucide-react";

interface EvidenceItem {
    id: string;
    type: string;
    name: string;
    description?: string;
    framework: string;
    controlId: string;
    uploadedBy?: string;
    status: string;
    expiresAt?: string;
}

export default function EvidencePage() {
    const { success, error } = useToast();
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvidence = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/evidence");
            if (res.ok) {
                const data = await res.json();
                setEvidenceItems(data.evidence);
            }
        } catch (error) {
            console.error("Failed to fetch evidence:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvidence();
    }, []);

    // Refresh after upload
    useEffect(() => {
        if (uploadSuccess) {
            fetchEvidence();
        }
    }, [uploadSuccess]);

    // Derived stats
    const stats = [
        { label: "Total Evidence", value: evidenceItems.length.toString(), icon: FolderOpen },
        { label: "Auto-Collected", value: evidenceItems.filter(e => e.uploadedBy === 'AI Agent' || e.uploadedBy === 'unknown').length.toString(), icon: Bot },
        { label: "Verified", value: evidenceItems.filter(e => e.status === 'verified').length.toString(), icon: CheckCircle2 },
        { label: "Pending Review", value: evidenceItems.filter(e => e.status === 'pending' || e.status === 'analyzing').length.toString(), icon: Clock },
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        framework: "SOC 2",
        controlId: "",
        type: "document" as "document" | "screenshot" | "configuration" | "log",
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
            setFormData(prev => ({ ...prev, name: e.dataTransfer.files[0].name }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setFormData(prev => ({ ...prev, name: e.target.files![0].name }));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        const data = new FormData();
        data.append("file", selectedFile);
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("framework", formData.framework);
        data.append("controlId", formData.controlId);
        data.append("type", formData.type);

        try {
            const response = await fetch("/api/evidence", {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setUploadSuccess(true);
                success("Evidence uploaded successfully! AI analysis in progress.");
                setTimeout(() => {
                    setUploadModalOpen(false);
                    setUploadSuccess(false);
                    setSelectedFile(null);
                    setFormData({
                        name: "",
                        description: "",
                        framework: "SOC 2",
                        controlId: "",
                        type: "document",
                    });
                }, 2000);
            } else {
                error("Upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            error("Upload failed. Please check your connection.");
        } finally {
            setUploading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "screenshot":
                return <Image size={16} />;
            case "document":
                return <FileText size={16} />;
            case "video":
                return <Video size={16} />;
            case "link":
                return <Link2 size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <span className="badge badge-success">Verified</span>;
            case "pending":
                return <span className="badge badge-warning">Pending</span>;
            case "expiring":
                return <span className="badge badge-error">Expiring Soon</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">Evidence Library</h1>
                            <p className="page-subtitle">
                                Manage and track compliance evidence across all frameworks
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setUploadModalOpen(true)}
                        >
                            <Upload size={16} />
                            Upload Evidence
                        </button>
                    </div>
                </div>

                {/* Upload Modal */}
                {uploadModalOpen && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 300,
                        }}
                        onClick={() => setUploadModalOpen(false)}
                    >
                        <div
                            className="card animate-scale-in"
                            style={{
                                width: "100%",
                                maxWidth: 500,
                                padding: "var(--space-6)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                                <h3>Upload Evidence</h3>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setUploadModalOpen(false)}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {uploadSuccess ? (
                                <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
                                    <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: "0 auto var(--space-4)" }} />
                                    <h4>Upload Successful!</h4>
                                    <p style={{ color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                                        Your evidence is being analyzed by AI...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Drop Zone */}
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            border: `2px dashed ${dragActive ? "var(--color-primary-500)" : "var(--glass-border)"}`,
                                            borderRadius: "var(--radius-lg)",
                                            padding: "var(--space-8)",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            marginBottom: "var(--space-4)",
                                            background: dragActive ? "rgba(16, 185, 129, 0.05)" : "transparent",
                                            transition: "all var(--transition-fast)",
                                        }}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            style={{ display: "none" }}
                                            accept=".pdf,.png,.jpg,.jpeg,.json,.txt,.csv"
                                        />
                                        <Upload size={32} color="var(--color-neutral-400)" style={{ margin: "0 auto var(--space-3)" }} />
                                        {selectedFile ? (
                                            <p style={{ fontWeight: "var(--font-medium)" }}>{selectedFile.name}</p>
                                        ) : (
                                            <>
                                                <p style={{ fontWeight: "var(--font-medium)" }}>Drop files here or click to upload</p>
                                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)" }}>
                                                    PDF, PNG, JPEG, JSON, TXT, CSV (max 10MB)
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Form Fields */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
                                                Evidence Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="e.g., AWS S3 Encryption Settings"
                                                style={{
                                                    width: "100%",
                                                    padding: "var(--space-3)",
                                                    background: "var(--color-neutral-800)",
                                                    border: "1px solid var(--glass-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    color: "var(--color-neutral-100)",
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
                                                    Framework
                                                </label>
                                                <select
                                                    value={formData.framework}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
                                                    style={{
                                                        width: "100%",
                                                        padding: "var(--space-3)",
                                                        background: "var(--color-neutral-800)",
                                                        border: "1px solid var(--glass-border)",
                                                        borderRadius: "var(--radius-md)",
                                                        color: "var(--color-neutral-100)",
                                                    }}
                                                >
                                                    <option value="SOC 2">SOC 2</option>
                                                    <option value="ISO 27001">ISO 27001</option>
                                                    <option value="HIPAA">HIPAA</option>
                                                    <option value="GDPR">GDPR</option>
                                                    <option value="PCI-DSS">PCI-DSS</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
                                                    Control ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.controlId}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, controlId: e.target.value }))}
                                                    placeholder="e.g., CC6.1"
                                                    style={{
                                                        width: "100%",
                                                        padding: "var(--space-3)",
                                                        background: "var(--color-neutral-800)",
                                                        border: "1px solid var(--glass-border)",
                                                        borderRadius: "var(--radius-md)",
                                                        color: "var(--color-neutral-100)",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
                                                Evidence Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as typeof formData.type }))}
                                                style={{
                                                    width: "100%",
                                                    padding: "var(--space-3)",
                                                    background: "var(--color-neutral-800)",
                                                    border: "1px solid var(--glass-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    color: "var(--color-neutral-100)",
                                                }}
                                            >
                                                <option value="document">Document</option>
                                                <option value="screenshot">Screenshot</option>
                                                <option value="configuration">Configuration</option>
                                                <option value="log">Log File</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3" style={{ marginTop: "var(--space-6)" }}>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setUploadModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleUpload}
                                            disabled={!selectedFile || uploading}
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} />
                                                    Upload Evidence
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}


                {/* Stats */}
                <div className="stats-grid stagger">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="stat-card">
                                <div className="flex items-center justify-between">
                                    <span className="stat-label">{stat.label}</span>
                                    <Icon size={20} color="var(--color-primary-400)" />
                                </div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: "var(--space-6)" }}
                >
                    <div className="flex items-center gap-4" style={{ flex: 1 }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                            <Search
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "var(--space-4)",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "var(--color-neutral-400)",
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search evidence..."
                                style={{
                                    width: "100%",
                                    padding:
                                        "var(--space-3) var(--space-4) var(--space-3) var(--space-12)",
                                    background: "var(--glass-bg)",
                                    border: "1px solid var(--glass-border)",
                                    borderRadius: "var(--radius-lg)",
                                    color: "var(--color-neutral-100)",
                                    fontSize: "var(--text-sm)",
                                }}
                            />
                        </div>

                        <button className="btn btn-secondary">
                            Framework <ChevronDown size={14} />
                        </button>
                        <button className="btn btn-secondary">
                            Status <ChevronDown size={14} />
                        </button>
                        <button className="btn btn-secondary">
                            <Filter size={16} />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Evidence Table */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "rgba(0, 0, 0, 0.3)",
                                    borderBottom: "1px solid var(--glass-border)",
                                }}
                            >
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "left",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: "var(--font-medium)",
                                        color: "var(--color-neutral-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Evidence
                                </th>
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "left",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: "var(--font-medium)",
                                        color: "var(--color-neutral-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Framework / Control
                                </th>
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "left",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: "var(--font-medium)",
                                        color: "var(--color-neutral-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Collected By
                                </th>
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "left",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: "var(--font-medium)",
                                        color: "var(--color-neutral-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Status
                                </th>
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "left",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: "var(--font-medium)",
                                        color: "var(--color-neutral-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Expires
                                </th>
                                <th
                                    style={{
                                        padding: "var(--space-4)",
                                        textAlign: "right",
                                    }}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {evidenceItems.map((item) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        borderBottom: "1px solid var(--glass-border)",
                                        transition: "background var(--transition-fast)",
                                    }}
                                    onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "rgba(255, 255, 255, 0.02)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td style={{ padding: "var(--space-4)" }}>
                                        <div className="flex items-center gap-3">
                                            <div
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "var(--radius-md)",
                                                    background: "rgba(255, 255, 255, 0.05)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "var(--color-primary-400)",
                                                }}
                                            >
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: "var(--font-medium)" }}>
                                                    {item.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "var(--text-xs)",
                                                        color: "var(--color-neutral-400)",
                                                    }}
                                                >
                                                    {item.description || "No description provided"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "var(--space-4)" }}>
                                        <div style={{ fontSize: "var(--text-sm)" }}>
                                            {item.framework}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--color-neutral-400)",
                                            }}
                                        >
                                            {item.controlId}
                                        </div>
                                    </td>
                                    <td style={{ padding: "var(--space-4)" }}>
                                        <div
                                            className="flex items-center gap-2"
                                            style={{ fontSize: "var(--text-sm)" }}
                                        >
                                            {item.uploadedBy === "AI Agent" && (
                                                <Bot size={14} className="text-primary-400" />
                                            )}
                                            {item.uploadedBy || "System"}
                                        </div>
                                    </td>
                                    <td style={{ padding: "var(--space-4)" }}>
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td style={{ padding: "var(--space-4)" }}>
                                        <span
                                            style={{
                                                fontSize: "var(--text-sm)",
                                                color: item.status === "expiring"
                                                    ? "var(--color-error)"
                                                    : "var(--color-neutral-400)",
                                            }}
                                        >
                                            {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }) : "N/A"}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            padding: "var(--space-4)",
                                            textAlign: "right",
                                        }}
                                    >
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="btn btn-ghost btn-sm">
                                                <Eye size={14} />
                                            </button>
                                            <button className="btn btn-ghost btn-sm">
                                                <Download size={14} />
                                            </button>
                                            <button className="btn btn-ghost btn-sm">
                                                <MoreVertical size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}
