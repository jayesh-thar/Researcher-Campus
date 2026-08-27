import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckSquare, Square, Plus, Sparkles, ExternalLink, ArrowRight, 
  Database, Code2, Trash2, Send, Bot, User, Activity, Undo2, ChevronLeft
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SidePaperDrawer } from '../components/layout/SidePaperDrawer';
import { api } from '../services/api';

export interface ChecklistItem {
  id: string;
  phase: 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS';
  task: string;
  isCompleted: boolean;
  userNotes?: string;
}

export interface RoadmapResource {
  name: string;
  source?: string;
  category?: string;
  description: string;
  url?: string;
}

export function Roadmap() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [readinessPercent, setReadinessPercent] = useState<number>(0);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = useState<'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS'>('DEVELOPMENT');

  const [datasets, setDatasets] = useState<RoadmapResource[]>([]);
  const [tools, setTools] = useState<RoadmapResource[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Research Co-Pilot. Ask me for specialized implementation milestones, ablation experiments, or clarification on your baseline evaluation setup.'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/project/${id || 'demo'}/roadmap`);
      const r = response.data.roadmap;
      if (r) {
        setDatasets(r.datasets || []);
        setTools(r.tools || []);
        setChecklist(r.checklist || []);
      }
      setReadinessPercent(response.data.readinessPercent || 0);
    } catch (err) {
      console.error('Fetch roadmap error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const updated = checklist.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !currentStatus } : t
    );
    setChecklist(updated);
    const completedCount = updated.filter((t) => t.isCompleted).length;
    setReadinessPercent(Math.round((completedCount / (updated.length || 1)) * 100));

    try {
      await api.patch(`/project/${id || 'demo'}/roadmap/checklist`, {
        taskId,
        isCompleted: !currentStatus
      });
    } catch (err) {
      console.error('Toggle task error:', err);
    }
  };

  const handleAddManualTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      const response = await api.post(`/project/${id || 'demo'}/roadmap/task`, {
        action: 'ADD_MANUAL',
        taskText: newTaskText.trim(),
        phase: selectedPhase
      });
      if (response.data.roadmap) {
        setChecklist(response.data.roadmap.checklist);
        setReadinessPercent(response.data.readinessPercent);
      }
      setNewTaskText('');
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await api.delete(`/project/${id || 'demo'}/roadmap/task/${taskId}`);
      if (response.data.roadmap) {
        setChecklist(response.data.roadmap.checklist);
        setReadinessPercent(response.data.readinessPercent);
      }
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await api.post(`/project/${id || 'demo'}/roadmap/task`, {
        action: 'GENERATE_AI',
        prompt: userMsg,
        phase: selectedPhase
      });

      if (response.data.roadmap) {
        setChecklist(response.data.roadmap.checklist);
        setReadinessPercent(response.data.readinessPercent);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.data.aiReply || 'I have analyzed your request and provided guidance for your research workflow.'
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'I encountered an issue connecting to the AI co-pilot.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 4 OF 7</span>
              <span>•</span>
              <span>ACTIONABLE IMPLEMENTATION ROADMAP</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Execution & Milestones</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link to={`/project/${id || 'demo'}/whitespace`}>
              <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
                Back to Stage 3
              </Button>
            </Link>

            <Link to={`/project/${id || 'demo'}/audit`}>
              <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Stage 6: Pre-Flight Audit
              </Button>
            </Link>
          </div>
        </div>

        {/* Readiness Meter Card */}
        <Card className="bg-white border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-navy-800" />
              <h2 className="font-bold text-slate-900 text-base">Implementation Readiness Meter</h2>
            </div>
            <span className="font-mono font-bold text-slate-900 text-lg">{readinessPercent}% Complete</span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-navy-800 h-full transition-all duration-500"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Check off completed milestones as your implementation progresses. All updates persist in your MongoDB session.
          </p>
        </Card>

        {/* Dynamic Resource Scout Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<div className="flex items-center space-x-2"><Database className="w-4 h-4 text-navy-800" /><span className="font-bold text-slate-900 text-sm">Recommended Open Datasets</span></div>}>
            <div className="space-y-3 text-xs">
              {datasets.length === 0 ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-12 bg-slate-100 rounded" />
                  <div className="h-12 bg-slate-100 rounded" />
                </div>
              ) : (
                datasets.map((d, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-slate-900 block">{d.name}</span>
                      <span className="text-slate-600">{d.description}</span>
                    </div>
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-navy-800 hover:underline inline-flex items-center font-mono shrink-0 ml-2">
                        Access <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card header={<div className="flex items-center space-x-2"><Code2 className="w-4 h-4 text-navy-800" /><span className="font-bold text-slate-900 text-sm">Recommended Stack & Specialized Libraries</span></div>}>
            <div className="space-y-3 text-xs">
              {tools.length === 0 ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-12 bg-slate-100 rounded" />
                  <div className="h-12 bg-slate-100 rounded" />
                </div>
              ) : (
                tools.map((t, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-slate-900 block">{t.name}</span>
                      <span className="text-slate-600">{t.description}</span>
                    </div>
                    {t.category && <Badge variant="info">{t.category}</Badge>}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* 2-Column: 4-Phase Checklist on Left, Live AI Assistant Chat on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 4-Phase Checklist (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card header={<span className="font-bold text-slate-900 text-base">4-Phase Implementation Milestone Checklist</span>}>
              <div className="space-y-6">
                {/* Manual Add Task Bar */}
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
                  <select
                    value={selectedPhase}
                    onChange={(e: any) => setSelectedPhase(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-mono"
                  >
                    <option value="ENVIRONMENT">Phase: ENVIRONMENT</option>
                    <option value="DEVELOPMENT">Phase: DEVELOPMENT</option>
                    <option value="EVALUATION">Phase: EVALUATION</option>
                    <option value="SYNTHESIS">Phase: SYNTHESIS</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Add custom task..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddManualTask()}
                    className="flex-1 min-w-[200px] bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />

                  <Button size="sm" onClick={handleAddManualTask} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add Task
                  </Button>
                </div>

                {/* Grouped Checklist */}
                {['ENVIRONMENT', 'DEVELOPMENT', 'EVALUATION', 'SYNTHESIS'].map((phaseKey) => {
                  const phaseTasks = checklist.filter((t) => t.phase === phaseKey);
                  if (phaseTasks.length === 0) return null;

                  return (
                    <div key={phaseKey} className="space-y-2">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block font-mono">
                        Phase: {phaseKey}
                      </span>
                      <div className="space-y-2">
                        {phaseTasks.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleTask(item.id, item.isCompleted)}
                            className={`p-3 rounded border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                              item.isCompleted
                                ? 'bg-slate-50 border-slate-200 text-slate-500 line-through'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-navy-800'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {item.isCompleted ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span className="font-medium">{item.task}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              {item.isCompleted && <Badge variant="pass" size="sm">Done</Badge>}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteTask(item.id, e)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* AI Research Assistant Co-Pilot (1 col) */}
          <div className="lg:col-span-1">
            <Card header={<div className="flex items-center space-x-2"><Sparkles className="w-4 h-4 text-amber-500" /><span className="font-bold text-slate-900 text-sm">AI Research Co-Pilot</span></div>}>
              <div className="flex flex-col h-[480px]">
                {/* Chat Message Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-navy-800 text-white ml-6 rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 mr-6 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1 opacity-75 font-mono text-[10px]">
                        {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-amber-600" />}
                        <span>{msg.sender === 'user' ? 'You' : 'AI Co-Pilot'}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg mr-6 text-xs font-mono animate-pulse">
                      Analyzing proposal & synthesizing advice...
                    </div>
                  )}
                </div>

                {/* Chat Input Box */}
                <div className="pt-3 border-t border-slate-200 mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Ask AI e.g. What ablation should I run?..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                  <Button size="sm" onClick={handleSendChat} isLoading={chatLoading}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Persistent Side-by-Side Paper Drafting Studio Drawer */}
        <SidePaperDrawer projectId={id || 'demo'} />
      </main>
    </div>
  );
}
