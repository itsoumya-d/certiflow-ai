"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/Toast";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Mail,
    ShieldAlert,
    CheckCircle2,
    Laptop,
    MoreVertical,
    Loader2
} from "lucide-react";

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'onboarding' | 'offboarding';
    joinedAt: string;
    policyAcceptance: number;
    deviceStatus: 'compliant' | 'non-compliant' | 'unknown';
}

export default function PeoplePage() {
    const { success, error } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", email: "", role: "", department: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/employees");
            if (res.ok) {
                const data = await res.json();
                setEmployees(data.employees);
            }
        } catch (err) {
            console.error("Failed to fetch employees", err);
            error("Failed to load employee data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!newItem.name || !newItem.email) {
            error("Name and Email are required");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                success("Employee added successfully");
                setIsAddModalOpen(false);
                setNewItem({ name: "", email: "", role: "", department: "" });
                fetchEmployees();
            } else {
                error("Failed to add employee");
            }
        } catch (err) {
            error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    // Stats
    const totalEmployees = employees.length;
    const fullyOnboarded = employees.filter(e => e.status === 'active' && e.policyAcceptance === 100).length;
    const pendingPolicies = employees.filter(e => e.policyAcceptance < 100).length;
    const deviceIssues = employees.filter(e => e.deviceStatus === 'non-compliant' || e.deviceStatus === 'unknown').length;

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="page-title">People & Onboarding</h1>
                            <p className="page-subtitle">
                                Manage employee access, policy acceptance, and device security
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <UserPlus size={16} />
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid stagger">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Total Employees</span>
                            <Users size={20} color="var(--color-primary-400)" />
                        </div>
                        <div className="stat-value">{totalEmployees}</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Fully Onboarded</span>
                            <CheckCircle2 size={20} color="var(--color-success)" />
                        </div>
                        <div className="stat-value">{fullyOnboarded}</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Pending Policies</span>
                            <Mail size={20} color="var(--color-warning)" />
                        </div>
                        <div className="stat-value">{pendingPolicies}</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <span className="stat-label">Device Issues</span>
                            <ShieldAlert size={20} color="var(--color-error)" />
                        </div>
                        <div className="stat-value">{deviceIssues}</div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                    <div className="flex items-center gap-4" style={{ flex: 1 }}>
                        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                            <Search size={18} style={{ position: "absolute", left: "var(--space-4)", top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                style={{ width: "100%", padding: "var(--space-3) var(--space-4) var(--space-3) var(--space-12)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-lg)", color: "var(--color-neutral-100)" }}
                            />
                        </div>
                        <button className="btn btn-secondary">
                            Department <Filter size={14} />
                        </button>
                    </div>
                </div>

                {/* Main Table */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid var(--glass-border)" }}>
                                <th style={{ padding: "var(--space-4)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textTransform: "uppercase" }}>Employee</th>
                                <th style={{ padding: "var(--space-4)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textTransform: "uppercase" }}>Role</th>
                                <th style={{ padding: "var(--space-4)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textTransform: "uppercase" }}>Status</th>
                                <th style={{ padding: "var(--space-4)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textTransform: "uppercase" }}>Policy Acceptance</th>
                                <th style={{ padding: "var(--space-4)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textTransform: "uppercase" }}>Device Security</th>
                                <th style={{ padding: "var(--space-4)", textAlign: "right" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "var(--space-8)", textAlign: "center" }}>
                                        <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
                                    </td>
                                </tr>
                            ) : (
                                employees.map(emp => (
                                    <tr key={emp.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                                        <td style={{ padding: "var(--space-4)" }}>
                                            <div style={{ fontWeight: "var(--font-medium)" }}>{emp.name}</div>
                                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>{emp.email}</div>
                                        </td>
                                        <td style={{ padding: "var(--space-4)" }}>
                                            <div>{emp.role}</div>
                                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>{emp.department}</div>
                                        </td>
                                        <td style={{ padding: "var(--space-4)" }}>
                                            <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "var(--space-4)" }}>
                                            <div className="flex items-center gap-2">
                                                <div className="framework-progress" style={{ width: 100, height: 6 }}>
                                                    <div className="framework-progress-bar" style={{ width: `${emp.policyAcceptance}%`, background: emp.policyAcceptance === 100 ? 'var(--color-success)' : 'var(--color-warning)' }} />
                                                </div>
                                                <span style={{ fontSize: "var(--text-xs)" }}>{emp.policyAcceptance}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "var(--space-4)" }}>
                                            <div className="flex items-center gap-2">
                                                {emp.deviceStatus === 'compliant' ? (
                                                    <div className="flex items-center gap-1" style={{ color: "var(--color-success)", fontSize: "var(--text-sm)" }}>
                                                        <CheckCircle2 size={14} /> Secure
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1" style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
                                                        <ShieldAlert size={14} /> At Risk
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                                            <button className="btn btn-ghost btn-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Employee Modal */}
                {isAddModalOpen && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                        <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 400, padding: "var(--space-6)" }}>
                            <h3 style={{ marginBottom: "var(--space-4)" }}>Add New Employee</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="input" // Assuming global input class or style
                                    style={{ padding: "var(--space-3)", background: "var(--color-neutral-800)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", color: "white" }}
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    style={{ padding: "var(--space-3)", background: "var(--color-neutral-800)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", color: "white" }}
                                    value={newItem.email}
                                    onChange={e => setNewItem({ ...newItem, email: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Role"
                                        style={{ padding: "var(--space-3)", background: "var(--color-neutral-800)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", color: "white" }}
                                        value={newItem.role}
                                        onChange={e => setNewItem({ ...newItem, role: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Department"
                                        style={{ padding: "var(--space-3)", background: "var(--color-neutral-800)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", color: "white" }}
                                        value={newItem.department}
                                        onChange={e => setNewItem({ ...newItem, department: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3" style={{ marginTop: "var(--space-6)" }}>
                                <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddEmployee} disabled={submitting}>
                                    {submitting ? "Adding..." : "Add Employee"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
