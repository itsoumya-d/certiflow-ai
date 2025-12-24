/**
 * Computer Use Agent - Simulated Implementation
 *
 * This module simulates the Gemini 2.5 Computer Use API for autonomous
 * navigation and evidence collection. When the real API becomes available,
 * this can be swapped out with minimal changes.
 */

export interface NavigationTask {
    id: string;
    type: "navigate" | "click" | "screenshot" | "verify" | "extract";
    target: string;
    params?: Record<string, string>;
}

export interface TaskResult {
    taskId: string;
    status: "success" | "failure" | "pending";
    screenshot?: string; // Base64 encoded
    extractedData?: Record<string, unknown>;
    error?: string;
    timestamp: string;
}

export interface AgentSession {
    id: string;
    status: "active" | "completed" | "failed";
    tasks: NavigationTask[];
    results: TaskResult[];
    startedAt: string;
    completedAt?: string;
}

// Simulated task execution delays (ms)
const TASK_DELAYS: Record<string, number> = {
    navigate: 2000,
    click: 500,
    screenshot: 1000,
    verify: 3000,
    extract: 2500,
};

/**
 * Simulated Computer Use Agent
 */
export class ComputerUseAgent {
    private session: AgentSession | null = null;

    /**
     * Start a new agent session
     */
    async startSession(): Promise<string> {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.session = {
            id: sessionId,
            status: "active",
            tasks: [],
            results: [],
            startedAt: new Date().toISOString(),
        };

        console.log(`[ComputerUseAgent] Session started: ${sessionId}`);
        return sessionId;
    }

    /**
     * Execute a single navigation task
     */
    async executeTask(task: NavigationTask): Promise<TaskResult> {
        if (!this.session || this.session.status !== "active") {
            throw new Error("No active session");
        }

        this.session.tasks.push(task);

        // Simulate task execution delay
        const delay = TASK_DELAYS[task.type] || 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Generate simulated result based on task type
        const result = this.simulateTaskResult(task);
        this.session.results.push(result);

        console.log(`[ComputerUseAgent] Task ${task.id} completed:`, result.status);
        return result;
    }

    /**
     * Execute a workflow of multiple tasks
     */
    async executeWorkflow(
        tasks: NavigationTask[]
    ): Promise<{ sessionId: string; results: TaskResult[] }> {
        const sessionId = await this.startSession();

        const results: TaskResult[] = [];

        for (const task of tasks) {
            try {
                const result = await this.executeTask(task);
                results.push(result);

                // Stop if a task fails
                if (result.status === "failure") {
                    console.log(`[ComputerUseAgent] Workflow stopped due to task failure`);
                    break;
                }
            } catch (error) {
                console.error(`[ComputerUseAgent] Task error:`, error);
                break;
            }
        }

        await this.endSession();

        return { sessionId, results };
    }

    /**
     * End the current session
     */
    async endSession(): Promise<void> {
        if (this.session) {
            this.session.status = "completed";
            this.session.completedAt = new Date().toISOString();
            console.log(`[ComputerUseAgent] Session ended: ${this.session.id}`);
        }
    }

    /**
     * Get the current session
     */
    getSession(): AgentSession | null {
        return this.session;
    }

    /**
     * Simulate task results based on task type
     */
    private simulateTaskResult(task: NavigationTask): TaskResult {
        const timestamp = new Date().toISOString();

        switch (task.type) {
            case "navigate":
                return {
                    taskId: task.id,
                    status: "success",
                    timestamp,
                    extractedData: {
                        url: task.target,
                        title: `Page: ${task.target}`,
                    },
                };

            case "screenshot":
                return {
                    taskId: task.id,
                    status: "success",
                    screenshot: this.generateMockScreenshot(task.target),
                    timestamp,
                };

            case "verify":
                // Simulate verification with 90% success rate
                const isVerified = Math.random() < 0.9;
                return {
                    taskId: task.id,
                    status: isVerified ? "success" : "failure",
                    timestamp,
                    extractedData: {
                        verified: isVerified,
                        control: task.target,
                        details: isVerified
                            ? "Control verified successfully"
                            : "Verification failed - control not properly configured",
                    },
                };

            case "extract":
                return {
                    taskId: task.id,
                    status: "success",
                    timestamp,
                    extractedData: this.generateMockExtractedData(task.target),
                };

            case "click":
                return {
                    taskId: task.id,
                    status: "success",
                    timestamp,
                };

            default:
                return {
                    taskId: task.id,
                    status: "success",
                    timestamp,
                };
        }
    }

