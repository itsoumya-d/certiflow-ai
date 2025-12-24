import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "json";
    const frameworkId = searchParams.get("framework");

    // Get compliance data
    const frameworks = db.getFrameworks();
    const stats = db.getComplianceStats();
    const evidence = db.getEvidence();
    const auditLogs = db.getAuditLogs(100);

    // Filter by framework if specified
    const controls = frameworkId
        ? db.getControlsByFramework(frameworkId)
        : frameworks.flatMap((f) => db.getControlsByFramework(f.id));

    const report = {
        generatedAt: new Date().toISOString(),
        organization: db.getOrganization("org-1"),
        complianceSummary: {
            overallScore: stats.score,
            totalControls: stats.total,
            passingControls: stats.passing,
            failingControls: stats.failing,
            pendingControls: stats.pending,
        },
        frameworks: frameworks.map((f) => {
            const fwControls = db.getControlsByFramework(f.id);
            const passing = fwControls.filter((c) => c.status === "passing").length;
            return {
                ...f,
                complianceScore: Math.round((passing / fwControls.length) * 100) || 0,
                controls: fwControls.length,
                passingControls: passing,
            };
        }),
        controlDetails: controls.map((c) => ({
            controlId: c.controlId,
            name: c.name,
            category: c.category,
            status: c.status,
            lastVerified: c.lastVerified,
            evidenceCount: c.evidenceIds.length,
        })),
        evidenceSummary: {
            total: evidence.length,
            verified: evidence.filter((e) => e.status === "verified").length,
            pending: evidence.filter((e) => e.status === "pending").length,
            aiCollected: evidence.filter((e) => e.collectedBy === "ai-agent").length,
        },
        recentActivity: auditLogs.slice(0, 20),
    };

    if (format === "csv") {
        // Generate CSV for controls
        const csvHeader = [
            "Control ID",
            "Name",
            "Category",
            "Status",
            "Last Verified",
            "Evidence Count",
        ].join(",");

        const csvRows = controls.map((c) =>
            [
                c.controlId,
                `"${c.name}"`,
                `"${c.category}"`,
                c.status,
                c.lastVerified || "N/A",
                c.evidenceIds.length,
            ].join(",")
        );

        const csv = [csvHeader, ...csvRows].join("\n");

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="compliance-report-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    }

    // Default: Return JSON
    return NextResponse.json(report, {
        headers: {
            "Content-Disposition": `attachment; filename="compliance-report-${new Date().toISOString().split("T")[0]}.json"`,
        },
    });
}
