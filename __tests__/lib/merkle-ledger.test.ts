import {
    MerkleLedger,
    canonicalJson,
    sha256Hex,
    type EvidenceEntry,
} from '@/lib/merkle-ledger';

const entries: EvidenceEntry[] = [
    {
        id: 'ev-0',
        controlId: 'CC6.1',
        framework: 'SOC2',
        collectedAt: '2026-10-01T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'configuration',
        payload: { resource: 's3://evidence/0', result: 'pass', index: 0 },
    },
    {
        id: 'ev-1',
        controlId: 'A.5.15',
        framework: 'ISO27001',
        collectedAt: '2026-10-02T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'access-review',
        payload: { resource: 'iam://review/1', result: 'pass', index: 1 },
    },
    {
        id: 'ev-2',
        controlId: 'CC6.1',
        framework: 'SOC2',
        collectedAt: '2026-10-03T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'log-review',
        payload: { resource: 'logs://audit/2', result: 'pass', index: 2 },
    },
    {
        id: 'ev-3',
        controlId: 'A.5.15',
        framework: 'ISO27001',
        collectedAt: '2026-10-04T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'configuration',
        payload: { resource: 's3://evidence/3', result: 'pass', index: 3 },
    },
];

function buildLedger(): MerkleLedger {
    const ledger = new MerkleLedger();
    for (const entry of entries) ledger.append(entry);
    return ledger;
}

describe('MerkleLedger', () => {
    it('canonicalizes JSON deterministically', () => {
        const value = { z: 'last', a: [1, { c: 3, b: 2 }] };
        expect(canonicalJson(value)).toBe('{"a":[1,{"b":2,"c":3}],"z":"last"}');
    });

    it('hashes with SHA-256', () => {
        expect(sha256Hex('abc')).toBe(
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
        );
    });

    it('builds a deterministic root and record chain', () => {
        const first = buildLedger();
        const second = buildLedger();

        expect(first.root()).toBe(second.root());
        expect(first.root()).toMatch(/^[0-9a-f]{64}$/);
        expect(first.records.map((record) => record.recordHash)).toEqual(
            second.records.map((record) => record.recordHash)
        );
    });

    it('verifies an inclusion proof for every record', () => {
        const ledger = buildLedger();

        ledger.records.forEach((record, index) => {
            const proof = ledger.inclusionProof(index);
            expect(MerkleLedger.verifyInclusion(record.recordHash, proof)).toBe(true);
        });
    });

    it('rejects a tampered inclusion proof', () => {
        const ledger = buildLedger();
        const proof = ledger.inclusionProof(1);
        proof.steps[0].hash = '0'.repeat(64);

        expect(MerkleLedger.verifyInclusion(ledger.records[1].recordHash, proof)).toBe(false);
    });

    it('verifies a valid chain', () => {
        const ledger = buildLedger();
        const result = ledger.verifyChain();

        expect(result.valid).toBe(true);
        expect(result.root).toBe(ledger.root());
    });

    it('rejects a tampered payload on reload', () => {
        const ledger = buildLedger();
        const snapshot = JSON.parse(JSON.stringify(ledger.toJSON()));
        snapshot.records[1].payload.result = 'fail';

        expect(() => MerkleLedger.fromJSON(snapshot)).toThrow(/verification failed/);
    });

    it('rejects a tampered root on reload', () => {
        const ledger = buildLedger();
        const snapshot = JSON.parse(JSON.stringify(ledger.toJSON()));
        snapshot.root = '0'.repeat(64);

        expect(() => MerkleLedger.fromJSON(snapshot)).toThrow(/root does not match/);
    });

    it('round-trips a snapshot and manifest', () => {
        const ledger = buildLedger();
        const restored = MerkleLedger.fromJSON(ledger.toJSON());
        const manifest = ledger.manifest();

        expect(restored.size).toBe(ledger.size);
        expect(restored.root()).toBe(ledger.root());
        expect(manifest.algorithm).toBe('SHA-256');
        expect(manifest.size).toBe(ledger.size);
        expect(manifest.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('has a stable empty root', () => {
        const first = new MerkleLedger();
        const second = new MerkleLedger();

        expect(first.root()).toBe(second.root());
        expect(first.root()).toMatch(/^[0-9a-f]{64}$/);
        expect(() => first.inclusionProof(0)).toThrow(/out of range/);
    });
});
