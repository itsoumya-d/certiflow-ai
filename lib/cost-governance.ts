import { randomUUID } from "crypto";

export interface ModelPricing {
    modelId: string;
    displayName: string;
    provider: "google" | "openai" | "anthropic" | "aws-bedrock";
    costPerMillionInputTokens: number;
    costPerMillionOutputTokens: number;
}

export const DEFAULT_MODEL_PRICING: Record<string, ModelPricing> = {
    "gemini-1.5-pro": {
        modelId: "gemini-1.5-pro",
        displayName: "Gemini 1.5 Pro",
        provider: "google",
        costPerMillionInputTokens: 3.5,
        costPerMillionOutputTokens: 10.5,
    },
    "gemini-1.5-flash": {
        modelId: "gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        provider: "google",
        costPerMillionInputTokens: 0.075,
        costPerMillionOutputTokens: 0.3,
    },
    "gemini-2.0-flash-lite": {
        modelId: "gemini-2.0-flash-lite",
        displayName: "Gemini 2.0 Flash Lite",
        provider: "google",
        costPerMillionInputTokens: 0.0375,
        costPerMillionOutputTokens: 0.15,
    },
    "claude-3-5-sonnet": {
        modelId: "claude-3-5-sonnet",
        displayName: "Claude 3.5 Sonnet",
        provider: "anthropic",
        costPerMillionInputTokens: 3.0,
        costPerMillionOutputTokens: 15.0,
    },
    "gpt-4o": {
        modelId: "gpt-4o",
        displayName: "GPT-4o",
        provider: "openai",
        costPerMillionInputTokens: 2.5,
        costPerMillionOutputTokens: 10.0,
    },
};

export interface UsageRecord {
    id: string;
    tenantId: string;
    agentId: string;
    modelId: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd: number;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface TenantBudgetPolicy {
    tenantId: string;
    monthlyBudgetUsd: number;
    warningThresholdPercent: number; // e.g. 80
    hardLimitEnforced: boolean;
    maxSingleInferenceCostUsd?: number;
    burstWindowMinutes?: number;
    burstSpendThresholdUsd?: number;
}

export interface BudgetStatus {
    tenantId: string;
    monthlyBudgetUsd: number;
    totalSpendUsd: number;
    remainingBudgetUsd: number;
    percentUsed: number;
    isWarning: boolean;
    isExceeded: boolean;
    canExecute: boolean;
    denialReason?: string;
}

export interface SpendMetrics {
    tenantId: string;
    totalSpendUsd: number;
    totalTokens: number;
    totalInferences: number;
    spendByModel: Record<string, { spendUsd: number; tokens: number; inferences: number }>;
    spendByAgent: Record<string, { spendUsd: number; tokens: number; inferences: number }>;
    recentInferences: UsageRecord[];
}

export class InferenceSpendGovernor {
    private pricing: Map<string, ModelPricing> = new Map();
    private budgets: Map<string, TenantBudgetPolicy> = new Map();
    private usageLedger: UsageRecord[] = [];

    constructor(initialPricing = DEFAULT_MODEL_PRICING) {
        Object.values(initialPricing).forEach((p) => this.pricing.set(p.modelId, p));
    }

    public registerPricing(pricing: ModelPricing): void {
        this.pricing.set(pricing.modelId, pricing);
    }

    public getPricing(modelId: string): ModelPricing {
        const found = this.pricing.get(modelId);
        if (!found) {
            return {
                modelId,
                displayName: modelId,
                provider: "google",
                costPerMillionInputTokens: 1.0,
                costPerMillionOutputTokens: 3.0,
            };
        }
        return found;
    }

    public calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
        const pricing = this.getPricing(modelId);
        const inputCost = (promptTokens / 1_000_000) * pricing.costPerMillionInputTokens;
        const outputCost = (completionTokens / 1_000_000) * pricing.costPerMillionOutputTokens;
        return Number((inputCost + outputCost).toFixed(6));
    }

    public setBudget(policy: TenantBudgetPolicy): void {
        this.budgets.set(policy.tenantId, policy);
    }

    public getBudget(tenantId: string): TenantBudgetPolicy | undefined {
        return this.budgets.get(tenantId);
    }

