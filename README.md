# 🎓 Researcher Campus
## Production-Grade MERN Autonomous AI Academic Operating System

> **Platform Name**: **Researcher Campus**  
> **Mission**: Eliminate academic fragmentation. Give every student, PhD candidate, professor, and independent researcher an all-in-one autonomous AI platform that takes them from an initial raw idea ➔ AI academic re-formulation ➔ literature gap verification ➔ actionable local implementation roadmap ➔ rich in-browser paper drafting studio with live Google Drive sync ➔ automated AI pre-flight compliance audit ➔ real-time conference/journal venue matching with live deadline countdowns.

---

## 📌 Master Table of Contents
1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Production System Architecture & Topology](#2-production-system-architecture--topology)
3. [Enterprise Security & Threat Model](#3-enterprise-security--threat-model)
4. [UI/UX Design System & Layout Specifications](#4-uiux-design-system--layout-specifications)
5. [The 7-Stage Autonomous Researcher Lifecycle](#5-the-7-stage-autonomous-researcher-lifecycle)
6. [Complete Database Schema (Mongoose / MongoDB)](#6-complete-database-schema-mongoose--mongodb)
7. [Production REST & Streaming API Specifications](#7-production-rest--streaming-api-specifications)
8. [Asynchronous Queue & Background Worker Architecture](#8-asynchronous-queue--background-worker-architecture)
9. [Tiered Subscription & Usage Quota System](#9-tiered-subscription--usage-quota-system)
10. [Production Deployment & Infrastructure Playbook](#10-production-deployment--infrastructure-playbook)
11. [Step-by-Step Implementation Roadmap](#11-step-by-step-implementation-roadmap)

---

## 1. Executive Summary & Product Vision

### The Problem in Today's Academic Workflow
Today, researchers are forced to context-switch across 8+ disconnected tools:
* **ChatGPT / Claude** for brainstorming (lacks verified real paper citations).
* **Google Scholar / Semantic Scholar** for literature search (manual, time-consuming, no automated gap analysis).
* **Notion / Obsidian / Trello** for tracking local implementation milestones.
* **Overleaf / LaTeX / Google Docs** for drafting the paper (static, context-unaware).
* **Turnitin / Grammarly** for checking tone and compliance.
* **WikiCFP / Conference Tracker** for keeping track of upcoming deadlines.
* **EasyChair / OpenReview / Microsoft CMT** for submission guidelines and formatting.

### The Solution: Researcher Campus
**Researcher Campus** unifies this fragmented stack into an **Autonomous Academic Operating System** built on a clean **Classic MERN Monorepo Architecture**:
* **`client/`**: Pure React 18 + Vite + TypeScript + Tailwind CSS Frontend.
* **`server/`**: Express.js + Node.js + Mongoose MongoDB + Redis + BullMQ Backend API.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RESEARCHER CAMPUS 7-STAGE LIFECYCLE                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ 0. RESEARCHER ONBOARDING: Profile, Domain, Experience Level, Target Venue & Local Tech Stack                 │
 └──────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┘
                                        │ (Injected into every Gemini AI prompt)
                                        ▼
 ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
 │ 1. IDEA LAB & REWRITE     │      │ 2. NOVELTY & THE GATE     │      │ 3. WHITESPACE SUMMARY     │
 ├───────────────────────────┤      ├───────────────────────────┤      ├───────────────────────────┤
 │ • Mode A: Raw 1-line idea │ ───► │ • 5 Academic APIs scan    │ ───► │ • Verified DOI links      │
 │ • Mode B: Existing draft  │      │ • 384d vector overlap %   │      │ • Literature gap banner   │
 │ • AI Academic Re-writer   │      │ • Green/Yellow/Red verdict│      │ • 1-Click BibTeX / .ris   │
 └───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
                                                                                      │
                                                                                      ▼
 ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
 │ 6. PRE-FLIGHT AI AUDIT    │      │ 5. PAPER DRAFTING STUDIO  │      │ 4. ROADMAP & CHECKLIST    │
 ├───────────────────────────┤      ├───────────────────────────┤      ├───────────────────────────┤
 │ • Citation integrity check│ ◄─── │ • In-Browser Doc Editor   │ ◄─── │ • Step-by-step milestones │
 │ • Anonymity / Page limits │      │ • IEEE, ACM, Nature tpls  │      │ • Datasets & GitHub repos │
 │ • Paraphrase tone score   │      │ • Google Drive Auto-Sync  │      │ • Track local PC progress │
 └─────────────┬─────────────┘      └───────────────────────────┘      └───────────────────────────┘
               │
               ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ 7. LIVE VENUE & CFP MATCHER (Online & In-Person Conferences + Journals with Countdown Deadlines)             │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 📦 1-Click Multi-Format Export (PDF, LaTeX .zip, Word .docx) + Auto-Generated In-App Submission Manual       │
 └──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Production System Architecture & Topology

The platform uses a modular MERN architecture with clear boundary separation between the frontend React application (`client/`), backend Express REST/SSE API server (`server/`), BullMQ worker processing pool, and data persistence layer.

```
                               ┌────────────────────────────────────────┐
                               │       Client (React 18 + Vite)         │
                               │  Minimalist Light UI / Tailwind CSS    │
                               └───────────────────┬────────────────────┘
                                                   │ HTTPS / WebSockets / SSE
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │   Express.js / Node.js API Server      │
                               │   JWT Auth, RBAC, Rate Limiter, CORS   │
                               └────────┬──────────┬───────────┬────────┘
                                        │          │           │
            ┌───────────────────────────┘          │           └───────────────────────────┐
            ▼                                      ▼                                       ▼
┌───────────────────────┐              ┌───────────────────────┐               ┌───────────────────────┐
│ Primary MongoDB Store │              │ Redis Cache & Lock    │               │  BullMQ Worker Queue  │
│ Mongo Atlas / Cluster │              │ API Cache, Quota, Auth│               │ Literature & PDF Jobs │
└───────────────────────┘              └───────────────────────┘               └───────────┬───────────┘
                                                                                           │
                                                                                           ▼
                                                                               ┌───────────────────────┐
                                                                               │ External Academic APIs│
                                                                               │ Crossref, arXiv,      │
                                                                               │ Semantic Scholar,     │
                                                                               │ OpenAlex, Europe PMC  │
                                                                               └───────────────────────┘
```

---

## 3. Enterprise Security & Threat Model

Production readiness requires enterprise-grade security across all data layers, network boundaries, and third-party integrations.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SECURITY & COMPLIANCE STACK                                            │
├──────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ Authentication & Authorization       │ Dual-token JWT architecture (Short-lived Access Token + httpOnly      │
│                                      │ SameSite Strict Refresh Token in Redis whitelist). RBAC enforcement. │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Data Encryption at Rest & In Transit │ Sensitive credentials (Google Drive Refresh Tokens, Custom API Keys) │
│                                      │ encrypted via AES-256-GCM. TLS 1.3 enforced for all network transit.  │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Threat Prevention & Sanitization     │ • NoSQL Injection: `express-mongo-sanitize` stripping `$` & `.` keys. │
│                                      │ • XSS Protection: DOMPurify sanitization on editor rendered HTML.    │
│                                      │ • Security Headers: Helmet enforcement (HSTS, CSP, X-Frame-Options).  │
│                                      │ • Strict CORS Whitelist: Restricts API calls to approved origins.     │
├──────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ Rate Limiting & Denial of Service    │ Redis-backed sliding window rate limiters per IP and per User ID:     │
│                                      │ • Auth Endpoints: 5 attempts per 15 minutes.                          │
│                                      │ • AI Generation Routes: Tiered quotas (100 / 500 / 1000 per month).   │
└──────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
```

---

## 4. UI/UX Design System & Layout Specifications

> [!IMPORTANT]
> **Design Rules**: The user interface must maintain a clean, aesthetic, minimalist light academic workstation feel. Bubbly pill buttons (`rounded-2xl/3xl`), glowing neon sci-fi themes, dark futuristic gradients, and sloppy unaligned layouts are **strictly prohibited**.

### Visual Design Tokens:
* **Background Surface**: `#FAFAFA` (Slate/Neutral 50) for overall canvas; `#FFFFFF` (Pure White) for structured content cards.
* **Borders & Dividers**: `#E2E8F0` (Slate 200, crisp 1px solid borders).
* **Border Radii**: Maximum **4px** (`rounded-sm` or crisp `rounded-none`/`rounded`). Clean, sharp box corners.
* **Typography Hierarchy**:
  * Primary Headings: `#0F172A` (Slate 900, Inter / Plus Jakarta Sans font, medium/bold weight).
  * Body Text: `#334155` (Slate 700, crisp legibility).
  * Secondary Labels & Meta: `#64748B` (Slate 500).
  * Academic Prose Canvas: Serif font (Merriweather / Source Serif Pro) in the paper drafting studio.
* **Accent Colors**:
  * Primary Accent: `#1E3A8A` (Deep Academic Royal Navy).
  * Interactive Trigger: `#2563EB` (Cobalt Blue).
  * Verdict Indicators: Soft Emerald (`#166534`), Soft Amber (`#92400E`), Soft Crimson (`#991B1B`).

### High-Density Responsive Dashboard Grid System:
The primary workspace dashboard uses a 12-column grid layout designed to gracefully handle four essential application states:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   HIGH-DENSITY GRID STATE HANDLING                                           │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────────┬─────────────────┤
│ 1. Loading Skeleton State    │ 2. Empty State Callout       │ 3. Populated Data Grid       │ 4. Error State  │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼─────────────────┤
│ Subtle CSS pulse blocks      │ Clear icon, single sentence  │ High-density cards with      │ Non-intrusive   │
│ matching exact card dimensions│ explanation, and crisp primary│ key metrics, status badges, │ banner with     │
│ to prevent layout layout shift│ action trigger button        │ and direct action links      │ retry button    │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴─────────────────┘
```

---

## 5. The 7-Stage Autonomous Researcher Lifecycle

### Stage 1: Idea Lab & Academic Reformulation Studio
* **Dual Intake**:
  * *Mode A (Raw Idea)*: 1–3 informal sentences.
  * *Mode B (Existing Draft)*: Upload `.pdf`, `.docx`, `.txt`, `.tex` or paste raw draft text.
* **AI Academic Re-formulator**: Transforms informal text into formal research queries (Title, Problem Statement, Methodology, Target Metrics).
* **Formulation Health Meter**: Score (0–100%) checking clarity and testability.

### Stage 2: Mathematical Literature Scan & Gate Verification
* **5-Engine Parallel Pipeline**: Queries Crossref, arXiv, Semantic Scholar, OpenAlex, and Europe PMC.
* **384-Dimensional Cosine Similarity**: Embeds proposals and paper abstracts to compute exact overlap distance.
* **The Gate Verdict**:
  * 🟢 **PASS (<30% overlap)**: Clear novelty.
  * 🟡 **SOFT WARNING (30–50% overlap)**: Moderate collision; AI provides differentiators.
  * 🔴 **HARD STOP (>50% overlap)**: Concept published; AI suggests 3 instant pivot angles.

### Stage 3: Research Whitespace & Literature Summary Board
* **Research Whitespace Banner**: Statement declaring what current literature has **not** achieved yet.
* **Categorized Literature Cards**: Grouped into *Baselines*, *Competitors*, and *References*.
* **Clickable Verified DOIs** & 1-Click BibTeX/RIS exporter.

### Stage 4: Implementation Roadmap, Resource Hub & Local Checklist
* **Resource Scout**: Recommendations for datasets (Kaggle/HuggingFace), libraries, and code repos.
* **Interactive 4-Phase Local Milestone Checklist** (Environment, Algorithm, Benchmarking, Synthesis).

### Stage 5: Academic Paper Drafting Studio
* **Templates**: IEEE Conference, ACM SIG, Springer LNCS, Nature/Elsevier, ArXiv Preprint.
* **TipTap/ProseMirror Canvas**: Rich text editor with KaTeX math rendering ($E = mc^2$), image drag-and-drop, `@` citation autocompletion, and side-by-side Gemini AI co-pilot.
* **Google Drive Auto-Sync**: Real-time sync creating and updating Google Docs in the user's Drive.

### Stage 6: AI Pre-Flight Audit & Compliance Checklist
* **Audits**: Citation integrity, blind review anonymity, page limits, academic tone & readability.

### Stage 7: Live Conference & Journal Matcher
* **Real-Time CFP Radar**: In-person, Virtual, Hybrid, and SCI/Scopus journals with deadline countdown clocks and CORE rankings.

---

## 6. Complete Database Schema (Mongoose / MongoDB)

```typescript
// server/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  persona: 'STUDENT' | 'PHD' | 'PROFESSOR' | 'INDUSTRY' | 'INDEPENDENT';
  primaryDomain: string;
  targetVenue: 'IEEE' | 'ACM' | 'SPRINGER' | 'NATURE' | 'ARXIV';
  techStack: string[];
  subscription: {
    tier: 'FREE' | 'PRO' | 'LAB';
    monthlyQuota: number;
    usedThisMonth: number;
    resetAt: Date;
  };
  googleDrive: {
    isConnected: boolean;
    encryptedRefreshToken?: string;
    rootFolderId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  persona: { type: String, enum: ['STUDENT', 'PHD', 'PROFESSOR', 'INDUSTRY', 'INDEPENDENT'], default: 'STUDENT' },
  primaryDomain: { type: String, default: '💻 Software & Distributed Systems' },
  targetVenue: { type: String, enum: ['IEEE', 'ACM', 'SPRINGER', 'NATURE', 'ARXIV'], default: 'IEEE' },
  techStack: [{ type: String }],
  subscription: {
    tier: { type: String, enum: ['FREE', 'PRO', 'LAB'], default: 'FREE' },
    monthlyQuota: { type: Number, default: 100 },
    usedThisMonth: { type: Number, default: 0 },
    resetAt: { type: Date, default: Date.now }
  },
  googleDrive: {
    isConnected: { type: Boolean, default: false },
    encryptedRefreshToken: { type: String },
    rootFolderId: { type: String }
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

```typescript
// server/src/models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  rawInput: string;
  academicTitle: string;
  problemStatement: string;
  methodologyOverview: string;
  domain: string;
  gateResult: {
    status: 'PASS' | 'SOFT_WARNING' | 'HARD_STOP';
    noveltyScore: number;
    maxOverlapPercent: number;
    whitespaceStatement: string;
    remediationAngle?: string;
  };
  literature: Array<{
    id: string;
    title: string;
    authors: string[];
    year: number;
    venue: string;
    doiUrl: string;
    similarity: number;
    keyTakeaway: string;
    category: 'BASELINE' | 'COMPETITOR' | 'REFERENCE';
    bibtex: string;
  }>;
  roadmap: {
    recommendedDatasets: Array<{ title: string; url: string; description: string }>;
    recommendedTools: Array<{ name: string; url: string; category: string }>;
    checklist: Array<{
      id: string;
      phase: 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS';
      task: string;
      isCompleted: boolean;
      userNotes?: string;
    }>;
  };
  document: {
    template: 'IEEE' | 'ACM' | 'SPRINGER' | 'NATURE' | 'ARXIV';
    contentMarkdown: string;
    contentHtml: string;
    contentLatex: string;
    lastSyncedToDriveAt?: Date;
    driveFileId?: string;
  };
  audit: {
    isPassed: boolean;
    overallScore: number;
    citationIntegrity: boolean;
    anonymityCheck: boolean;
    formattingCompliance: boolean;
    academicToneScore: number;
    issuesFound: string[];
  };
  targetVenues: Array<{
    name: string;
    acronym: string;
    deadlineDate: string;
    location: string;
    mode: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
    acceptanceRate?: string;
    rank?: string;
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  rawInput: { type: String, required: true },
  academicTitle: { type: String, default: '' },
  problemStatement: { type: String, default: '' },
  methodologyOverview: { type: String, default: '' },
  domain: { type: String, default: '' },
  gateResult: {
    status: { type: String, enum: ['PASS', 'SOFT_WARNING', 'HARD_STOP'], default: 'PASS' },
    noveltyScore: { type: Number, default: 100 },
    maxOverlapPercent: { type: Number, default: 0 },
    whitespaceStatement: { type: String, default: '' },
    remediationAngle: { type: String }
  },
  literature: [{
    id: String,
    title: String,
    authors: [String],
    year: Number,
    venue: String,
    doiUrl: String,
    similarity: Number,
    keyTakeaway: String,
    category: { type: String, enum: ['BASELINE', 'COMPETITOR', 'REFERENCE'], default: 'BASELINE' },
    bibtex: String
  }],
  roadmap: {
    recommendedDatasets: [{ title: String, url: String, description: String }],
    recommendedTools: [{ name: String, url: String, category: String }],
    checklist: [{
      id: String,
      phase: { type: String, enum: ['ENVIRONMENT', 'DEVELOPMENT', 'EVALUATION', 'SYNTHESIS'] },
      task: String,
      isCompleted: { type: Boolean, default: false },
      userNotes: String
    }]
  },
  document: {
    template: { type: String, enum: ['IEEE', 'ACM', 'SPRINGER', 'NATURE', 'ARXIV'], default: 'IEEE' },
    contentMarkdown: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    contentLatex: { type: String, default: '' },
    lastSyncedToDriveAt: Date,
    driveFileId: String
  },
  audit: {
    isPassed: { type: Boolean, default: false },
    overallScore: { type: Number, default: 0 },
    citationIntegrity: { type: Boolean, default: false },
    anonymityCheck: { type: Boolean, default: false },
    formattingCompliance: { type: Boolean, default: false },
    academicToneScore: { type: Number, default: 0 },
    issuesFound: [String]
  },
  targetVenues: [{
    name: String,
    acronym: String,
    deadlineDate: String,
    location: String,
    mode: { type: String, enum: ['IN_PERSON', 'ONLINE', 'HYBRID'] },
    acceptanceRate: String,
    rank: String,
    url: String
  }]
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
```

---

## 7. Production REST & Streaming API Specifications

### Express API Routes (`server/src/routes/`)
* `POST /api/auth/register` — User registration with bcrypt hashing.
* `POST /api/auth/login` — Authentication returning JWT access token & httpOnly refresh cookie.
* `POST /api/auth/refresh` — Refresh access token using cookie whitelist.
* `POST /api/auth/logout` — Clear auth cookies.
* `GET & PUT /api/user/profile` — Fetch/update researcher intake profile.
* `POST /api/ai/reformulate` — Transform raw user idea into formal academic proposal.
* `GET /api/ai/copilot/stream` — SSE endpoint for side-by-side Gemini streaming assistant.
* `POST /api/literature/scan` — Enqueue parallel 5-engine scan job in BullMQ.
* `GET /api/project/:id/roadmap` — Fetch actionable dataset/tool recommendations.
* `PUT /api/project/:id/document` — Save active paper draft.
* `POST /api/project/:id/drive-sync` — Trigger Google Drive API v3 sync.

---

## 8. Asynchronous Queue & Background Worker Architecture

Heavy operations are decoupled from the HTTP API server using **BullMQ** worker processes backed by **Redis**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     BULLMQ ASYNCHRONOUS WORKER POOL                                         │
├──────────────────────────────┬──────────────────────────────┬────────────────────────────────────────────────┤
│ 1. Literature Harvesting Job │ 2. Vector Embedding Job      │ 3. Export Compilation Job                      │
├──────────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ Concurrently queries 5       │ Computes cosine similarity   │ Compiles LaTeX documents into PDF binaries     │
│ academic endpoints with      │ scores and flags potential   │ and packages .zip archives without blocking UI.│
│ exponential retry backoff.   │ literature collisions.       │                                                │
└──────────────────────────────┴──────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 9. Tiered Subscription & Usage Quota System

| Feature / Metric | 🎓 Student (Free) | 🚀 Scholar Pro | 🏢 Research Lab |
| :--- | :--- | :--- | :--- |
| **Monthly Price** | **$0 / month** | **$19 / month** | **$49 / month** |
| **AI Copilot Quota** | **100 requests / mo** | **500 requests / mo** | **1,000+ requests / mo** |
| **Active Projects** | 5 projects | Unlimited | Unlimited |
| **Academic Search** | Crossref, arXiv, OpenAlex | All 5 Academic Engines | All 5 Engines + Priority Queue |
| **Google Drive Sync** | Single Document Sync | Multi-folder Auto-sync | Multi-folder Auto-sync |
| **Export Formats** | Markdown, LaTeX | PDF, Word, LaTeX .zip | PDF, Word, LaTeX .zip, Overleaf API |

---

## 10. Production Deployment & Infrastructure Playbook

### Multi-Container Setup (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb+srv://...
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis

  client:
    build: ./client
    ports:
      - "3000:80"
    depends_on:
      - server

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  redis_data:
```

---

## 11. Step-by-Step Implementation Roadmap

> **Official Implementation Record**: See [`implementation/IMPLEMENTATION_PLAN.md`](file:///c:/Users/Lenovo/OneDrive/Desktop/research%20campus/implementation/IMPLEMENTATION_PLAN.md) for full phase-by-phase execution checklists, task breakdowns, and acceptance criteria.

When implementing this codebase, follow this sequential execution path:

1. **Phase 1: Foundation, Mongoose Database Schemas & Express Dual-Token Auth** — Set up `client/` (React + Vite) and `server/` (Express + Mongoose + JWT auth with httpOnly cookies).
2. **Phase 2: UI Design System & High-Density Dashboard Grid** — Implement Tailwind CSS tokens (`#FAFAFA` canvas, `#FFFFFF` cards, max 4px radii) and the 12-column high-density dashboard grid handling all loading, empty, data, and error states.
3. **Phase 3: Idea Lab & Literature Gate Verification Engine** — Connect Gemini Pro API for dual-intake reformulation; build BullMQ workers for 5-engine search and 384d cosine similarity scoring.
4. **Phase 4: Research Whitespace & Implementation Roadmap** — Build Whitespace summary board and 4-phase milestone checklist with local task tracking.
5. **Phase 5: Academic Paper Drafting Studio & Google Drive Sync** — Integrate TipTap/ProseMirror editor with IEEE/ACM templates, KaTeX math blocks, citation autocompletion, side-by-side Gemini AI co-pilot, and Google Drive auto-sync.
6. **Phase 6: AI Pre-Flight Audit & Live CFP Matcher** — Build pre-flight compliance scanner and live CFP venue radar with countdown clocks.
7. **Phase 7: Production Security Hardening, Quota Enforcement & Docker Containerization**.