import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, UserCheck, BookOpen, Cloud, 
  SkipForward, ShieldCheck, Sparkles, Layers
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [persona, setPersona] = useState<'STUDENT' | 'PHD' | 'PROFESSOR' | 'INDUSTRY' | 'INDEPENDENT'>('PHD');
  const [primaryDomain, setPrimaryDomain] = useState<string>('💻 Software & Distributed Systems');
  const [venuePreference, setVenuePreference] = useState<string>('IEEE Conference');
  const [connectDrive, setConnectDrive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCompleteOnboarding = async (shouldConnectDrive: boolean) => {
    setLoading(true);
    setConnectDrive(shouldConnectDrive);
    try {
      const response = await api.put('/user/onboarding', {
        persona,
        primaryDomain,
        targetVenuePreference: venuePreference,
        connectDrive: shouldConnectDrive
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding submit error:', err);
      // Fallback navigate to dashboard for demo
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col space-y-6">
        {/* Stepper Header */}
        <div className="text-center space-y-2">
          <Badge variant="info" size="md">RESEARCHER INTAKE WIZARD</Badge>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configure Your Academic Workstation</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Help Researcher Campus tailor AI formulations, literature search parameters, and submission deadlines to your exact domain.
          </p>
        </div>

        {/* 3-Step Stepper Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded p-3">
          <div className={`flex items-center space-x-2 text-xs font-semibold ${step >= 1 ? 'text-navy-800' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 1 ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
              1
            </div>
            <span>Academic Identity</span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center space-x-2 text-xs font-semibold ${step >= 2 ? 'text-navy-800' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 2 ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
              2
            </div>
            <span>Domain & Venues</span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center space-x-2 text-xs font-semibold ${step >= 3 ? 'text-navy-800' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 3 ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
              3
            </div>
            <span>Cloud Drive Sync</span>
          </div>
        </div>

        {/* STEP 1: PERSONA SELECTION */}
        {step === 1 && (
          <Card className="space-y-5">
            <h2 className="font-bold text-slate-900 text-base">Select Your Researcher Persona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'STUDENT', label: 'Undergraduate Student', desc: 'Working on capstone projects or early papers.' },
                { key: 'PHD', label: 'PhD Candidate / Master Researcher', desc: 'Focusing on thesis papers and top-tier venue submissions.' },
                { key: 'PROFESSOR', label: 'Professor / Lab Director', desc: 'Managing student teams, grant proposals, and review cycles.' },
                { key: 'INDUSTRY', label: 'Industry R&D Scientist', desc: 'Building practical benchmarks and technical whitepapers.' },
                { key: 'INDEPENDENT', label: 'Independent Researcher', desc: 'Publishing self-directed open research.' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setPersona(item.key as any)}
                  className={`p-3.5 rounded border cursor-pointer transition-colors ${
                    persona === item.key
                      ? 'bg-navy-800/5 border-navy-800 text-navy-900 ring-1 ring-navy-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{item.label}</span>
                    {persona === item.key && <CheckCircle2 className="w-4 h-4 text-navy-800 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Domain & Venues
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: DOMAIN & VENUE SELECTION */}
        {step === 2 && (
          <Card className="space-y-5">
            <h2 className="font-bold text-slate-900 text-base">Primary Domain & Venue Preferences</h2>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-slate-700 uppercase tracking-wider">
                  Primary Research Domain
                </label>
                <select
                  value={primaryDomain}
                  onChange={(e) => setPrimaryDomain(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
                >
                  <option>💻 Software & Distributed Systems</option>
                  <option>🧠 Artificial Intelligence & Machine Learning</option>
                  <option>🛡️ Cybersecurity & Privacy</option>
                  <option>🧬 Biomedical & Healthcare Informatics</option>
                  <option>📚 Education & Social Computing</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-slate-700 uppercase tracking-wider">
                  Target Publication Venue Format
                </label>
                <select
                  value={venuePreference}
                  onChange={(e) => setVenuePreference(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
                >
                  <option>IEEE Conference (2-Column Format)</option>
                  <option>ACM SIGPLAN / CHI Format</option>
                  <option>Nature / Science Journal Layout</option>
                  <option>Generic Computer Science Manuscript</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Cloud Drive Setup
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: GOOGLE DRIVE CLOUD SYNC SETUP WITH SKIP OPTION */}
        {step === 3 && (
          <Card className="space-y-5 text-center py-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
              <Cloud className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg">Connect Google Drive Auto-Sync</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Automatically sync paper drafts, KaTeX mathematical figures, and LaTeX `.tex` archives directly to your personal Google Drive storage.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Data Loss Auto-Save Every 30 Seconds</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted using AES-256-GCM authenticated storage</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-3">
              <Button
                variant="secondary"
                onClick={() => handleCompleteOnboarding(false)}
                isLoading={loading}
                leftIcon={<SkipForward className="w-4 h-4 text-slate-400" />}
              >
                Skip for Now
              </Button>

              <Button
                onClick={() => handleCompleteOnboarding(true)}
                isLoading={loading}
                leftIcon={<Cloud className="w-4 h-4" />}
              >
                Connect Drive & Finish Intake
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
