import {
    Shield,
    CheckCircle2,
    Lock,
    Server,
    FileCheck,
    Download
} from "lucide-react";
import Link from "next/link";

export default function TrustCenter() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">CertiFlow</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Powered by CertiFlow Trust</span>
                        <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
                            Request Access
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 border-b border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-6">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">All Systems Operational</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Security & Compliance Center
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Transparency is our core value. Review our real-time security posture, compliance certifications, and data protection policies.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                            Request SOC 2 Report
                        </button>
                        <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
                            View Subprocessors
                        </button>
                    </div>
                </div>
            </div>

            {/* Certifications */}
            <div className="py-20 px-6 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold mb-10 text-center">Certifications & Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 border border-blue-900/50">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">SOC 2 Type II</h3>
                            <p className="text-gray-400 mb-6 text-sm">
                                Independent audit confirming our controls for security, availability, and confidentiality.
                            </p>
                            <span className="text-xs font-mono text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
                                Verified • Period 2024
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Controls */}
            <div className="py-20 px-6 border-t border-gray-800">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-10">Live Security Controls</h2>
                    <div className="grid gap-4">
                        {[
                            { name: "Data Encryption", status: "Enforced (AES-256)", icon: Lock },
                            { name: "Access Control", status: "MFA Required", icon: Shield },
                            { name: "Infrastructure Security", status: "Daily Scans", icon: Server },
                            { name: "Incident Response", status: "Tested Q4 2024", icon: FileCheck },
                        ].map((control) => (
                            <div key={control.name} className="flex items-center justify-between p-4 bg-[#111] border border-gray-800 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                                        <control.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">{control.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">{control.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                <p>© 2025 CertiFlow AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
