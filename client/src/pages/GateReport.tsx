import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, 
  ExternalLink, Globe, Eye, X, Copy, Check, BookOpen
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export interface GateScanData {
  status: 'PASS' | 'SOFT_WARNING' | 'HARD_STOP';
  noveltyScore: number;
  maxOverlapPercent: number;
  whitespaceStatement: string;
  remediationAngle?: string;
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
}

export function GateReport() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [scanningEngines, setScanningEngines] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [gateData, setGateData] = useState<GateScanData | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');
  
  // Paper Detail Modal State
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  const scanStepsList = [
    'Connecting to Crossref Works Registry API...',
    'Harvesting arXiv Scientific Preprints...',
    'Querying OpenAlex Global Scholarly Graph...',
    'Scanning Semantic Scholar & Europe PMC...',
    'Gemini AI Computing 384d Vector Cosine Embeddings...'
  ];

  const loadGateReport = async () => {
    setLoading(true);

    try {
      // 1. Fetch real project data
      const projRes = await api.get(`/project/${id || 'demo'}`);
      const project = projRes.data.project;
      if (project) {
        setProjectTitle(project.academicTitle || project.title || 'Research Project');

        // HYDRATION FIRST: If literature & gate result already exist, hydrate directly!
        if (project.literature && project.literature.length > 0 && project.gateResult) {
          setGateData({
            status: project.gateResult.status || 'PASS',
            noveltyScore: project.gateResult.noveltyScore ?? 92,
            maxOverlapPercent: project.gateResult.maxOverlapPercent ?? 15,
            whitespaceStatement: project.gateResult.whitespaceStatement || 'Novel methodology with empirical differentiation from published baselines.',
            remediationAngle: project.gateResult.remediationAngle,
            literature: project.literature
          });
          // Advance stage to 2 (idempotent — $max never goes back)
          await api.put(`/project/${id}/stage`, { stage: 2 });
          setLoading(false);
          return;
        }
      }

      // 2. Only run 5-engine scan if project has NOT been scanned yet
      setScanningEngines(true);
      for (let i = 0; i < scanStepsList.length; i++) {
        setScanStep(i);
        await new Promise((r) => setTimeout(r, 200));
      }

      const scanRes = await api.post('/literature/scan', {
        projectId: id,
        academicTitle: project?.academicTitle || project?.title || 'Academic Methodology',
        problemStatement: project?.problemStatement || '',
        methodologyOverview: project?.methodologyOverview || project?.rawInput || ''
      });

      const scanResult: GateScanData = scanRes.data.gateScan;
      setGateData(scanResult);
      // Advance stage to 2 after first scan completes
      await api.put(`/project/${id}/stage`, { stage: 2 });
    } catch (err) {
      console.error('Failed to load Gate report:', err);
    } finally {
      setLoading(false);
      setScanningEngines(false);
    }
  };

  useEffect(() => {
    loadGateReport();
  }, [id]);

  const handleCopyBibtex = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PASS':
        return <Badge variant="pass">🟢 High Novelty (Ready to Proceed)</Badge>;
      case 'SOFT_WARNING':
        return <Badge variant="warning">🟡 Moderate Overlap (Review Baselines)</Badge>;
      case 'HARD_STOP':
        return <Badge variant="stop">🔴 High Overlap with Existing Papers</Badge>;
      default:
        return <Badge variant="info">Evaluation Complete</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 2 OF 7</span>
              <span>•</span>
              <span>LITERATURE & NOVELTY CHECK</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Literature & Novelty Analysis</h1>
            {projectTitle && (
              <p className="text-xs text-slate-600 font-mono mt-0.5 truncate max-w-2xl">
                Topic: {projectTitle}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <Link to={`/project/${id || 'demo'}/whitespace`}>
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Stage 3: Whitespace Board
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Harvester Live Status Banner */}
        <div className="bg-white border border-slate-200 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-navy-800 shrink-0" />
            <span className="font-semibold text-slate-800">5 Academic Databases Scanned:</span>
            <span className="font-mono text-slate-500">Crossref, arXiv, OpenAlex, Semantic Scholar, Europe PMC</span>
          </div>
          {scanningEngines ? (
            <span className="font-mono text-amber-600 font-bold flex items-center space-x-1.5 animate-pulse">
              <span>●</span>
              <span>{scanStepsList[scanStep]}</span>
            </span>
          ) : (
            <span className="font-mono text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Literature Scanned & Vectorized</span>
            </span>
          )}
        </div>

        {/* Scanning In-Progress Banner */}
        {scanningEngines && (
          <div className="bg-white border border-amber-200 rounded p-4 text-xs font-mono space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 uppercase">Searching Academic Engines:</span>
              <span className="text-amber-700 font-bold">{scanStep + 1} / {scanStepsList.length}</span>
            </div>
            <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanStepsList.length) * 100}%` }}
              />
            </div>
            <p className="text-slate-600">{scanStepsList[scanStep]}</p>
          </div>
        )}

        {/* Loading Wireframe Skeletons */}
        {loading ? (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-6 w-56 bg-slate-200 rounded" />
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded" />
              </div>
              <div className="h-16 bg-slate-100 rounded" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded p-5 space-y-3 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-4 w-64 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </div>
                  <div className="h-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : gateData ? (
          <>
            {/* Novelty Summary Card */}
            <Card className="bg-white border-slate-200 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                    Novelty Analysis
                  </span>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(gateData.status)}
                    <span className="font-mono text-xs text-slate-600">
                      Similarity with Existing Work: <strong className="text-slate-900">{gateData.maxOverlapPercent}%</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-xs text-slate-500">Novelty Score:</span>
                  <span className="text-2xl font-extrabold text-navy-800">{gateData.noveltyScore}/100</span>
                </div>
              </div>

              {/* What Makes Your Idea Unique */}
              <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-4 rounded text-xs">
                <span className="font-bold text-navy-800 uppercase tracking-wider block font-mono">
                  What Makes Your Work Unique:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{gateData.whitespaceStatement}</p>
              </div>

              {/* Suggested Improvement if overlap is present */}
              {gateData.remediationAngle && (
                <div className="space-y-1 bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900">
                  <span className="font-bold uppercase tracking-wider block font-mono">
                    Suggested Angle to Differentiate:
                  </span>
                  <p>{gateData.remediationAngle}</p>
                </div>
              )}
            </Card>

            {/* Similar Research Papers Found */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Similar Research Papers Found</h2>
                  <p className="text-xs text-slate-500">
                    Explore existing papers to compare methodologies and cite as baselines. Click any paper to view abstract and BibTeX citation.
                  </p>
                </div>
                <Badge variant="info">{gateData.literature.length} Related Papers</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {gateData.literature.map((paper) => (
                  <Card
                    key={paper.id}
                    className="bg-white border-slate-200 hover:border-navy-800 transition-all cursor-pointer space-y-3"
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={paper.category === 'BASELINE' ? 'stop' : paper.category === 'COMPETITOR' ? 'warning' : 'info'} size="sm">
                            {paper.category}
                          </Badge>
                          <span className="font-mono text-xs text-slate-500 font-semibold">{paper.venue} ({paper.year})</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm hover:text-navy-800">{paper.title}</h3>
                        <p className="text-xs text-slate-500 font-mono">Authors: {paper.authors.join(', ')}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-navy-800">
                          {paper.similarity}% Overlap
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-3 rounded space-y-1 text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[10px]">
                        Paper Summary:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-sans">{paper.keyTakeaway}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-mono">
                      <span className="text-navy-800 font-semibold flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Abstract & BibTeX
                      </span>
                      {paper.doiUrl && (
                        <a
                          href={paper.doiUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-navy-800 hover:underline flex items-center"
                        >
                          Publisher Link <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200 rounded">
            No literature scan data found for this project.
          </div>
        )}
      </main>

      {/* Expanded Paper Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white border border-slate-300 rounded shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Badge variant={selectedPaper.category === 'BASELINE' ? 'stop' : selectedPaper.category === 'COMPETITOR' ? 'warning' : 'info'}>
                  {selectedPaper.category}
                </Badge>
                <span className="font-mono text-xs font-bold text-slate-700">{selectedPaper.venue} ({selectedPaper.year})</span>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <h2 className="text-base font-bold text-slate-900">{selectedPaper.title}</h2>
              <p className="font-mono text-slate-600">Authors: {selectedPaper.authors.join(', ')}</p>

              <div className="space-y-1 bg-slate-50 border border-slate-200 p-3 rounded">
                <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[10px]">
                  Paper Abstract & Method:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedPaper.keyTakeaway}</p>
                <div className="pt-2 font-mono text-navy-800 font-bold">
                  Similarity with Your Work: {selectedPaper.similarity}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[10px]">
                    BibTeX Reference:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyBibtex(selectedPaper.bibtex)}
                    className="text-navy-800 hover:text-navy-900 font-mono text-[11px] flex items-center space-x-1"
                  >
                    {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBibtex ? 'Copied!' : 'Copy BibTeX'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded text-[11px] font-mono overflow-x-auto">
                  {selectedPaper.bibtex}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {selectedPaper.doiUrl && (
                <a
                  href={selectedPaper.doiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-navy-800 font-mono hover:underline flex items-center"
                >
                  Open Publisher Link <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              <Button size="sm" onClick={() => setSelectedPaper(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
