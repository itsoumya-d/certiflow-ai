"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileCheck, LogOut, FileText } from "lucide-react";

export default function AuditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: "Audit Overview", href: "/auditor", icon: Shield },
        { name: "Evidence Review", href: "/auditor/evidence", icon: FileCheck },
        { name: "Reports", href: "/auditor/reports", icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-800 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                            CertiFlow Auditor
                        </span>
                    </div>

                    <div className="px-3 py-2 bg-blue-900/20 text-blue-400 rounded-lg mb-6 text-sm font-medium border border-blue-900/50">
                        <span className="block text-xs uppercase opacity-70 mb-1">Audit Firm</span>
                        {session?.user?.organization || "External Auditor"}
                    </div>

                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Safe Exit</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-black">
                    {children}
                </main>
            </div>
        </div>
    );
}
