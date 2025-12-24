import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import {
    computerUseAgent,
    VERIFICATION_WORKFLOWS,
    NavigationTask,
} from "@/lib/agents/computer-use";

// In-memory task history (use database in production)
const taskHistory: Array<{
    id: string;
    workflow: string;
    status: string;
    startedAt: string;
    completedAt?: string;
    results?: unknown;
}> = [];

/**
 * POST /api/agents/execute - Execute an agent workflow
 */
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { workflow, customTasks } = body as {
            workflow?: keyof typeof VERIFICATION_WORKFLOWS;
            customTasks?: NavigationTask[];
        };

        let tasks: NavigationTask[];

        if (workflow && VERIFICATION_WORKFLOWS[workflow]) {
            tasks = VERIFICATION_WORKFLOWS[workflow];
        } else if (customTasks && customTasks.length > 0) {
            tasks = customTasks;
        } else {
            return NextResponse.json(
                {
                    error: "Invalid request. Provide 'workflow' name or 'customTasks' array.",
                    availableWorkflows: Object.keys(VERIFICATION_WORKFLOWS),
                },
                { status: 400 }
            );
        }

        const executionId = `exec-${Date.now()}`;

        // Record start
        taskHistory.push({
            id: executionId,
            workflow: workflow || "custom",
            status: "running",
            startedAt: new Date().toISOString(),
        });

        // Execute workflow
        const { sessionId, results } = await computerUseAgent.executeWorkflow(tasks);

        // Update history
        const historyEntry = taskHistory.find((h) => h.id === executionId);
        if (historyEntry) {
            historyEntry.status = results.every((r) => r.status === "success")
                ? "completed"
                : "failed";
            historyEntry.completedAt = new Date().toISOString();
            historyEntry.results = results;
        }

        // Keep only last 50 entries
        while (taskHistory.length > 50) {
            taskHistory.shift();
        }

        return NextResponse.json({
            executionId,
            sessionId,
            status: historyEntry?.status,
            tasksExecuted: results.length,
            results: results.map((r) => ({
                taskId: r.taskId,
                status: r.status,
                hasScreenshot: !!r.screenshot,
                extractedData: r.extractedData,
            })),
        });
    } catch (error) {
        console.error("Agent execution failed:", error);
        return NextResponse.json(
            { error: "Execution failed" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/agents/execute - Get execution history or available workflows
 */
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "workflows") {
        // Return available workflows with descriptions
        return NextResponse.json({
            workflows: {
                awsS3Encryption: {
                    name: "AWS S3 Encryption",
                    description: "Verify S3 bucket encryption settings",
                    steps: VERIFICATION_WORKFLOWS.awsS3Encryption.length,
                    controls: ["CC6.1", "CC6.7"],
                },
                awsMfa: {
                    name: "AWS MFA",
                    description: "Check MFA enforcement for all IAM users",
                    steps: VERIFICATION_WORKFLOWS.awsMfa.length,
                    controls: ["CC6.1", "CC6.2"],
                },
                githubBranchProtection: {
                    name: "GitHub Branch Protection",
                    description: "Verify branch protection rules",
                    steps: VERIFICATION_WORKFLOWS.githubBranchProtection.length,
                    controls: ["CC8.1"],
                },
                oktaMfa: {
                    name: "Okta MFA",
                    description: "Check Okta MFA policy configuration",
                    steps: VERIFICATION_WORKFLOWS.oktaMfa.length,
                    controls: ["CC6.1", "CC6.2"],
                },
            },
        });
    }

    // Default: return task history
    return NextResponse.json({
        history: taskHistory.slice(-20).reverse(),
        total: taskHistory.length,
    });
}
