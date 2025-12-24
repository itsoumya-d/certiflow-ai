import { NextRequest, NextResponse } from "next/server";
import {
    computerUseAgent,
    VERIFICATION_WORKFLOWS,
} from "@/lib/agents/computer-use";
import { verifyControl } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { controlId, controlName, workflowType, configData } = body;

        if (!controlId || !controlName) {
            return NextResponse.json(
                { error: "Control ID and name are required" },
                { status: 400 }
            );
        }

        // If workflow type provided, run automated verification
        if (
            workflowType &&
            workflowType in VERIFICATION_WORKFLOWS
        ) {
            const workflow =
                VERIFICATION_WORKFLOWS[
                workflowType as keyof typeof VERIFICATION_WORKFLOWS
                ];
            const result = await computerUseAgent.executeWorkflow(workflow);

            return NextResponse.json({
                controlId,
                controlName,
                verificationMethod: "computer-use",
                sessionId: result.sessionId,
                results: result.results,
                status: result.results.every((r) => r.status === "success")
                    ? "pass"
                    : "fail",
                timestamp: new Date().toISOString(),
            });
        }

        // If config data provided, use Gemini for analysis
        if (configData && process.env.GEMINI_API_KEY) {
            const result = await verifyControl(controlId, controlName, configData);
            return NextResponse.json({
                controlId,
                controlName,
                verificationMethod: "gemini-analysis",
                ...result,
                timestamp: new Date().toISOString(),
            });
        }

        // Demo mode response
        return NextResponse.json({
            controlId,
            controlName,
            verificationMethod: "demo",
            status: "pass",
            findings: [
                "Control configuration verified",
                "Required policies are in place",
                "No anomalies detected",
            ],
            evidence: "Automated verification completed successfully",
            confidence: 0.95,
            timestamp: new Date().toISOString(),
            demo: true,
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "Failed to verify control" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return available verification workflows
    return NextResponse.json({
        availableWorkflows: Object.keys(VERIFICATION_WORKFLOWS).map((key) => ({
            id: key,
            name: key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim(),
            steps:
                VERIFICATION_WORKFLOWS[key as keyof typeof VERIFICATION_WORKFLOWS]
                    .length,
        })),
    });
}
