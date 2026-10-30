# Evidence integrity: Merkle ledger + OSCAL export

CertiFlow AI now has a tamper-evident evidence layer for SOC 2 and ISO 27001 workflows. Every evidence record is hash-chained and committed to a SHA-256 Merkle tree. The OSCAL exporter turns the ledger into an `assessment-results` document whose metadata carries the Merkle root, so a reviewer can verify that the evidence set has not changed after export.

## Files

| File | Purpose |
|---|---|
| `lib/merkle-ledger.ts` | Append-only evidence records, hash chain, Merkle root, inclusion proofs, tamper verification, snapshot/manifest serialization |
| `lib/oscal.ts` | OSCAL 1.1.2-shaped `assessment-results` export with observations, findings and the Merkle root |
| `__tests__/lib/merkle-ledger.test.ts` | Determinism, inclusion proofs, tamper detection, snapshot round-trip |
| `__tests__/lib/oscal.test.ts` | Metadata, reviewed controls, observations, satisfied/not-satisfied findings |

## Ledger model

Each `EvidenceEntry` carries the control, framework, collector, timestamp, evidence type and payload. Appending it produces a `LedgerRecord` with:

- `payloadHash` — SHA-256 of canonical JSON for the payload.
- `previousHash` — the previous record hash, or a 64-character genesis hash.
- `recordHash` — SHA-256 of canonical JSON for the record body (index, id, control, framework, timestamp, collector, evidence type, payload hash and previous hash).

Records are the Merkle leaves. Pairs are hashed with `SHA-256("node:" + left + ":" + right)`; an odd node is duplicated, so the tree is deterministic. The root is stable for the same evidence set.

```ts
import { MerkleLedger } from "@/lib/merkle-ledger";

const ledger = new MerkleLedger();
const record = ledger.append({
  id: "ev-2026-10-30-001",
  controlId: "CC6.1",
  framework: "SOC2",
  collectedAt: "2026-10-30T00:00:00.000Z",
  collectedBy: "soumya",
  evidenceType: "configuration",
  payload: { resource: "s3://evidence/iam", result: "pass" },
});

const proof = ledger.inclusionProof(0);
MerkleLedger.verifyInclusion(record.recordHash, proof); // true
ledger.verifyChain(); // { valid: true, root: "..." }
```

Persist `ledger.toJSON()` and reload it with `MerkleLedger.fromJSON(snapshot)`. Reloading verifies the hash chain, every payload hash and the stored root; a tampered payload, record hash or root throws.

## OSCAL export

```ts
import { exportOscalAssessmentResults } from "@/lib/oscal";

const document = exportOscalAssessmentResults(ledger, {
  title: "SOC 2 evidence assessment",
  version: "1.0",
  assessmentPlanHref: "#assessment-plan",
  controlIds: ["CC6.1", "A.5.15", "CC7.2"],
});
```

The export contains:

- `assessment-results.metadata` with `oscal-version: 1.1.2`, source props and the **Merkle root**.
- One `results` entry with `reviewed-controls`, observations for every evidence record and findings per control.
- Findings are `satisfied` when evidence exists and `not-satisfied` when an expected control has no evidence.
- Every observation carries `control-id`, `framework`, `evidence-type`, `record-hash` and `merkle-root` props.

This is a minimal, schema-shaped assessment-results document, not a full OSCAL SSP/assessment-plan. Validate it with the OSCAL CLI before submitting it to a regulator or customer.

## Guarantees and limits

- **Tamper evidence:** changing a payload, a record hash, a previous hash or the root is detected on reload or verification.
- **Inclusion proofs:** a single evidence record can be proved against the root without revealing the full ledger.
- **Server-side only:** the implementation uses `node:crypto`; do not import it into client components.
- **Not a substitute for signatures:** the ledger proves internal consistency. For third-party non-repudiation, sign the root with a KMS key and store the signature alongside the manifest.
- **Payloads are stored in the snapshot:** do not put secrets in evidence payloads; store a reference or a redacted payload and hash it.

## Verification

```bash
npm test -- --runInBand
npx tsc --noEmit
npm run lint
```

The CI workflow runs the same typecheck, lint, unit-test and build steps on Node 22 and 24.
