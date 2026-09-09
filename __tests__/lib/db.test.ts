import {
    db,
    getComplianceStats,
    getControlsByFramework,
    getFrameworks,
} from "@/lib/db";

describe("in-memory compliance db", () => {
    it("exposes a non-empty framework catalogue", () => {
        const frameworks = getFrameworks();
        expect(frameworks.length).toBeGreaterThan(0);
        frameworks.forEach((framework) => {
            expect(framework).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    status: expect.any(String),
                })
            );
        });
    });

    it("returns controls for a known framework", () => {
        const controls = getControlsByFramework("soc2");
        expect(controls.length).toBeGreaterThan(0);
        controls.forEach((control) => {
            expect(control.frameworkId).toBe("soc2");
            expect(["passing", "failing", "pending"]).toContain(control.status);
            expect(Array.isArray(control.evidenceIds)).toBe(true);
        });
    });

    it("returns no controls for an unknown framework", () => {
        expect(getControlsByFramework("does-not-exist")).toEqual([]);
    });

    it("computes compliance stats that add up to the control total", () => {
        const stats = getComplianceStats();
        expect(stats.total).toBeGreaterThan(0);
        expect(stats.passing + stats.failing + stats.pending).toBe(stats.total);
        expect(stats.score).toBeGreaterThanOrEqual(0);
        expect(stats.score).toBeLessThanOrEqual(100);
    });

    it("looks up the demo organization", () => {
        const organization = db.getOrganization("org-1");
        expect(organization).not.toBeNull();
        expect(organization?.id).toBe("org-1");
        expect(db.getOrganization("missing")).toBeNull();
    });

    it("limits audit logs to the requested number", () => {
        const all = db.getAuditLogs();
        expect(all.length).toBeGreaterThan(0);
        expect(db.getAuditLogs(2)).toHaveLength(2);
    });

    it("returns evidence with a known collector", () => {
        const evidence = db.getEvidence();
        expect(evidence.length).toBeGreaterThan(0);
        evidence.forEach((item) => {
            expect(["ai-agent", "manual"]).toContain(item.collectedBy);
        });
    });
});
