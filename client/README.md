# 💻 Researcher Campus — Client Frontend

React 18 + Vite + TypeScript single-page application powering the Researcher Campus academic workstation interface.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite 6
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3 (Minimalist light theme: `#FAFAFA`, `#1E3A8A` accents)
- **Routing**: React Router DOM v6
- **Animations**: GSAP (GreenSock)
- **Icons**: Lucide React
- **API Client**: Axios (with Bearer JWT Interceptor)

---

## 📁 Directory Structure

```
client/src/
├── components/
│   ├── auth/           # ProtectedRoute authentication gate
│   ├── layout/         # Navbar, SidePaperDrawer, Page Layout Shells
│   └── ui/             # Card, Button, Badge, Modal, CommandPalette, BibtexModal
├── pages/
│   ├── LandingPage.tsx # Hero landing page with 7-stage interactive showcase
│   ├── Login.tsx       # Dual email/password & Google OAuth login
│   ├── Onboarding.tsx  # Frictionless welcome & persona setup
│   ├── Dashboard.tsx   # Workstation dashboard with AI request audit logs & delete
│   ├── IdeaLab.tsx     # Stage 1: Idea formulation & metric tag editor
│   ├── GateReport.tsx  # Stage 2: 5-engine literature scanner & Drive report sync
│   ├── WhitespaceBoard.tsx # Stage 3: Competitor matrix & AI research gaps
│   ├── Roadmap.tsx     # Stage 4: 4-phase checklist & AI Co-Pilot chat
│   ├── PaperStudio.tsx # Stage 5: Full drafting studio with IEEE live preview
│   ├── PreFlightAudit.tsx # Stage 6: Live manuscript audit & inline editor
│   ├── VenueMatcher.tsx   # Stage 7: Ranked conference directory & .zip export
│   └── ProfileSettings.tsx # User profile & credentials manager
└── services/
    └── api.ts          # Configured Axios instance with auto-auth headers
```

---

## 🚀 Available Scripts

```bash
# Start development server on http://localhost:3000
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```
