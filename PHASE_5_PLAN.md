# Phase 5: Employee Onboarding & Human Risk Management

## Goal
Implement a system to track employee compliance (Policy Acceptance, Device Security). This is critical for SOC 2 (Human Resources Security).

## Constraints
- **ENOSPC**: Cannot install `prisma` or `faker`. Must use `fs` based persistence and manual mock data generation.
- **Dependencies**: Use existing (Next.js, Tailwind, Lucide, standard Node.js libs).

## Architecture
1.  **Persistence**: `employees.json` stored in project root.
    - Fields: `id`, `name`, `email`, `role`, `department`, `status` (active/onboarding), `policyAcceptance` (map of policyId -> date), `deviceStatus` (compliant/non-compliant).
2.  **API**: `app/api/employees/route.ts`
    - `GET`: List all employees.
    - `POST`: Add new employee (simulates sending invite).
    - `PUT`: Update employee status (simulates policy signing).
3.  **UI**:
    - `app/dashboard/people/page.tsx`: DataTable of employees.
    - `components/Sidebar.tsx`: Add "People" link.

## Steps
1.  **Backend**: Create `app/api/employees/route.ts` with `fs` persistence logic (similar to evidence).
2.  **Sidebar**: Update `components/Sidebar.tsx` to include the "People" route.
3.  **Page**: Create `app/dashboard/people/page.tsx` fetching from API.
4.  **Feature**: Add "Add Employee" modal.
5.  **Feature**: Add "Remind" button (mock action).

## Verification
- Add an employee via UI.
- Restart server (simulate).
- Verify employee persists.
- Check "People" page loads.
