# 🎓 Researcher Campus
### *The Autonomous AI Academic Operating System for Researchers & Computer Scientists*

> **Architecture**: Production-Ready Classic MERN Monorepo (`client/` React 18 + Vite + TypeScript + Tailwind CSS & `server/` Node.js + Express.js + Mongoose MongoDB)  
> **UI Aesthetic**: Clean, minimal, high-density light workspace (`#FAFAFA` canvas, `#FFFFFF` surface cards, `#1E3A8A` royal academic navy accents, max `4px` border radius). Zero glowing dark neon elements and zero rounded pill borders.

---

## 📑 Documentation Sitemap & Direct Links

| Resource Document | Link | Description |
| :--- | :--- | :--- |
| 🎬 **Live Demo & Walkthrough Guide** | [`DEMO.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/DEMO.md) | Step-by-step instructions for initializing local servers and running a live demo |
| 🏗️ **Technical Architecture Document** | [`ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/ARCHITECTURE.md) | Deep-dive topology, Mermaid sequence diagrams, security & database schemas |

---

## ❓ The Problem: Why Academic Research Is Broken

Computer science researchers, PhD candidates, and university students routinely encounter severe friction throughout the research lifecycle:

1. **Academic Fragmentation**: Researchers jump between dozens of un-connected tools — Google Scholar for papers, Notion for notes, Overleaf for drafting, Trello for tasks, and spreadsheets for conference deadlines.
2. **Desk-Rejection Risks**: Over **30% of conference paper submissions** suffer immediate desk-rejections due to unnoticed overlap with existing preprints, formatting errors, or accidental author identity leaks violating double-blind policies.
3. **Formatting & Citation Pain**: Hours are wasted troubleshooting LaTeX build errors, broken BibTeX syntax, and missing reference handles.
4. **Implementation Stall**: Ideas fail to progress into empirical benchmark implementations due to a lack of structured datasets, open-source tool recommendation hubs, and step-by-step technical roadmaps.

---

## 💡 The Solution: Autonomous 7-Stage Academic OS

**Researcher Campus** solves academic fragmentation by consolidating the complete paper lifecycle into a single high-density workstation. Powered by Google Gemini Pro AI and a parallel 5-engine literature harvesting engine, the system guides researchers through **7 sequential lifecycles**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    THE 7 SEQUENTIAL RESEARCH LIFECYCLES                                 │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬─────────────────────────┤
│ Stage 1: Idea Lab │ Stage 2: Gate     │ Stage 3: Matrix   │ Stage 4: Roadmap  │ Stage 5: Paper Studio   │
│ Gemini AI proposal│ 5-engine scan &   │ Research gap      │ 4-phase milestone │ Live split preview,     │
│ reformulation.    │ Gate verdict.     │ & BibTeX export.  │ & AI task generator. KaTeX math & Drive sync.│
├───────────────────┴───────────────────┴───────────────────┴───────────────────┴─────────────────────────┤
│ Stage 6: AI Pre-Flight Audit ➔ Stage 7: Target Venue Matcher & Submission Package (.zip)              │
│ 4 compliance guards & 1-click auto-fix ➔ Conference directory, countdowns & final submission archive.   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⭐ Feature Deep Dive Across All 7 Stages

### 💡 Stage 1: Idea Lab & Gemini AI Reformulator
- **Dual Intake Interface**:
  - *Mode A (Raw Idea)*: Takes informal 1–3 sentence prompts (e.g., *"An app that tracks student task deadlines"*).
  - *Mode B (Existing Draft Upload / Paste)*: File dropzone & raw text intake.
- **Gemini Pro Reformulation Engine**: Transforms informal text into a publication-grade academic proposal with a formal Academic Title, Problem Statement, Methodological Formulation, and Target Evaluation Metrics.
- **Formulation Health Meter**: Score (0–100%) grading testability, scope boundaries, and clarity.

### 🌐 Stage 2: 5-Engine Literature Gate Scan
- **Multi-Engine Parallel Harvester**: Concurrently queries **5 academic databases**: Crossref (DOIs), arXiv (2024–2026 preprints), Semantic Scholar, OpenAlex, and Europe PMC.
- **384-Dimensional Cosine Similarity & The Gate Verdict**:
  - 🟢 **PASS (<30% overlap)**: Clear research novelty.
  - 🟡 **SOFT WARNING (30–50% overlap)**: Moderate collision; AI provides 1-click differentiators.
  - 🔴 **HARD STOP (>50% overlap)**: Concept published; AI suggests 3 instant pivot angles.
- **Side-by-Side Methodology Comparison**: Displays proposed methodology alongside closest published baseline with highlighted overlap tags.

### 🔬 Stage 3: Research Whitespace & Literature Matrix Board
- **Research Whitespace Declaration**: Prominent banner declaring the exact technical gap unaddressed by published literature.
- **Categorized Literature Cards**: Filterable view across **🏆 Foundational Baselines**, **⚡ Direct Competitors**, and **🔬 Methodological References** with verified clickable DOIs.
- **1-Click Citation Exporter**: Downloads structured `.bib` BibTeX files for Zotero, Mendeley, and EndNote integration.

