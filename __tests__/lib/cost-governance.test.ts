import {
    InferenceSpendGovernor,
    TenantBudgetPolicy,
} from "../../lib/cost-governance";

describe("InferenceSpendGovernor", () => {
    let governor: InferenceSpendGovernor;

    beforeEach(() => {
        governor = new InferenceSpendGovernor();
    });

    describe("Cost Calculation", () => {
        it("calculates correct inference cost for Gemini 1.5 Pro", () => {
            // 1,000,000 prompt tokens = $3.50, 500,000 completion tokens = $5.25 -> Total $8.75
            const cost = governor.calculateCost("gemini-1.5-pro", 1_000_000, 500_000);
            expect(cost).toBe(8.75);
        });

        it("calculates cost for Gemini 1.5 Flash micro-batches", () => {
            // 10,000 prompt tokens: (10,000 / 1,000,000) * 0.075 = $0.00075
            // 5,000 completion tokens: (5,000 / 1,000,000) * 0.30 = $0.0015
            // Total = $0.00225
            const cost = governor.calculateCost("gemini-1.5-flash", 10_000, 5_000);
            expect(cost).toBe(0.00225);
        });

        it("falls back to default pricing for unrecognized models", () => {
            const cost = governor.calculateCost("custom-fine-tuned-model", 100_000, 50_000);
            expect(cost).toBeGreaterThan(0);
        });

        it("supports custom registered model pricing", () => {
            governor.registerPricing({
                modelId: "llama-3-70b-instruct",
                displayName: "Llama 3 70B",
                provider: "aws-bedrock",
                costPerMillionInputTokens: 0.99,
                costPerMillionOutputTokens: 2.99,
            });

            const cost = governor.calculateCost("llama-3-70b-instruct", 1_000_000, 1_000_000);
            expect(cost).toBe(3.98);
        });
    });

    describe("Budget Enforcement & Quota Policies", () => {
        const tenantId = "tenant-enterprise-acme";

        beforeEach(() => {
            const policy: TenantBudgetPolicy = {
                tenantId,
                monthlyBudgetUsd: 10.0,
                warningThresholdPercent: 80,
                hardLimitEnforced: true,
                maxSingleInferenceCostUsd: 2.5,
            };
            governor.setBudget(policy);
        });

        it("allows execution when well within budget", () => {
            const status = governor.getBudgetStatus(tenantId, 0.5);
            expect(status.canExecute).toBe(true);
            expect(status.isWarning).toBe(false);
            expect(status.isExceeded).toBe(false);
            expect(status.remainingBudgetUsd).toBe(10.0);
        });

        it("flags warning when spend reaches warning threshold", () => {
            // Spend $8.50 on a $10 budget (85% used)
            governor.recordUsage({
                tenantId,
                agentId: "agent-compliance-auditor",
                modelId: "claude-3-5-sonnet",
                promptTokens: 1_000_000, // $3.00
                completionTokens: 366_667, // ~$5.50
            });

            const status = governor.getBudgetStatus(tenantId);
            expect(status.isWarning).toBe(true);
            expect(status.percentUsed).toBeGreaterThanOrEqual(80);
            expect(status.canExecute).toBe(true);
        });

        it("denies execution when hard limit is breached", () => {
            // First record spend up to $9.50
            governor.recordUsage({
                tenantId,
                agentId: "agent-doc-reviewer",
                modelId: "gemini-1.5-pro",
                promptTokens: 2_000_000, // $7.00
                completionTokens: 238_095, // ~$2.50
            });

            // Attempt inference costing $1.00 (projected $10.50 > $10.00 cap)
            const status = governor.getBudgetStatus(tenantId, 1.0);
            expect(status.canExecute).toBe(false);
            expect(status.isExceeded).toBe(true);
            expect(status.denialReason).toContain("Budget exceeded");
        });

        it("denies execution when single inference exceeds max cost cap", () => {
            // Cap is $2.50; projected inference is $3.00
            const status = governor.getBudgetStatus(tenantId, 3.0);
            expect(status.canExecute).toBe(false);
            expect(status.denialReason).toContain("Single inference cost cap exceeded");
        });

        it("enforces burst velocity rate limit in rapid execution bursts", () => {
            const burstTenantId = "tenant-burst-protect";
            governor.setBudget({
                tenantId: burstTenantId,
                monthlyBudgetUsd: 100.0,
                warningThresholdPercent: 90,
                hardLimitEnforced: true,
                burstWindowMinutes: 5,
                burstSpendThresholdUsd: 5.0,
            });

            // Simulate $4.50 spend right now
            governor.recordUsage({
                tenantId: burstTenantId,
                agentId: "agent-worker",
                modelId: "gemini-1.5-pro",
                promptTokens: 1_000_000, // $3.50
                completionTokens: 95_238, // ~$1.00
                timestamp: new Date().toISOString(),
            });

            // Attempt another $1.00 within the 5m window ($5.50 > $5.00 limit)
            const status = governor.getBudgetStatus(burstTenantId, 1.0);
            expect(status.canExecute).toBe(false);
            expect(status.denialReason).toContain("Velocity rate limit exceeded");
        });
    });

    describe("Spend Metrics & Audit Export", () => {
        const tenantId = "tenant-compliance-org";

        beforeEach(() => {
            governor.recordUsage({
                tenantId,
                agentId: "agent-audit-scanner",
                modelId: "gemini-1.5-flash",
                promptTokens: 100_000,
                completionTokens: 20_000,
            });

            governor.recordUsage({
                tenantId,
                agentId: "agent-remediation-bot",
                modelId: "gemini-1.5-pro",
                promptTokens: 50_000,
                completionTokens: 10_000,
            });
        });

        it("aggregates spend by model and by agent accurately", () => {
            const metrics = governor.getSpendMetrics(tenantId);

            expect(metrics.totalInferences).toBe(2);
            expect(metrics.totalTokens).toBe(180_000);
            expect(metrics.totalSpendUsd).toBeGreaterThan(0);
            expect(metrics.spendByModel["gemini-1.5-flash"]).toBeDefined();
            expect(metrics.spendByModel["gemini-1.5-pro"]).toBeDefined();
            expect(metrics.spendByAgent["agent-audit-scanner"].inferences).toBe(1);
            expect(metrics.spendByAgent["agent-remediation-bot"].inferences).toBe(1);
        });

        it("exports an audit record aligned with ISO-42001 and SOC 2", () => {
            const audit = governor.exportAuditRecord(tenantId);

            expect(audit.auditType).toBe("AI_INFERENCE_COST_GOVERNANCE");
            expect(audit.frameworkAlignment).toEqual(["ISO-42001", "SOC-2-CC6.6", "SOC-2-CC9.1"]);
            expect(audit.tenantId).toBe(tenantId);
            expect(audit.totalInferences).toBe(2);
            expect(Array.isArray(audit.modelsUsed)).toBe(true);
        });
    });
});
