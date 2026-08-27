import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await api.put('/user/onboarding', {
        persona: 'RESEARCHER',
        primaryDomain: 'Computer Science & AI',
        targetVenuePreference: 'Peer-Reviewed Conference',
        connectDrive: false
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-16 flex flex-col justify-center space-y-6">
        <Card className="p-8 space-y-6 text-center border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-navy-800 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <Badge variant="info">Welcome to Researcher Campus</Badge>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Your Autonomous Academic Workstation
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              From raw idea formulation to 5-engine literature scanning, implementation roadmaps, and paper drafting with live AI assistance.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-left space-y-2 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full 7-Stage Sequential Lifecycle Access</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dynamic AI Proposal Reformulation & Literature Scanning</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Persistent MongoDB Session Workspaces</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            isLoading={loading}
            onClick={handleStart}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Research Workstation
          </Button>
        </Card>
      </main>
    </div>
  );
}
