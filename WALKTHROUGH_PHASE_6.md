# Phase 6 Walkthrough: Auditor Portal

## Overview
The **Auditor Portal** provides a dedicated, read-only view for external auditors (e.g., SOC 2 or ISO 27001 auditors). It aggregates compliance status without exposing sensitive administration controls.

## Features Implemented
1.  **Dedicated Route**: `/auditor` protected by RBAC logic in `middleware.ts`.
2.  **Dynamic Dashboard**: Fetches real-time evidence data from `evidence.json` via `/api/evidence`.
3.  **Readiness Score**: Automatically calculated based on the ratio of verified evidence items.
4.  **Activity Feed**: Shows the actual most recent evidence uploads from the "Real AI" system.

## Verification Steps
1.  **Log Out** of your current session (if logged in as admin).
2.  **Log In as Auditor**:
    - **Email**: `auditor@certiflow.ai`
    - **Password**: `demo123`
3.  **Verify Redirection**:
    - You should land directly on `/auditor`.
    - Try navigating to `/dashboard` manually. You should be redirected back to `/auditor`.
4.  **Check Data**:
    - Verify the "Readiness Score" reflects your verified evidence count.
    - Check "Recent Evidence Uploads" for the files you uploaded in the previous phase (Phase 4/5).

## Next Steps
- This completes the core MVP feature set:
    - Phase 3: Core Infrastructure (AI & Persistence)
    - Phase 4: Policy Center & Evidence Library
    - Phase 5: Employee Onboarding
    - Phase 6: Auditor Portal

The application is now a fully functional "Agentic GRC" MVP.
