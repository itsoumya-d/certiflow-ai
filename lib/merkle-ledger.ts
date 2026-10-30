import { createHash, randomUUID } from "crypto";

export type EvidenceEntry = {
    id?: string;
    controlId: string;
    framework: string;
    collectedAt: string;
    collectedBy: string;
    evidenceType: string;
    payload: unknown;
};

export type LedgerRecord = {
    index: number;
    id: string;
    controlId: string;
    framework: string;
    collectedAt: string;
    collectedBy: string;
    evidenceType: string;
    payload: unknown;
    payloadHash: string;
    previousHash: string;
    recordHash: string;
};

export type InclusionStep = {
    hash: string;
    position: "left" | "right";
};

export type InclusionProof = {
    leaf: string;
    root: string;
    steps: InclusionStep[];
};

export type ChainVerification = {
    valid: boolean;
    root: string;
    brokenAt?: number;
    reason?: string;
};

export type LedgerSnapshot = {
    version: 1;
    algorithm: "SHA-256";
    root: string;
    size: number;
    records: LedgerRecord[];
};

export type LedgerManifest = LedgerSnapshot & {
    generatedAt: string;
};

const GENESIS_HASH = "0".repeat(64);
const EMPTY_ROOT = createHash("sha256")
    .update("certiflow-ai:empty-evidence-ledger")
    .digest("hex");

