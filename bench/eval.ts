import { MerkleLedger, sha256Hex, canonicalJson } from "../lib/merkle-ledger";
import { InferenceSpendGovernor } from "../lib/cost-governance";

export interface BenchmarkResult {
    name: string;
    iterations: number;
    totalMs: number;
    avgMsPerOp: number;
    opsPerSec: number;
}

export interface BenchmarkSuiteReport {
    timestamp: string;
    environment: {
        nodeVersion: string;
        platform: string;
        arch: string;
    };
    results: BenchmarkResult[];
}

export function runMerkleAppendBenchmark(iterations = 1000): BenchmarkResult {
    const ledger = new MerkleLedger();
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        ledger.append({
            controlId: `AC-${(i % 20) + 1}`,
            framework: "NIST-800-53",
            collectedAt: new Date(1700000000000 + i * 1000).toISOString(),
            collectedBy: "eval-agent-runner",
            evidenceType: "automated-test-run",
            payload: {
                testSuite: "crypto-audit",
                iteration: i,
                status: "PASS",
                metadata: { cpuUsagePct: 12.5, memoryMb: 128 },
            },
        });
    }

    const root = ledger.root();
    if (!root) throw new Error("Failed to compute root");

    const totalMs = performance.now() - start;
    const avgMsPerOp = totalMs / iterations;
    const opsPerSec = Math.round((iterations / totalMs) * 1000);

    return {
        name: "Merkle Ledger Append & Root Calculation",
        iterations,
        totalMs: Number(totalMs.toFixed(2)),
        avgMsPerOp: Number(avgMsPerOp.toFixed(4)),
        opsPerSec,
    };
}

export function runMerkleProofVerificationBenchmark(iterations = 500): BenchmarkResult {
    const ledger = new MerkleLedger();
    const recordCount = 128;
    for (let i = 0; i < recordCount; i++) {
        ledger.append({
            controlId: `SC-${(i % 10) + 1}`,
            framework: "SOC2",
            collectedAt: new Date(1700000000000 + i * 1000).toISOString(),
            collectedBy: "compliance-bot",
            evidenceType: "configuration-drift",
            payload: { verified: true, signature: sha256Hex(`data-${i}`) },
        });
    }

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const targetIndex = i % recordCount;
        const proof = ledger.inclusionProof(targetIndex);
        const isValid = MerkleLedger.verifyInclusion(proof.leaf, proof);
        if (!isValid) throw new Error(`Proof verification failed at index ${targetIndex}`);
    }

    const totalMs = performance.now() - start;
    const avgMsPerOp = totalMs / iterations;
    const opsPerSec = Math.round((iterations / totalMs) * 1000);

    return {
        name: "Merkle Inclusion Proof Verification",
        iterations,
        totalMs: Number(totalMs.toFixed(2)),
        avgMsPerOp: Number(avgMsPerOp.toFixed(4)),
        opsPerSec,
    };
}

export function runCostGovernanceBenchmark(iterations = 1000): BenchmarkResult {
    const governor = new InferenceSpendGovernor();
    const tenantId = "benchmark-tenant";
    governor.setBudget({
        tenantId,
        monthlyBudgetUsd: 1000.0,
        warningThresholdPercent: 80,
        hardLimitEnforced: true,
    });

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        governor.recordUsage({
            tenantId,
            agentId: `agent-${i % 5}`,
            modelId: i % 2 === 0 ? "gemini-1.5-pro" : "claude-3-5-sonnet",
            promptTokens: 500 + (i % 200),
            completionTokens: 150 + (i % 50),
            timestamp: new Date().toISOString(),
        });

        governor.getBudgetStatus(tenantId, 0.05);
    }

    const totalMs = performance.now() - start;
    const avgMsPerOp = totalMs / iterations;
    const opsPerSec = Math.round((iterations / totalMs) * 1000);

    return {
        name: "Inference Spend Governance & Budget Check",
        iterations,
        totalMs: Number(totalMs.toFixed(2)),
        avgMsPerOp: Number(avgMsPerOp.toFixed(4)),
        opsPerSec,
    };
}

export function runCanonicalSerializationBenchmark(iterations = 2000): BenchmarkResult {
    const payload = {
        complianceMatrix: {
            nist: ["AC-1", "AC-2", "IA-5"],
            iso27001: ["A.9.2", "A.12.1"],
        },
        evidence: {
            sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            metadata: {
                timestamp: "2026-11-27T07:00:00Z",
                actor: "agent-pipeline",
                verified: true,
                tags: ["automated", "cryptographic", "production-eval"],
            },
        },
    };

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const canonical = canonicalJson(payload);
        const hash = sha256Hex(canonical);
        if (!hash) throw new Error("Hash failure");
    }

    const totalMs = performance.now() - start;
    const avgMsPerOp = totalMs / iterations;
    const opsPerSec = Math.round((iterations / totalMs) * 1000);

    return {
        name: "Canonical JSON Serialization & SHA-256 Hashing",
        iterations,
        totalMs: Number(totalMs.toFixed(2)),
        avgMsPerOp: Number(avgMsPerOp.toFixed(4)),
        opsPerSec,
    };
}

export function runFullBenchmarkSuite(): BenchmarkSuiteReport {
    return {
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
        },
        results: [
            runMerkleAppendBenchmark(1000),
            runMerkleProofVerificationBenchmark(500),
            runCostGovernanceBenchmark(1000),
            runCanonicalSerializationBenchmark(2000),
        ],
    };
}

export function formatReportMarkdown(report: BenchmarkSuiteReport): string {
    const lines: string[] = [
        `# Benchmark & Evaluation Results (${report.timestamp.slice(0, 10)})`,
        "",
        `**Environment**: Node ${report.environment.nodeVersion} (${report.environment.platform} ${report.environment.arch})  `,
        `**Run Time**: ${report.timestamp}`,
        "",
        "| Benchmark Suite | Iterations | Total Time (ms) | Avg Latency (ms/op) | Throughput (ops/sec) |",
        "|---|---|---|---|---|",
    ];

    for (const r of report.results) {
        lines.push(
            `| ${r.name} | ${r.iterations.toLocaleString()} | ${r.totalMs} ms | ${r.avgMsPerOp} ms | ${r.opsPerSec.toLocaleString()} ops/s |`
        );
    }

    lines.push("");
    return lines.join("\n");
}
