import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, Activity, Plus, X } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export function IdeaLab() {
  const navigate = useNavigate();
  const [intakeMode, setIntakeMode] = useState<'RAW' | 'DRAFT'>('RAW');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [rawInput, setRawInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Gemini AI Reformulation State
  const [reformulated, setReformulated] = useState<{
    academicTitle: string;
    problemStatement: string;
    methodologyOverview: string;
    targetMetrics: string[];
    healthScore: number;
    clarityNotes: string;
    inferredDomain?: string;
  } | null>(null);

  const [customMetrics, setCustomMetrics] = useState<string[]>([]);
  const [newMetricInput, setNewMetricInput] = useState<string>('');

  const handleReformulate = async () => {
    if (!rawInput.trim()) {
      setError('Please enter your research idea or paste a draft first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/ai/reformulate', {
        rawInput,
        userProfile: { persona: 'Researcher' }
      });
      const data = response.data.reformulation;
      setReformulated(data);
      setCustomMetrics(data.targetMetrics || []);
      if (!projectTitle) {
        setProjectTitle(data.academicTitle || rawInput.slice(0, 50));
      }
    } catch (err: any) {
      console.error('Reformulation error:', err);
      setError('Failed to refine with AI. You can still proceed directly to Stage 2.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (useAiResult: boolean) => {
    if (!rawInput.trim() && !projectTitle.trim()) {
      setError('Please provide a project title or research idea before proceeding.');
      return;
    }
    setLoading(true);
    try {
      const titleToSave = projectTitle.trim() || (reformulated ? reformulated.academicTitle : rawInput.slice(0, 50));
      const response = await api.post('/project/create', {
        title: titleToSave,
        rawInput,
        academicTitle: useAiResult && reformulated ? reformulated.academicTitle : titleToSave,
        problemStatement: useAiResult && reformulated ? reformulated.problemStatement : rawInput,
        methodologyOverview: useAiResult && reformulated ? reformulated.methodologyOverview : rawInput,
        domain: reformulated?.inferredDomain || 'Computer Science & AI'
      });
      const projectId = response.data.project._id;
      navigate(`/project/${projectId}/report`);
    } catch (err: any) {
      console.error('Create project error:', err);
      setError(err.response?.data?.error || 'Failed to initialize project in database.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = () => {
    if (newMetricInput.trim() && !customMetrics.includes(newMetricInput.trim())) {
      setCustomMetrics([...customMetrics, newMetricInput.trim()]);
      setNewMetricInput('');
    }
  };

  const handleRemoveMetric = (metricToRemove: string) => {
    setCustomMetrics(customMetrics.filter((m) => m !== metricToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 mb-1 font-semibold">
            <span>STAGE 1 OF 7</span>
            <span>•</span>
            <span>IDEA LAB & ACADEMIC RE-FORMULATION</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Formulate Your Research Proposal</h1>
          <p className="text-xs text-slate-600 mt-1">
            Enter your raw research idea or paste an existing draft. Refine into a publication-ready academic proposal or proceed directly to literature scanning.
          </p>
        </div>

        {/* Dual Intake Mode Selector */}
        <div className="flex items-center space-x-3 bg-white p-1.5 border border-slate-200 rounded max-w-md">
          <button
            onClick={() => setIntakeMode('RAW')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
              intakeMode === 'RAW'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mode A: Raw Idea (1–3 Sentences)
          </button>
          <button
            onClick={() => setIntakeMode('DRAFT')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
              intakeMode === 'DRAFT'
                ? 'bg-navy-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mode B: Existing Draft / Abstract
          </button>
        </div>

        {/* Intake Form */}
        <Card className="space-y-4">
          <Input
            label="Project Title / Working Identifier"
            placeholder="e.g. Clinical Diabetes Prediction with LightGBM & SMOTE-Tomek"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {intakeMode === 'RAW' ? 'Describe Your Idea' : 'Paste Draft Text or Abstract'}
            </label>
            <textarea
              rows={5}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={
                intakeMode === 'RAW'
                  ? 'e.g. I want to build a machine learning model to predict early diabetes in patients using LightGBM and SMOTE-Tomek to fix class imbalance...'
                  : 'Paste your experimental methodology, abstract, or draft paragraph here...'
              }
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 placeholder-slate-400 font-sans"
            />
          </div>

          {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleCreateProject(false)}
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Stage 2 with My Input
            </Button>

            <Button
              size="md"
              onClick={handleReformulate}
              isLoading={loading}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Refine with AI Academic Formulation
            </Button>
          </div>
        </Card>

        {/* AI REFORMULATION DISPLAY */}
        {reformulated && (
          <Card className="border-navy-800/30 bg-white space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-navy-800" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Academic Proposal Formulation
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {reformulated.inferredDomain && (
                  <Badge variant="info">{reformulated.inferredDomain}</Badge>
                )}
                <div className="flex items-center space-x-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Health Score: {reformulated.healthScore}/100</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Academic Title:
                </span>
                <input
                  type="text"
                  value={reformulated.academicTitle}
                  onChange={(e) => setReformulated({ ...reformulated, academicTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Scientific Problem Statement:
                </span>
                <textarea
                  rows={3}
                  value={reformulated.problemStatement}
                  onChange={(e) => setReformulated({ ...reformulated, problemStatement: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Proposed Methodology Overview:
                </span>
                <textarea
                  rows={3}
                  value={reformulated.methodologyOverview}
                  onChange={(e) => setReformulated({ ...reformulated, methodologyOverview: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              {/* Dynamic Target Evaluation Metrics with Tag Editor */}
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Target Evaluation Metrics:
                </span>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {customMetrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 bg-navy-50 text-navy-900 border border-navy-200 px-2.5 py-1 rounded text-xs font-mono font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-navy-700 shrink-0" />
                      <span>{metric}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(metric)}
                        className="text-navy-400 hover:text-red-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add custom evaluation metric..."
                    value={newMetricInput}
                    onChange={(e) => setNewMetricInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMetric())}
                    className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                  <Button size="sm" variant="secondary" onClick={handleAddMetric} leftIcon={<Plus className="w-3 h-3" />}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button
                size="md"
                onClick={() => handleCreateProject(true)}
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Stage 2: Literature Gate Scan
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
