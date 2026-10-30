import { randomUUID } from "crypto";
import { MerkleLedger } from "./merkle-ledger";

export type OscalProp = {
    name: string;
    value: string;
};

export type OscalObservation = {
    uuid: string;
    description: string;
    methods: string[];
    collected: string;
    props: OscalProp[];
};

export type OscalFinding = {
    uuid: string;
    title: string;
    description: string;
    target: {
        type: "objective-id";
        "target-id": string;
        status: {
            state: "satisfied" | "not-satisfied";
        };
    };
    props: OscalProp[];
};

export type OscalResult = {
    uuid: string;
    title: string;
    description: string;
    start: string;
    end: string;
    "reviewed-controls": {
        "control-selections": Array<{
            "include-controls": Array<{ "control-id": string }>;
        }>;
    };
    observations: OscalObservation[];
    findings: OscalFinding[];
};

export type OscalAssessmentResults = {
    "assessment-results": {
        uuid: string;
        metadata: {
            title: string;
            "last-modified": string;
            version: string;
            "oscal-version": string;
            props: OscalProp[];
        };
        "import-ap": {
            href: string;
        };
        results: OscalResult[];
    };
};

export type OscalExportOptions = {
    title?: string;
    version?: string;
    lastModified?: string;
    assessmentPlanHref?: string;
    start?: string;
    end?: string;
    controlIds?: string[];
};

export function exportOscalAssessmentResults(
    ledger: MerkleLedger,
    options: OscalExportOptions = {}
): OscalAssessmentResults {
    if (!ledger.verifyChain().valid) {
        throw new Error("cannot export an invalid evidence ledger");
    }

    const records = ledger.records;
    const root = ledger.root();
    const discoveredControls = Array.from(new Set(records.map((record) => record.controlId)));
    const controls = options.controlIds?.length
        ? Array.from(new Set(options.controlIds))
        : discoveredControls;

    const findings: OscalFinding[] = controls.map((controlId) => {
        const evidence = records.filter((record) => record.controlId === controlId);
        const satisfied = evidence.length > 0;
        return {
            uuid: randomUUID(),
            title: `Control ${controlId}`,
            description: satisfied
                ? `${evidence.length} evidence record(s) support control ${controlId}.`
                : `No evidence records support control ${controlId}.`,
            target: {
                type: "objective-id",
                "target-id": controlId,
                status: {
                    state: satisfied ? "satisfied" : "not-satisfied",
                },
            },
            props: [
                { name: "evidence-count", value: String(evidence.length) },
                { name: "merkle-root", value: root },
            ],
        };
    });

    const observations: OscalObservation[] = records.map((record) => ({
        uuid: record.id,
        description: `${record.evidenceType} evidence for ${record.controlId} collected by ${record.collectedBy}.`,
        methods: ["EXAMINE"],
        collected: record.collectedAt,
        props: [
            { name: "control-id", value: record.controlId },
            { name: "framework", value: record.framework },
            { name: "evidence-type", value: record.evidenceType },
            { name: "record-hash", value: record.recordHash },
            { name: "merkle-root", value: root },
        ],
    }));

    const title = options.title ?? "CertiFlow AI assessment results";
    const start = options.start ?? records[0]?.collectedAt ?? new Date().toISOString();
    const end = options.end ?? records[records.length - 1]?.collectedAt ?? start;

    return {
        "assessment-results": {
            uuid: randomUUID(),
            metadata: {
                title,
                "last-modified": options.lastModified ?? new Date().toISOString(),
                version: options.version ?? "1.0",
                "oscal-version": "1.1.2",
                props: [
                    { name: "source", value: "certiflow-ai" },
                    { name: "merkle-algorithm", value: "SHA-256" },
                    { name: "merkle-root", value: root },
                ],
            },
            "import-ap": {
                href: options.assessmentPlanHref ?? "#assessment-plan",
            },
            results: [
                {
                    uuid: randomUUID(),
                    title,
                    description: `Assessment results for ${controls.length} control(s), anchored to Merkle root ${root}.`,
                    start,
                    end,
                    "reviewed-controls": {
                        "control-selections": [
                            {
                                "include-controls": controls.map((controlId) => ({ "control-id": controlId })),
                            },
                        ],
                    },
                    observations,
                    findings,
                },
            ],
        },
    };
}
