import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, FileText, Globe, CheckSquare, Layers, Clock, Cloud, FolderPlus, Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Navbar } from '../components/layout/Navbar';
import { api } from '../services/api';

export interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  currentStage: number;
  gateStatus: 'PASS' | 'SOFT_WARNING' | 'HARD_STOP';
  maxOverlapPercent: number;
  healthScore: number;
  targetVenue: string;
  deadlineCountdown: string;
  driveSynced: boolean;
  updatedAt: string;
}

export function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');
      const apiProjects = response.data.projects || [];

      const formatted: ProjectItem[] = apiProjects.map((p: any) => ({
        id: p._id || p.id,
        title: p.academicTitle || p.title || 'Untitled Research Project',
        domain: p.domain || '💻 Software & Distributed Systems',
        currentStage: p.currentStage || 1,
        gateStatus: p.gateResult?.status || 'PASS',
        maxOverlapPercent: p.gateResult?.maxOverlapPercent || 15,
        healthScore: p.gateResult?.noveltyScore || 90,
        targetVenue: p.targetVenues?.[0]?.acronym || 'IEEE ICSE 2026',
        deadlineCountdown: p.targetVenues?.[0]?.deadlineDate ? `${p.targetVenues[0].deadlineDate}` : '42 Days Left',
        driveSynced: p.googleDrive?.isConnected ?? false,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently'
      }));

      setProjects(formatted);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch projects error:', err);
      // Clean empty projects list on error
      setProjects([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Workspaces</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage active 7-stage research lifecycles, monitor novelty gate verdicts, and track paper studio progress.
            </p>
          </div>

          <Link to="/project/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Start Stage 1 (Idea Lab)
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200 p-2 rounded shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search projects by title, domain, or target venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 focus:outline-none bg-transparent font-sans"
          />
        </div>

        {/* STATE 1: LOADING SKELETON GRID */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        )}

        {/* STATE 2: EMPTY STATE CALLOUT (0 Projects) */}
        {!loading && !error && projects.length === 0 && (
          <Card className="bg-white border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-12 h-12 bg-navy-800/10 text-navy-800 rounded-full flex items-center justify-center mx-auto border border-navy-800/20">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">No Active Research Projects</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                You haven't initialized any research projects yet. Begin by entering your raw idea in Stage 1 (Idea Lab).
              </p>
            </div>
            <div>
              <Link to="/project/new">
                <Button size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Start Stage 1: Idea Lab
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* STATE 3: POPULATED PROJECT GRID */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-white border-slate-200 space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{project.domain}</span>
                    {project.gateStatus === 'PASS' && <Badge variant="pass">🟢 Gate Pass</Badge>}
                    {project.gateStatus === 'SOFT_WARNING' && <Badge variant="warning">🟡 Gate Warning</Badge>}
                    {project.gateStatus === 'HARD_STOP' && <Badge variant="stop">🔴 Gate Stop</Badge>}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Current Stage:</span>
                      <span className="font-bold text-navy-800">Stage {project.currentStage} of 7</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Target Venue:</span>
                      <span className="font-bold text-slate-800">{project.targetVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Updated {project.updatedAt}</span>
                  <Link to={`/project/${project.id}/report`}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Open Project
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
