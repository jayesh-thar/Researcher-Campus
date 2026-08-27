# 🎓 Researcher Campus
### *The Autonomous AI Academic Operating System for Researchers & Computer Scientists*

> **Architecture**: Production-Ready Classic MERN Monorepo (`client/` React 18 + Vite + TypeScript + Tailwind CSS & `server/` Node.js + Express.js + Mongoose MongoDB)  
> **UI Aesthetic**: Clean, minimal, high-density light workspace (`#FAFAFA` canvas, `#FFFFFF` surface cards, `#1E3A8A` royal academic navy accents, max `4px` border radius). Zero glowing dark neon elements and zero rounded pill borders.

---

## 📑 Documentation Sitemap & Direct Links

| Resource Document | Link | Description |
| :--- | :--- | :--- |
| 🎬 **Live Demo & Walkthrough Guide** | [`DEMO.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/DEMO.md) | Step-by-step instructions for initializing local servers and running an end-to-end live demo |
| 🏗️ **Technical Architecture Document** | [`ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/ARCHITECTURE.md) | Deep-dive topology, Mermaid sequence diagrams, security & database schemas |
| 🔒 **Security & Privacy Policy** | [`SECURITY.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/SECURITY.md) | Dual-token authentication, AES-256-GCM encryption, and vulnerability disclosure policy |
| 🤝 **Contributing Guidelines** | [`CONTRIBUTING.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/CONTRIBUTING.md) | Local development guidelines, coding conventions, and PR workflow |

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
│ Gemini AI proposal│ 5-engine scan,    │ Research gaps,    │ 4-phase milestone,│ Persistent side drawer, │
│ reformulation.    │ Gate verdict &    │ competitor matrix │ conversational AI │ live IEEE preview &     │
│                   │ Drive doc report. │ & BibTeX export.  │ & tool scout hub. │ LaTeX math exporter.    │
├───────────────────┴───────────────────┴───────────────────┴───────────────────┴─────────────────────────┤
│ Stage 6: AI Pre-Flight Audit ➔ Stage 7: Target Venue Matcher & Submission Package (.zip)              │
│ 4 compliance guards, live paper editing ➔ Live conference directory, countdowns & final submission .zip.│
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⭐ Feature Deep Dive Across All 7 Stages

### 💡 Stage 1: Idea Lab & Proposal Reformulator
- **Reorganized Input Layout**: Editable Project Title placed first at the top, followed by the Research Idea / Draft Textarea.
- **Dynamic Domain Detection**: Automatically infers exact domain (e.g. Healthcare & Medical ML, Systems, NLP, Security).
- **Dynamic Evaluation Metric Tags**: Renders topic-appropriate metrics (e.g. AUC-ROC, Sensitivity, Precision for Disease ML; Latency, Throughput for Systems) with add/delete tag editing.
- **Dual Flow**: Choose between **"Refine with AI Formulation"** or **"Proceed to Stage 2 with My Input"**.

### 🌐 Stage 2: 5-Engine Literature Gate Scan
- **Parallel Multi-Harvester**: Concurrently queries **5 academic databases**: Crossref, arXiv (2024–2026 preprints), OpenAlex, Semantic Scholar, and Europe PMC.
- **384-Dimensional Cosine Similarity & The Gate Verdict**:
  - 🟢 **PASS (<30% overlap)**: Clear research novelty.
  - 🟡 **SOFT WARNING (30–50% overlap)**: Moderate collision; AI provides 1-click differentiators.
  - 🔴 **HARD STOP (>50% overlap)**: Concept published; AI suggests 3 instant pivot angles.
- **Live Step-by-Step Scanner Animation**: Real-time progress tracker across all 5 engines.
- **1-Click Google Drive Report Sync**: Certified export: `[Project Title] - Stage 2 Literature Gate & Novelty Report.doc`.
- **Paper Inspection Modal**: Full abstract, methodology gap, and BibTeX copy for every baseline.

### 🔬 Stage 3: Whitespace Board & AI Research Gaps
- **Dual Tab Interface**:
  1. *Published Baseline Matrix*: Filterable view across **🏆 Foundational Baselines**, **⚡ Direct Competitors**, and **🔬 References** with verified clickable DOIs.
  2. *AI Research Gaps Discovery*: 3 deep scientific gaps identified by Gemini AI with baseline limitations and proposed innovation angles.
