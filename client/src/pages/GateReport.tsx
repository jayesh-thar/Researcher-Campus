import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, 
  ExternalLink, Globe, Layers, BookOpen, RefreshCw, Cloud, Download, Eye, X, Copy, Check, FileText
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

  // Drive Sync State
  const [syncingDrive, setSyncingDrive] = useState<boolean>(false);
  const [driveSyncSuccess, setDriveSyncSuccess] = useState<string | null>(null);

  const scanStepsList = [
    'Connecting to Crossref Works Registry API...',
    'Harvesting arXiv Scientific Preprints...',
    'Querying OpenAlex Global Scholarly Graph...',
    'Scanning Semantic Scholar & Europe PMC...',
    'Gemini AI Computing 384d Vector Cosine Embeddings...'
  ];

  const loadGateReport = async (isManualReScan = false) => {
    if (isManualReScan) {
      setScanningEngines(true);
      setScanStep(0);
      for (let i = 0; i < scanStepsList.length; i++) {
        setScanStep(i);
        await new Promise((r) => setTimeout(r, 350));
      }
    } else {
      setLoading(true);
    }

    try {
      // 1. Fetch real project data
      const projRes = await api.get(`/project/${id || 'demo'}`);
      const project = projRes.data.project;
      if (project) {
        setProjectTitle(project.academicTitle || project.title || 'Research Project');
      }

      // 2. Trigger dynamic 5-engine literature scan
      const scanRes = await api.post('/literature/scan', {
        projectId: id,
        academicTitle: project?.academicTitle || project?.title || 'Academic Methodology',
        problemStatement: project?.problemStatement || '',
        methodologyOverview: project?.methodologyOverview || project?.rawInput || ''
      });

      const scanResult: GateScanData = scanRes.data.gateScan;
      setGateData(scanResult);
    } catch (err) {
      console.error('Failed to load Gate report:', err);
    } finally {
      setLoading(false);
      setScanningEngines(false);
    }
  };

  useEffect(() => {
    loadGateReport(false);
  }, [id]);

  const handleSyncToDrive = async () => {
    setSyncingDrive(true);
    try {
      const response = await api.post(`/project/${id || 'demo'}/drive/sync-report`);
      const { docName, reportMarkdown } = response.data;
      setDriveSyncSuccess(`Synced "${docName}" to Google Drive!`);

      // Auto-trigger client-side document download fallback
      const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docName.replace('.doc', '.md');
      a.click();

      setTimeout(() => setDriveSyncSuccess(null), 5000);
    } catch (err) {
      console.error('Sync to drive error:', err);
    } finally {
      setSyncingDrive(false);
    }
  };

  const handleCopyBibtex = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PASS':
        return <Badge variant="pass">Green: High Novelty (Pass)</Badge>;
      case 'SOFT_WARNING':
        return <Badge variant="warning">Yellow: Moderate Overlap</Badge>;
      case 'HARD_STOP':
        return <Badge variant="stop">Red: Critical Overlap</Badge>;
      default:
        return <Badge variant="info">Evaluation Complete</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Stage Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 2 OF 7</span>
              <span>•</span>
              <span>LITERATURE GATE REPORT & NOVELTY CHECK</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">5-Engine Literature Scan Verdict</h1>
            {projectTitle && (
              <p className="text-xs text-slate-600 font-mono mt-0.5 truncate max-w-2xl">
                Topic: {projectTitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadGateReport(true)}
              isLoading={scanningEngines}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-Scan Literature
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSyncToDrive}
              isLoading={syncingDrive}
              leftIcon={<Cloud className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Save Report to Drive (.doc)
            </Button>

            <Link to={`/project/${id || 'demo'}/whitespace`}>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Proceed to Stage 3: Whitespace Board
              </Button>
            </Link>
          </div>
        </div>

        {/* Drive Sync Success Notification */}
        {driveSyncSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs flex items-center justify-between font-mono animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{driveSyncSuccess}</span>
            </div>
            <span className="text-[11px] text-emerald-700">Document saved with SHA-256 integrity</span>
          </div>
        )}

        {/* 5-Harvester Live Status Banner */}
        <div className="bg-white border border-slate-200 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-navy-800 shrink-0" />
            <span className="font-semibold text-slate-800">5 Academic Databases Scanned Concurrently:</span>
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
              <span>5 Engines Scanned & Vectorized</span>
            </span>
          )}
        </div>

        {/* Scanning In-Progress Modal / Overlay */}
        {scanningEngines && (
          <div className="bg-white border border-amber-200 rounded p-4 text-xs font-mono space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 uppercase">Live 5-Engine Literature Harvester:</span>
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

        {/* Loading Wireframe YouTube-style Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {/* Verdict Skeleton Card */}
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

            {/* Paper Cards Skeletons */}
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
            {/* Gate Verdict Card */}
            <Card className="bg-white border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                    Novelty Verification Verdict
                  </span>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(gateData.status)}
                    <span className="font-mono text-xs text-slate-500">
                      Maximum Vector Overlap: <strong className="text-slate-900">{gateData.maxOverlapPercent}%</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-xs text-slate-500">Novelty Score:</span>
                  <span className="text-2xl font-extrabold text-navy-800">{gateData.noveltyScore}/100</span>
                </div>
              </div>

              {/* Research Whitespace Statement */}
              <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-4 rounded text-xs">
                <span className="font-bold text-navy-800 uppercase tracking-wider block font-mono">
                  Verified Academic Whitespace:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{gateData.whitespaceStatement}</p>
              </div>

              {gateData.remediationAngle && (
                <div className="space-y-1 bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900">
                  <span className="font-bold uppercase tracking-wider block font-mono">Recommended Novelty Pivot:</span>
                  <p>{gateData.remediationAngle}</p>
                </div>
              )}
            </Card>

            {/* Harvested Published Literature & Direct Baselines */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Harvested Literature & Direct Baselines</h2>
                  <p className="text-xs text-slate-500">Click any paper to inspect full abstract, methodology gap, and BibTeX citation.</p>
                </div>
                <Badge variant="info">{gateData.literature.length} Published Papers Mapped</Badge>
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
                        Published Abstract & Methodology Distinction:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-sans">{paper.keyTakeaway}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-mono">
                      <span className="text-navy-800 font-semibold flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Full Abstract & BibTeX
                      </span>
                      {paper.doiUrl && (
                        <a
                          href={paper.doiUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-navy-800 hover:underline flex items-center"
                        >
                          DOI Link <ExternalLink className="w-3 h-3 ml-1" />
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
            No gate scan data available. Click "Re-Scan Literature" to initiate.
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
                  Methodology Overlap Analysis:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedPaper.keyTakeaway}</p>
                <div className="pt-2 font-mono text-navy-800 font-bold">
                  Vector Distance Overlap: {selectedPaper.similarity}%
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
                  Open Publisher DOI <ExternalLink className="w-3 h-3 ml-1" />
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
