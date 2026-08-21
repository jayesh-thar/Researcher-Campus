import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, Download, Save, Cloud, Sparkles, ArrowRight, 
  Columns2, Eye, Code, AtSign, Calculator, Layers, FileCode, Printer, X
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export function PaperStudio() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<'IEEE' | 'ACM' | 'NATURE' | 'MANUSCRIPT'>('IEEE');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>(`# StudentTasker: Intelligent Constraint-Aware Academic Task Scheduling

## Abstract
Contemporary implementations in Software & Distributed Systems exhibit latency bottlenecks under dynamic student workloads. Existing tools lack deterministic bounds during peak concurrent usage. We propose an autonomous, event-driven algorithm that dynamically evaluates prerequisite dependency graph heuristics and applies localized workload balancing.

## 1. Introduction
Academic workload fragmentation remains a critical challenge for university researchers and students. As demonstrated by @chen2024, static priority queues fail to adapt under localized distraction conditions.

## 2. System Methodology
Our approach formulates student scheduling as a constrained optimization problem. Let $\\mathcal{T} = \\{t_1, t_2, \\dots, t_n\\}$ denote the set of active academic tasks.

$$\\min_{\\theta} \\sum_{i=1}^n w_i \\cdot L(t_i, \\theta) + \\lambda \\cdot D(t_i)$$

Where $L(t_i, \\theta)$ represents execution latency and $D(t_i)$ represents the distraction coefficient.

## 3. Empirical Evaluation
We benchmarked StudentTasker against static baselines across 12,000 anonymized student execution traces.

| Metric | Static Priority Baseline | StudentTasker (Ours) | Improvement |
| :--- | :--- | :--- | :--- |
| **Mean Latency (ms)** | 142 ms | **38 ms** | **73.2% 🚀** |
| **Peak Memory (MB)** | 256 MB | **94 MB** | **63.2%** |

## 4. Conclusion
StudentTasker successfully bridges the gap between academic task planning and empirical distraction modeling.`);

  const [showCitationDropdown, setShowCitationDropdown] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Synced to Drive');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveDocument = async () => {
    setIsSaving(true);
    setSyncStatus('Saving to MongoDB & Drive...');
    try {
      await api.put(`/project/${id || 'demo'}/document`, {
        template,
        contentMarkdown: markdown
      });
      setIsSaving(false);
      setSyncStatus('Synced to Drive (Just now)');
    } catch (err) {
      console.error('Save error:', err);
      setIsSaving(false);
      setSyncStatus('Autosaved Locally');
    }
  };

  const handleInsertSection = (sectionType: string) => {
    if (sectionType === 'MATH') {
      setMarkdown((prev) => prev + '\n\n$$\\theta = \\arg\\min_{\\theta} \\mathcal{L}(\\theta)$$\n');
    } else if (sectionType === 'CITATION') {
      setMarkdown((prev) => prev + ' @chen2024 ');
    } else if (sectionType === 'ABSTRACT') {
      setMarkdown((prev) => prev + '\n\n## Abstract\nInsert refined research summary here...\n');
    } else if (sectionType === 'TABLE') {
      setMarkdown((prev) => prev + '\n\n| Metric | Baseline | Ours |\n| :--- | :--- | :--- |\n| Latency | 100ms | 25ms |\n');
    }
  };

  const handleExportLatex = () => {
    const latexContent = `\\documentclass[conference]{IEEEtran}
\\title{StudentTasker: Intelligent Constraint-Aware Academic Task Scheduling}
\\author{\\IEEEauthorblockN{John Doe}\n\\IEEEauthorblockA{University Campus}}
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
    link.download = `manuscript_${id || 'paper'}.tex`;
    link.click();
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manuscript_${id || 'paper'}.md`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Studio Header Toolbar */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-[57px] z-20 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-navy-800 font-semibold">
            <span>STAGE 5 OF 7</span>
            <span>•</span>
            <span>PAPER DRAFTING STUDIO</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Template Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Template:</span>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-600"
            >
              <option value="IEEE">IEEE Conference (2-Column)</option>
              <option value="ACM">ACM SIGPLAN / CHI Format</option>
              <option value="NATURE">Nature / Science Journal</option>
              <option value="MANUSCRIPT">Custom CS Manuscript</option>
            </select>
          </div>
        </div>

        {/* Sync Status & Action Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
            <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{syncStatus}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPrintModal(true)}
            leftIcon={<Printer className="w-3.5 h-3.5 text-navy-800" />}
          >
            PDF / Print View
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportLatex}
            leftIcon={<FileCode className="w-3.5 h-3.5" />}
          >
            Export LaTeX (.tex)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportMarkdown}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Markdown
          </Button>

          <Button
            size="sm"
            onClick={handleSaveDocument}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>

          <Link to={`/project/${id || 'demo'}/audit`}>
            <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Proceed to Stage 6: Pre-Flight Audit
            </Button>
          </Link>
        </div>
      </header>

      {/* Editor Main Content: Live Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Markdown / Text Canvas */}
        <Card noPadding className="flex flex-col h-[calc(100vh-180px)] border-slate-300">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Code className="w-4 h-4 text-navy-800" />
              <span>Drafting Canvas (Markdown + LaTeX Math)</span>
            </div>

            {/* Quick Insertion Tools */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleInsertSection('CITATION')}
                className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-mono font-medium text-slate-700 flex items-center space-x-1"
                title="Insert Literature Citation (@)"
              >
                <AtSign className="w-3 h-3 text-navy-800" />
                <span>@Citation</span>
              </button>

              <button
                onClick={() => handleInsertSection('MATH')}
                className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-mono font-medium text-slate-700 flex items-center space-x-1"
                title="Insert LaTeX Math Block"
              >
                <Calculator className="w-3 h-3 text-navy-800" />
                <span>$Math</span>
              </button>

              <button
                onClick={() => handleInsertSection('TABLE')}
                className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-mono font-medium text-slate-700 flex items-center space-x-1"
                title="Insert Benchmark Table"
              >
                <Columns2 className="w-3 h-3 text-navy-800" />
                <span>+Table</span>
              </button>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs text-slate-800 bg-white focus:outline-none resize-none leading-relaxed"
            placeholder="Type your academic paper manuscript here..."
          />
        </Card>

        {/* Right Pane: Live Academic Formatted Render Preview */}
        <Card noPadding className="flex flex-col h-[calc(100vh-180px)] border-slate-300 bg-white overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Eye className="w-4 h-4 text-navy-800" />
              <span>Live Academic Manuscript Preview ({template} Template)</span>
            </div>
            <Badge variant="neutral" size="sm">{template} Layout Mode</Badge>
          </div>

          <div className="flex-1 p-8 overflow-y-auto font-serif text-slate-900 leading-relaxed text-sm bg-white space-y-4">
            {/* Formatted Article Output */}
            <div className={`space-y-4 ${template === 'IEEE' ? 'columns-1 md:columns-2 gap-6' : ''}`}>
              <div className="break-inside-avoid">
                <h1 className="font-sans font-bold text-xl text-slate-900 tracking-tight leading-tight mb-2">
                  StudentTasker: Intelligent Constraint-Aware Academic Task Scheduling
                </h1>
                <div className="text-xs font-sans text-slate-500 font-medium mb-4 pb-2 border-b border-slate-200">
                  John Doe • Department of Computer Science • University Campus
                </div>
              </div>

              <div className="break-inside-avoid bg-slate-50 p-3.5 border border-slate-200 rounded font-sans text-xs">
                <span className="font-bold text-navy-800 block mb-1 uppercase tracking-wider">Abstract</span>
                <p className="text-slate-700 leading-normal">
                  Contemporary implementations in Software & Distributed Systems exhibit latency bottlenecks under dynamic student workloads. Existing tools lack deterministic bounds during peak concurrent usage. We propose an autonomous, event-driven algorithm that dynamically evaluates prerequisite dependency graph heuristics.
                </p>
              </div>

              <div className="break-inside-avoid font-sans">
                <h2 className="font-bold text-slate-900 text-sm mb-1 pb-1 border-b border-slate-200">1. Introduction</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Academic workload fragmentation remains a critical challenge for university researchers and students. As demonstrated by <span className="text-navy-800 font-semibold font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-200">[Chen et al., 2024]</span>, static priority queues fail to adapt under localized distraction conditions.
                </p>
              </div>

              <div className="break-inside-avoid font-sans">
                <h2 className="font-bold text-slate-900 text-sm mb-1 pb-1 border-b border-slate-200">2. System Methodology</h2>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  Our approach formulates student scheduling as a constrained optimization problem:
                </p>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center font-mono text-xs text-navy-800">
                  {"$$\\min_{\\theta} \\sum_{i=1}^n w_i \\cdot L(t_i, \\theta) + \\lambda \\cdot D(t_i)$$"}
                </div>
              </div>

              <div className="break-inside-avoid font-sans">
                <h2 className="font-bold text-slate-900 text-sm mb-1 pb-1 border-b border-slate-200">3. Empirical Evaluation</h2>
                <div className="border border-slate-200 rounded overflow-hidden mt-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Metric</th>
                        <th className="p-2">Static Baseline</th>
                        <th className="p-2">StudentTasker</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">Mean Latency</td>
                        <td className="p-2">142 ms</td>
                        <td className="p-2 font-bold text-emerald-700">38 ms (73.2% 🚀)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Peak Memory</td>
                        <td className="p-2">256 MB</td>
                        <td className="p-2 font-bold text-emerald-700">94 MB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* PDF Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white border border-slate-300 rounded shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-navy-800" />
                <h3 className="font-bold text-slate-900 text-base">IEEE / ACM PDF Print Preview</h3>
              </div>
              <div className="flex items-center space-x-3">
                <Button size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-3.5 h-3.5" />}>
                  Trigger Print (Save to PDF)
                </Button>
                <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto font-serif text-slate-900 space-y-4 bg-white">
              <div className="columns-2 gap-6 text-xs leading-relaxed">
                <div className="break-inside-avoid">
                  <h1 className="font-sans font-bold text-lg text-slate-900 tracking-tight leading-tight mb-2">
                    StudentTasker: Intelligent Constraint-Aware Academic Task Scheduling
                  </h1>
                  <div className="font-sans text-[11px] text-slate-500 font-medium mb-3 pb-2 border-b border-slate-200">
                    John Doe • Department of Computer Science • University Campus
                  </div>
                </div>

                <div className="break-inside-avoid bg-slate-50 p-3 border border-slate-200 rounded font-sans text-[11px]">
                  <span className="font-bold text-navy-800 block mb-1 uppercase tracking-wider">Abstract</span>
                  Contemporary implementations in Software & Distributed Systems exhibit latency bottlenecks under dynamic student workloads. We propose an event-driven algorithm evaluating prerequisite dependency graph heuristics.
                </div>

                <div className="break-inside-avoid font-sans mt-3">
                  <h2 className="font-bold text-slate-900 text-xs mb-1 border-b border-slate-200">1. Introduction</h2>
                  <p className="text-[11px] text-slate-700">
                    Academic workload fragmentation remains a critical challenge. As demonstrated by [Chen et al., 2024], static priority queues fail to adapt under localized distraction conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
