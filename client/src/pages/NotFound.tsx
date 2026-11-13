import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Sparkles, FolderX, ExternalLink } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <Card className="w-full bg-white border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
          {/* Visual Icon Badge */}
          <div className="w-16 h-16 bg-navy-50 border border-navy-200 rounded-2xl flex items-center justify-center mx-auto text-navy-800 shadow-xs">
            <Compass className="w-8 h-8 text-navy-800 animate-pulse" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <FolderX className="w-3.5 h-3.5" />
              <span>404 • UNRECOGNIZED ROUTE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic Resource Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              The workstation lifecycle stage, paper draft, or endpoint you are attempting to reach does not exist or has been relocated.
            </p>
          </div>

          {/* Path diagnostic badge */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 max-w-md mx-auto text-xs font-mono text-slate-700 break-all">
            <span className="text-slate-400 mr-2">Route:</span>
            <span className="text-navy-900 font-semibold">{location.pathname}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>

            <Link to="/dashboard">
              <Button size="md" leftIcon={<Home className="w-4 h-4" />}>
                Workstation Dashboard
              </Button>
            </Link>

            <Link to="/project/new">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Launch Stage 1: Idea Lab
              </Button>
            </Link>
          </div>

          {/* Quick Sitemap Links */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3">
              Standard Research Lifecycles
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link to="/project/new" className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-navy-800 text-slate-700 hover:text-navy-900 transition-colors">
                Stage 1: Idea Lab
              </Link>
              <Link to="/dashboard" className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-navy-800 text-slate-700 hover:text-navy-900 transition-colors">
                All Projects
              </Link>
              <Link to="/profile" className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-navy-800 text-slate-700 hover:text-navy-900 transition-colors">
                Profile Settings
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