    public getBudgetStatus(tenantId: string, estimatedCostUsd = 0): BudgetStatus {
        const policy = this.budgets.get(tenantId) || {
            tenantId,
            monthlyBudgetUsd: Infinity,
            warningThresholdPercent: 80,
            hardLimitEnforced: false,
        };

        const totalSpendUsd = this.usageLedger
            .filter((u) => u.tenantId === tenantId)
            .reduce((sum, u) => sum + u.costUsd, 0);

        const projectedSpend = totalSpendUsd + estimatedCostUsd;
        const remainingBudgetUsd = Math.max(0, policy.monthlyBudgetUsd - totalSpendUsd);
        const percentUsed =
            policy.monthlyBudgetUsd === Infinity || policy.monthlyBudgetUsd === 0
                ? 0
                : Number(((totalSpendUsd / policy.monthlyBudgetUsd) * 100).toFixed(2));
        const isWarning = policy.monthlyBudgetUsd !== Infinity && percentUsed >= policy.warningThresholdPercent;
        const isExceeded = policy.monthlyBudgetUsd !== Infinity && projectedSpend > policy.monthlyBudgetUsd;

        let canExecute = true;
        let denialReason: string | undefined;

        if (policy.hardLimitEnforced && isExceeded) {
            canExecute = false;
            denialReason = `Budget exceeded: projected spend ($${projectedSpend.toFixed(4)}) exceeds monthly cap ($${policy.monthlyBudgetUsd.toFixed(2)})`;
        } else if (policy.maxSingleInferenceCostUsd && estimatedCostUsd > policy.maxSingleInferenceCostUsd) {
            canExecute = false;
            denialReason = `Single inference cost cap exceeded: estimated cost ($${estimatedCostUsd.toFixed(4)}) > limit ($${policy.maxSingleInferenceCostUsd.toFixed(4)})`;
        }

        if (canExecute && policy.burstSpendThresholdUsd && policy.burstWindowMinutes) {
            const cutoffTime = new Date(Date.now() - policy.burstWindowMinutes * 60 * 1000).toISOString();
            const recentSpend = this.usageLedger
                .filter((u) => u.tenantId === tenantId && u.timestamp >= cutoffTime)
                .reduce((sum, u) => sum + u.costUsd, 0);

            if (recentSpend + estimatedCostUsd > policy.burstSpendThresholdUsd) {
                canExecute = false;
                denialReason = `Velocity rate limit exceeded: $${(recentSpend + estimatedCostUsd).toFixed(4)} spent in ${policy.burstWindowMinutes}m window`;
            }
        }

        return {
            tenantId,
            monthlyBudgetUsd: policy.monthlyBudgetUsd,
            totalSpendUsd: Number(totalSpendUsd.toFixed(6)),
            remainingBudgetUsd: Number(remainingBudgetUsd.toFixed(6)),
            percentUsed,
            isWarning,
            isExceeded,
            canExecute,
            denialReason,
        };
    }

    public recordUsage(params: {
        tenantId: string;
        agentId: string;
        modelId: string;
        promptTokens: number;
        completionTokens: number;
        timestamp?: string;
        metadata?: Record<string, unknown>;
    }): { record: UsageRecord; budgetStatus: BudgetStatus } {
        const costUsd = this.calculateCost(params.modelId, params.promptTokens, params.completionTokens);
        const record: UsageRecord = {
            id: randomUUID(),
            tenantId: params.tenantId,
            agentId: params.agentId,
            modelId: params.modelId,
            promptTokens: params.promptTokens,
            completionTokens: params.completionTokens,
            totalTokens: params.promptTokens + params.completionTokens,
            costUsd,
            timestamp: params.timestamp || new Date().toISOString(),
            metadata: params.metadata,
        };

        this.usageLedger.push(record);
        const budgetStatus = this.getBudgetStatus(params.tenantId);

        return { record, budgetStatus };
    }

    public getSpendMetrics(tenantId: string): SpendMetrics {
        const records = this.usageLedger.filter((u) => u.tenantId === tenantId);
        const totalSpendUsd = records.reduce((s, r) => s + r.costUsd, 0);
        const totalTokens = records.reduce((s, r) => s + r.totalTokens, 0);

        const spendByModel: Record<string, { spendUsd: number; tokens: number; inferences: number }> = {};
        const spendByAgent: Record<string, { spendUsd: number; tokens: number; inferences: number }> = {};

        records.forEach((r) => {
            if (!spendByModel[r.modelId]) {
                spendByModel[r.modelId] = { spendUsd: 0, tokens: 0, inferences: 0 };
            }
            spendByModel[r.modelId].spendUsd += r.costUsd;
            spendByModel[r.modelId].tokens += r.totalTokens;
            spendByModel[r.modelId].inferences += 1;

            if (!spendByAgent[r.agentId]) {
                spendByAgent[r.agentId] = { spendUsd: 0, tokens: 0, inferences: 0 };
            }
            spendByAgent[r.agentId].spendUsd += r.costUsd;
            spendByAgent[r.agentId].tokens += r.totalTokens;
            spendByAgent[r.agentId].inferences += 1;
        });

        Object.keys(spendByModel).forEach((m) => {
            spendByModel[m].spendUsd = Number(spendByModel[m].spendUsd.toFixed(6));
        });
        Object.keys(spendByAgent).forEach((a) => {
            spendByAgent[a].spendUsd = Number(spendByAgent[a].spendUsd.toFixed(6));
        });

        return {
            tenantId,
            totalSpendUsd: Number(totalSpendUsd.toFixed(6)),
            totalTokens,
            totalInferences: records.length,
            spendByModel,
            spendByAgent,
            recentInferences: records.slice(-10).reverse(),
        };
    }

    public exportAuditRecord(tenantId: string): Record<string, unknown> {
        const metrics = this.getSpendMetrics(tenantId);
        const budget = this.getBudget(tenantId);
        return {
            auditType: "AI_INFERENCE_COST_GOVERNANCE",
            frameworkAlignment: ["ISO-42001", "SOC-2-CC6.6", "SOC-2-CC9.1"],
            tenantId,
            generatedAt: new Date().toISOString(),
            budgetPolicy: budget || null,
            totalSpendUsd: metrics.totalSpendUsd,
            totalTokens: metrics.totalTokens,
            totalInferences: metrics.totalInferences,
            modelsUsed: Object.keys(metrics.spendByModel),
            spendSummary: metrics.spendByModel,
        };
    }
}

export const defaultSpendGovernor = new InferenceSpendGovernor();
