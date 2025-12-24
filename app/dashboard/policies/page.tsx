"use client";

import { useState } from "react";
import {
    FileText,
    Shield,
    Clock,
    CheckCircle2,
    AlertTriangle,
    MoreVertical,
    Plus
} from "lucide-react";

import { POLICY_TEMPLATES } from "@/lib/policies";

// Seed policies from our verified templates
const MOCK_POLICIES = POLICY_TEMPLATES.map((tmpl, index) => ({
    id: `pol-${tmpl.id}`,
    title: tmpl.title,
    version: "v1.0 (Draft)",
    status: index === 0 ? "active" : "draft", // Make first one active for demo
    lastReview: index === 0 ? new Date().toISOString().split('T')[0] : "-",
    owner: "System Template",
    frameworks: ["SOC 2"], // Default to SOC 2 for these templates
    category: tmpl.category
}));

export default function PoliciesPage() {
    const [policies, setPolicies] = useState(MOCK_POLICIES);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500/10 text-green-400 border-green-500/20";
            case "review": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "draft": return "bg-gray-800 text-gray-400 border-gray-700";
            default: return "bg-gray-800 text-gray-400";
        }
    };

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Policy Management</h1>
                    <p className="text-gray-400">
                        Create, review, and approve organization security policies.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Policy
                </button>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400 bg-gray-900/50">
                    <div className="col-span-4">Policy Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Version</div>
                    <div className="col-span-2">Last Review</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-800">
                    {policies.map((policy) => (
                        <div
                            key={policy.id}
                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
                        >
                            <div className="col-span-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                            {policy.title}
                                        </h3>
                                        <div className="flex gap-2 mt-1">
                                            {policy.frameworks.map(fw => (
                                                <span key={fw} className="text-[10px] uppercase tracking-wider bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">
                                                    {fw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(policy.status)} capitalize`}>
                                    {policy.status}
                                </span>
                            </div>

                            <div className="col-span-2 text-sm text-gray-300">
                                {policy.version}
                            </div>

                            <div className="col-span-2 flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                {policy.lastReview}
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
