# 🏗️ Researcher Campus Technical Architecture & Design Document

This document details the software architecture, data flow sequences, security models, and internal algorithms powering the **Researcher Campus Autonomous AI Academic Operating System**.

---

## 📐 1. System Topology & Monorepo Architecture

Researcher Campus is engineered on a **Classic MERN Stack Monorepo Architecture** (`client/` React 18 + Vite + TypeScript & `server/` Node.js + Express.js + Mongoose MongoDB), ensuring high performance, rapid iteration, and zero vendor lock-in.

```mermaid
graph TD
    subgraph Client ["Client Layer (React 18 + Vite + TypeScript)"]
        UI["Minimalist UI Design System<br/>(#FAFAFA Canvas, Max 4px Radius)"]
        Router["React Router DOM (7 Stages)"]
        SideDrawer["Persistent Side-by-Side<br/>Paper Drafting Studio Drawer"]
        Axios["Axios API Client<br/>(Bearer Token Interceptor)"]
    end

    subgraph Server ["Server Layer (Node.js + Express.js REST API)"]
        Express["Express App Bootstrap (Port 5000)"]
        AuthMw["JWT Auth Middleware Guard"]
        AuthRoutes["/api/auth & /api/user"]
        AIRoutes["/api/ai (Gemini Reformulator & Auditor)"]
        LitRoutes["/api/literature & /api/project (Gate & Gaps)"]
        RoadmapRoutes["/api/roadmap (AI Co-Pilot & Tasks)"]
        DriveRoutes["/api/drive (Cloud Sync & Report Generator)"]
        VenueRoutes["/api/venues (Matcher & .zip Vault)"]
    end

    subgraph DB ["Persistence & External Services Layer"]
        MongoDB[("Mongoose MongoDB Database<br/>(User & Project Schemas)")]
        Gemini["Google Gemini AI Multi-Model Cascade<br/>(2.0-flash / 1.5-flash / 1.5-pro / 3.7-flash<br/>with JSON Schema Mode)"]
        Apis["5 Academic Literature Engines<br/>(Crossref, arXiv, Semantic Scholar, OpenAlex, Europe PMC)"]
    end

    UI --> Router
    Router --> SideDrawer
    Router --> Axios
    SideDrawer --> Axios
    Axios --> Express
    Express --> AuthMw
    AuthMw --> AuthRoutes
    AuthMw --> AIRoutes
    AuthMw --> LitRoutes
    AuthMw --> RoadmapRoutes
    AuthMw --> DriveRoutes
    AuthMw --> VenueRoutes

    AuthRoutes --> MongoDB
    AIRoutes --> Gemini
    LitRoutes --> Apis
    LitRoutes --> MongoDB
    RoadmapRoutes --> MongoDB
    DriveRoutes --> MongoDB
    VenueRoutes --> MongoDB
```

---

## 🔐 2. Security & Dual-Token Authentication Flow

Authentication utilizes a **Dual-Token JWT Architecture** paired with `bcrypt` password hashing and secure token lookups:
- **Access Token (15 Minutes)**: Short-lived token sent via `Authorization: Bearer <token>` HTTP header.
- **Refresh Token (7 Days)**: Stored securely in client storage and verified for automatic session continuation.
- **Google OAuth Integration**: Direct user lookup by email prevents duplicate index collisions on existing accounts.
- **Google Drive Credentials**: Encrypted at rest using AES-256-GCM authenticated encryption (`crypto.ts`).

---

## 🌐 3. 5-Engine Literature Scan & Cosine Similarity Gate Algorithm

When a researcher initiates Stage 2 Literature Verification, the server executes parallel requests across 5 global academic databases and calculates a **384-Dimensional Cosine Similarity Overlap**:

```mermaid
flowchart TD
    Start["User Triggers Stage 2 Literature Scan"] --> Express["Express POST /api/literature/scan"]
    Express --> ParallelScan["Execute Concurrent 5-Engine Harvester"]
    
    ParallelScan --> Crossref["🌐 Crossref API (Journal DOIs)"]
    ParallelScan --> ArXiv["🌐 arXiv API (2024-2026 Preprints)"]
    ParallelScan --> Semantic["🌐 Semantic Scholar API (CS & AI)"]
    ParallelScan --> OpenAlex["🌐 OpenAlex API (Global Research)"]
    ParallelScan --> EuropePMC["🌐 Europe PMC (Life Sciences)"]

    Crossref & ArXiv & Semantic & OpenAlex & EuropePMC --> Aggregate["Aggregate Candidate Abstracts"]
    Aggregate --> Cosine["Calculate 384d Cosine Similarity Vector Overlap"]
    
    Cosine --> Thresholds{"Max Overlap Percentage?"}
    Thresholds -- "< 30% Overlap" --> Pass["🟢 PASS Verdict (Clear Novelty)"]
    Thresholds -- "30% - 50% Overlap" --> Warning["🟡 SOFT WARNING (AI Differentiator Triggers)"]
    Thresholds -- "> 50% Overlap" --> Stop["🔴 HARD STOP (Instant Concept Pivot Angles)"]

    Pass & Warning & Stop --> Save["Atomic findByIdAndUpdate to MongoDB"]
    Save --> Response["Return Gate Report JSON to React Client"]
```

---

## 📑 4. Document Drafting & Side-by-Side Studio Pipeline

Manuscript state is accessible across stages through `<SidePaperDrawer />` and Stage 5 Paper Studio with background auto-sync and Google Drive report export:

```mermaid
flowchart LR
    Editor["Split-Screen Markdown / LaTeX Canvas"] --> State["In-Memory Draft State"]
    State --> Preview["Live Academic Preview (IEEE 2-Column Render)"]
    State --> Debounce["Debounced Save Trigger"]
    Debounce --> API["PUT /api/project/:id/document"]
    API --> Mongo["Persist Document State in MongoDB"]
    API --> Drive["POST /api/project/:id/drive/sync-report"]
    Drive --> DriveCloud["Google Drive Certified Document (.doc / .md)"]
    DriveCloud --> Status["UI Status Badge: 🟢 Synced to Drive"]
```
