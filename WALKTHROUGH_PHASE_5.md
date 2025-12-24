# Phase 5 Walkthrough: Employee Onboarding

## Overview
We have implemented the **People & Onboarding** module, a critical requirement for SOC 2 "Human Resources Security" controls. This feature allows tracking of employee status, policy acceptance, and device security.

## Features Implemented
1.  **Employee Directory**: A centralized view of all employees and their compliance posture.
2.  **Onboarding Status**: Tracks whether employees are "Active", "Onboarding", or "Offboarding".
3.  **Human Risk Dashboard**: Visual indicators for:
    - Policy Acceptance (% completed).
    - Device Security (Compliant vs. At Risk).
4.  **Persistence**: Uses `employees.json` to store data, ensuring it survives server restarts without a database.

## Verification Steps
1.  **Navigation**: Click "People" in the sidebar.
2.  **View Seed Data**: You should see 3 initial employees (Soumya, Alice, Bob).
    - *Bob* is in "Onboarding" with 0% policy acceptance (simulating a new hire).
    - *Soumya* is "Active" with 100% acceptance.
3.  **Add Employee**:
    - Click **Add Employee**.
    - Enter Name: "Test User", Email: "test@certiflow.ai".
    - Click **Add**.
    - Verify the new user appears in the list immediately.
4.  **Confirm Persistence**:
    - Check the project root for `employees.json`. It should now contain the new "Test User".

## Screenshots
*(Placeholders for actual screenshots)*
- **[People Dashboard]**: Shows the table with stats cards.
- **[Add Modal]**: Shows the input form.
