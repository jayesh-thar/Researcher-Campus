# ⚙️ Researcher Campus — Express API Server

Node.js + Express.js + Mongoose MongoDB REST API backend powering all AI synthesis, literature harvesting, and authentication pipelines.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js v18+ / v20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: Google Gemini Pro SDK with Multi-Model Fallback (`gemini-1.5-flash` ➔ `gemini-2.0-flash` ➔ `gemini-1.5-pro` ➔ Heuristics)
- **Security**: Dual-Token JWT (jsonwebtoken), bcrypt password hashing, AES-256-GCM token encryption

---

## 📁 Directory Structure & REST Endpoints

```
server/src/
├── config/
│   └── db.ts             # MongoDB connection with local fallback
├── models/
│   ├── User.ts           # User identity & persona schema
│   └── Project.ts        # 7-stage project state & document schema
├── routes/
│   ├── authRoutes.ts     # POST /api/auth/register, /login, /google, /refresh
│   ├── literatureRoutes.ts # POST /api/literature/scan, GET /api/project/:id/gaps, logs, delete
│   ├── roadmapRoutes.ts  # GET /api/project/:id/roadmap, POST/PATCH/DELETE tasks
│   ├── driveRoutes.ts    # POST /api/project/:id/drive/sync-report
│   ├── venueRoutes.ts    # GET /api/project/:id/venues, POST export-package
│   └── aiRoutes.ts       # POST /api/ai/reformulate, /audit, /chat
├── services/
│   ├── geminiService.ts  # Multi-model AI cascade & safe JSON parsing
│   ├── literatureService.ts # 5-engine parallel harvester (Crossref, arXiv, OpenAlex, Semantic, PMC)
│   └── driveService.ts   # Google Drive API file synchronization
└── middlewares/
    └── authMiddleware.ts # JWT authentication guard
```

---

## 🚀 Available Scripts

```bash
# Start development server with hot-reload on port 5000
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Compile TypeScript to JavaScript in dist/
npm run build

# Start production server
npm start
```
