# 🎬 Researcher Campus Live Demo & Walkthrough Guide

This document provides step-by-step instructions for initializing, running, and demonstrating the **Researcher Campus Autonomous AI Academic Operating System**.

---

## 🛠️ 1. Prerequisites & Environment Setup

Ensure you have the following installed on your local system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI
- **Google Gemini API Key** *(Optional for local fallback mode)*

---

## ⚙️ 2. Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
# server/.env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/researcher_campus
JWT_ACCESS_SECRET=super_secret_jwt_access_key_2026
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_2026
TOKEN_ENCRYPTION_KEY=32_byte_secret_key_for_aes_256_gcm!!
GEMINI_API_KEY=your_google_gemini_api_key_here
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
*Output: `[Express API Server] Running on http://localhost:5000`*

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

1. **Home Landing Page (`/`)**:
   - View the executive academic operating system overview.
   - Click **"Get Started"** or **"View Dashboard"** to enter the workspace.

2. **Stage 1: Idea Lab & Academic Reformulation (`/project/new`)**:
   - Select **Mode A (Raw 1-Sentence Idea)**.
   - Enter an informal idea: *"An app that tracks student assignment deadlines and sends reminders based on workload priority."*
   - Click **"Generate AI Academic Formulation"**.
   - Observe Gemini Pro transform the informal sentence into a formal Academic Title, Problem Statement, Methodological Overview, Target Evaluation Metrics, and a **92% Formulation Health Score**.
   - Click **"Proceed to Stage 2: Literature Gate Scan"**.

3. **Stage 2: Literature Gate Verification (`/project/:id/report`)**:
   - Observe the 5-Engine Academic Scanner bar (Crossref, arXiv, Semantic Scholar, OpenAlex, Europe PMC).
   - View **The Gate Verdict**: 🟢 **PASS (18% Max Overlap)**.
   - View the Research Whitespace Declaration and the Side-by-Side Methodology Comparison with highlighted overlap tags.
   - Click **"Proceed to Stage 3: Whitespace Board"**.

4. **Stage 3: Research Whitespace Summary Board (`/project/:id/literature`)**:
   - Read the prominent **Research Whitespace Banner** declaring the core novel contribution.
   - Filter literature cards by **🏆 Baselines**, **⚡ Competitors**, and **🔬 References**.
   - Click **"Export BibTeX (.bib)"** to download structured citations for Zotero/Mendeley.
   - Click **"Proceed to Stage 4: Implementation Roadmap"**.

5. **Stage 4: Implementation Roadmap & Checklist (`/project/:id/roadmap`)**:
   - Explore the Resource Scout Hub (Kaggle/HuggingFace open datasets & PyTorch/TipTap tool recommendations).
   - Interact with the **4-Phase Milestone Checklist** (`ENVIRONMENT`, `DEVELOPMENT`, `EVALUATION`, `SYNTHESIS`) and check off tasks.
   - Type in the AI Prompt box: *"Add 2 security audit tasks"* and click **"Generate AI Tasks"**.
   - Watch the **Implementation Readiness Meter** dynamically update.
   - Click **"Proceed to Stage 5: Paper Drafting Studio"**.

6. **Stage 5: Paper Drafting Studio (`/project/:id/editor`)**:
   - Experience the distraction-free **Live Split-Screen Canvas** (Markdown Editor on Left + Live Academic Rendered Preview on Right).
   - Switch templates between **IEEE Conference (2-Column)**, **ACM SIGPLAN**, and **Nature Journal**.
   - Insert LaTeX math equation blocks (`$Math`) and citation handles (`@chen2024`).
   - Notice the **`🟢 Synced to Drive`** indicator.
   - Export manuscript files using **"Export LaTeX (.tex)"** or **"Export Markdown"**.
   - Click **"Proceed to Stage 6: Pre-Flight Audit"**.

7. **Stage 6: Pre-Flight Compliance Audit (`/project/:id/audit`)**:
   - View the **Overall Audit Score** and 4 Guard Status cards (Citation Integrity, Double-Blind Anonymity, Formatting, Academic Tone).
   - Inspect flagged warning cards (e.g. leaked author identities).
   - Click **"1-Click AI Auto-Fix Issues"** and observe the score jump to **96% 🟢 READY FOR SUBMISSION**.
   - Click **"Proceed to Stage 7: Target Venue Matcher"**.

8. **Stage 7: Target Venue Matcher & Submission Package (`/project/:id/venues`)**:
   - Browse recommended conference directory cards (IEEE ICSE 2026, ACM CHI 2026, USENIX Security 2026).
   - View acceptance rates (`19.4%`) and dynamic deadline countdown badges (`42 Days Left`).
   - Click **"Set as Target Venue"**.
   - Click **"Export Submission Package (.zip)"** to generate the final ready-to-submit archive.
