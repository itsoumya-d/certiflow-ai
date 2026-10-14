import { z } from "zod";

export const evidenceAnalysisSchema = z.object({
    controls: z.array(z.object({
        id: z.string().trim().min(1),
        name: z.string().trim().min(1),
        status: z.enum(["compliant", "non-compliant", "partial", "unknown"]),
        evidence: z.string(),
        recommendation: z.string().optional(),
    })),
    summary: z.string().trim().min(1),
    riskLevel: z.enum(["low", "medium", "high"]),
});

export type EvidenceAnalysis = z.infer<typeof evidenceAnalysisSchema>;

/** A MIME/extension pair is a supported format, not proof that binary contents are valid. */
export function evidenceFileKind(name: string, mime: string): "text" | "binary" | null {
    const extension = name.toLowerCase().split(".").pop();
    const text: Record<string, string[]> = {
        txt: ["text/plain"], log: ["text/plain"], md: ["text/markdown", "text/plain", ""],
        csv: ["text/csv", "application/vnd.ms-excel"], json: ["application/json"],
    };
    const binary: Record<string, string[]> = {
        pdf: ["application/pdf"], png: ["image/png"], jpg: ["image/jpeg"], jpeg: ["image/jpeg"],
    };
    if (extension && text[extension]?.includes(mime)) return "text";
    if (extension && binary[extension]?.includes(mime)) return "binary";
    return null;
}
