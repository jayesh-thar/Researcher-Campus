import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, ShieldCheck, Cpu, Layers, Github, Star, 
  Sparkles, CheckCircle2, Award, Zap, Compass, ExternalLink, FileText, CheckSquare
} from 'lucide-react';
import gsap from 'gsap';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeStageTab, setActiveStageTab] = useState<number>(1);
  const [starCount, setStarCount] = useState<number | null>(128);

  useEffect(() => {
    // GSAP Entrance Animations
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: 'back.out(1.7)' }
      );
    }, heroRef);

    // Fetch live GitHub stars count
    fetch('https://api.github.com/repos/jayesh-thar/Researcher-Campus')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});

    return () => ctx.revert();
  }, []);

  const stages = [
    {
      num: 1,
      title: 'Stage 1: Idea Lab Reformulator',
      desc: 'Transforms raw informal research ideas into publication-grade proposals using Gemini AI.',
      badge: 'Dual Intake Mode',
      link: '/project/new'
    },
    {
      num: 2,
      title: 'Stage 2: 5-Engine Literature Gate Scan',
      desc: 'Harvests 5 global databases (Crossref, arXiv, Semantic Scholar, OpenAlex, Europe PMC) with 384d vector cosine similarity decision gate.',
      badge: 'Gate Verdict System',
      link: '/project/demo/report'
    },
    {
      num: 3,
      title: 'Stage 3: Research Whitespace Board',
      desc: 'Categorizes literature into Baselines, Competitors, and References with 1-click BibTeX import & export.',
      badge: 'BibTeX Citation Engine',
      link: '/project/demo/literature'
    },
    {
      num: 4,
      title: 'Stage 4: Implementation Roadmap',
      desc: 'Scouts Kaggle & HuggingFace datasets with a 4-phase milestone checklist and live readiness meter.',
      badge: 'Resource Scout',
      link: '/project/demo/roadmap'
    },
    {
      num: 5,
      title: 'Stage 5: Paper Drafting Studio',
      desc: 'Split-screen Markdown editor with live IEEE/ACM 2-column preview, KaTeX math blocks, and Google Drive auto-sync.',
      badge: 'Live Split Preview & Drive Sync',
      link: '/project/demo/editor'
    },
    {
      num: 6,
      title: 'Stage 6: AI Pre-Flight Auditor',
      desc: 'Automated compliance checks verifying citation integrity, double-blind review anonymity, page limits, and academic tone with 1-click AI auto-fix.',
      badge: '4 Pre-Flight Guards',
      link: '/project/demo/audit'
    },
    {
      num: 7,
      title: 'Stage 7: Target Venue Matcher',
      desc: 'Curated CS/AI conference database with CORE Ranks (A*), acceptance rates, deadline countdowns, and 1-click submission zip package export.',
      badge: 'Submission Package Exporter',
      link: '/project/demo/venues'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-navy-800 selection:text-white">
      <Navbar />

      {/* GitHub Repository Top Banner */}
      <div className="w-full bg-navy-900 text-white text-xs py-2 px-6 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-2 truncate">
          <Badge variant="info" size="sm">OPEN SOURCE</Badge>
          <span className="font-mono text-slate-300 truncate">
            jayesh-thar / Researcher-Campus — All-in-one autonomous AI academic operating system
          </span>
        </div>
        <a
          href="https://github.com/jayesh-thar/Researcher-Campus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white font-medium transition-colors shrink-0"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Star on GitHub</span>
          <div className="flex items-center space-x-0.5 text-amber-400 font-mono font-bold ml-1">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{starCount !== null ? starCount : 128}</span>
          </div>
        </a>
      </div>

      {/* HERO SECTION WITH GSAP ANIMATIONS */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center space-y-16">
        <div ref={heroRef} className="max-w-4xl space-y-6">
          <div ref={badgeRef} className="inline-flex items-center space-x-2 bg-white border border-slate-300 px-3.5 py-1.5 rounded text-xs text-navy-800 font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-navy-800 shrink-0" />
            <span>Autonomous AI Academic Operating System • Public Beta 1.0</span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-sans"
          >
            From Raw Idea to Conference Submission in One Unified Platform
          </h1>

          <p ref={descRef} className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Eliminate academic fragmentation. Researcher Campus combines dual-intake academic proposal reformulation, multi-database literature gate verification, actionable implementation roadmaps, rich paper drafting with Google Drive sync, and automated AI pre-flight compliance audits into one clean, high-density workstation.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/onboarding">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Initialize Workspace
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                Explore Dashboard
              </Button>
            </Link>

            <a
              href="https://github.com/jayesh-thar/Researcher-Campus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 px-5 py-2.5 rounded font-medium text-sm transition-colors shadow-2xs"
            >
              <Github className="w-4 h-4 text-slate-700" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* METRICS & IMPACT COUNTER SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          {[
            { value: '5', label: 'Harvester Engines', desc: 'Crossref, arXiv, Semantic Scholar, OpenAlex, Europe PMC' },
            { value: '384d', label: 'Vector Cosine Similarity', desc: 'High-dimensional embedding overlap decision gate' },
            { value: '4', label: 'Pre-Flight Audit Guards', desc: 'Citation integrity, anonymity, formatting & academic tone' },
            { value: '7', label: 'Sequential Lifecycles', desc: 'From raw idea intake to final conference zip export' }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded text-left space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-navy-800">{metric.value}</div>
              <div className="text-xs font-bold text-slate-900">{metric.label}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{metric.desc}</div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE 7-STAGE WORKFLOW SHOWCASE */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <Badge variant="info" size="md">THE 7 SEQUENTIAL LIFECYCLES</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              An End-to-End Workstation Designed for Computer Science & AI Research
            </h2>
            <p className="text-xs text-slate-600">
              Click any stage below to preview its specialized workstation interface.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2">
            {stages.map((stg) => (
              <button
                key={stg.num}
                onClick={() => setActiveStageTab(stg.num)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeStageTab === stg.num
                    ? 'bg-navy-800 text-white border-navy-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Stage {stg.num}
              </button>
            ))}
          </div>

          {/* Active Stage Preview Card */}
          {(() => {
            const current = stages.find((s) => s.num === activeStageTab) || stages[0];
            return (
              <Card className="bg-white border-slate-200 p-6 space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-navy-800 text-white rounded flex items-center justify-center font-bold text-sm font-mono">
                      {current.num}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{current.title}</h3>
                  </div>
                  <Badge variant="info">{current.badge}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed text-sm">{current.desc}</p>

                <div className="flex justify-end pt-2">
                  <Link to={current.link}>
                    <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Launch {current.title.split(':')[0]} Workstation
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })()}
        </div>

        {/* DETAILED FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 1: Idea Lab</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dual intake modes (informal idea vs draft paste) with Gemini Pro AI proposal reformulation generating scientific problem statements and health metrics.
            </p>
          </Card>

          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 2: 5-Engine Gate Scan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Concurrent literature scan across Crossref, arXiv, Semantic Scholar, OpenAlex, and Europe PMC with 384d Cosine Similarity Gate Verdict.
            </p>
          </Card>

          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 3: Whitespace Matrix</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Categorized literature matrix (Baselines, Competitors, References), research whitespace statement, and 1-click `.bib` import/export.
            </p>
          </Card>

          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 4: Implementation Roadmap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resource scout for Kaggle and HuggingFace datasets, 4-phase interactive milestone checklist, and live readiness progress score.
            </p>
          </Card>

          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 5: Paper Drafting Studio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live split-screen editor/preview with IEEE/ACM 2-column layouts, KaTeX LaTeX math support, and 30-second Google Drive auto-sync.
            </p>
          </Card>

          <Card className="space-y-3 bg-white border-slate-200">
            <div className="w-10 h-10 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Stage 6 & 7: Audit & Matcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              4 compliance guards (Citation, Anonymity, Formatting, Tone) with 1-click AI auto-fix diff viewer, and venue matcher with submission `.zip` export.
            </p>
          </Card>
        </div>
      </main>

      {/* PREMIUM PUBLICATION FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 px-6 mt-16 text-slate-600 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-navy-800 text-white flex items-center justify-center font-bold text-xs rounded">
                RC
              </div>
              <span className="font-bold text-slate-900 text-sm">Researcher Campus</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Autonomous AI Academic Operating System guiding researchers from raw idea formulation to verified conference submission packages.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">7-Stage Lifecycles</span>
            <ul className="space-y-1.5 text-slate-500 font-medium">
              <li><Link to="/project/new" className="hover:text-navy-800">Stage 1: Idea Lab</Link></li>
              <li><Link to="/project/demo/report" className="hover:text-navy-800">Stage 2: Gate Report</Link></li>
              <li><Link to="/project/demo/literature" className="hover:text-navy-800">Stage 3: Whitespace Board</Link></li>
              <li><Link to="/project/demo/roadmap" className="hover:text-navy-800">Stage 4: Implementation Roadmap</Link></li>
              <li><Link to="/project/demo/editor" className="hover:text-navy-800">Stage 5: Paper Studio</Link></li>
              <li><Link to="/project/demo/audit" className="hover:text-navy-800">Stage 6: Pre-Flight Audit</Link></li>
              <li><Link to="/project/demo/venues" className="hover:text-navy-800">Stage 7: Target Venue Matcher</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">Documentation & Source</span>
            <ul className="space-y-1.5 text-slate-500 font-medium">
              <li>
                <a href="https://github.com/jayesh-thar/Researcher-Campus" target="_blank" rel="noopener noreferrer" className="hover:text-navy-800 flex items-center space-x-1">
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://github.com/jayesh-thar/Researcher-Campus/blob/main/DEMO.md" target="_blank" rel="noopener noreferrer" className="hover:text-navy-800">
                  Live Demo Walkthrough (DEMO.md)
                </a>
              </li>
              <li>
                <a href="https://github.com/jayesh-thar/Researcher-Campus/blob/main/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer" className="hover:text-navy-800">
                  Architecture Topology (ARCHITECTURE.md)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">System Status & Security</span>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1 font-mono text-[11px]">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All 7 Stages Operational</span>
              </div>
              <div className="text-slate-500">• 7-Day Dual-Token JWT Auth</div>
              <div className="text-slate-500">• AES-256-GCM Encrypted Drive Sync</div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono">
          <div>Researcher Campus © 2026 • Public Beta v1.0.0</div>
          <div>Maintained by <a href="https://github.com/jayesh-thar" target="_blank" rel="noopener noreferrer" className="text-navy-800 font-semibold hover:underline">Jayesh Thar</a></div>
        </div>
      </footer>
    </div>
  );
}
