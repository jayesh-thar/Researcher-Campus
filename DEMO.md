# 🎬 Researcher Campus Live Demo & Walkthrough Guide

This document provides step-by-step instructions for initializing, running, and demonstrating the **Researcher Campus Autonomous AI Academic Operating System**.

---

## 🛠️ 1. Prerequisites & Environment Setup

Ensure you have the following installed on your local system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string
- **Google Gemini API Key**: *(Optional for live Gemini Pro features; cascading multi-model fallbacks activate automatically)*

---

## ⚙️ 2. Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
# server/.env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/researcher_campus
JWT_SECRET=1b5c0800cfbd094aa63c064bb980db3f41571b18b7ffe94592d54c4fa38f0810
JWT_REFRESH_SECRET=8baf22e225b830e6645422076d2cfa990c4771ab72977c7391055e482d5a7061
ENCRYPTION_KEY=ae304c2996ea71576f08ef678f9568fdb5ab23d6191ac9f9bbf7eff2602c7fdf
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 3. Starting Local Application Servers

### A. Start Express API Backend Server
In terminal 1:
```bash
cd server
npm install
npm run dev
```
*Output: `⚡ Researcher Campus Express Server running on port 5000`*

### B. Start React Vite Frontend Application
In terminal 2:
```bash
cd client
npm install
npm run dev
```
*Output: `Vite v6.4.3 ready in 300ms • Local: http://localhost:3000`*

---

## 🧭 4. End-to-End Live Walkthrough Script (Stage 1 ➔ Stage 7)

Open your browser and navigate to **`http://localhost:3000`**:

### 1. Home Landing Page & Dashboard (`/` & `/dashboard`)
- View the executive academic operating system overview.
- Click **"Start New Project (Stage 1)"** or **"View Workspace Dashboard"**.
- On the Dashboard, test:
  - **"Inspect AI Logs"**: View verified Gemini AI invocations, timestamps, and download an audit `.txt` log.
  - **Rename Project Title**: Click the edit pencil icon to rename in real-time.

### 2. Stage 1: Idea Lab & Academic Reformulation (`/project/new`)
- Edit the **Project Title / Working Identifier** at the top.
- Enter an informal idea in the textarea:
  - *Example 1 (Medical ML)*: *"Predict diabetes early in 100k patients using LightGBM and SMOTE-Tomek feature engineering."*
  - *Example 2 (Distributed Systems)*: *"Low-latency distributed consensus using partition graph pruning."*
- Click **"Refine with AI Formulation"**.
- Observe Gemini Pro formulate a formal Academic Title, Problem Statement, Methodological Formulation, and **dynamic domain metric tags** (e.g., AUC-ROC, Sensitivity, Precision).
- Click **"Proceed to Stage 2: Literature Gate Scan"**.

### 3. Stage 2: Literature Gate Verification (`/project/:id/report`)
- Watch the **Live 5-Engine Scanner Animation** query Crossref, arXiv, OpenAlex, Semantic Scholar, and Europe PMC.
- View **The Gate Verdict**: 🟢 **PASS (<30% Overlap)** or 🟡 **SOFT WARNING**.
- Click **"View Full Abstract & BibTeX"** on any harvested paper to view the complete abstract, methodology overlap analysis, and 1-click BibTeX copy.
- Click **"Save Report to Drive (.doc)"** to export `[Project Title] - Stage 2 Literature Gate & Novelty Report.doc`.
- Click **"Proceed to Stage 3: Whitespace Board"**.

### 4. Stage 3: Whitespace Board & AI Research Gaps (`/project/:id/whitespace`)
- Toggle between two views:
  1. **Published Baseline Matrix**: Filter across Baselines, Competitors, and References.
  2. **AI Research Gaps & Opportunities**: View 3 concrete scientific gaps, baseline limitations, and proposed innovations.
- Click the floating **"Side-by-Side Paper Studio"** drawer at bottom-right to write notes or draft paper sections side-by-side!
- Click **"Export .bib"** to download BibTeX citations.
- Click **"Proceed to Stage 4: Implementation Roadmap"**.

### 5. Stage 4: Implementation Roadmap & AI Co-Pilot (`/project/:id/roadmap`)
- Explore the **Resource Scout Hub** with direct links to Kaggle/HuggingFace datasets and tools.
- Interact with the **4-Phase Milestone Checklist** (`ENVIRONMENT`, `DEVELOPMENT`, `EVALUATION`, `SYNTHESIS`) and check off tasks.
- Chat with the **AI Research Co-Pilot**:
  - Say: *"hi"* ➔ Receives natural conversational greeting without duplicate task creation.
  - Say: *"Add an ablation experiment for SMOTE-Tomek"* ➔ Generates and adds a tailored task to the checklist.
- Watch the **Implementation Readiness Meter** dynamically update.
- Click **"Proceed to Stage 6: Pre-Flight Audit"**.

### 6. Stage 6: Pre-Flight Compliance Audit (`/project/:id/audit`)
- View the **Overall Compliance Score (94/100)**, **Humanization Score (96%)**, and 4 Guard status cards.
- View your full manuscript payload on the left; click **"Edit Draft Here"** to modify text and click **"Save & Re-Audit"** to re-evaluate compliance on the fly.
- Click **"Proceed to Stage 7: Target Venues"**.

### 7. Stage 7: Target Publication Venue Matcher (`/project/:id/venues`)
- Browse top-ranked target conferences and high-impact journals matched to your topic (e.g. *IEEE BHI*, *Nature Digital Medicine*, *ACM BCB*, *IEEE ICSE*).
- Click **"Call for Papers"** to visit official submission portals.
- Click **"Export Submission Package (.zip)"** to bundle the compiled manuscript, LaTeX source, BibTeX citations, and audit report into a camera-ready `.zip` archive.
