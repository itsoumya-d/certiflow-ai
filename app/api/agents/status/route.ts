import { NextRequest } from "next/server";

// Agent status types
interface AgentStatus {
    id: string;
    name: string;
    status: "running" | "idle" | "paused" | "error";
    currentTask: string | null;
    progress: number;
    lastUpdate: string;
    tasksCompleted: number;
    errorMessage?: string;
}

// Simulated agent state (in production, this would come from a database or message queue)
const agents: AgentStatus[] = [
    {
        id: "agent-1",
        name: "Evidence Collector",
        status: "running",
        currentTask: "Collecting AWS S3 bucket encryption settings",
        progress: 65,
        lastUpdate: new Date().toISOString(),
        tasksCompleted: 12,
    },
    {
        id: "agent-2",
        name: "Control Verifier",
        status: "running",
        currentTask: "Verifying MFA configuration across user accounts",
        progress: 40,
        lastUpdate: new Date().toISOString(),
        tasksCompleted: 8,
    },
    {
        id: "agent-3",
        name: "Remediation Agent",
        status: "idle",
        currentTask: null,
        progress: 0,
        lastUpdate: new Date().toISOString(),
        tasksCompleted: 5,
    },
    {
        id: "agent-4",
        name: "Compliance Mapper",
        status: "idle",
        currentTask: null,
        progress: 0,
        lastUpdate: new Date().toISOString(),
        tasksCompleted: 3,
    },
];

// Simulate agent activity
function simulateAgentActivity(): AgentStatus[] {
    const tasks = [
        "Scanning IAM policies for compliance gaps",
        "Collecting security group configurations",
        "Verifying encryption-at-rest settings",
        "Checking access review logs",
        "Mapping SOC 2 controls to ISO 27001",
        "Analyzing CloudTrail logs for anomalies",
        "Verifying backup configurations",
        "Collecting penetration test evidence",
    ];

    return agents.map((agent) => {
        if (agent.status === "running") {
            // Update progress
            const newProgress = agent.progress + Math.floor(Math.random() * 15);
            if (newProgress >= 100) {
                // Task completed, start new one or go idle
                if (Math.random() > 0.3) {
                    return {
                        ...agent,
                        currentTask: tasks[Math.floor(Math.random() * tasks.length)],
                        progress: 0,
                        tasksCompleted: agent.tasksCompleted + 1,
                        lastUpdate: new Date().toISOString(),
                    };
                } else {
                    return {
                        ...agent,
                        status: "idle" as const,
                        currentTask: null,
                        progress: 0,
                        tasksCompleted: agent.tasksCompleted + 1,
                        lastUpdate: new Date().toISOString(),
                    };
                }
            }
            return {
                ...agent,
                progress: newProgress,
                lastUpdate: new Date().toISOString(),
            };
        } else if (agent.status === "idle" && Math.random() > 0.7) {
            // Random chance to start a new task
            return {
                ...agent,
                status: "running" as const,
                currentTask: tasks[Math.floor(Math.random() * tasks.length)],
                progress: 0,
                lastUpdate: new Date().toISOString(),
            };
        }
        return agent;
    });
}

// SSE endpoint for real-time agent updates
export async function GET(request: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Send initial state
            const initialData = JSON.stringify({
                type: "initial",
                agents: agents,
                timestamp: new Date().toISOString(),
            });
            controller.enqueue(encoder.encode(`data: ${initialData}\n\n`));

            // Set up interval for updates
            const intervalId = setInterval(() => {
                try {
                    // Simulate agent activity
                    const updatedAgents = simulateAgentActivity();
                    agents.splice(0, agents.length, ...updatedAgents);

                    const updateData = JSON.stringify({
                        type: "update",
                        agents: updatedAgents,
                        timestamp: new Date().toISOString(),
                    });
                    controller.enqueue(encoder.encode(`data: ${updateData}\n\n`));
                } catch (error) {
                    console.error("SSE stream error:", error);
                    clearInterval(intervalId);
                    controller.close();
                }
            }, 3000); // Update every 3 seconds

            // Handle client disconnect
            request.signal.addEventListener("abort", () => {
                clearInterval(intervalId);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