- **1-Click Citation Exporter**: Downloads structured `.bib` BibTeX files.

### 🗺️ Stage 4: Implementation Roadmap & Conversational AI Co-Pilot
- **Dynamic Resource Scout Hub**: Topic-tailored open datasets (Kaggle, HuggingFace, UCI) and specialized libraries (LightGBM, imbalanced-learn, SHAP, PyTorch).
- **Interactive 4-Phase Milestone Checklist**: Milestone tracking across `ENVIRONMENT`, `DEVELOPMENT`, `EVALUATION`, and `SYNTHESIS`.
- **Conversational AI Research Co-Pilot**: Intelligent, context-aware assistant for ablation studies and milestone planning without duplicate task repetition.
- **Implementation Readiness Meter**: Real-time completion progress bar.

### 📝 Stage 5: Paper Drafting Studio & Persistent Side-by-Side Drawer
- **Persistent Side-by-Side Paper Studio (`<SidePaperDrawer />`)**: Available from Stage 3, Stage 4, Stage 6, and Stage 7 for uninterrupted drafting.
- **Template Selector**: Switch between **IEEE Conference (2-Column)**, **ACM SIGPLAN / CHI**, **Nature Journal**, and **Custom CS Manuscript** modes.
- **KaTeX Math & Citation Tools**: LaTeX math equation blocks (`$$\min_{\theta} \mathcal{L}(\theta)$$`) and tables.
- **Google Drive Auto-Sync**: Background auto-sync to MongoDB and Google Drive cloud storage (`🟢 Synced`).

### 🛡️ Stage 6: Automated AI Pre-Flight Compliance Auditor
- **Inline Manuscript Editing & Re-Audit**: View and edit the manuscript draft side-by-side and re-audit on the fly.
- **4 Compliance Verification Guards**:
  1. 🔍 *Citation Integrity Guard*: Scans for in-text citation validity and DOIs.
  2. 🕵️ *Blind Review Anonymity Guard*: Flags leaked author names or personal repository links.
  3. 📏 *Formatting & Structure Guard*: Verifies Abstract, LaTeX math, and section structures.
  4. 🎓 *Academic Tone & Humanization Guard*: Scores natural academic writing style (95%+).

### 🎯 Stage 7: Target Venue Matcher & Submission Package Exporter
- **Target Venue Directory**: Conferences and top journals ranked by topic fit with CORE Ranks (`A*`), acceptance rates, deadlines, location, and mode (**Hybrid**, **Virtual/Online**, **In-Person**).
- **1-Click Submission Package Exporter**: Bundles compiled manuscript `.pdf`/`.tex`, `.bib` references, and audit logs into a final `.zip` archive.

---

## 🏛️ High-Level System Architecture Summary

```
researcher-campus/
├── client/                     # React 18 + Vite + TypeScript + Tailwind CSS (Port 3000)
│   ├── src/
│   │   ├── components/layout/  # Navbar, SidePaperDrawer, Layout Shells
│   │   ├── components/auth/    # ProtectedRoute guards
│   │   ├── components/ui/      # Button, Card, Badge, Input, CommandPalette, BibtexModal
│   │   ├── pages/              # LandingPage, Login, Onboarding, Dashboard, Stages 1-7
│   │   └── services/           # Axios API client
├── server/                     # Node.js + Express.js + Mongoose MongoDB (Port 5000)
│   ├── src/
│   │   ├── config/             # MongoDB fallback connection handling
│   │   ├── models/             # User, Project MongoDB Schemas
│   │   ├── routes/             # authRoutes, literatureRoutes, roadmapRoutes, venueRoutes, driveRoutes, aiRoutes
│   │   ├── services/           # geminiService, literatureService, driveService
│   │   ├── middlewares/        # Dual-token JWT authMiddleware
│   │   └── utils/              # Token crypto & signing
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 1. Start Server Backend
```bash
cd server
npm install
npm run dev
# Express API server listening on http://localhost:5000
```

### 2. Start Client Frontend
```bash
cd client
npm install
npm run dev
# Vite client development server running on http://localhost:3000
```
