import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, 
  ExternalLink, Globe, Layers, BookOpen, FileSpreadsheet, RefreshCw
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

  const loadGateReport = async () => {
    setLoading(true);
    setScanningEngines(true);
    try {
      // Simulate parallel 5-engine search API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockGateData: GateScanData = {
        status: 'PASS',
        noveltyScore: 82,
        maxOverlapPercent: 18,
        whitespaceStatement: 'Existing student dashboards focus exclusively on static time-blocking. None currently integrate automated prerequisite dependency graph modeling with localized distraction heuristics and real-time paper drafting auto-sync.',
        literature: [
          {
            id: 'lit-1',
            title: 'Automated Task Scheduling with Dependency Graph Heuristics in Distributed Systems',
            authors: ['A. Chen', 'M. Rodriguez', 'K. Sharma'],
            year: 2024,
            venue: 'IEEE Trans. Softw. Eng. (TSE)',
            doiUrl: 'https://doi.org/10.1109/TSE.2024.3398102',
            similarity: 18,
            keyTakeaway: 'Relies on static priority queues without dynamic distraction metrics.',
            category: 'BASELINE',
            bibtex: '@article{chen2024, author={Chen et al.}, title={Task Scheduling}, year={2024}}'
          },
          {
            id: 'lit-2',
            title: 'Real-Time Deadline Warning and Context-Aware Workload Balancing',
            authors: ['J. Smith', 'L. Zhang'],
            year: 2025,
            venue: 'ACM CHI Conference Proceedings',
            doiUrl: 'https://doi.org/10.1145/3613904.3642010',
            similarity: 12,
            keyTakeaway: 'Contextual notification triggers without graph modeling.',
            category: 'COMPETITOR',
            bibtex: '@article{smith2025, author={Smith et al.}, title={Deadline Warning}, year={2025}}'
          }
        ],
        comparedBaseline: {
          proposedMethodology: 'We propose an autonomous, event-driven algorithm that dynamically evaluates prerequisite dependency graph heuristics and applies localized workload balancing.',
          publishedBaselineTitle: 'Automated Task Scheduling with Dependency Graph Heuristics (Chen et al., 2024)',
          publishedMethodology: 'Static priority queue model evaluating static deadline timestamps without local distraction feedback loops.',
          highlightedOverlaps: [
            'Priority queue evaluation logic',
            'Timestamp deadline tracking'
          ]
        }
      };

      setGateData(mockGateData);
      setScanningEngines(false);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load Gate report:', err);
      setLoading(false);
      setScanningEngines(false);
    }
  };

  useEffect(() => {
    loadGateReport();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 2 OF 7</span>
              <span>•</span>
              <span>MATHEMATICAL LITERATURE SCAN & GATE VERIFICATION</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">The Gate Novelty Report</h1>
          </div>

          <Link to={`/project/${id || 'demo'}/literature`}>
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Stage 3: Whitespace Board
            </Button>
          </Link>
        </div>

        {/* 5-Engine Parallel Scanner Status Bar */}
        <div className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-100 text-navy-800 rounded flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm block">5-Engine Academic Harvesting Pipeline</span>
              <span className="text-xs text-slate-500">Crossref • arXiv (2024-2026) • Semantic Scholar • OpenAlex • Europe PMC</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>200M+ Peer-Reviewed Papers Scanned</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        )}

        {/* POPULATED GATE REPORT CONTENT */}
        {!loading && gateData && (
          <>
            {/* Verdict Summary Card */}
            <Card className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  {gateData.status === 'PASS' && (
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                  )}
                  {gateData.status === 'SOFT_WARNING' && (
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded flex items-center justify-center">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  )}
                  {gateData.status === 'HARD_STOP' && (
                    <div className="w-12 h-12 bg-red-100 text-red-800 rounded flex items-center justify-center">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-bold text-slate-900 text-lg">The Gate Verdict:</h2>
                      {gateData.status === 'PASS' && <Badge variant="pass">🟢 PASS (Novelty Verified)</Badge>}
                      {gateData.status === 'SOFT_WARNING' && <Badge variant="warning">🟡 SOFT WARNING</Badge>}
                      {gateData.status === 'HARD_STOP' && <Badge variant="stop">🔴 HARD STOP</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      384-Dimensional Cosine Similarity distance calculated across 200M+ peer-reviewed papers.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-3 rounded text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Novelty Score</span>
                    <span className="font-bold font-mono text-slate-900 text-lg">{gateData.noveltyScore} / 100</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Max Overlap</span>
                    <span className="font-bold font-mono text-slate-900 text-lg">{gateData.maxOverlapPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Research Whitespace Declaration */}
              <div className="bg-navy-800/5 border border-navy-800/20 p-4 rounded">
                <span className="font-bold text-navy-800 text-xs uppercase tracking-wider block mb-1">
                  Research Whitespace Declaration (What Has NOT Been Done Yet)
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  &ldquo;{gateData.whitespaceStatement}&rdquo;
                </p>
              </div>
            </Card>

            {/* Side-by-Side Methodology Comparison */}
            {gateData.comparedBaseline && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card header={<span className="font-bold text-slate-900 text-sm">Your Proposed Methodology</span>}>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {gateData.comparedBaseline.proposedMethodology}
                  </p>
                </Card>

                <Card header={<span className="font-bold text-slate-900 text-sm">Closest Published Baseline</span>}>
                  <span className="font-semibold text-slate-900 text-xs block mb-1">
                    {gateData.comparedBaseline.publishedBaselineTitle}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {gateData.comparedBaseline.publishedMethodology}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block w-full mb-1">Highlighted Overlaps:</span>
                    {gateData.comparedBaseline.highlightedOverlaps.map((overlap, idx) => (
                      <Badge key={idx} variant="warning" size="sm">
                        ⚠️ {overlap}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
