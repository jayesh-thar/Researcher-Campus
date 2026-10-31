import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User as UserIcon, LogOut, Search, Github, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandPalette } from '../ui/CommandPalette';
import { ServerStatusGuard } from './ServerStatusGuard';
import { useAuth } from '../../context/AuthContext';

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user: propUser, onLogout: propOnLogout }) => {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number | null>(2);

  const currentUser = propUser || (authUser ? { name: authUser.name, email: authUser.email } : null);

  useEffect(() => {
    // Fetch live GitHub stars count gracefully
    fetch('https://api.github.com/repos/jayesh-thar/Researcher-Campus')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    if (propOnLogout) {
      propOnLogout();
      return;
    }
    await authLogout();
    navigate('/login');
  };

  return (
    <>
      <ServerStatusGuard />
      <header className="w-full bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
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
            <Github className="w-3.5 h-3.5 text-slate-800" />
            <span>GitHub</span>
            {starCount !== null && (
              <span className="flex items-center space-x-0.5 bg-white border border-slate-200 px-1.5 py-0.2 rounded font-mono text-[10px] text-slate-600 font-semibold">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span>{starCount}</span>
              </span>
            )}
          </a>

          {/* Quick Command Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 px-3 py-1.5 rounded text-xs transition-colors font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Jump (Stages 1–7)...</span>
            <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">
              Ctrl+K
            </kbd>
          </button>

          {/* Stage 1 Init CTA */}
          <Link to="/project/new">
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              <span className="hidden sm:inline">New Research Workstation</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>

          {/* User Profile / Login State */}
          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-100 text-slate-700 text-xs transition-colors"
                title="Profile & Settings"
              >
                <div className="w-7 h-7 bg-navy-800/10 text-navy-800 font-bold flex items-center justify-center rounded border border-navy-800/20 text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-semibold text-slate-800 text-xs truncate max-w-[120px]">
                    {currentUser.name || 'Researcher'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" leftIcon={<UserIcon className="w-3.5 h-3.5" />}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Global Stage Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};
