# CertiFlow AI 🔐

### Autonomous GRC & Agent Telemetry Simulator *(Functional Prototype)*

> Stop manually chasing compliance evidence. Explore autonomous agent-driven compliance verification.

[![CI](https://github.com/itsoumya-d/certiflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/itsoumya-d/certiflow-ai/actions/workflows/ci.yml)
[![Maturity: Prototype Simulation](https://img.shields.io/badge/Maturity-Prototype%20Simulation-orange.svg)](#-architecture--simulation-boundaries)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

> [!NOTE]
> **Architecture & Simulation Disclosure:** CertiFlow AI is an engineering prototype evaluating autonomous agentic compliance workflows. To allow zero-dependency local evaluation and immediate reviewer verification without requiring live enterprise AWS/Okta IAM credentials, the current workflows run against simulated cloud telemetry fixtures and an in-memory audit store.

---

## The Problem

Modern engineering teams juggle SOC 2, ISO 27001, HIPAA, and more — each demanding continuous evidence collection, control verification, and audit trails. Most teams still do this manually: screenshots, spreadsheets, and frantic prep before audits.

**CertiFlow AI changes that.** Autonomous agents run your compliance checks 24/7, collect evidence automatically, and keep your trust posture real-time — so audits become a formality, not a fire drill.

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🤖 **Autonomous Agents** | AI agents powered by Gemini continuously verify your controls (AWS, GitHub, Okta, and more) |
| 📊 **Live Trust Dashboard** | Animated compliance score ring with real-time agent status via Server-Sent Events |
| 📁 **Evidence Library** | Upload, tag, and AI-analyze compliance artifacts — auto-linked to controls |
| 🔐 **Role-Based Access** | Admin, User, and Auditor roles with scoped permissions |
| 🔄 **Continuous Monitoring** | SSE-powered live updates — no polling, no refresh |
| 📱 **Mobile Responsive** | Full compliance visibility from any device |

---

## 🎬 Demo

> **Live demo accounts — no signup required:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@certiflow.ai` | `admin123` |
| User | `user@certiflow.ai` | `user123` |
| Auditor | `auditor@certiflow.ai` | `auditor123` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://ai.google.dev/) (free tier works)

### Setup

```bash
git clone https://github.com/itsoumya-d/certiflow-ai.git
cd certiflow-ai
npm install
cp env.example.txt .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=any_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're in.

---

## 🤖 Built-In Compliance Workflows

```typescript
awsS3Encryption        // Verify S3 bucket encryption settings
awsMfa                 // Check MFA enforcement for IAM users
githubBranchProtection // Verify branch protection rules
oktaMfa                // Check Okta MFA policy configuration
```

Each workflow models autonomous Gemini agent navigation and telemetry evaluation. In this prototype build, checks execute against structured simulated cloud responses to demonstrate agent computer-use decision trees and automated evidence parsing deterministically.

---

## Evidence failure recovery

See [the metadata persistence contract and credential-free failure/retry demonstration](docs/evidence-persistence.md) for storage behavior, regression commands, and prototype limitations.

---

## ⚡ Performance Benchmarks & Engine Evaluation

Automated cryptographic ledger, audit trail, and AI governance throughput benchmarks ([results/2026-11-27.md](results/2026-11-27.md)):

| Benchmark Suite | Iterations | Total Time (ms) | Avg Latency (ms/op) | Throughput (ops/sec) |
|---|---|---|---|---|
| Merkle Ledger Append & Root Calculation | 1,000 | 50.02 ms | 0.0500 ms | 19,994 ops/s |
| Merkle Inclusion Proof Verification | 500 | 185.48 ms | 0.3710 ms | 2,696 ops/s |
| Inference Spend Governance & Budget Check | 1,000 | 97.49 ms | 0.0975 ms | 10,257 ops/s |
| Canonical JSON Serialization & SHA-256 Hashing | 2,000 | 96.52 ms | 0.0483 ms | 20,722 ops/s |

Run locally:
```bash
npm test -- __tests__/lib/benchmark.test.ts
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Google Gemini Pro/Flash with Computer Use
- **Auth**: NextAuth.js with role-based sessions
- **Real-time**: Server-Sent Events (SSE)
- **Language**: TypeScript throughout

---

## 🗺️ Roadmap

- [ ] Slack/Teams notifications for compliance drift alerts
- [ ] SOC 2 Type II, ISO 27001, HIPAA, PCI DSS frameworks
- [ ] Custom no-code workflow builder
- [ ] Evidence auto-expiry + renewal reminders
- [ ] CI/CD integration (GitHub Actions)
- [ ] Audit report PDF export

---

## 🤝 Contributing

New compliance workflows, bug fixes, UI improvements — open a PR. Let's build the open-source compliance layer together.

---

## 📄 License

MIT — see LICENSE for details.

Built with ❤️ by [itsoumya-d](https://github.com/itsoumya-d) · Powered by Gemini AI

### Evidence authorization and analysis boundaries

Evidence creation and agent execution require an explicit `user` or `admin`
role on the server. Auditors, missing roles and unknown roles cannot write;
ordinary authenticated reads and admin-only deletion remain unchanged. This is
role authorization for a shared demo store, not tenant isolation or production
authentication hardening.

Uploads require matching supported MIME/extension pairs: TXT/LOG, Markdown,
CSV and JSON for text; PDF, PNG and JPEG for binary metadata. Unsupported formats,
mismatches, invalid evidence categories, empty files, malformed multipart and
files over 10 MiB are rejected. The demo stores metadata/analysis, not raw file
bytes. Binary metadata stays `unprocessed`: no filename-based simulated analysis.

Text analysis is awaited and validated at runtime. Successful model output is
`review_required`, never automatically `verified`, regardless of risk or control
assessment. Full control assessments and text-analysis provenance are preserved.
Invalid/provider-failed results remain failed, subject to honest persistence
failure handling. There is no implemented human sign-off workflow. Legacy
`verified` records are presented as review-required on reads without rewriting
historical stored bytes. The UI distinguishes review-required and unprocessed
states. Storage remains single-process JSON, not transactional multi-tenant
production storage; provider and binary extraction integrations are not exercised
by provider-free regression tests.

## Regulatory Country Packs

CertiFlow includes pluggable regulatory and compliance jurisdiction packs under `packs/<country>/rules.json` with cryptographic source tracking in `sources.lock.json`.

| Jurisdiction | Country | Standards Covered | Rules as of | Status |
|---|---|---|---|---|
| `CA` | Canada | PIPEDA Principle 7, CRA Memo 15.1, CCCS ITSG-33, TBS ADM | 2026-11-27 | Active |
| `IN` | India | DPDP Act 2023 Sec 8 & 9, CERT-In Directions 2022, RBI IT Gov 2023 | 2026-11-27 | Active |

### Canadian (CA) Regulatory Rules

- **CA-PIPEDA-007**: Personal Information Protection - Security Safeguards (PIPEDA Principle 7). Mandates encryption at rest and in transit for sensitive customer personal information. Source: [Office of the Privacy Commissioner of Canada (OPC)](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/#p7).
- **CA-CRA-GST-001**: CRA GST/HST Invoicing Documentation Threshold (CRA Memorandum 15.1). Mandatory invoice recipient name and registration thresholds for transactions >= CAD 150.00. Source: [Canada Revenue Agency (CRA)](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/15-1/general-requirements-books-records.html).
- **CA-CCCS-MFA-002**: CCCS Privileged Account Access Authentication (CCCS ITSG-33). Enforces multi-factor authentication (MFA) on all administrative sessions. Source: [Canadian Centre for Cyber Security (CCCS)](https://www.cyber.gc.ca/en/guidance/it-security-risk-management-lifecycle-approach-itsg-33).
- **CA-TBS-ADM-001**: TBS Directive on Automated Decision-Making (ADM) Governance. Requires human oversight checkpoints for high-impact automated and algorithmic decisions. Source: [Treasury Board of Canada Secretariat (TBS)](https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592).

### Indian (IN) Regulatory Rules

- **IN-DPDP-SEC8-PII**: DPDP Act 2023 Section 8(5) - Technical & Organizational Security Safeguards. Mandates reasonable security safeguards and encryption at rest and in transit to prevent personal data breaches. Source: [Ministry of Electronics and Information Technology (MeitY)](https://www.meity.gov.in/writereaddata/files/Digital_Personal_Data_Protection_Act_2023.pdf).
- **IN-DPDP-SEC9-CHILD**: DPDP Act 2023 Section 9 - Additional Obligations in Relation to Children. Prohibits behavioral monitoring, tracking, or targeted advertising directed at children, and requires verifiable parental consent. Source: [Ministry of Electronics and Information Technology (MeitY)](https://www.meity.gov.in/writereaddata/files/Digital_Personal_Data_Protection_Act_2023.pdf).
- **IN-CERTIN-DIR2022-LOGS**: CERT-In Cyber Security Directions (No. 20(3)/2022-CERT-In) Section 2(v). Mandates that corporate entities maintain system and audit logs securely within India for a rolling 180-day period. Source: [Indian Computer Emergency Response Team (CERT-In)](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf).
- **IN-RBI-ITGOV-2023-AI**: Reserve Bank of India Master Direction - IT Governance, Risk, Controls and Assurance Practices (2023). Requires model explainability, verifiable audit trails, and human oversight for high-risk automated decision systems. Source: [Reserve Bank of India (RBI)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12562).

> **Disclaimer**: Not legal or tax advice - check the official source.

