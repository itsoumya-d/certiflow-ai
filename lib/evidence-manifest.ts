import { MerkleLedger } from "./merkle-ledger";
import { exportOscalAssessmentResults, type OscalAssessmentResults } from "./oscal";

export type EvidenceManifestBase = {
    id: string;
    controlId: string;
    framework: string;
    type: string;
    uploadedAt: string;
    uploadedBy: string;
};

export type EvidenceManifestRecord = EvidenceManifestBase & {
    [key: string]: unknown;
};

export type EvidenceManifestResult = {
    ledger: MerkleLedger;
    manifest: ReturnType<MerkleLedger["manifest"]>;
    oscal: OscalAssessmentResults;
    verification: ReturnType<MerkleLedger["verifyChain"]>;
};

export function buildEvidenceManifest<T extends EvidenceManifestBase>(
    records: readonly T[],
    title = "CertiFlow AI evidence assessment"
): EvidenceManifestResult {
    const ledger = new MerkleLedger();
    const ordered = [...records].sort((left, right) => {
        const leftTime = left.uploadedAt || "";
        const rightTime = right.uploadedAt || "";
        return leftTime.localeCompare(rightTime) || left.id.localeCompare(right.id);
    });

    for (const record of ordered) {
        ledger.append({
            id: record.id,
            controlId: record.controlId?.trim() || "Unassigned",
            framework: record.framework?.trim() || "SOC 2",
            collectedAt: record.uploadedAt || new Date(0).toISOString(),
            collectedBy: record.uploadedBy || "unknown",
            evidenceType: record.type || "document",
            payload: { ...record },
        });
    }

    return {
        ledger,
        manifest: ledger.manifest(),
        oscal: exportOscalAssessmentResults(ledger, { title }),
        verification: ledger.verifyChain(),
    };
}
