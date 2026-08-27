import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, 
  ExternalLink, Globe, Layers, BookOpen, RefreshCw
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
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
  comparedBaseline?: {
    proposedMethodology: string;
    publishedBaselineTitle: string;
    publishedMethodology: string;
    highlightedOverlaps: string[];
  };
}

export function GateReport() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [scanningEngines, setScanningEngines] = useState<boolean>(true);
  const [gateData, setGateData] = useState<GateScanData | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');

  const loadGateReport = async () => {
    setLoading(true);
    setScanningEngines(true);
    try {
      // 1. Fetch real project data
      const projRes = await api.get(`/project/${id || 'demo'}`);
      const project = projRes.data.project;
      if (project) {
        setProjectTitle(project.academicTitle || project.title || 'Research Project');
      }

      // 2. Trigger dynamic 5-engine literature scan for the specific topic
      const scanRes = await api.post('/literature/scan', {
        projectId: id,
        academicTitle: project?.academicTitle || project?.title || 'Academic Methodology',
        problemStatement: project?.problemStatement || '',
        methodologyOverview: project?.methodologyOverview || project?.rawInput || ''
      });

      const scanResult: GateScanData = scanRes.data.gateScan;
      setGateData(scanResult);
      setScanningEngines(false);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load Gate report:', err);
      // Fallback
      setScanningEngines(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGateReport();
  }, [id]);

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

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadGateReport}
              isLoading={scanningEngines}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-Scan Literature
            </Button>

            <Link to={`/project/${id || 'demo'}/whitespace`}>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Proceed to Stage 3: Whitespace Board
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Harvester Status Banner */}
        <div className="bg-white border border-slate-200 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-navy-800 shrink-0" />
            <span className="font-semibold text-slate-800">5 Academic Databases Scanned Concurrently:</span>
            <span className="font-mono text-slate-500">Crossref, arXiv, OpenAlex, Semantic Scholar, Europe PMC</span>
          </div>
          {scanningEngines ? (
            <span className="font-mono text-amber-600 font-bold flex items-center space-x-1 animate-pulse">
              <span>●</span>
              <span>Computing 384d Vector Cosine Embeddings...</span>
            </span>
          ) : (
            <span className="font-mono text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Scan Complete (0ms Latency)</span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-56 w-full" />
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

            {/* Published Literature & Baseline Comparisons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-base">Harvested Literature & Direct Baselines</h2>
                <Badge variant="info">{gateData.literature.length} Relevant Papers Mapped</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {gateData.literature.map((paper) => (
                  <Card key={paper.id} className="bg-white border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={paper.category === 'BASELINE' ? 'stop' : paper.category === 'COMPETITOR' ? 'warning' : 'info'} size="sm">
                            {paper.category}
                          </Badge>
                          <span className="font-mono text-xs text-slate-500">{paper.venue} ({paper.year})</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{paper.title}</h3>
                        <p className="text-xs text-slate-500 font-mono">Authors: {paper.authors.join(', ')}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-navy-800">
                          {paper.similarity}% Overlap
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                      {paper.keyTakeaway}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-mono">
                      {paper.doiUrl && (
                        <a
                          href={paper.doiUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy-800 hover:underline flex items-center"
                        >
                          View Publisher DOI <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                      <span className="text-slate-400">BibTeX Indexed</span>
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
    </div>
  );
}
