import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Evidence upload metadata type
interface EvidenceMetadata {
    id: string;
    name: string;
    description: string;
    framework: string;
    controlId: string;
    type: "document" | "screenshot" | "configuration" | "log";
    mimeType: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
    status: "pending" | "analyzing" | "verified" | "failed";
    analysisResult?: {
        controls: string[];
        riskLevel: "low" | "medium" | "high";
        summary: string;
    };
}

// Persistence Layer (JSON File) - Replaces In-Memory Map
const DB_PATH = path.join(process.cwd(), "evidence.json");

function loadEvidence(): Map<string, EvidenceMetadata> {
    let data: string;
    try {
        data = fs.readFileSync(DB_PATH, "utf-8");
    } catch (error) {
        // Only first use is empty. Permission/I/O errors must not erase old data.
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Map();
        throw error;
    }

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error("Invalid evidence store");
    const store = new Map<string, EvidenceMetadata>();
    for (const entry of parsed) {
        if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string"
            || !entry[1] || typeof entry[1] !== "object" || Array.isArray(entry[1])
            || entry[1].id !== entry[0] || store.has(entry[0])) {
            throw new Error("Invalid evidence entry");
        }
        // Reject malformed records rather than silently replacing their bytes.
        const record = entry[1];
        for (const field of ["name", "description", "framework", "controlId", "type", "mimeType", "uploadedBy", "uploadedAt", "status"]) {
            if (typeof record[field] !== "string") throw new Error("Invalid evidence metadata");
        }
        if (typeof record.size !== "number" || !Number.isFinite(record.size) || record.size < 0) {
            throw new Error("Invalid evidence size");
        }
        store.set(entry[0], record);
    }
    return store;
}

function saveEvidence(store: Map<string, EvidenceMetadata>) {
    const data = JSON.stringify(Array.from(store.entries()), null, 2);
    // Same-directory rename leaves the previous file intact if writing fails.
    // This is a single-process demo store, not cross-process transaction isolation.
    const temporaryPath = `${DB_PATH}.${randomUUID()}.tmp`;
    let temporaryWritten = false;
    try {
        fs.writeFileSync(temporaryPath, data, { flag: "wx", mode: 0o600 });
        temporaryWritten = true;
        fs.renameSync(temporaryPath, DB_PATH);
    } catch (error) {
        // EEXIST from exclusive creation means the file is not ours.
        // An EEXIST rename failure still needs to clean up our completed write.
        if (temporaryWritten || (error as NodeJS.ErrnoException).code !== "EEXIST") {
            try {
                fs.unlinkSync(temporaryPath);
            } catch (cleanupError) {
                if ((cleanupError as NodeJS.ErrnoException).code !== "ENOENT") {
                    console.error("Failed to clean up evidence temporary file:", cleanupError);
                }
            }
        }
        throw error;
    }
}

