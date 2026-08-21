import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Plus, User as UserIcon, LogOut, Search, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandPalette } from '../ui/CommandPalette';

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
    subscription: {
      usedThisMonth: number;
      monthlyQuota: number;
    };
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const used = user?.subscription?.usedThisMonth ?? 42;
  const quota = user?.subscription?.monthlyQuota ?? 100;
  const percentage = Math.min(100, Math.round((used / quota) * 100));

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-navy-800 text-white flex items-center justify-center font-bold text-sm rounded">
              RC
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-sm tracking-tight leading-none">Researcher Campus</span>
              <span className="text-[10px] text-slate-500 font-mono leading-tight">Academic OS v1.0</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-300 text-slate-600 px-3 py-1.5 rounded text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search & Commands...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-500">
              Ctrl+K
            </kbd>
          </button>

          {/* Usage Quota Meter */}
          <div className="hidden sm:flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
            <Cpu className="w-4 h-4 text-navy-800 shrink-0" />
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-700 space-x-2">
                <span>Quota:</span>
                <span className="font-semibold">{used} / {quota} reqs</span>
              </div>
              <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-navy-800 h-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <Link to="/project/new">
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Project
            </Button>
          </Link>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <Link to="/profile" title="Account Settings">
                <div className="w-8 h-8 bg-navy-800 text-white rounded flex items-center justify-center font-semibold text-xs border border-navy-900 hover:bg-navy-700 transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-red-700 p-1.5 rounded hover:bg-slate-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="secondary" size="sm" leftIcon={<UserIcon className="w-3.5 h-3.5" />}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};
