import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckSquare, Square, Plus, Sparkles, ExternalLink, ArrowRight, 
  Database, Code2, CheckCircle2, Layers, Cpu, Activity
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';

export interface ChecklistItem {
  id: string;
  phase: 'ENVIRONMENT' | 'DEVELOPMENT' | 'EVALUATION' | 'SYNTHESIS';
  task: string;
  isCompleted: boolean;
  userNotes?: string;
}

export function Roadmap() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [readinessPercent, setReadinessPercent] = useState<number>(25);
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 't-1', phase: 'ENVIRONMENT', task: 'Initialize repository, setup environment variables & install dependencies', isCompleted: true },
    { id: 't-2', phase: 'ENVIRONMENT', task: 'Download and preprocess StudentTaskBench dataset (12k traces)', isCompleted: false },
    { id: 't-3', phase: 'DEVELOPMENT', task: 'Implement constraint-aware priority queue scheduling heuristic', isCompleted: false },
    { id: 't-4', phase: 'DEVELOPMENT', task: 'Build real-time React drafting canvas with KaTeX math rendering', isCompleted: false },
    { id: 't-5', phase: 'EVALUATION', task: 'Execute latency & peak memory overhead benchmarks vs static baseline', isCompleted: false },
    { id: 't-6', phase: 'SYNTHESIS', task: 'Synthesize empirical benchmark charts and draft paper evaluation section', isCompleted: false }
  ]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const updated = checklist.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !currentStatus } : t
    );
    setChecklist(updated);
    const completedCount = updated.filter((t) => t.isCompleted).length;
    setReadinessPercent(Math.round((completedCount / updated.length) * 100));

    try {
      await api.patch(`/project/${id || 'demo'}/roadmap/checklist`, {
        taskId,
        isCompleted: !currentStatus
      });
    } catch (err) {
      console.error('Failed to sync checklist toggle:', err);
    }
  };

  const handleAddManualTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: ChecklistItem = {
      id: `t-manual-${Date.now()}`,
      phase: 'DEVELOPMENT',
      task: newTaskText,
      isCompleted: false
    };
    const updated = [...checklist, newTask];
    setChecklist(updated);
    setNewTaskText('');
  };

  const handleGenerateAiTasks = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const response = await api.post(`/project/${id || 'demo'}/roadmap/task`, {
        action: 'GENERATE_AI',
        prompt: aiPrompt
      });
      if (response.data.roadmap?.checklist) {
        setChecklist(response.data.roadmap.checklist);
        setReadinessPercent(response.data.readinessPercent || 40);
      }
      setAiPrompt('');
      setAiLoading(false);
    } catch (err) {
      console.error('AI task generation error:', err);
      // Fallback local task addition
      const aiTask: ChecklistItem = {
        id: `t-ai-${Date.now()}`,
        phase: 'EVALUATION',
        task: `Execute security & input sanitization audit based on: "${aiPrompt}"`,
        isCompleted: false
      };
      setChecklist([...checklist, aiTask]);
      setAiPrompt('');
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Bar */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
              <span>STAGE 4 OF 7</span>
              <span>•</span>
              <span>IMPLEMENTATION ROADMAP, RESOURCE HUB & LOCAL CHECKLIST</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Implementation Roadmap & Progress Meter</h1>
          </div>

          <Link to={`/project/${id || 'demo'}/editor`}>
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Stage 5: Paper Drafting Studio
            </Button>
          </Link>
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
            Complete milestones to reach 100% readiness for final pre-flight paper auditing.
          </p>
        </Card>

        {/* Resource Scout Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<div className="flex items-center space-x-2"><Database className="w-4 h-4 text-navy-800" /><span className="font-bold text-slate-900 text-sm">Recommended Open Datasets</span></div>}>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-900 block">StudentTaskBench (Kaggle)</span>
                  <span className="text-slate-600">12,000 anonymized student scheduling traces</span>
                </div>
                <a href="https://kaggle.com" target="_blank" rel="noreferrer" className="text-navy-800 hover:underline inline-flex items-center font-mono">
                  Access <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-900 block">AcademicWorkload-v2 (HuggingFace)</span>
                  <span className="text-slate-600">Multi-modal workload benchmark dataset</span>
                </div>
                <a href="https://huggingface.co" target="_blank" rel="noreferrer" className="text-navy-800 hover:underline inline-flex items-center font-mono">
                  Access <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </Card>

          <Card header={<div className="flex items-center space-x-2"><Code2 className="w-4 h-4 text-navy-800" /><span className="font-bold text-slate-900 text-sm">Recommended Stack & Open-Source Tools</span></div>}>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-900 block">PyTorch / FastAPI</span>
                  <span className="text-slate-600">High-performance tensor optimization & REST backend</span>
                </div>
                <Badge variant="info">Backend Engine</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-900 block">TipTap / KaTeX</span>
                  <span className="text-slate-600">Rich text editor with LaTeX math rendering</span>
                </div>
                <Badge variant="info">Drafting Canvas</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Interactive 4-Phase Local Milestone Checklist */}
        <Card header={<span className="font-bold text-slate-900 text-base">4-Phase Implementation Milestone Checklist</span>}>
          <div className="space-y-6">
            {/* Add Custom & AI Task Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add custom task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />
                <Button size="sm" onClick={handleAddManualTask} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  placeholder="AI prompt e.g. Add 2 security audit tasks..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAiTasks}
                  isLoading={aiLoading}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                >
                  Generate AI Tasks
                </Button>
              </div>
            </div>

            {/* Checklist Items Grouped by Phase */}
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
                        {item.isCompleted && <Badge variant="pass" size="sm">Completed</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