export function canonicalJson(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value === "number" && !Number.isFinite(value)) return "null";
    if (typeof value !== "object") {
        const encoded = JSON.stringify(value);
        return encoded === undefined ? "null" : encoded;
    }
    if (Array.isArray(value)) {
        return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
    }
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys
        .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
        .join(",")}}`;
}

export function sha256Hex(value: string): string {
    return createHash("sha256").update(value, "utf8").digest("hex");
}

function nodeHash(left: string, right: string): string {
    return sha256Hex(`node:${left}:${right}`);
}

function recordBody(record: Omit<LedgerRecord, "recordHash">): Record<string, unknown> {
    return {
        index: record.index,
        id: record.id,
        controlId: record.controlId,
        framework: record.framework,
        collectedAt: record.collectedAt,
        collectedBy: record.collectedBy,
        evidenceType: record.evidenceType,
        payloadHash: record.payloadHash,
        previousHash: record.previousHash,
    };
}

export class MerkleLedger {
    private entries: LedgerRecord[] = [];

    get size(): number {
        return this.entries.length;
    }

    get records(): readonly LedgerRecord[] {
        return this.entries.slice();
    }

    append(entry: EvidenceEntry): LedgerRecord {
        if (!entry.controlId.trim()) throw new Error("controlId is required");
        if (!entry.framework.trim()) throw new Error("framework is required");
        if (!entry.collectedAt.trim()) throw new Error("collectedAt is required");
        if (!entry.collectedBy.trim()) throw new Error("collectedBy is required");
        if (!entry.evidenceType.trim()) throw new Error("evidenceType is required");

        const index = this.entries.length;
        const id = entry.id?.trim() || randomUUID();
        const payloadHash = sha256Hex(canonicalJson(entry.payload));
        const previousHash = index === 0 ? GENESIS_HASH : this.entries[index - 1].recordHash;

        const body = recordBody({
            index,
            id,
            controlId: entry.controlId,
            framework: entry.framework,
            collectedAt: entry.collectedAt,
            collectedBy: entry.collectedBy,
            evidenceType: entry.evidenceType,
            payload: entry.payload,
            payloadHash,
            previousHash,
        });
        const recordHash = sha256Hex(canonicalJson(body));
        const record: LedgerRecord = {
            index,
            id,
            controlId: entry.controlId,
            framework: entry.framework,
            collectedAt: entry.collectedAt,
            collectedBy: entry.collectedBy,
            evidenceType: entry.evidenceType,
            payload: entry.payload,
            payloadHash,
            previousHash,
            recordHash,
        };
        this.entries.push(record);
        return { ...record };
    }

    levels(): string[][] {
        if (this.entries.length === 0) return [];
        const levels: string[][] = [this.entries.map((record) => record.recordHash)];
        while (levels[levels.length - 1].length > 1) {
            const current = levels[levels.length - 1];
            const next: string[] = [];
            for (let index = 0; index < current.length; index += 2) {
                const left = current[index];
                const right = current[index + 1] ?? current[index];
                next.push(nodeHash(left, right));
            }
            levels.push(next);
        }
        return levels;
    }

    root(): string {
        const levels = this.levels();
        if (levels.length === 0) return EMPTY_ROOT;
        return levels[levels.length - 1][0];
    }

    inclusionProof(index: number): InclusionProof {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new Error(`record index ${index} is out of range`);
        }
        const levels = this.levels();
        const steps: InclusionStep[] = [];
        let position = index;
        for (let depth = 0; depth < levels.length - 1; depth += 1) {
            const nodes = levels[depth];
            const siblingIndex = position ^ 1;
            const siblingHash = siblingIndex < nodes.length ? nodes[siblingIndex] : nodes[position];
            steps.push({
                hash: siblingHash,
                position: position % 2 === 0 ? "right" : "left",
            });
            position = Math.floor(position / 2);
        }
        return {
            leaf: levels[0][index],
            root: levels[levels.length - 1][0],
            steps,
        };
    }

    static verifyInclusion(leaf: string, proof: InclusionProof): boolean {
        let current = leaf;
        for (const step of proof.steps) {
            current = step.position === "left"
                ? nodeHash(step.hash, current)
                : nodeHash(current, step.hash);
        }
        return current === proof.root;
    }

    verifyChain(): ChainVerification {
        let previous = GENESIS_HASH;
        for (let index = 0; index < this.entries.length; index += 1) {
            const record = this.entries[index];
            if (record.index !== index) {
                return { valid: false, root: this.root(), brokenAt: index, reason: "record index mismatch" };
            }
            if (record.previousHash !== previous) {
                return { valid: false, root: this.root(), brokenAt: index, reason: "previous hash mismatch" };
            }
            const expectedPayloadHash = sha256Hex(canonicalJson(record.payload));
            if (record.payloadHash !== expectedPayloadHash) {
                return { valid: false, root: this.root(), brokenAt: index, reason: "payload hash mismatch" };
            }
            const expectedRecordHash = sha256Hex(canonicalJson(recordBody({
                index: record.index,
                id: record.id,
                controlId: record.controlId,
                framework: record.framework,
                collectedAt: record.collectedAt,
                collectedBy: record.collectedBy,
                evidenceType: record.evidenceType,
                payload: record.payload,
                payloadHash: record.payloadHash,
                previousHash: record.previousHash,
            })));
            if (record.recordHash !== expectedRecordHash) {
                return { valid: false, root: this.root(), brokenAt: index, reason: "record hash mismatch" };
            }
            previous = record.recordHash;
        }
        return { valid: true, root: this.root() };
    }

    toJSON(): LedgerSnapshot {
        return {
            version: 1,
            algorithm: "SHA-256",
            root: this.root(),
            size: this.entries.length,
            records: this.entries.map((record) => ({ ...record })),
        };
    }

    manifest(): LedgerManifest {
        return {
            ...this.toJSON(),
            generatedAt: new Date().toISOString(),
        };
    }

    static fromJSON(value: unknown): MerkleLedger {
        if (value === null || typeof value !== "object") {
            throw new Error("ledger snapshot must be an object");
        }
        const snapshot = value as Partial<LedgerSnapshot>;
        if (snapshot.version !== 1 || !Array.isArray(snapshot.records)) {
            throw new Error("unsupported ledger snapshot");
        }
        const ledger = new MerkleLedger();
        for (const raw of snapshot.records) {
            if (raw === null || typeof raw !== "object") {
                throw new Error("invalid ledger record");
            }
            const record = raw as LedgerRecord;
            const valid =
                typeof record.index === "number" &&
                typeof record.id === "string" &&
                typeof record.controlId === "string" &&
                typeof record.framework === "string" &&
                typeof record.collectedAt === "string" &&
                typeof record.collectedBy === "string" &&
                typeof record.evidenceType === "string" &&
                typeof record.payloadHash === "string" &&
                typeof record.previousHash === "string" &&
                typeof record.recordHash === "string";
            if (!valid) throw new Error("invalid ledger record fields");
            ledger.entries.push({ ...record });
        }
        const verification = ledger.verifyChain();
        if (!verification.valid) {
            throw new Error(`ledger verification failed at record ${verification.brokenAt}: ${verification.reason}`);
        }
        if (snapshot.root && snapshot.root !== ledger.root()) {
            throw new Error("ledger root does not match the records");
        }
        return ledger;
    }
}
