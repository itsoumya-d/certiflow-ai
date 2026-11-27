import * as fs from "fs";
import * as path from "path";
import {
    runMerkleAppendBenchmark,
    runMerkleProofVerificationBenchmark,
    runCostGovernanceBenchmark,
    runCanonicalSerializationBenchmark,
    runFullBenchmarkSuite,
    formatReportMarkdown,
} from "../../bench/eval";

describe("Benchmark & Evaluation Engine", () => {
    it("runs Merkle append benchmark and produces throughput metrics", () => {
        const res = runMerkleAppendBenchmark(100);
        expect(res.name).toBe("Merkle Ledger Append & Root Calculation");
        expect(res.iterations).toBe(100);
        expect(res.totalMs).toBeGreaterThan(0);
        expect(res.avgMsPerOp).toBeGreaterThan(0);
        expect(res.opsPerSec).toBeGreaterThan(0);
    });

    it("runs Merkle inclusion proof verification benchmark", () => {
        const res = runMerkleProofVerificationBenchmark(50);
        expect(res.name).toBe("Merkle Inclusion Proof Verification");
        expect(res.iterations).toBe(50);
        expect(res.totalMs).toBeGreaterThan(0);
        expect(res.opsPerSec).toBeGreaterThan(0);
    });

    it("evaluates cost governance throughput under policy constraints", () => {
        const res = runCostGovernanceBenchmark(100);
        expect(res.name).toBe("Inference Spend Governance & Budget Check");
        expect(res.iterations).toBe(100);
        expect(res.totalMs).toBeGreaterThan(0);
        expect(res.opsPerSec).toBeGreaterThan(0);
    });

    it("benchmarks canonical JSON serialization & hashing", () => {
        const res = runCanonicalSerializationBenchmark(200);
        expect(res.name).toBe("Canonical JSON Serialization & SHA-256 Hashing");
        expect(res.iterations).toBe(200);
        expect(res.totalMs).toBeGreaterThan(0);
        expect(res.opsPerSec).toBeGreaterThan(0);
    });

    it("runs full benchmark suite and records results/2026-11-27.md", () => {
        const report = runFullBenchmarkSuite();
        expect(report.results).toHaveLength(4);
        expect(report.environment.nodeVersion).toBeDefined();

        const md = formatReportMarkdown(report);
        expect(md).toContain("# Benchmark & Evaluation Results");
        expect(md).toContain("Merkle Ledger Append & Root Calculation");
        expect(md).toContain("Inference Spend Governance & Budget Check");
        expect(md).toContain("| Benchmark Suite | Iterations |");

        const outDir = path.resolve(__dirname, "../../results");
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        fs.writeFileSync(path.join(outDir, "2026-11-27.md"), md, "utf8");
        expect(fs.existsSync(path.join(outDir, "2026-11-27.md"))).toBe(true);
    });
});