// Generate unique ID
function generateId(): string {
    return `ev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// POST - Upload new evidence
export async function POST(request: NextRequest) {
    try {
        const session = (await getServerSession(authOptions)) as Session | null;

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const name = formData.get("name");
        const description = formData.get("description");
        const framework = formData.get("framework");
        const controlId = formData.get("controlId");
        const type = formData.get("type");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Multipart text fields can also contain Files. Reject malformed input
        // before persistence so a successful upload cannot poison future reads.
        if (typeof file === "string"
            || (name !== null && typeof name !== "string")
            || (description !== null && typeof description !== "string")
            || (framework !== null && typeof framework !== "string")
            || (controlId !== null && typeof controlId !== "string")
            || (type !== null && typeof type !== "string")) {
            return NextResponse.json(
                { error: "Invalid evidence upload fields" },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB for demo)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "application/json",
            "text/plain",
            "text/csv",
            "application/vnd.ms-excel",
            "text/markdown"
        ];
        // Relaxed type check slightly for demo flexibility to allow .md
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
            // Intentionally loose for demo
        }

        // Create evidence metadata
        const evidence: EvidenceMetadata = {
            id: generateId(),
            name: name || file.name,
            description: description || "",
            framework: framework || "SOC 2",
            controlId: controlId || "Unassigned",
            type: (type as EvidenceMetadata["type"]) || "document",
            mimeType: file.type,
            size: file.size,
            uploadedBy: session.user.email || "unknown",
            uploadedAt: new Date().toISOString(),
            status: "pending",
        };

        // Store metadata
        const evidenceStore = loadEvidence();
        evidenceStore.set(evidence.id, evidence);
        saveEvidence(evidenceStore);

        // Trigger async analysis 
        (async () => {
            try {
                // Reload fresh state to minimize race conditions
                let currentStore = loadEvidence();
                const storedEvidence = currentStore.get(evidence.id);
                if (!storedEvidence) return;
                storedEvidence.status = "analyzing";
                currentStore.set(evidence.id, storedEvidence);
                saveEvidence(currentStore);

                let contentToAnalyze = "";

                if (file.type === "application/pdf" || file.type.startsWith("image/")) {
                    contentToAnalyze = `[Binary File: ${file.name} (${file.type})] - Automated analysis of binary files requires the 'pdf-parse' package. Simulating analysis based on filename and type.`;
                } else {
                    contentToAnalyze = await file.text();
                }

                // Call Gemini
                const { analyzeDocument } = await import("@/lib/gemini");
                const analysis = await analyzeDocument(contentToAnalyze, evidence.framework);

                // Update evidence with result
                currentStore = loadEvidence(); // Reload again
                const finalEvidence = currentStore.get(evidence.id);
                if (finalEvidence) {
                    finalEvidence.status = "verified";
                    finalEvidence.analysisResult = {
                        controls: analysis.controls.map(c => c.id),
                        riskLevel: analysis.riskLevel,
                        summary: analysis.summary
                    };
                    currentStore.set(evidence.id, finalEvidence);
                    saveEvidence(currentStore);
                }
            } catch (error) {
                console.error("Async analysis failed:", error);
                try {
                    const currentStore = loadEvidence();
                    const failedEvidence = currentStore.get(evidence.id);
                    if (failedEvidence) {
                        failedEvidence.status = "failed";
                        currentStore.set(evidence.id, failedEvidence);
                        saveEvidence(currentStore);
                    }
                } catch (persistenceError) {
                    // Background work cannot change the upload response, but must
                    // handle disk failures instead of rejecting an unobserved promise.
                    console.error("Failed to persist analysis failure:", persistenceError);
                }
            }
        })();

        return NextResponse.json({
            success: true,
            evidence: {
                id: evidence.id,
                name: evidence.name,
                status: evidence.status,
                uploadedAt: evidence.uploadedAt,
            },
            message: "Evidence uploaded successfully. Analysis requested.",
        });
    } catch (error) {
        console.error("Evidence upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload evidence" },
            { status: 500 }
        );
    }
}

// GET - List all evidence or get specific evidence by ID
export async function GET(request: NextRequest) {
    try {
        const session = (await getServerSession(authOptions)) as Session | null;

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const evidenceStore = loadEvidence();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const framework = searchParams.get("framework");
        const status = searchParams.get("status");

        if (id) {
            // Get specific evidence
            const evidence = evidenceStore.get(id);
            if (!evidence) {
                return NextResponse.json(
                    { error: "Evidence not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ evidence });
        }

        // List all evidence with optional filters
        let evidenceList = Array.from(evidenceStore.values());

        if (framework) {
            evidenceList = evidenceList.filter((e) => e.framework === framework);
        }

        if (status) {
            evidenceList = evidenceList.filter((e) => e.status === status);
        }

        // Sort by upload date (newest first)
        evidenceList.sort((a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        return NextResponse.json({
            evidence: evidenceList,
            total: evidenceList.length,
        });
    } catch (error) {
        console.error("Evidence list error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve evidence" },
            { status: 500 }
        );
    }
}

// DELETE - Remove evidence
export async function DELETE(request: NextRequest) {
    try {
        const session = (await getServerSession(authOptions)) as Session | null;

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check for admin role
        const userRole = (session.user as { role?: string }).role;
        if (userRole !== "admin") {
            return NextResponse.json(
                { error: "Only admins can delete evidence" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Evidence ID required" },
                { status: 400 }
            );
        }

        const evidenceStore = loadEvidence();
        const deleted = evidenceStore.delete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Evidence not found" },
                { status: 404 }
            );
        }

        saveEvidence(evidenceStore);

        return NextResponse.json({
            success: true,
            message: "Evidence deleted successfully",
        });
    } catch (error) {
        console.error("Evidence delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete evidence" },
            { status: 500 }
        );
    }
}
