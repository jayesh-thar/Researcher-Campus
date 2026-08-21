import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, BookOpen, Layers, CheckSquare, 
  FileText, ShieldCheck, Award, Settings, User, Command
} from 'lucide-react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { icon: Sparkles, title: 'Stage 1: Idea Lab Reformulator', path: '/project/new' },
    { icon: BookOpen, title: 'Stage 2: Literature Gate Report', path: '/project/demo/report' },
    { icon: Layers, title: 'Stage 3: Research Whitespace Board', path: '/project/demo/literature' },
    { icon: CheckSquare, title: 'Stage 4: Implementation Roadmap', path: '/project/demo/roadmap' },
    { icon: FileText, title: 'Stage 5: Paper Drafting Studio', path: '/project/demo/editor' },
    { icon: ShieldCheck, title: 'Stage 6: AI Pre-Flight Auditor', path: '/project/demo/audit' },
    { icon: Award, title: 'Stage 7: Target Venue Matcher', path: '/project/demo/venues' },
    { icon: Settings, title: 'Account Settings & Profile', path: '/profile' }
  ];

  const filtered = actions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
      <div className="bg-white border border-slate-300 rounded shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-200 flex items-center space-x-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or jump to stage (e.g. Stage 5, Paper Studio)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-800 focus:outline-none placeholder-slate-400 bg-transparent font-sans"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full p-2.5 rounded text-left text-xs flex items-center justify-between hover:bg-slate-100 text-slate-800 font-medium transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-navy-800 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Jump ↵</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
