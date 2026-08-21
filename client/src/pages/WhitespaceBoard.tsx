import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, ExternalLink, Download, FileText, CheckCircle2, 
  ArrowRight, Filter, Search, Award, Zap, Compass
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
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

export function WhitespaceBoard() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'BASELINE' | 'COMPETITOR' | 'REFERENCE'>('ALL');
  const [whitespaceText, setWhitespaceText] = useState<string>('');
  const [literatureItems, setLiteratureItems] = useState<LiteratureItem[]>([]);

  const fetchWhitespaceData = async () => {
    setLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockItems: LiteratureItem[] = [
        {
          id: 'lit-1',
          title: 'Automated Task Scheduling with Dependency Graph Heuristics in Distributed Systems',
          authors: ['A. Chen', 'M. Rodriguez', 'K. Sharma'],
          year: 2024,
          venue: 'IEEE Trans. Softw. Eng. (TSE)',
          doiUrl: 'https://doi.org/10.1109/TSE.2024.3398102',
          similarity: 18,
          keyTakeaway: 'Establishes static priority queue scheduling for academic workloads. Does not evaluate dynamic localized distraction heuristics.',
          category: 'BASELINE',
          bibtex: `@article{chen2024,\n  author={Chen, A. and Rodriguez, M. and Sharma, K.},\n  title={Automated Task Scheduling with Dependency Graph Heuristics in Distributed Systems},\n  journal={IEEE Transactions on Software Engineering},\n  year={2024},\n  doi={10.1109/TSE.2024.3398102}\n}`
        },
        {
          id: 'lit-2',
          title: 'Real-Time Deadline Warning and Context-Aware Workload Balancing',
          authors: ['J. Smith', 'L. Zhang'],
          year: 2025,
          venue: 'ACM CHI Conference Proceedings',
          doiUrl: 'https://doi.org/10.1145/3613904.3642010',
          similarity: 12,
          keyTakeaway: 'Focuses on contextual notification triggers for mobile applications. Does not integrate in-browser paper drafting or auto-sync.',
          category: 'COMPETITOR',
          bibtex: `@inproceedings{smith2025,\n  author={Smith, J. and Zhang, L.},\n  title={Real-Time Deadline Warning and Context-Aware Workload Balancing},\n  booktitle={ACM CHI Conference on Human Factors in Computing Systems},\n  year={2025},\n  doi={10.1145/3613904.3642010}\n}`
        },
        {
          id: 'lit-3',
          title: 'Empirical Evaluation of Student Academic Task Management Platforms',
          authors: ['H. Patel', 'E. Neumann'],
          year: 2023,
          venue: 'Springer Lecture Notes in Computer Science (LNCS)',
          doiUrl: 'https://doi.org/10.1007/978-3-031-35891-3_14',
          similarity: 8,
          keyTakeaway: 'A systematic review highlighting fragmentation across literature discovery, paper drafting, and venue trackers.',
          category: 'REFERENCE',
          bibtex: `@incollection{patel2023,\n  author={Patel, H. and Neumann, E.},\n  title={Empirical Evaluation of Student Academic Task Management Platforms},\n  booktitle={Springer LNCS},\n  year={2023},\n  doi={10.1007/978-3-031-35891-3_14}\n}`
        }
      ];

      setWhitespaceText('Existing student dashboards focus exclusively on static time-blocking. None currently integrate automated prerequisite dependency graph modeling with localized distraction heuristics and real-time paper drafting auto-sync.');
      setLiteratureItems(mockItems);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load literature whitespace board:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitespaceData();
  }, [id]);

  const handleDownloadBibTeX = () => {
    const bibContent = literatureItems.map((item) => item.bibtex).join('\n\n');
    const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `references_${id || 'project'}.bib`;
    link.click();
  };

  const filteredItems = literatureItems.filter(
    (item) => filterCategory === 'ALL' || item.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 3 OF 7</span>
              <span>•</span>
              <span>RESEARCH WHITESPACE & LITERATURE SUMMARY BOARD</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Literature Matrix & Gap Analysis</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadBibTeX}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export BibTeX (.bib)
            </Button>

            <Link to={`/project/${id || 'demo'}/roadmap`}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Stage 4: Implementation Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        )}

        {!loading && (
          <>
            {/* The Research Whitespace Banner */}
            <Card className="bg-navy-800 text-white border-navy-900 p-6 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>The Research Whitespace Banner (Your Core Novelty Contribution)</span>
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                &ldquo;{whitespaceText}&rdquo;
              </p>
            </Card>

            {/* Category Filter Toolbar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 bg-white p-1 border border-slate-200 rounded">
                <button
                  onClick={() => setFilterCategory('ALL')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    filterCategory === 'ALL' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Sources ({literatureItems.length})
                </button>
                <button
                  onClick={() => setFilterCategory('BASELINE')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    filterCategory === 'BASELINE' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🏆 Baselines
                </button>
                <button
                  onClick={() => setFilterCategory('COMPETITOR')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    filterCategory === 'COMPETITOR' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ⚡ Competitors
                </button>
                <button
                  onClick={() => setFilterCategory('REFERENCE')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    filterCategory === 'REFERENCE' ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🔬 Methodological References
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Verified Clickable DOIs Ready for Citation Insertion (`@`)
              </span>
            </div>

            {/* Literature Cards Grid */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:border-slate-300 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {item.category === 'BASELINE' && <Badge variant="info">🏆 Foundational Baseline</Badge>}
                        {item.category === 'COMPETITOR' && <Badge variant="warning">⚡ Direct Competitor</Badge>}
                        {item.category === 'REFERENCE' && <Badge variant="neutral">🔬 Reference</Badge>}
                        <span className="text-xs font-mono text-slate-500">{item.year} • {item.venue}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Authors: {item.authors.join(', ')}
                      </p>
                    </div>

                    <a
                      href={item.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-navy-800 px-2.5 py-1 rounded text-xs font-mono font-medium border border-slate-200 transition-colors"
                    >
                      <span>DOI Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Plain-English Key Takeaway:</span>
                    <p className="text-slate-600 leading-relaxed">{item.keyTakeaway}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