    /**
     * Generate a mock screenshot (placeholder)
     */
    private generateMockScreenshot(target: string): string {
        // In real implementation, this would be actual screenshot data
        return `data:image/svg+xml;base64,${Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <text x="400" y="280" text-anchor="middle" fill="#64748b" font-size="16">
          Screenshot: ${target}
        </text>
        <text x="400" y="320" text-anchor="middle" fill="#10b981" font-size="12">
          Captured at ${new Date().toISOString()}
        </text>
      </svg>`
        ).toString("base64")}`;
    }

    /**
     * Generate mock extracted data based on target
     */
    private generateMockExtractedData(target: string): Record<string, unknown> {
        const mockData: Record<string, Record<string, unknown>> = {
            "aws-s3-encryption": {
                bucketName: "company-data-bucket",
                encryptionEnabled: true,
                encryptionType: "AES-256",
                kmsKeyId: "arn:aws:kms:us-east-1:123456789:key/xxx",
            },
            "aws-mfa": {
                usersWithMfa: 45,
                usersWithoutMfa: 0,
                mfaEnforced: true,
                rootMfaEnabled: true,
            },
            "github-branch-protection": {
                protectedBranches: ["main", "develop", "release/*"],
                requireReviews: true,
                requiredReviewers: 2,
                dismissStaleReviews: true,
                requireCodeOwners: true,
            },
            "okta-mfa": {
                mfaPolicy: "Required",
                allowedFactors: ["Okta Verify", "Google Authenticator", "YubiKey"],
                enforcementMode: "Always",
            },
        };

        // Return matching mock data or generic data
        const key = Object.keys(mockData).find((k) =>
            target.toLowerCase().includes(k.replace("-", " "))
        );

        return (
            mockData[key || ""] || {
                target,
                status: "verified",
                timestamp: new Date().toISOString(),
            }
        );
    }
}

// Pre-built verification workflows
export const VERIFICATION_WORKFLOWS = {
    awsS3Encryption: [
        { id: "nav-1", type: "navigate" as const, target: "AWS Console > S3" },
        { id: "click-1", type: "click" as const, target: "Select Bucket" },
        { id: "nav-2", type: "navigate" as const, target: "Bucket Properties" },
        {
            id: "verify-1",
            type: "verify" as const,
            target: "Default encryption enabled",
        },
        { id: "screenshot-1", type: "screenshot" as const, target: "Encryption Settings" },
        { id: "extract-1", type: "extract" as const, target: "aws-s3-encryption" },
    ],

    awsMfa: [
        { id: "nav-1", type: "navigate" as const, target: "AWS Console > IAM" },
        { id: "nav-2", type: "navigate" as const, target: "Users" },
        { id: "verify-1", type: "verify" as const, target: "MFA enabled for all users" },
        { id: "screenshot-1", type: "screenshot" as const, target: "MFA Status" },
        { id: "extract-1", type: "extract" as const, target: "aws-mfa" },
    ],

    githubBranchProtection: [
        { id: "nav-1", type: "navigate" as const, target: "GitHub > Repository Settings" },
        { id: "nav-2", type: "navigate" as const, target: "Branches" },
        { id: "verify-1", type: "verify" as const, target: "Branch protection rules" },
        { id: "screenshot-1", type: "screenshot" as const, target: "Protection Rules" },
        { id: "extract-1", type: "extract" as const, target: "github-branch-protection" },
    ],

    oktaMfa: [
        { id: "nav-1", type: "navigate" as const, target: "Okta Admin > Security" },
        { id: "nav-2", type: "navigate" as const, target: "Multifactor" },
        { id: "verify-1", type: "verify" as const, target: "MFA policy enforcement" },
        { id: "screenshot-1", type: "screenshot" as const, target: "MFA Policy" },
        { id: "extract-1", type: "extract" as const, target: "okta-mfa" },
    ],
};

// Export singleton instance
export const computerUseAgent = new ComputerUseAgent();
