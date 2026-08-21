import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, FileText, Globe, CheckSquare, Layers, Clock, Cloud, FolderPlus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Navbar } from '../components/layout/Navbar';

export interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  currentStage: number; // 1 to 7
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
      // Simulated API response delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock production datasets
      const mockProjects: ProjectItem[] = [
        {
          id: 'proj-101',
          title: 'StudentTasker: Intelligent Constraint-Aware Academic Task Scheduling',
          domain: '💻 Software & Distributed Systems',
          currentStage: 5,
          gateStatus: 'PASS',
          maxOverlapPercent: 18,
          healthScore: 94,
          targetVenue: 'IEEE ICSE 2026',
          deadlineCountdown: '42 Days Left (Nov 1, 2026)',
          driveSynced: true,
          updatedAt: '12 mins ago'
        },
        {
          id: 'proj-102',
          title: 'SpotKube: Autonomous Workload Balancing on Cloud Spot Instances',
          domain: '🧠 Artificial Intelligence & ML',
          currentStage: 3,
          gateStatus: 'SOFT_WARNING',
          maxOverlapPercent: 38,
          healthScore: 78,
          targetVenue: 'ACM CHI 2026',
          deadlineCountdown: '68 Days Left (Dec 1, 2026)',
          driveSynced: false,
          updatedAt: '2 hours ago'
        }
      ];

      setProjects(mockProjects);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard projects:', err);
      setError('Unable to connect to Researcher Campus server. Please check your network or server connection.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar user={{ name: 'John Doe', email: 'john@university.edu', subscription: { usedThisMonth: 42, monthlyQuota: 100 } }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Top Header & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Workspace Dashboard</h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage active research lifecycles, monitor literature overlap gate verdicts, and track paper submission roadmaps.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter research projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 w-64"
              />
            </div>
            <Link to="/project/new">
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* STATE 4: ERROR CALLOUT BANNER */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 flex items-center justify-between text-sm text-red-900">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchDashboardData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* STATE 1: LOADING SKELETON GRID */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2].map((idx) => (
              <Card key={idx} className="space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* STATE 2: EMPTY STATE CALLOUT */}
        {!loading && !error && projects.length === 0 && (
          <Card className="py-16 text-center border-dashed">
            <div className="w-14 h-14 bg-slate-100 text-navy-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <FolderPlus className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No Active Research Projects</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
              You haven&apos;t created any research workspaces yet. Start by entering a raw idea or uploading an existing paper draft.
            </p>
            <Link to="/project/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Create Your First Project
              </Button>
            </Link>
          </Card>
        )}

        {/* STATE 3: POPULATED HIGH-DENSITY DATA GRID */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div>
                  {/* Top Badge & Domain Bar */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {project.domain}
                    </span>
                    {project.gateStatus === 'PASS' && (
                      <Badge variant="pass">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                        Gate PASS ({project.maxOverlapPercent}% overlap)
                      </Badge>
                    )}
                    {project.gateStatus === 'SOFT_WARNING' && (
                      <Badge variant="warning">
                        <AlertTriangle className="w-3 h-3 mr-1 inline" />
                        Warning ({project.maxOverlapPercent}% overlap)
                      </Badge>
                    )}
                    {project.gateStatus === 'HARD_STOP' && (
                      <Badge variant="stop">
                        <AlertCircle className="w-3 h-3 mr-1 inline" />
                        Hard Stop ({project.maxOverlapPercent}% overlap)
                      </Badge>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-3 hover:text-navy-800">
                    <Link to={`/project/${project.id}/editor`}>{project.title}</Link>
                  </h3>

                  {/* 7-Stage Pipeline Lifecycle Stepper */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4">
                    <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-600 mb-1.5">
                      <span>Lifecycle Pipeline:</span>
                      <span className="text-navy-800 font-bold">Stage {project.currentStage} of 7</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => (
                        <div
                          key={stageNum}
                          className={`h-2 rounded-xs ${
                            stageNum <= project.currentStage
                              ? 'bg-navy-800'
                              : 'bg-slate-200'
                          }`}
                          title={`Stage ${stageNum}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Formulation Health & Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-white border border-slate-200 rounded p-2.5">
                      <div className="text-slate-500 mb-0.5 flex items-center justify-between">
                        <span>Formulation Health:</span>
                        <span className="font-mono font-bold text-slate-900">{project.healthScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${project.healthScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded p-2.5">
                      <div className="text-slate-500 mb-0.5 flex items-center justify-between">
                        <span>Target Venue:</span>
                        <Clock className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="font-medium text-slate-900 truncate">{project.targetVenue}</div>
                      <div className="text-[10px] text-slate-500">{project.deadlineCountdown}</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer & Action Links */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-500">
                    {project.driveSynced ? (
                      <span className="inline-flex items-center text-emerald-700 font-mono text-[11px]">
                        <Cloud className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Synced to Drive
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Local Autosave</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link to={`/project/${project.id}/report`}>
                      <Button variant="secondary" size="sm">
                        Gate Report
                      </Button>
                    </Link>
                    <Link to={`/project/${project.id}/editor`}>
                      <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Open Studio
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
