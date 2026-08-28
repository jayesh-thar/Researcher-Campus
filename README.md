# 🎓 Researcher Campus
### *The Autonomous AI Research Environment & Workstation for Computer Scientists & Researchers*

[![Production Status](https://img.shields.io/badge/Status-Production%20v1.0.0.0-1E3A8A?style=for-the-badge&logo=shield)](https://github.com/jayesh-thar/Researcher-Campus)
[![MERN Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Express%20%7C%20MongoDB%20Atlas-007ACC?style=for-the-badge&logo=react)](https://github.com/jayesh-thar/Researcher-Campus)
[![AI Engine](https://img.shields.io/badge/AI%20Core-Google%20Gemini%202.0%20%2F%201.5%20Cascade-FF7043?style=for-the-badge&logo=google)](https://github.com/jayesh-thar/Researcher-Campus)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/jayesh-thar/Researcher-Campus/blob/main/LICENSE)

---

## 📑 Master Documentation Sitemap & Direct Links

| Documentation | Direct Link | Description |
| :--- | :--- | :--- |
| 🧠 **Autonomous AI Engine Architecture** | [`AI_ENGINE_ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/AI_ENGINE_ARCHITECTURE.md) | Deep technical manual of Google Gemini cascading models, structured JSON schemas, and stage pipelines |
| 🏗️ **Technical Architecture Document** | [`ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/ARCHITECTURE.md) | System topology, Mermaid sequence diagrams, data models, and literature engine flow |
| 🎬 **Live Demo & Walkthrough Guide** | [`DEMO.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/DEMO.md) | Complete step-by-step walkthrough to initialize local servers and test Stages 1 through 7 end-to-end |
| 🔒 **Security & Privacy Policy** | [`SECURITY.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/SECURITY.md) | Dual-token authentication, AES-256-GCM encryption, double-blind review shielding, and vulnerability reporting |
| 🤝 **Contributing Guidelines** | [`CONTRIBUTING.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/CONTRIBUTING.md) | Local development setup, TypeScript conventions, and semantic pull request workflows |
| 💻 **Client Frontend Subsystem** | [`client/README.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/client/README.md) | React 18 + Vite SPA component hierarchy, KaTeX math integration, and UI design tokens |
| ⚙️ **Server Backend Subsystem** | [`server/README.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/server/README.md) | Express.js REST API endpoints, Mongoose schema definitions, and 5-engine literature harvester |

---

## 📜 The Origin Story: Why Academic Research Needed a Unified Environment

### 🔴 The Historical Pain: Fragmented, Chaotic & Error-Prone
For decades, graduate students, academic researchers, and computer scientists have struggled through a fractured research workflow:
1. **Tooling Fragmentation**: Researchers constantly switch between disconnected tools — searching papers on Google Scholar, taking notes in Notion, drafting equations in Overleaf, tracking code on GitHub, managing deadlines on spreadsheets, and checking compliance manually.
2. **30%+ Desk-Rejection Crisis**: Over **30% of submitted manuscripts** face immediate desk-rejections before peer review due to overlooked preprint overlaps, broken citation keys, formatting errors, or accidental author identity leaks violating double-blind policies.
3. **LaTeX & BibTeX Build Hell**: Hours are wasted resolving broken LaTeX macros, mismatched math braces, and orphan citation keys (`[@vaswani2017attention]` missing in `.bib`).
4. **Execution Roadblocks**: Great theoretical ideas frequently stall before empirical implementation due to a lack of curated open-source baseline datasets and structured milestone tracking.

---

### 🟢 The Solution: A Unified Autonomous Research Environment
**Researcher Campus** transforms this fragmented landscape into a single, cohesive, high-density workstation. Powered by a **Zero-Downtime Google Gemini Multi-Model Cascade** and a **Parallel 5-Engine Literature Harvester**, the platform unifies the entire research journey into **7 sequential, stateful lifecycles**:

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

### 💡 Stage 1: Idea Lab & Academic Proposal Reformulator
- **Dual Intake Architecture**: Accepts informal 1-sentence ideas (`RAW` mode) or pasted drafts (`DRAFT` mode).
- **Dynamic Domain Detection**: Automatically infers the exact research subfield (*Healthcare ML*, *Distributed Systems*, *NLP*, *Security*).
- **Dynamic Metric Tag Editor**: Recommends appropriate statistical evaluation metrics (e.g. *AUC-ROC*, *F1-Score*, *Brier Score*, *Latency*, *Throughput*) with interactive add/delete tagging.
- **Academic Formulation**: Generates formal Academic Titles, Problem Statements, and Methodology Overviews with a quantitative **Formulation Health Score (0–100%)**.

### 🌐 Stage 2: 5-Engine Literature Gate & Novelty Verification
- **Parallel Multi-Engine Scanning**: Concurrently queries **5 academic databases**: Crossref, arXiv (2024–2026 preprints), OpenAlex, Semantic Scholar, and Europe PMC.
- **Novelty & Overlap Scoring**: Calculates 384-dimensional cosine vector embeddings between user methodology and published abstracts.
- **Tri-State Gate Verdict**:
  - 🟢 `PASS` ($\ge 80\%$ novelty): Cleared for Stage 3.
  - 🟡 `SOFT WARNING` ($25\% - 45\%$ overlap): Highlights baseline overlap requiring differentiation statements.
  - 🔴 `HARD STOP` ($> 45\%$ direct collision): Warns of potential desk-rejection.
- **Certified Drive Sync Report**: Generates a formatted `.docx`/`.doc` report containing scan results and cloud sync registration.

### 📊 Stage 3: Whitespace Board & AI Research Gaps Discovery
- **Published Baseline Matrix**: Direct competitor cards with direct DOIs, citation keys, key takeaways, and 1-click BibTeX import.
- **AI Research Gaps Discovery Tab**: Synthesizes 3 concrete scientific gaps from baseline literature, detailing baseline limitations, proposed innovation avenues, and **Impact Potential Scores (1–10)**.
- **BibTeX Exporter**: 1-click download of all baseline citations as a compiled `references.bib`.

### 🗺️ Stage 4: Implementation Roadmap, Stack Scout & AI Co-Pilot
- **Dynamic Resource Scout**: Recommends curated open-access datasets (*MIMIC-IV*, *Kaggle 100k*, *PhysioNet*) and specialized libraries (*LightGBM*, *SHAP*, *PyTorch*, *imbalanced-learn*).
- **4-Phase Milestone Checklist**: Phased milestone tracker across `ENVIRONMENT`, `DEVELOPMENT`, `EVALUATION`, and `SYNTHESIS` with live progress meter updates.
- **Conversational AI Co-Pilot (`chatWithAiAssistant`)**: Context-aware assistant that answers methodology questions, provides statistical advice, and de-duplicates task creation requests.

### 📝 Stage 5: Persistent Side-by-Side Paper Drafting Studio Drawer
- **Floating `<SidePaperDrawer />` Studio**: Accessible from Stage 3, Stage 4, Stage 6, and Stage 7 via a floating drawer button.
- **Real-Time Split-Screen Drafting**: Markdown and LaTeX math input with live KaTeX math formula rendering (`$E=mc^2$`).
- **IEEE 2-Column Typography**: Camera-ready academic layout preview with 1-click math/table template inserters.
- **Session Persistence**: Autosaves directly into MongoDB Atlas on every keystroke.

### 🛡️ Stage 6: Automated AI Pre-Flight Compliance Auditor
- **4 Automated Pre-Flight Guards**:
  1. 📚 **Citation Integrity Guard**: Flags orphan citation handles missing from `references.bib`.
  2. 🕵️ **Double-Blind Review Guard**: Screens and flags author names, institutional emails, and non-anonymized GitHub URLs.
  3. 📐 **Structural & Formatting Guard**: Validates required sections (Abstract, Intro, Method, Evaluation, Conclusion).
  4. 🖋️ **Academic Tone & Humanizer Guard**: Detects passive voice overuse and unsupported statistical claims.
- **Live Inline Manuscript Editor**: Edit flagged manuscript text directly within the auditor and trigger **"Save & Re-Audit"** for instant compliance recalculation.

### 🎯 Stage 7: Target Venue Matcher & Camera-Ready Vault
- **CORE-Ranked Publication Directory**: Curated conference/journal recommendations ranked by topic fit with official CORE Ranks (`A*`, `A`, `B`).
- **Live Venue Telemetry**: Displays verified Call for Papers URLs, acceptance rates (e.g. `18.6%`), submission countdowns, and venue mode indicators (**Hybrid**, **In-Person**, **Virtual**).
- **1-Click Submission Package (.zip)**: Bundles all camera-ready artifacts into a single downloadable archive:
  - `manuscript.pdf` *(Camera-ready manuscript)*
  - `manuscript.tex` *(LaTeX source document)*
  - `references.bib` *(Formatted BibTeX entries)*
  - `audit_report.json` *(Certified compliance certificate)*

---

## 🏛️ System Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SYSTEM TOPOLOGY MATRIX                           │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ Frontend Client   │ React 18 • TypeScript • Vite • Tailwind CSS • KaTeX     │
│ (`client/`)       │ Deployed on Vercel Global Edge CDN                      │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Backend Server    │ Node.js • Express.js • TypeScript • Mongoose ODM        │
│ (`server/`)       │ Deployed on Render / Railway                            │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Database          │ MongoDB Atlas (Users & Projects Collections)            │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ AI Engine         │ Google Gemini Pro Cascade (2.0-Flash ➔ 1.5-Flash ➔     │
│                   │ 1.5-Pro ➔ 3.7-Flash ➔ Domain Heuristics)                │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Academic APIs     │ Crossref • arXiv • OpenAlex • Semantic Scholar • Europe |
└───────────────────┴─────────────────────────────────────────────────────────┘
```

For full architectural diagrams and data schemas, see [`ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/ARCHITECTURE.md) and [`AI_ENGINE_ARCHITECTURE.md`](https://github.com/jayesh-thar/Researcher-Campus/blob/main/AI_ENGINE_ARCHITECTURE.md).

---

## 🚀 Quickstart: Local Development & Testing

### Prerequisites
- **Node.js**: `v18.0.0+` or `v20.0.0+`
- **npm**: `v9.0.0+`
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or free MongoDB Atlas URI.
- **Google Gemini API Key**: Acquired from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### Step 1: Clone Repository
```bash
git clone https://github.com/jayesh-thar/Researcher-Campus.git
cd Researcher-Campus
```

---

### Step 2: Configure & Start Backend Server
```bash
cd server
npm install

# Create server/.env file
cp .env.example .env   # (or configure MONGODB_URI and GEMINI_API_KEY)

# Start Express development server
npm run dev
```
*Backend runs on: `http://localhost:5000`*

---

### Step 3: Configure & Start Frontend Client
```bash
# Open a new terminal tab
cd client
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🧪 Verification Commands

| Component | Command | Expected Output |
| :--- | :--- | :--- |
| **Server TypeScript** | `cd server && npx tsc --noEmit` | `0 Errors` |
| **Client TypeScript** | `cd client && npx tsc --noEmit` | `0 Errors` |
| **Production Build** | `cd client && npm run build` | `dist/ built in ~5s` |

---

## 🌟 Project Leadership Reflection & Vision

> *"Academic research is humanity's most powerful engine for progress, yet the tools researchers use have remained fundamentally disconnected. Researcher Campus was conceived not to replace the researcher's intellect, but to eliminate the friction that slows it down. By automating the mechanical burdens of literature cross-referencing, compliance checking, and citation formatting, we empower researchers to focus on what matters most: discovery, innovation, and truth."*
>
> — **Researcher Campus Engineering Team • August 2026**

---

## 📄 License
This project is open-source and licensed under the [MIT License](https://github.com/jayesh-thar/Researcher-Campus/blob/main/LICENSE).
