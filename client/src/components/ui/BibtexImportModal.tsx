import React, { useState } from 'react';
import { Download, FileText, X } from 'lucide-react';
import { Button } from './Button';

export interface BibtexImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (bibtexText: string) => void;
  isLoading?: boolean;
}

export const BibtexImportModal: React.FC<BibtexImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  isLoading = false
}) => {
  const [bibtexText, setBibtexText] = useState<string>(`@article{smith2026,
  author = {Smith, John and Zhang, Li},
  title = {Autonomous Workload Balancing on Cloud Spot Instances},
  journal = {IEEE Transactions on Cloud Computing},
  year = {2026},
  doi = {10.1109/TCC.2026.3400123}
}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bibtexText.trim()) {
      onImport(bibtexText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-navy-800" />
            <h3 className="font-bold text-slate-900 text-base">Import BibTeX Reference (.bib)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Paste BibTeX Entry or Citation Text
            </label>
            <textarea
              rows={8}
              value={bibtexText}
              onChange={(e) => setBibtexText(e.target.value)}
              placeholder="Paste @article{...} or @inproceedings{...} content here..."
              className="w-full bg-white border border-slate-300 rounded p-3 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={isLoading} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Import Literature Citation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
