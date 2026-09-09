// Core interface for all third-party integrations
export interface Integration {
    id: string;
    name: string;
    type: IntegrationType;
    logo: string;
    connected: boolean;
    lastSync?: Date;
    config?: Record<string, unknown>;

    // Core methods
    connect(credentials: Record<string, unknown>): Promise<boolean>;
    disconnect(): Promise<boolean>;
    validateConfig(): Promise<boolean>;

    // Compliance methods
    collectEvidence(controlId: string): Promise<EvidenceResult>;
}

export type IntegrationType = 'cloud' | 'version_control' | 'identity' | 'hr' | 'ticketing';

export interface EvidenceResult {
    controlId: string;
    status: 'compliant' | 'non-compliant' | 'error';
    rawEvidence: unknown;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export abstract class BaseIntegration implements Integration {
    id: string;
    name: string;
    type: IntegrationType;
    logo: string;
    connected: boolean = false;
    lastSync?: Date;
    config?: Record<string, unknown>;

    constructor(id: string, name: string, type: IntegrationType, logo: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.logo = logo;
    }

    abstract connect(credentials: Record<string, unknown>): Promise<boolean>;

    async disconnect(): Promise<boolean> {
        this.connected = false;
        this.config = undefined;
        return true;
    }

    abstract validateConfig(): Promise<boolean>;
    abstract collectEvidence(controlId: string): Promise<EvidenceResult>;
}
