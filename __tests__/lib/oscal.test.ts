import { exportOscalAssessmentResults } from '@/lib/oscal';
import { MerkleLedger, type EvidenceEntry } from '@/lib/merkle-ledger';

const entries: EvidenceEntry[] = [
    {
        id: 'ev-0',
        controlId: 'CC6.1',
        framework: 'SOC2',
        collectedAt: '2026-10-01T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'configuration',
        payload: { resource: 's3://evidence/0', result: 'pass' },
    },
    {
        id: 'ev-1',
        controlId: 'A.5.15',
        framework: 'ISO27001',
        collectedAt: '2026-10-02T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'access-review',
        payload: { resource: 'iam://review/1', result: 'pass' },
    },
    {
        id: 'ev-2',
        controlId: 'CC6.1',
        framework: 'SOC2',
        collectedAt: '2026-10-03T00:00:00.000Z',
        collectedBy: 'soumya',
        evidenceType: 'log-review',
        payload: { resource: 'logs://audit/2', result: 'pass' },
    },
];

function buildLedger(): MerkleLedger {
    const ledger = new MerkleLedger();
    for (const entry of entries) ledger.append(entry);
    return ledger;
}

describe('OSCAL assessment-results export', () => {
    it('exports metadata, reviewed controls, observations and findings', () => {
        const ledger = buildLedger();
        const document = exportOscalAssessmentResults(ledger, {
            title: 'SOC 2 evidence assessment',
            version: '1.0',
            lastModified: '2026-10-30T00:00:00.000Z',
            assessmentPlanHref: '#assessment-plan',
            start: '2026-10-01T00:00:00.000Z',
            end: '2026-10-30T00:00:00.000Z',
            controlIds: ['CC6.1', 'A.5.15', 'CC7.2'],
        });

        const assessment = document['assessment-results'];
        expect(assessment.uuid).toMatch(/^[0-9a-f-]{36}$/);
        expect(assessment.metadata.title).toBe('SOC 2 evidence assessment');
        expect(assessment.metadata['oscal-version']).toBe('1.1.2');
        expect(assessment.metadata['last-modified']).toBe('2026-10-30T00:00:00.000Z');
        expect(assessment['import-ap'].href).toBe('#assessment-plan');

        const rootProp = assessment.metadata.props.find((prop) => prop.name === 'merkle-root');
        expect(rootProp?.value).toBe(ledger.root());

        expect(assessment.results).toHaveLength(1);
        const result = assessment.results[0];
        expect(result.observations).toHaveLength(entries.length);
        expect(result.findings).toHaveLength(3);

        const reviewed = result['reviewed-controls']['control-selections'][0]['include-controls'];
        expect(reviewed.map((control) => control['control-id'])).toEqual([
            'CC6.1',
            'A.5.15',
            'CC7.2',
        ]);

        const satisfied = result.findings.find((finding) => finding.target['target-id'] === 'CC6.1');
        const unsatisfied = result.findings.find((finding) => finding.target['target-id'] === 'CC7.2');
        expect(satisfied?.target.status.state).toBe('satisfied');
        expect(unsatisfied?.target.status.state).toBe('not-satisfied');
        expect(unsatisfied?.props.find((prop) => prop.name === 'evidence-count')?.value).toBe('0');
    });

    it('anchors every observation to the ledger root', () => {
        const ledger = buildLedger();
        const document = exportOscalAssessmentResults(ledger);
        const result = document['assessment-results'].results[0];

        for (const observation of result.observations) {
            const rootProp = observation.props.find((prop) => prop.name === 'merkle-root');
            expect(rootProp?.value).toBe(ledger.root());
            expect(observation.props.find((prop) => prop.name === 'record-hash')?.value).toBe(
                ledger.records.find((record) => record.id === observation.uuid)?.recordHash
            );
        }
    });

    it('derives the default control list from evidence', () => {
        const ledger = buildLedger();
        const document = exportOscalAssessmentResults(ledger);
        const result = document['assessment-results'].results[0];

        expect(result.findings).toHaveLength(2);
        expect(result['reviewed-controls']['control-selections'][0]['include-controls']).toEqual([
            { 'control-id': 'CC6.1' },
            { 'control-id': 'A.5.15' },
        ]);
    });
});
