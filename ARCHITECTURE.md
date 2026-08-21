# 🏗️ Researcher Campus Technical Architecture & Design Document

This document details the software architecture, data flow sequences, security models, and internal algorithms powering the **Researcher Campus Autonomous AI Academic Operating System**.

---

## 📐 1. System Topology & Monorepo Architecture

Researcher Campus is engineered on a **Classic MERN Stack Monorepo Architecture** (`client/` React 18 + Vite + TypeScript & `server/` Node.js + Express.js + Mongoose MongoDB), ensuring zero framework lock-in and high scalability.

```mermaid
graph TD
    subgraph Client ["Client Layer (React 18 + Vite + TypeScript)"]
        UI["Minimalist UI Design System<br/>(#FAFAFA Canvas, Max 4px Radius)"]
        Router["React Router DOM (7 Stages)"]
        Axios["Axios API Client<br/>(Bearer Token Interceptor)"]
    end

    subgraph Server ["Server Layer (Node.js + Express.js REST API)"]
        Express["Express App Bootstrap (Port 5000)"]
        AuthMw["JWT Auth Middleware Guard"]
        AuthRoutes["/api/auth & /api/user"]
        AIRoutes["/api/ai (Gemini Reformulator)"]
        LitRoutes["/api/literature & /api/project"]
        RoadmapRoutes["/api/roadmap"]
        DriveRoutes["/api/drive (Cloud Sync)"]
        AuditRoutes["/api/audit (Pre-Flight Auditor)"]
        VenueRoutes["/api/venues"]
    end

    subgraph DB ["Persistence & External Services Layer"]
        MongoDB[("Mongoose MongoDB Database<br/>(User & Project Schemas)")]
        Gemini["Google Gemini Pro AI API"]
        Apis["5 Academic Literature Engines<br/>(Crossref, arXiv, Semantic Scholar, OpenAlex, Europe PMC)"]
    end

    UI --> Router
    Router --> Axios
    Axios --> Express
    Express --> AuthMw
    AuthMw --> AuthRoutes
    AuthMw --> AIRoutes
    AuthMw --> LitRoutes
    AuthMw --> RoadmapRoutes
    AuthMw --> DriveRoutes
    AuthMw --> AuditRoutes
    AuthMw --> VenueRoutes

    AuthRoutes --> MongoDB
    AIRoutes --> Gemini
    LitRoutes --> Apis
    LitRoutes --> MongoDB
    RoadmapRoutes --> MongoDB
    DriveRoutes --> MongoDB
    AuditRoutes --> MongoDB
    VenueRoutes --> MongoDB
```

---

## 🔐 2. Security & Dual-Token Authentication Flow

Authentication utilizes a **Dual-Token JWT Architecture** paired with `bcrypt` password hashing and `httpOnly` cookie protection:
- **Access Token (15 Minutes)**: In-memory short-lived token sent via `Authorization: Bearer <token>` HTTP header.
- **Refresh Token (7 Days)**: Stored in an `httpOnly`, `SameSite=Strict`, `Secure` browser cookie to eliminate XSS token theft risks.
- **Google Drive Credentials**: Encrypted at rest using AES-256-GCM authenticated encryption (`crypto.ts`).

```mermaid
sequenceDiagram
    autonumber
    actor Researcher
    participant Client as React Client (Port 3000)
    participant Server as Express Server (Port 5000)
    participant DB as MongoDB Database

    Researcher->>Client: Enter Email & Password
    Client->>Server: POST /api/auth/login { email, password }
    Server->>DB: Query User by Email
    DB-->>Server: User Document (bcrypt Hash)
    Server->>Server: Verify bcrypt.compare(password, hash)
    Server->>Server: Sign 15m Access Token & 7d Refresh Token
    Server-->>Client: Set httpOnly Refresh Cookie + Return Access Token JSON
    Client->>Client: Save Access Token in State & Axios Headers
    Researcher->>Client: Access Protected Dashboard / Project Studio
    Client->>Server: GET /api/user/profile (Bearer Access Token)
    Server->>Server: Verify JWT Signature in authMiddleware
    Server-->>Client: 200 OK User Profile Data
```

---

## 🌐 3. 5-Engine Literature Scan & Cosine Similarity Gate Algorithm

When a researcher initiates Stage 2 Literature Verification, the server executes parallel requests across 5 global academic databases and calculates a **384-Dimensional Cosine Similarity Overlap**:

```mermaid
flowchart TD
    Start["User Triggers Stage 2 Literature Scan"] --> Express["Express POST /api/literature/scan"]
    Express --> ParallelScan["Execute Concurrent API Harvester"]
    
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

    Pass & Warning & Stop --> Save["Persist Gate Verdict & Literature Matrix to MongoDB"]
    Save --> Response["Return Gate Report JSON to React Client"]
```

---

## 📑 4. Document Drafting & Google Drive Auto-Sync Pipeline

In Stage 5 (Paper Studio), manuscript state is updated in real time with automatic cloud synchronization:

```mermaid
flowchart LR
    Editor["React Markdown Editor Canvas"] --> State["In-Memory Draft State"]
    State --> Preview["Live Academic Preview (IEEE / ACM / Nature Render)"]
    State --> Debounce["Debounced Auto-Save Trigger (30s)"]
    Debounce --> API["PUT /api/project/:id/document"]
    API --> Mongo["Persist Document State in MongoDB"]
    API --> Drive["POST /api/project/:id/drive/sync"]
    Drive --> DriveCloud["Google Drive REST API Storage"]
    DriveCloud --> Status["UI Status Badge: 🟢 Synced to Drive"]
```
