import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Health check and stats endpoint
 * GET /api/health
 */
export async function GET(request: NextRequest) {
    const stats = db.getComplianceStats();
    const frameworks = db.getFrameworks();
    const evidence = db.getEvidence();

    // Memory usage stats
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // Health checks
    const checks = [
        { name: "database", status: "pass", message: "In-memory DB working" },
        { name: "auth", status: process.env.NEXTAUTH_SECRET ? "pass" : "fail", message: process.env.NEXTAUTH_SECRET ? "Auth configured" : "Missing NEXTAUTH_SECRET" },
        { name: "gemini", status: process.env.GEMINI_API_KEY ? "pass" : "warn", message: process.env.GEMINI_API_KEY ? "API key present" : "AI features disabled" },
        { name: "memory", status: heapUsedMB < heapTotalMB * 0.9 ? "pass" : "warn", message: `${heapUsedMB}MB / ${heapTotalMB}MB` },
    ];

    const hasFailure = checks.some(c => c.status === "fail");

    return NextResponse.json({
        status: hasFailure ? "degraded" : "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0-mvp",
        environment: process.env.NODE_ENV || "development",
        uptime: Math.floor(process.uptime()),
        checks,
        features: {
            authentication: true,
            rbac: true,
            aiIntegration: !!process.env.GEMINI_API_KEY,
            computerUse: "simulated",
        },
        stats: {
            complianceScore: stats.score,
            totalControls: stats.total,
            passingControls: stats.passing,
            failingControls: stats.failing,
            pendingControls: stats.pending,
            frameworks: frameworks.length,
            evidenceItems: evidence.length,
        },
        memory: {
            heapUsed: heapUsedMB,
            heapTotal: heapTotalMB,
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
        },
    });
}
