import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, User as UserIcon, LogOut, Search, Github, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandPalette } from '../ui/CommandPalette';

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number | null>(128);

  useEffect(() => {
    fetch('https://api.github.com/repos/jayesh-thar/Researcher-Campus')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-navy-800 text-white flex items-center justify-center font-bold text-sm rounded">
              RC
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">Researcher Campus</span>
              <span className="text-[10px] font-mono bg-navy-800/10 text-navy-800 px-1.5 py-0.5 rounded border border-navy-800/20 font-semibold">
                v1.0.0-beta
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* GitHub Repo & Star Counter */}
          <a
            href="https://github.com/jayesh-thar/Researcher-Campus"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-700 px-2.5 py-1.5 rounded text-xs transition-colors font-medium"
            title="View Source on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="font-semibold">GitHub</span>
            <div className="h-3 w-px bg-slate-300 mx-0.5" />
            <div className="flex items-center space-x-1 font-mono text-[11px] text-amber-700 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{starCount !== null ? starCount : 128}</span>
            </div>
          </a>

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
                  {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
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
