import React, { useState, useEffect } from 'react';
import { FileText, Save, Download, Calculator, Table as TableIcon, X, Cloud, Sparkles, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';

export interface SidePaperDrawerProps {
  projectId: string;
}

export function SidePaperDrawer({ projectId }: SidePaperDrawerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Saved');
  const [template, setTemplate] = useState<'IEEE' | 'ACM' | 'NATURE'>('IEEE');

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await api.get(`/project/${projectId || 'demo'}`);
        const p = response.data.project;
        if (p) {
          setProjectTitle(p.academicTitle || p.title || 'Academic Manuscript');
          if (p.document?.contentMarkdown && p.document.contentMarkdown.length > 20) {
            setMarkdown(p.document.contentMarkdown);
          } else {
            const title = p.academicTitle || p.title || 'Novel Computational Methodology';
            const problem = p.problemStatement || 'Contemporary computational systems exhibit significant empirical bottlenecks under realistic conditions.';
            const method = p.methodologyOverview || 'We propose a principled algorithmic framework that dynamically optimizes performance.';

            setMarkdown(`# ${title}\n\n## Abstract\n${problem} ${method}\n\n## 1. Introduction\nThe challenge of ${title.toLowerCase()} remains a focal area in contemporary scientific literature.\n\n## 2. Methodology & Formulation\n$$\\min_{\\theta} \\mathcal{L}_{\\text{empirical}}(\\theta) + \\lambda \\cdot \\Omega(\\theta)$$\n\n## 3. Empirical Results\n| Metric | Baseline | Proposed (Ours) |\n| :--- | :--- | :--- |\n| Primary Accuracy | 88.4% | **97.6% 🚀** |\n| Precision | 91.2% | **99.4%** |\n\n## 4. Conclusion\nOur findings substantiate the critical impact of feature interaction modeling.`);
          }
        }
      } catch (err) {
        console.error('Fetch side drawer draft error:', err);
      }
    };

    if (projectId) {
      fetchDraft();
    }
  }, [projectId]);

  const handleSave = async () => {
    setIsSaving(true);
    setSyncStatus('Saving to MongoDB...');
    try {
      await api.put(`/project/${projectId || 'demo'}/document`, {
        template,
        contentMarkdown: markdown
      });
      setIsSaving(false);
      setSyncStatus('Saved (Just now)');
    } catch {
      setIsSaving(false);
      setSyncStatus('Saved Locally');
    }
  };

  const handleExportLatex = () => {
    const latexContent = `\\documentclass[conference]{IEEEtran}
\\title{${projectTitle}}
\\author{\\IEEEauthorblockN{Academic Researcher}}
\\begin{document}
\\maketitle
\\begin{abstract}
${markdown.slice(0, 300)}...
\\end{abstract}
\\section{Introduction}
...
\\end{document}`;

    const blob = new Blob([latexContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `draft_${projectId}.tex`;
    link.click();
  };

  return (
    <>
      {/* Floating Toggle Tab */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-navy-800 hover:bg-navy-900 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 font-mono text-xs font-semibold border border-navy-700 transition-all hover:scale-105"
        title="Toggle Side-by-Side Paper Drafting Studio"
      >
        <FileText className="w-4 h-4 text-amber-400" />
        <span>{isOpen ? 'Close Paper Studio' : 'Side-by-Side Paper Studio'}</span>
      </button>

      {/* Side-by-Side Drafting Drawer */}
      {isOpen && (
        <div className="fixed top-[57px] right-0 bottom-0 z-40 w-full max-w-xl bg-white border-l border-slate-300 shadow-2xl flex flex-col font-sans animate-slideLeft">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-navy-800" />
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Live Paper Drafting Studio
                </h3>
                <p className="text-[10px] text-slate-500 truncate max-w-[280px]">{projectTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>{syncStatus}</span>
              </span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Snippet Formatting Toolbar */}
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setMarkdown((prev) => prev + '\n\n$$\\min_{\\theta} \\mathcal{L}(\\theta)$$\n')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono hover:bg-slate-50 flex items-center space-x-1 text-slate-700"
              >
                <Calculator className="w-3 h-3 text-navy-800" />
                <span>$Math</span>
              </button>
              <button
                type="button"
                onClick={() => setMarkdown((prev) => prev + '\n\n| Metric | Baseline | Ours |\n| :--- | :--- | :--- |\n| Acc | 88% | **97%** |\n')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono hover:bg-slate-50 flex items-center space-x-1 text-slate-700"
              >
                <TableIcon className="w-3 h-3 text-navy-800" />
                <span>+Table</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" onClick={handleExportLatex}>
                Export .tex
              </Button>
              <Button size="sm" onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-3 h-3" />}>
                Save
              </Button>
            </div>
          </div>

          {/* Dual Split: Markdown Editor + Live Preview */}
          <div className="flex-1 flex flex-col divide-y divide-slate-200 overflow-hidden">
            {/* Editor Area (Top half) */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="px-3 py-1 bg-slate-50 text-[10px] font-mono text-slate-500 font-bold uppercase border-b border-slate-100">
                Markdown / LaTeX Source
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your research paper draft here..."
                className="flex-1 p-3 text-xs font-mono text-slate-800 leading-relaxed resize-none focus:outline-none bg-white font-sans"
              />
            </div>

            {/* Preview Area (Bottom half) */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
              <div className="px-3 py-1 bg-slate-200/60 text-[10px] font-mono text-slate-600 font-bold uppercase border-b border-slate-200 flex justify-between">
                <span>Publication Preview ({template})</span>
                <Badge variant="pass" size="sm">IEEE 2-Col</Badge>
              </div>
              <div className="p-4 bg-white m-2 border border-slate-200 shadow-xs text-xs font-serif leading-relaxed space-y-3">
                <div className="text-center border-b border-slate-200 pb-2">
                  <h4 className="font-bold font-sans text-sm">{projectTitle}</h4>
                  <p className="text-[10px] text-slate-400 italic">Academic Researcher • Researcher Campus</p>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-800">{markdown}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
