import { buildEvidenceManifest, type EvidenceManifestRecord } from '@/lib/evidence-manifest';

const records: EvidenceManifestRecord[] = [
    {
        id: 'ev-0',
        name: 'Access review export',
        controlId: 'CC6.1',
        framework: 'SOC 2',
        type: 'configuration',
        uploadedAt: '2026-10-01T00:00:00.000Z',
        uploadedBy: 'soumya',
        status: 'verified',
    },
    {
        id: 'ev-1',
        name: 'Key management policy',
        controlId: 'A.5.15',
        framework: 'ISO 27001',
        type: 'document',
        uploadedAt: '2026-10-02T00:00:00.000Z',
        uploadedBy: 'soumya',
        status: 'pending',
    },
    {
        id: 'ev-2',
        name: 'Audit log sample',
        controlId: 'CC6.1',
        framework: 'SOC 2',
        type: 'log',
        uploadedAt: '2026-10-03T00:00:00.000Z',
        uploadedBy: 'soumya',
        status: 'verified',
    },
];

describe('buildEvidenceManifest', () => {
    it('builds a verified ledger and OSCAL export from evidence records', () => {
        const built = buildEvidenceManifest(records);

        expect(built.manifest.size).toBe(3);
        expect(built.manifest.algorithm).toBe('SHA-256');
        expect(built.manifest.root).toMatch(/^[0-9a-f]{64}$/);
        expect(built.verification.valid).toBe(true);
        expect(built.verification.root).toBe(built.manifest.root);

        const assessment = built.oscal['assessment-results'];
        expect(assessment.metadata.props.find((prop) => prop.name === 'merkle-root')?.value).toBe(
            built.manifest.root
        );
        expect(assessment.results[0].observations).toHaveLength(3);
        expect(assessment.results[0].findings).toHaveLength(2);
    });

    it('is deterministic regardless of input order', () => {
        const forward = buildEvidenceManifest(records);
        const reversed = buildEvidenceManifest([...records].reverse());

        expect(reversed.manifest.root).toBe(forward.manifest.root);
    });

    it('handles an empty evidence store', () => {
        const built = buildEvidenceManifest([]);

        expect(built.manifest.size).toBe(0);
        expect(built.verification.valid).toBe(true);
        expect(built.oscal['assessment-results'].results[0].observations).toHaveLength(0);
        expect(built.oscal['assessment-results'].results[0].findings).toHaveLength(0);
    });

    it('preserves the evidence payload for auditor inspection', () => {
        const built = buildEvidenceManifest(records);
        const first = built.manifest.records[0];

        expect(first.payload).toMatchObject({
            id: 'ev-0',
            name: 'Access review export',
            controlId: 'CC6.1',
            status: 'verified',
        });
    });
});
