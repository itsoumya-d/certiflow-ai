# CertiFlow AI

**Agentic GRC & Continuous Trust Platform**

An AI-powered compliance automation platform built with Next.js 14, Gemini AI, and modern web technologies. CertiFlow AI uses autonomous agents to continuously monitor, verify, and document compliance controls.

## ✨ Features

- **🤖 AI-Powered Agents** - Autonomous verification with Gemini Computer Use
- **📊 Real-time Dashboard** - Animated compliance score and live agent status
- **📁 Evidence Library** - Upload, organize, and AI-analyze compliance evidence
- **🔐 Role-Based Access** - Admin, User, and Auditor roles with appropriate permissions
- **🔄 Continuous Monitoring** - SSE-powered real-time agent status updates
- **📱 Mobile Responsive** - Full mobile support with hamburger navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API Key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd certiflow-ai

# Install dependencies
npm install

# Set up environment variables
cp env.example.txt .env.local

# Edit .env.local and add your API keys
# GEMINI_API_KEY=your_api_key_here
# NEXTAUTH_SECRET=your_secret_here
# NEXTAUTH_URL=http://localhost:3000

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@certiflow.ai | admin123 |
| User | user@certiflow.ai | user123 |
| Auditor | auditor@certiflow.ai | auditor123 |

## 📂 Project Structure

```
certiflow-ai/
├── app/
│   ├── api/
│   │   ├── agents/          # Agent SSE and execution endpoints
│   │   ├── auth/            # NextAuth.js authentication
│   │   ├── evidence/        # Evidence CRUD operations
│   │   └── ...
│   ├── agents/              # Agents management page
│   ├── dashboard/           # Main dashboard
│   ├── evidence/            # Evidence library
│   ├── auditor/             # Auditor portal
│   └── page.tsx             # Landing page
├── components/
│   ├── AnimatedScoreRing.tsx
│   ├── Sidebar.tsx
│   ├── RoleGate.tsx
│   └── ...
├── lib/
│   ├── agents/
│   │   └── computer-use.ts  # Gemini Computer Use agent
│   └── gemini.ts            # Gemini API integration
└── ...
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | GET/POST | NextAuth.js authentication |
| `/api/evidence` | GET | List evidence with filters |
| `/api/evidence` | POST | Upload new evidence |
| `/api/evidence` | DELETE | Delete evidence (admin only) |
| `/api/agents/status` | GET | SSE stream for agent updates |
| `/api/agents/execute` | POST | Execute verification workflow |
| `/api/agents/execute?type=workflows` | GET | List available workflows |

## 🤖 Verification Workflows

Pre-built workflows for common compliance checks:

- **awsS3Encryption** - Verify S3 bucket encryption settings
- **awsMfa** - Check MFA enforcement for IAM users
- **githubBranchProtection** - Verify branch protection rules
- **oktaMfa** - Check Okta MFA policy configuration

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **AI**: Google Gemini Pro/Flash
- **Styling**: Custom CSS with design tokens
- **Icons**: Lucide React
- **Real-time**: Server-Sent Events (SSE)

## 📄 License

MIT License

---

Built with ❤️ using Gemini AI