### 🗺️ Stage 4: Implementation Roadmap & Local Milestone Checklist
- **Resource Scout Hub**: Connects research to Kaggle/HuggingFace open datasets and PyTorch/TipTap tool recommendations.
- **Interactive 4-Phase Local Milestone Checklist**: Milestone tracking across `ENVIRONMENT`, `DEVELOPMENT`, `EVALUATION`, and `SYNTHESIS`.
- **Gemini AI Task Generator**: Auto-generates custom technical tasks on demand (*"Add 3 security audit tasks"*).
- **Implementation Readiness Meter**: Real-time progress bar calculating completion percentage.

### 📝 Stage 5: Paper Drafting Studio & Google Drive Cloud Sync
- **Template Selector**: Switch between **IEEE Conference (2-Column)**, **ACM SIGPLAN / CHI**, **Nature Journal**, and **Custom CS Manuscript** modes.
- **Live Split-Screen Canvas**: Distraction-free Markdown editor on left + live academic rendered manuscript preview on right.
- **KaTeX Math & Citation Tools**: LaTeX math equation blocks (`$$\min_{\theta} \sum w_i L(t_i)$$`) and citation handles (`@chen2024`).
- **Google Drive Auto-Sync**: Background auto-sync to MongoDB and Google Drive cloud storage (`🟢 Synced`).

### 🛡️ Stage 6: Automated AI Pre-Flight Compliance Auditor
- **4 Compliance Verification Guards**:
  1. 🔍 *Citation Integrity Guard*: Scans for unreferenced citation handles (`@key`).
  2. 🕵️ *Blind Review Anonymity Guard*: Flags leaked author names or personal repository links violating double-blind rules.
  3. 📏 *Formatting & Page Limits Guard*: Verifies Abstract presence and figure caption rules.
  4. 🎓 *Academic Tone Guard*: Flags informal phrasing (*"cool"*, *"a lot of"*) and suggests publication-grade alternatives.
- **1-Click AI Auto-Fix Engine**: Resolves anonymity leaks and informal tone in 1 click.

### 🎯 Stage 7: Target Venue Matcher & Submission Package Exporter
- **Target Venue Directory**: CS/AI conference database (IEEE ICSE, ACM CHI, USENIX Security, ISSTA) with CORE Ranks (`A*`), acceptance rates (`19.4%`), and official portal links.
- **Submission Countdown Portal**: Dynamic countdown timers (`42 Days Left`).
- **1-Click Submission Package Exporter**: Bundles compiled manuscript `.pdf`/`.tex`, `.bib` references, and anonymized benchmark artifacts into a final `.zip` archive.

---

## 🏛️ High-Level System Architecture Summary

```
researcher-campus/
├── client/                              # Frontend React 18 App (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/                  # UI Primitives & Navbar Layout
│   │   ├── pages/                       # Dashboard & 7 Stage Views (IdeaLab ➔ VenueMatcher)
│   │   ├── services/                    # Axios API Client (Bearer Token Interceptor)
│   │   └── App.tsx                      # React Router DOM Setup
│   └── package.json
├── server/                              # Backend Express REST Server (Node.js + Mongoose)
│   ├── src/
│   │   ├── config/                      # db.ts (Mongoose Connection Pooling)
│   │   ├── utils/                       # jwt.ts (Dual-Token Auth) & crypto.ts (AES-256-GCM)
│   │   ├── models/                      # User.ts & Project.ts Mongoose Schemas
│   │   ├── services/                    # geminiService.ts & literatureService.ts
│   │   ├── routes/                      # authRoutes, aiRoutes, literatureRoutes, roadmapRoutes, driveRoutes, auditRoutes, venueRoutes
│   │   └── index.ts                     # Express Bootstrap (Port 5000)
│   └── package.json
├── implementation/                      # Master IMPLEMENTATION_PLAN.md
├── reports/                             # Technical change reports (PHASE_0 to PHASE_7, FULL_PROJECT_REPORT)
├── understanding/                       # Educational guides (PHASE_0 to PHASE_7, FULL_PROJECT_UNDERSTANDING)
├── DEMO.md                              # Live Demo & Walkthrough Guide
└── ARCHITECTURE.md                      # Technical Architecture & Sequence Diagrams
```

---

## 🚀 Quick Start Commands

### 1. Start Express API Backend Server
```bash
cd server
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Start React Vite Frontend Application
```bash
cd client
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 🧪 Production Verification Status
- **Server Typecheck**: `cd server && npx tsc --noEmit` ➔ **0 errors**
- **Client Typecheck**: `cd client && npx tsc --noEmit` ➔ **0 errors**
- **Client Bundle Build**: `cd client && npm run build` ➔ **1662 modules transformed, dist/ built in 16.05s**
