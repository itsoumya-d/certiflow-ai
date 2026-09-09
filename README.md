# CertiFlow AI 🔐

### Agentic GRC & Continuous Trust Platform

> Stop manually chasing compliance evidence. Let AI agents do it for you — continuously.

[![CI](https://github.com/itsoumya-d/certiflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/itsoumya-d/certiflow-ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

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

Each workflow runs autonomously using Gemini's Computer Use — the agent navigates, checks, and reports back without human intervention.

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
