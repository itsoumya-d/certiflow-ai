"use client";

import { useState } from "react";
import {
    Cloud,
    Github,
    Database,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Plus
} from "lucide-react";

// Mock data based on our new Integration Framework
const AVAILABLE_INTEGRATIONS = [
    {
        id: "aws",
        name: "Amazon Web Services",
        description: "Automated evidence collection for Cloud Infrastructure",
        category: "Cloud",
        icon: Cloud,
        connected: false,
    },
    {
        id: "github",
        name: "GitHub",
        description: "Source code retention and branch protection monitoring",
        category: "Version Control",
        icon: Github,
        connected: false,
    },
    {
        id: "postgres",
        name: "Production Database",
        description: "Backup verification and encryption monitoring",
        category: "Database",
        icon: Database,
        connected: false,
    },
];

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(AVAILABLE_INTEGRATIONS);
    const [connecting, setConnecting] = useState<string | null>(null);

    const handleConnect = async (id: string) => {
        setConnecting(id);
        // Simulate API call
        setTimeout(() => {
            setIntegrations(prev =>
                prev.map(int =>
                    int.id === id ? { ...int, connected: !int.connected } : int
                )
            );
            setConnecting(null);
        }, 1500);
    };

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Integrations</h1>
                    <p className="text-gray-400">
                        Connect your tools to automatically collect compliance evidence.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    Request Integration
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                    <div
                        key={integration.id}
                        className="group relative bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gray-900 rounded-lg group-hover:bg-gray-800 transition-colors">
                                <integration.icon className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${integration.connected
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-gray-800 text-gray-400 border-gray-700"
                                }`}>
                                {integration.connected ? "Connected" : "Disconnected"}
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">{integration.name}</h3>
                        <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                            {integration.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                {integration.category}
                            </span>

                            <button
                                onClick={() => handleConnect(integration.id)}
                                disabled={!!connecting}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${integration.connected
                                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                        : "bg-white text-black hover:bg-gray-200"
                                    }`}
                            >
                                {connecting === integration.id ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        {integration.connected ? "Disconnecting..." : "Connecting..."}
                                    </>
                                ) : (
                                    <>
                                        {integration.connected ? "Disconnect" : "Connect"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
