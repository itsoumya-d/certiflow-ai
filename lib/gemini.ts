import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Model configurations
export const MODELS = {
    PRO: "gemini-1.5-pro",
    FLASH: "gemini-1.5-flash",
    FLASH_LITE: "gemini-2.0-flash-lite",
} as const;

/**
 * Analyze a document for compliance-relevant information
 */
export async function analyzeDocument(
    content: string,
    framework: string = "SOC 2"
): Promise<{
    controls: Array<{
        id: string;
        name: string;
        status: "compliant" | "non-compliant" | "partial" | "unknown";
        evidence: string;
        recommendation?: string;
    }>;
    summary: string;
    riskLevel: "low" | "medium" | "high";
}> {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `You are a compliance expert analyzing documents for ${framework} compliance.

Analyze the following document and extract:
1. Any security controls mentioned or evidenced
2. Compliance status for each control
3. Supporting evidence quotes
4. Recommendations for gaps

Document content:
${content}

Respond in JSON format:
{
  "controls": [
    {
      "id": "CC6.1",
      "name": "Logical Access Security",
      "status": "compliant" | "non-compliant" | "partial" | "unknown",
      "evidence": "Quote from document supporting this assessment",
      "recommendation": "Optional recommendation if gaps found"
    }
  ],
  "summary": "Brief overall assessment",
  "riskLevel": "low" | "medium" | "high"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error("Failed to parse response");
    } catch (error) {
        console.error("Document analysis failed:", error);
        throw error;
    }
}

/**
 * Verify a specific control based on configuration data
 */
export async function verifyControl(
    controlId: string,
    controlName: string,
    configData: string
): Promise<{
    status: "pass" | "fail" | "warning";
    findings: string[];
    evidence: string;
    confidence: number;
}> {
    const model = genAI.getGenerativeModel({ model: MODELS.FLASH });

    const prompt = `You are a security auditor verifying compliance control ${controlId}: ${controlName}

Analyze the following configuration data and determine if this control is satisfied:

Configuration Data:
${configData}

Respond in JSON format:
{
  "status": "pass" | "fail" | "warning",
  "findings": ["List of specific findings"],
  "evidence": "Specific evidence from the configuration that supports your assessment",
  "confidence": 0.95
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error("Failed to parse response");
    } catch (error) {
        console.error("Control verification failed:", error);
        throw error;
    }
}

/**
 * Generate remediation steps for a failed control
 */
export async function generateRemediation(
    controlId: string,
    controlName: string,
    findings: string[],
    platform: string = "AWS"
): Promise<{
    steps: Array<{
        order: number;
        action: string;
        description: string;
        automated: boolean;
    }>;
    estimatedTime: string;
    riskIfNotAddressed: string;
}> {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `You are a cloud security engineer providing remediation guidance.

Control: ${controlId} - ${controlName}
Platform: ${platform}
Findings:
${findings.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Provide step-by-step remediation guidance:

Respond in JSON format:
{
  "steps": [
    {
      "order": 1,
      "action": "Short action title",
      "description": "Detailed description of what to do",
      "automated": true | false
    }
  ],
  "estimatedTime": "Estimated time to complete (e.g., '30 minutes')",
  "riskIfNotAddressed": "Description of risk if this remains unfixed"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error("Failed to parse response");
    } catch (error) {
        console.error("Remediation generation failed:", error);
        throw error;
    }
}

/**
 * Map controls between frameworks
 */
export async function mapControlsAcrossFrameworks(
    sourceFramework: string,
    sourceControls: string[],
    targetFramework: string
): Promise<
    Array<{
        sourceControl: string;
        targetControls: string[];
        mappingConfidence: number;
    }>
> {
    const model = genAI.getGenerativeModel({ model: MODELS.PRO });

    const prompt = `You are a compliance expert mapping controls between frameworks.

Map the following ${sourceFramework} controls to ${targetFramework}:

Source Controls:
${sourceControls.join("\n")}

Respond in JSON format:
{
  "mappings": [
    {
      "sourceControl": "SOC 2 CC6.1",
      "targetControls": ["ISO 27001 A.9.1.1", "ISO 27001 A.9.4.1"],
      "mappingConfidence": 0.95
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.mappings;
        }

        throw new Error("Failed to parse response");
    } catch (error) {
        console.error("Framework mapping failed:", error);
        throw error;
    }
}
