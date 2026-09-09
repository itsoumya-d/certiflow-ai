import { AWSIntegration } from "./aws";
import { Integration } from "./core";

// Registry of available integrations
export const AVAILABLE_INTEGRATIONS: Record<string, new () => Integration> = {
    aws: AWSIntegration,
};

// Factory to get integration instance
export function getIntegration(id: string): Integration | null {
    const IntegrationClass = AVAILABLE_INTEGRATIONS[id];
    if (!IntegrationClass) return null;

    return new IntegrationClass();
}

export * from "./core";
export * from "./aws";
