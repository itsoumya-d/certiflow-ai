import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Types
export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'onboarding' | 'offboarding';
    joinedAt: string;
    policyAcceptance: number; // percentage 0-100
    deviceStatus: 'compliant' | 'non-compliant' | 'unknown';
}

// Persistence Layer
const DB_PATH = path.join(process.cwd(), "employees.json");

function loadEmployees(): Employee[] {
    try {
        if (!fs.existsSync(DB_PATH)) {
            // Seed with some initial data if empty
            const seedData: Employee[] = [
                {
                    id: "emp-1",
                    name: "Soumya Debnath",
                    email: "soumya@certiflow.ai",
                    role: "Admin",
                    department: "Engineering",
                    status: "active",
                    joinedAt: "2024-01-01",
                    policyAcceptance: 100,
                    deviceStatus: "compliant"
                },
                {
                    id: "emp-2",
                    name: "Alice Smith",
                    email: "alice@certiflow.ai",
                    role: "Developer",
                    department: "Engineering",
                    status: "active",
                    joinedAt: "2024-03-15",
                    policyAcceptance: 75,
                    deviceStatus: "compliant"
                },
                {
                    id: "emp-3",
                    name: "Bob Jones",
                    email: "bob@certiflow.ai",
                    role: "Sales",
                    department: "Sales",
                    status: "onboarding",
                    joinedAt: "2024-12-20",
                    policyAcceptance: 0,
                    deviceStatus: "unknown"
                }
            ];
            saveEmployees(seedData);
            return seedData;
        }
        const data = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to load employees db:", e);
        return [];
    }
}

function saveEmployees(data: Employee[]) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to save employees db:", e);
    }
}

export async function GET() {
    const employees = loadEmployees();
    return NextResponse.json({ employees });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const employees = loadEmployees();

        const newEmployee: Employee = {
            id: `emp-${Date.now()}`,
            name: body.name,
            email: body.email,
            role: body.role || "Employee",
            department: body.department || "General",
            status: "onboarding",
            joinedAt: new Date().toISOString().split('T')[0],
            policyAcceptance: 0,
            deviceStatus: "unknown"
        };

        employees.push(newEmployee);
        saveEmployees(employees);

        return NextResponse.json({ success: true, employee: newEmployee });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create employee" }, { status: 500 });
    }
}
