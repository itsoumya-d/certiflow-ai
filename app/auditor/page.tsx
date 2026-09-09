"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import {
    staggerContainer,
    staggerChild,
    fadeInUp,
} from "@/lib/animations";
import {
    Shield,
    CheckCircle2,
    AlertCircle,
    FileText,
    PieChart,
    Loader2
} from "lucide-react";

interface AuditorEvidenceItem {
    id: string;
    name: string;
    framework: string;
    controlId: string;
    status: string;
    collectedAt?: string;
    riskLevel?: string;
}

export default function AuditorDashboard() {
    const [evidence, setEvidence] = useState<AuditorEvidenceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/evidence");
                if (res.ok) {
                    const data = await res.json();
                    setEvidence(data.evidence);
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate stats
    const totalEvidence = evidence.length;
    const verifiedEvidence = evidence.filter(e => e.status === 'verified').length;
    const readinessScore = totalEvidence > 0 ? Math.round((verifiedEvidence / totalEvidence) * 100) : 0;
    const pendingReview = evidence.filter(e => e.status === 'pending' || e.status === 'analyzing').length;
    const criticalGaps = evidence.filter(e => e.riskLevel === 'high').length; // Assuming riskLevel exists or default 0

    return (
        <>
            <Sidebar />
            <main className="main-content">
                <div className="p-8 space-y-8">
                    {/* Auditor-specific gradient accent bar */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 280,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, var(--color-secondary-500), var(--color-accent-500))',
                        }}
                    />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">Audit Engagement Overview</h1>
                        <p className="text-gray-400">SOC 2 Type II • Audit Period: Jan 1, 2024 - Dec 31, 2024</p>
                    </motion.div>

                    {/* Audit Progress Stats */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div
                            className="bg-[#111] border border-gray-800 p-6 rounded-xl"
                            variants={staggerChild}
                            whileHover={{ y: -4, boxShadow: '0 0 40px -10px rgba(59, 130, 246, 0.3)' }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                                    In Progress
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{loading ? "-" : `${readinessScore}%`}</div>
                            <div className="text-sm text-gray-500">Readiness Score</div>
                        </motion.div>

                        <motion.div
                            className="bg-[#111] border border-gray-800 p-6 rounded-xl"
                            variants={staggerChild}
                            whileHover={{ y: -4, boxShadow: '0 0 40px -10px rgba(34, 197, 94, 0.3)' }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{loading ? "-" : verifiedEvidence}</div>
                            <div className="text-sm text-gray-500">Passed Controls</div>
                        </motion.div>

                        <motion.div
                            className="bg-[#111] border border-gray-800 p-6 rounded-xl"
                            variants={staggerChild}
                            whileHover={{ y: -4, boxShadow: '0 0 40px -10px rgba(245, 158, 11, 0.3)' }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{loading ? "-" : pendingReview}</div>
                            <div className="text-sm text-gray-500">Pending Review</div>
                        </motion.div>

                        <motion.div
                            className="bg-[#111] border border-gray-800 p-6 rounded-xl"
                            variants={staggerChild}
                            whileHover={{ y: -4, boxShadow: '0 0 40px -10px rgba(239, 68, 68, 0.3)' }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{loading ? "-" : criticalGaps}</div>
                            <div className="text-sm text-gray-500">Critical Gaps</div>
                        </motion.div>
                    </motion.div>

                    {/* Main Review Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Recent Evidence Uploads</h3>
                                <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                            </div>
                            <div className="divide-y divide-gray-800">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading evidence...</div>
                                ) : evidence.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No evidence uploaded yet.</div>
                                ) : (
                                    evidence.slice(0, 5).map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.framework} • {item.controlId} • {new Date(item.collectedAt || Date.now()).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${item.status === 'verified' ? 'border-green-800 text-green-400' : 'border-gray-700 text-gray-400'
                                                }`}>
                                                {item.status === 'verified' ? 'Verified' : 'Ready for Review'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Action Items */}
                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
                            <h3 className="font-semibold text-white mb-6">Audit Tasks</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Review HR Onboarding</h4>
                                        <p className="text-xs text-gray-500 mt-1">Samples for Q4 2024 needed</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-700" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400">Approve Pen Test Report</h4>
                                        <p className="text-xs text-gray-500 mt-1">Waiting on unblinded report</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-700" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400">Disaster Recovery Walkthrough</h4>
                                        <p className="text-xs text-gray-500 mt-1">Scheduled for Jan 15</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                                Generate Interim Report
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
