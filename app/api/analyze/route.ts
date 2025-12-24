import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, framework = "SOC 2" } = body;

        if (!content) {
            return NextResponse.json(
                { error: "Document content is required" },
                { status: 400 }
            );
        }

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            // Return mock data for demo purposes
            return NextResponse.json({
                controls: [
                    {
                        id: "CC6.1",
                        name: "Logical Access Security",
                        status: "compliant",
                        evidence: "MFA is enabled for all admin accounts",
                        recommendation: null,
                    },
                    {
                        id: "CC6.2",
                        name: "Authentication Mechanisms",
                        status: "partial",
                        evidence: "SSO configured but some legacy apps not integrated",
                        recommendation: "Migrate remaining apps to SSO",
                    },
                    {
                        id: "CC8.1",
                        name: "Change Management",
                        status: "compliant",
                        evidence: "Branch protection rules enforced on main branch",
                        recommendation: null,
                    },
                ],
                summary:
                    "Document analysis indicates strong compliance posture with minor gaps in authentication mechanisms.",
                riskLevel: "low",
                processingTime: "2.3s",
                framework,
                demo: true,
            });
        }

        const result = await analyzeDocument(content, framework);

        return NextResponse.json({
            ...result,
            processingTime: "N/A",
            framework,
            demo: false,
        });
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: "Failed to analyze document" },
            { status: 500 }
        );
    }
}
