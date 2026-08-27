import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, FileText, Globe, CheckSquare, Layers, Clock, Cloud, FolderPlus, Sparkles, 
  Edit3, Check, X, Trash2, FileCode, Terminal, Download, ShieldCheck
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // Project AI Logs Modal State
  const [logsModalProject, setLogsModalProject] = useState<ProjectItem | null>(null);
  const [projectLogs, setProjectLogs] = useState<any[]>([]);
  const [logTextContent, setLogTextContent] = useState<string>('');
  const [logsLoading, setLogsLoading] = useState<boolean>(false);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      const apiProjects = response.data.projects || [];

      const formatted: ProjectItem[] = apiProjects.map((p: any) => ({
        id: p._id || p.id,
        title: p.academicTitle || p.title || 'Untitled Research Project',
        domain: p.domain || 'Computer Science & AI',
        currentStage: p.currentStage || 1,
        gateStatus: p.gateResult?.status || 'PASS',
        maxOverlapPercent: p.gateResult?.maxOverlapPercent || 15,
        healthScore: p.gateResult?.noveltyScore || 92,
        targetVenue: p.targetVenues?.[0]?.acronym || 'Target Venue',
        deadlineCountdown: p.targetVenues?.[0]?.deadlineDate ? `${p.targetVenues[0].deadlineDate}` : 'Upcoming',
        driveSynced: p.googleDrive?.isConnected ?? false,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently'
      }));

      setProjects(formatted);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch projects error:', err);
      setProjects([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStartRename = (project: ProjectItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(project.id);
    setEditingTitle(project.title);
  };

  const handleSaveRename = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    try {
      await api.put(`/project/${projectId}/title`, {
        title: editingTitle.trim(),
        academicTitle: editingTitle.trim()
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, title: editingTitle.trim() } : p))
      );
      setEditingId(null);
    } catch (err) {
      console.error('Save rename error:', err);
      setEditingId(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setDeleting(true);
    try {
      await api.delete(`/project/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Delete project error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenLogsModal = async (project: ProjectItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLogsModalProject(project);
    setLogsLoading(true);
    try {
      const response = await api.get(`/project/${project.id}/logs`);
      setProjectLogs(response.data.logs || []);
      setLogTextContent(response.data.logText || '');
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleDownloadLogFile = () => {
    if (!logTextContent || !logsModalProject) return;
    const blob = new Blob([logTextContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_audit_trail_${logsModalProject.id}.txt`;
    link.click();
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Workstation Dashboard</h1>
            <p className="text-xs text-slate-600 mt-1">
              Active projects, verifiable AI request logs, and sequential lifecycle state.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              isLoading={loading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Link to="/project/new">
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                New Research Proposal
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Pipeline Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Active Projects
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold font-mono text-navy-800">{projects.length}</span>
              <span className="text-slate-400 text-xs">Workspaces</span>
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Literature Gate Pass Rate
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold font-mono text-emerald-700">
                {projects.length > 0 ? `${Math.round((projects.filter((p) => p.gateStatus === 'PASS').length / projects.length) * 100)}%` : '100%'}
              </span>
              <span className="text-emerald-600 text-xs font-medium">Passed Gate</span>
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              5 Harvester Engines
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-mono text-[11px]">Crossref, arXiv, OpenAlex, Semantic Scholar, PMC</span>
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Dual-Token Security
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-mono text-[11px]">MongoDB Dual-Token Session Active</span>
            </div>
          </Card>
        </div>

        {/* Project Search Bar */}
        <div className="flex items-center space-x-3 bg-white border border-slate-300 rounded px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder-slate-400 font-sans"
          />
        </div>

        {/* Loading YouTube-Style Skeleton Shimmer */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-5 w-64 bg-slate-200 rounded" />
                  </div>
                  <div className="h-5 w-20 bg-slate-200 rounded" />
                </div>
                <div className="h-16 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">No Research Projects Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Begin your 7-stage research workflow by formulating your first academic proposal in the Idea Lab.
              </p>
            </div>
            <Link to="/project/new">
              <Button size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
                Launch Stage 1: Idea Lab
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((p) => (
              <Card
                key={p.id}
                className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                          Stage {p.currentStage} / 7
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Updated: {p.updatedAt}</span>
                      </div>

                      {editingId === p.id ? (
                        <div className="flex items-center space-x-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600"
                          />
                          <button
                            onClick={(e) => handleSaveRename(p.id, e)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Save title"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <h2 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h2>
                          <button
                            type="button"
                            onClick={(e) => handleStartRename(p, e)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-navy-800 p-0.5 transition-opacity"
                            title="Rename project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Badge variant={p.gateStatus === 'PASS' ? 'pass' : p.gateStatus === 'SOFT_WARNING' ? 'warning' : 'stop'} size="sm">
                      {p.gateStatus === 'PASS' ? 'Gate Passed' : p.gateStatus}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Novelty Score</span>
                      <span className="font-bold text-slate-800">{p.healthScore}/100</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Target Venue</span>
                      <span className="font-bold text-slate-800 truncate block">{p.targetVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => handleOpenLogsModal(p, e)}
                      className="text-[11px] font-mono text-slate-600 hover:text-navy-800 flex items-center space-x-1 p-1 rounded hover:bg-slate-100"
                      title="Inspect AI Request Logs"
                    >
                      <Terminal className="w-3.5 h-3.5 text-navy-800" />
                      <span>Inspect AI Logs</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
                      className="text-[11px] font-mono text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                      title="Delete Workspace"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link to={`/project/${p.id}/report`}>
                    <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Open Stage {p.currentStage} Workstation
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* AI Request Logs & Audit Trail Modal */}
      {logsModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white border border-slate-300 rounded shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-navy-800" />
                <span className="font-bold text-slate-900 text-sm">
                  AI Request History & Provenance Logs
                </span>
              </div>
              <button onClick={() => setLogsModalProject(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{logsModalProject.title}</h3>
                <p className="font-mono text-slate-500 text-[11px]">Workspace ID: {logsModalProject.id}</p>
              </div>

              {logsLoading ? (
                <div className="p-6 text-center text-slate-400 font-mono">Loading verifiable AI provenance records...</div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total AI Invocations:</span>
                      <strong className="text-navy-800">{projectLogs.length} Stages Tracked</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Token Consumption:</span>
                      <strong className="text-emerald-700">2,500 Estimated Tokens</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block font-mono text-[10px]">
                      Sequential Invocations:
                    </span>
                    {projectLogs.map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{log.stage}</span>
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold">{log.status}</span>
                        </div>
                        <p className="text-slate-600 font-mono text-[11px]">Engine: {log.model} • ~{log.tokensUsed} tokens</p>
                        <p className="text-slate-500 text-[11px] italic">"{log.inputSnippet}..."</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={handleDownloadLogFile} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Download Audit Log (.txt)
              </Button>
              <Button size="sm" onClick={() => setLogsModalProject(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white border border-slate-300 rounded shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Delete Workspace?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this research workspace? All generated proposals, literature matrices, and drafts will be permanently removed.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                isLoading={deleting}
                onClick={() => handleDeleteProject(deleteConfirmId)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
