# 🎓 Researcher Campus (Autonomous AI Academic Operating System)

> **Production-Ready Classic MERN Monorepo Architecture (`client/` React + Vite + TypeScript + Tailwind CSS & `server/` Node.js + Express.js + Mongoose MongoDB)**

Researcher Campus is an end-to-end autonomous academic research operating system built to eliminate academic fragmentation. It guides computer science, software engineering, and AI researchers through all **7 sequential paper lifecycles**: from raw 1-sentence ideas to conference-ready submission packages.

---

## 🏛️ System Architecture

```
researcher-campus/
├── client/                              # Frontend React 18 Application (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/                  # Reusable UI Primitives (Card, Button, Badge, Input, Skeleton, Navbar)
│   │   ├── pages/                       # 7 Lifecycle Stages:
│   │   │   ├── Dashboard.tsx            # High-Density 4-State Workspace Grid
│   │   │   ├── IdeaLab.tsx              # Stage 1: Dual Intake & Gemini AI Academic Reformulator
│   │   │   ├── GateReport.tsx           # Stage 2: 5-Engine Literature Scan & Gate Verdict Engine
│   │   │   ├── WhitespaceBoard.tsx      # Stage 3: Research Whitespace Matrix & BibTeX Exporter
│   │   │   ├── Roadmap.tsx              # Stage 4: Implementation Roadmap & 4-Phase Checklist
│   │   │   ├── PaperStudio.tsx          # Stage 5: Paper Drafting Studio (LaTeX Math & Google Drive Sync)
│   │   │   ├── PreFlightAudit.tsx       # Stage 6: Automated AI Pre-Flight Compliance Auditor
│   │   │   └── VenueMatcher.tsx         # Stage 7: Target Venue Matcher & Submission Package Exporter
│   │   ├── services/                    # Axios API client connecting to Express server
│   │   ├── styles/                      # Tailwind design tokens (#FAFAFA canvas, max 4px radius)
│   │   ├── App.tsx                      # React Router DOM configuration
│   │   └── main.tsx                     # React DOM entry point
│   ├── vite.config.ts                   # Vite bundler configuration
│   └── package.json                     # Client React dependencies
│
├── server/                              # Backend Express API Server (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/                      # db.ts (Mongoose connection pooling)
│   │   ├── utils/                       # jwt.ts (Dual-token JWT) & crypto.ts (AES-256-GCM)
│   │   ├── models/                      # User.ts & Project.ts Mongoose schemas
│   │   ├── services/                    # geminiService.ts & literatureService.ts
│   │   ├── middlewares/                 # authMiddleware.ts (Bearer token guard)
│   │   ├── routes/                      # authRoutes, aiRoutes, literatureRoutes, roadmapRoutes, driveRoutes, auditRoutes, venueRoutes
│   │   └── index.ts                     # Express app bootstrap (Port 5000)
│   └── package.json                     # Server Express dependencies
│
├── implementation/                      # IMPLEMENTATION_PLAN.md (7-Phase master roadmap)
├── reports/                             # Technical change reports (PHASE_0 through PHASE_7)
├── understanding/                       # Plain-English educational guides (PHASE_0 through PHASE_7)
├── EXTRA/                               # Personal notes & developer assets
└── .gitignore                           # Excludes secrets, node_modules, and tracking folders
```

---

## ⚡ The 7 Complete Research Lifecycles

| Stage # | Stage Name | Technical Capabilities & Features |
| :--- | :--- | :--- |
| **Stage 1** | **Idea Lab & Gemini Reformulator** | Dual intake (Mode A informal idea vs Mode B draft paste), Gemini Pro AI academic reformulation, live Formulation Health Meter (0-100%). |
| **Stage 2** | **5-Engine Literature Gate Scan** | Concurrently scans Crossref, arXiv (2024-2026), Semantic Scholar, OpenAlex, Europe PMC. 384d Cosine Similarity Gate Verdict (🟢 Pass <30%, 🟡 Soft Warning 30-50%, 🔴 Hard Stop >50%). |
| **Stage 3** | **Research Whitespace Matrix** | Categorizes literature (Baselines, Competitors, References), verified clickable DOIs, Research Whitespace Declaration, and 1-click `.bib` BibTeX citation exporter. |
| **Stage 4** | **Implementation Roadmap** | Resource Scout (Kaggle/HuggingFace datasets, PyTorch/TipTap open tools), 4-Phase interactive checklist (Environment, Development, Evaluation, Synthesis), Gemini AI task generator. |
| **Stage 5** | **Paper Drafting Studio** | Live split-screen workspace (Markdown editor on left, live IEEE 2-column preview on right), KaTeX LaTeX math support, citation autocomplete `@`, Google Drive cloud auto-sync (`🟢 Synced`). |
| **Stage 6** | **AI Pre-Flight Audit** | 4 Compliance Verification Guards (Citation Integrity, Double-Blind Anonymity, Formatting & Rules, Academic Tone), 1-Click AI Auto-Fix button. |
| **Stage 7** | **Target Venue Matcher** | CS/AI conference database (IEEE ICSE, ACM CHI, USENIX Security, ISSTA), acceptance rate tags, deadline countdown timers, 1-click submission package exporter (.zip). |

---

## 🚀 Quick Start & Development Commands

### 1. Backend Server Setup (`server/`)
```bash
cd server
npm install
npm run dev
# Express server running on http://localhost:5000
```

### 2. Frontend Client Setup (`client/`)
```bash
cd client
npm install
npm run dev
# React Vite client running on http://localhost:3000
```

---

## 🧪 Production Verification & Build Commands
- **Server Typecheck**: `cd server && npx tsc --noEmit` ➔ **0 errors**
- **Client Typecheck**: `cd client && npx tsc --noEmit` ➔ **0 errors**
- **Client Bundle Build**: `cd client && npm run build` ➔ **1661 modules transformed, dist/ built successfully**