import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { IdeaLab } from './pages/IdeaLab';
import { GateReport } from './pages/GateReport';
import { WhitespaceBoard } from './pages/WhitespaceBoard';
import { Roadmap } from './pages/Roadmap';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Academic Navigation Bar */}
      <header className="w-full bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-navy-800 text-white flex items-center justify-center font-bold text-sm rounded-sm">
            RC
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">Researcher Campus</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono">
            Classic MERN Stack
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-navy-800">
            Sign In
          </Link>
          <Link
            to="/onboarding"
            className="text-sm font-medium bg-navy-800 text-white px-3.5 py-1.5 rounded hover:bg-navy-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1 rounded text-xs text-navy-800 font-medium mb-6">
            <Cpu className="w-3.5 h-3.5 text-navy-600" />
            <span>Autonomous AI Academic Operating System (React + Express)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            From Raw Idea to Conference Submission in One Unified Platform
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Eliminate academic fragmentation. Researcher Campus combines dual-intake academic reformulation, 
            multi-database literature gate verification, actionable implementation roadmaps, rich paper drafting 
            with Google Drive sync, and automated AI pre-flight compliance audits into one clean, high-density workstation.
          </p>

          <div className="flex items-center space-x-4 mb-12">
            <Link
              to="/onboarding"
              className="inline-flex items-center space-x-2 bg-navy-800 text-white px-5 py-2.5 rounded font-medium text-sm hover:bg-navy-700 transition-colors"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded font-medium text-sm hover:bg-slate-100 transition-colors"
            >
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="bg-white p-5 rounded border border-slate-200">
            <div className="w-9 h-9 bg-slate-100 text-navy-800 rounded flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">5-Engine Literature Scan</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Concurrently scans Crossref, arXiv, Semantic Scholar, OpenAlex, and Europe PMC to verify research novelty.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-slate-200">
            <div className="w-9 h-9 bg-slate-100 text-navy-800 rounded flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">Paper Drafting Studio</h3>
            <p className="text-xs text-slate-600 leading-normal">
              In-browser rich document editor with IEEE, ACM, and Nature templates, KaTeX math blocks, and Google Drive auto-sync.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-slate-200">
            <div className="w-9 h-9 bg-slate-100 text-navy-800 rounded flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-1">AI Pre-Flight Audit</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Automated compliance checks verifying citation integrity, blind review anonymity, page limits, and academic tone.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        Researcher Campus © 2026 • Classic MERN Stack (React + Express) • Production Ready
      </footer>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/new" element={<IdeaLab />} />
        <Route path="/project/:id/report" element={<GateReport />} />
        <Route path="/project/:id/literature" element={<WhitespaceBoard />} />
        <Route path="/project/:id/roadmap" element={<Roadmap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
