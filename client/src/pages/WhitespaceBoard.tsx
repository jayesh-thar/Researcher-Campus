import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, ExternalLink, Download, FileText, CheckCircle2, 
  ArrowRight, Filter, Search, Award, Compass, RefreshCw, Eye, X, Copy, Check, Lightbulb, Sparkles, Layers
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BibtexImportModal } from '../components/ui/BibtexImportModal';
import { SidePaperDrawer } from '../components/layout/SidePaperDrawer';
import { api } from '../services/api';

export interface LiteratureItem {
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
}

export interface ResearchGapItem {
  id: string;
  gapTitle: string;
  currentLimitation: string;
  proposedInnovation: string;
  impactScore: number;
}

export function WhitespaceBoard() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'GAPS'>('PAPERS');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'BASELINE' | 'COMPETITOR' | 'REFERENCE'>('ALL');
  const [whitespaceText, setWhitespaceText] = useState<string>('');
  const [literatureItems, setLiteratureItems] = useState<LiteratureItem[]>([]);
  const [researchGaps, setResearchGaps] = useState<ResearchGapItem[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<LiteratureItem | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  const fetchWhitespaceData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/project/${id || 'demo'}`);
      const project = response.data.project;
      if (project) {
        setProjectTitle(project.academicTitle || project.title || 'Research Proposal');
        setWhitespaceText(
          project.gateResult?.whitespaceStatement ||
          'Novel methodological formulation with empirical differentiation from published baselines.'
        );
        if (project.literature && project.literature.length > 0) {
          setLiteratureItems(project.literature);
        } else {
          const scanRes = await api.post('/literature/scan', {
            projectId: id,
            academicTitle: project.academicTitle || project.title,
            methodologyOverview: project.methodologyOverview || project.rawInput
          });
          setLiteratureItems(scanRes.data.gateScan.literature || []);
        }
      }

      // Fetch AI Research Gaps
      const gapsRes = await api.get(`/project/${id || 'demo'}/gaps`);
      setResearchGaps(gapsRes.data.gaps || []);
    } catch (err) {
      console.error('Fetch whitespace error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitespaceData();
  }, [id]);

  const handleExportAllBibtex = () => {
    const combined = literatureItems.map((l) => l.bibtex).join('\n\n');
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `references_${id || 'project'}.bib`;
    link.click();
  };

  const handleSaveImportedBibtex = (bibtexText: string) => {
    const titleMatch = bibtexText.match(/title\s*=\s*[{"]([^}"]+)[}"]/i);
    const authorMatch = bibtexText.match(/author\s*=\s*[{"]([^}"]+)[}"]/i);
    const yearMatch = bibtexText.match(/year\s*=\s*[{"]?(\d{4})[}"]?/i);
    const journalMatch = bibtexText.match(/(?:journal|booktitle)\s*=\s*[{"]([^}"]+)[}"]/i);

    const newItem: LiteratureItem = {
      id: `lit-custom-${Date.now()}`,
      title: titleMatch ? titleMatch[1] : 'Imported BibTeX Reference',
      authors: authorMatch ? authorMatch[1].split(' and ') : ['Custom Author'],
      year: yearMatch ? parseInt(yearMatch[1], 10) : 2025,
      venue: journalMatch ? journalMatch[1] : 'Custom Academic Venue',
      doiUrl: 'https://doi.org/',
      similarity: 10,
      keyTakeaway: 'User-imported reference for custom literature whitespace mapping.',
      category: 'REFERENCE',
      bibtex: bibtexText
    };

    setLiteratureItems((prev) => [...prev, newItem]);
  };

  const handleCopyBibtex = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const filteredItems = literatureItems.filter((item) => {
    if (filterCategory === 'ALL') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Stage Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 3 OF 7</span>
              <span>•</span>
              <span>WHITESPACE BOARD & COMPETITOR MATRIX</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Literature Whitespace Matrix</h1>
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
              onClick={handleExportAllBibtex}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export .bib
            </Button>

            <Link to={`/project/${id || 'demo'}/roadmap`}>
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Proceed to Stage 4: Implementation Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Whitespace Discovery Callout */}
        <Card className="bg-navy-900 text-white border-navy-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base tracking-tight">Novel Scientific Contribution Angle</h2>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {whitespaceText}
          </p>
        </Card>

        {/* View Switcher: Published Papers vs AI Research Gaps */}
        <div className="flex items-center space-x-3 bg-white p-1.5 border border-slate-200 rounded max-w-md">
          <button
            onClick={() => setActiveTab('PAPERS')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'PAPERS'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Published Baseline Matrix ({literatureItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('GAPS')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'GAPS'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Research Gaps ({researchGaps.length})</span>
          </button>
        </div>

        {/* TAB 1: Published Baselines */}
        {activeTab === 'PAPERS' && (
          <div className="space-y-4">
            {/* Filter Controls & BibTeX Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Filter:</span>
                {(['ALL', 'BASELINE', 'COMPETITOR', 'REFERENCE'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      filterCategory === cat
                        ? 'bg-navy-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsImportModalOpen(true)}
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              >
                Import Custom BibTeX
              </Button>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 w-56 bg-slate-200 rounded animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded p-5 space-y-3 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-72 bg-slate-200 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </div>
                    <div className="h-12 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((paper) => (
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

                      <span className="font-mono text-xs font-bold text-navy-800 shrink-0">
                        {paper.similarity}% Overlap
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-3 rounded space-y-1 text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[10px]">
                        Methodology Distinction / Gap:
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
                          Publisher DOI <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI Research Gaps & Opportunity Discovery */}
        {activeTab === 'GAPS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {researchGaps.map((gap) => (
                <Card key={gap.id} className="bg-white border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <h3 className="font-bold text-slate-900 text-sm">{gap.gapTitle}</h3>
                    </div>
                    <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Impact Potential: {gap.impactScore}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="bg-red-50/60 border border-red-200 p-3 rounded space-y-1">
                      <span className="font-bold text-red-900 uppercase tracking-wider block font-mono text-[10px]">
                        Limitation in Existing Published Work:
                      </span>
                      <p className="text-red-950 leading-relaxed">{gap.currentLimitation}</p>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded space-y-1">
                      <span className="font-bold text-emerald-900 uppercase tracking-wider block font-mono text-[10px]">
                        Proposed Methodological Innovation:
                      </span>
                      <p className="text-emerald-950 leading-relaxed">{gap.proposedInnovation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Paper Detail Modal */}
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
                    Methodology Distinction / Gap:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-sans">{selectedPaper.keyTakeaway}</p>
                  <div className="pt-2 font-mono text-navy-800 font-bold">
                    Vector Overlap: {selectedPaper.similarity}%
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

        {/* BibTeX Import Modal */}
        <BibtexImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleSaveImportedBibtex}
        />

        {/* Persistent Side-by-Side Paper Drafting Studio Drawer */}
        <SidePaperDrawer projectId={id || 'demo'} />
      </main>
    </div>
  );
}
