import { toCSV, formatDate, formatDateTime, evidenceColumns, agentColumns } from '@/lib/export';

describe('Export Utilities', () => {
    describe('toCSV', () => {
        it('should generate CSV from data array', () => {
            const data = [
                { name: 'Item 1', value: 100 },
                { name: 'Item 2', value: 200 },
            ];
            const columns = [
                { header: 'Name', key: 'name' },
                { header: 'Value', key: 'value' },
            ];

            const csv = toCSV(data, columns);

            expect(csv).toContain('"Name","Value"');
            expect(csv).toContain('"Item 1","100"');
            expect(csv).toContain('"Item 2","200"');
        });

        it('should escape quotes in values', () => {
            const data = [{ name: 'Test "quoted" value' }];
            const columns = [{ header: 'Name', key: 'name' }];

            const csv = toCSV(data, columns);

            expect(csv).toContain('""quoted""');
        });

        it('should use formatter when provided', () => {
            const data = [{ amount: 1000 }];
            const columns = [
                { header: 'Amount', key: 'amount', formatter: (v: unknown) => `$${v}` },
            ];

            const csv = toCSV(data, columns);

            expect(csv).toContain('"$1000"');
        });

        it('should handle null/undefined values', () => {
            const data = [{ name: null, value: undefined }];
            const columns = [
                { header: 'Name', key: 'name' },
                { header: 'Value', key: 'value' },
            ];

            const csv = toCSV(data, columns);

            expect(csv).toContain('"",""');
        });
    });

    describe('formatDate', () => {
        it('should format Date object', () => {
            const date = new Date('2024-12-25T10:30:00Z');
            expect(formatDate(date)).toBe('2024-12-25');
        });

        it('should format date string', () => {
            expect(formatDate('2024-12-25T10:30:00Z')).toBe('2024-12-25');
        });

        it('should return empty string for null', () => {
            expect(formatDate(null)).toBe('');
        });

        it('should return empty string for undefined', () => {
            expect(formatDate(undefined)).toBe('');
        });
    });

    describe('formatDateTime', () => {
        it('should format Date object with time', () => {
            const date = new Date('2024-12-25T10:30:00Z');
            const result = formatDateTime(date);
            expect(result).toContain('2024-12-25');
            expect(result).toContain('10:30:00');
        });

        it('should return empty string for null', () => {
            expect(formatDateTime(null)).toBe('');
        });
    });

    describe('Column Configurations', () => {
        it('should have correct evidence columns', () => {
            expect(evidenceColumns).toHaveLength(8);
            expect(evidenceColumns.map(c => c.key)).toContain('name');
            expect(evidenceColumns.map(c => c.key)).toContain('framework');
            expect(evidenceColumns.map(c => c.key)).toContain('status');
        });

        it('should have correct agent columns', () => {
            expect(agentColumns).toHaveLength(5);
            expect(agentColumns.map(c => c.key)).toContain('name');
            expect(agentColumns.map(c => c.key)).toContain('status');
        });
    });
});
