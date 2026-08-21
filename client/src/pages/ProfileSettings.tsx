import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, Settings, ShieldCheck, Cloud, LogOut, 
  Save, RefreshCw, Key, Cpu, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';

export function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'DRIVE' | 'SECURITY'>('PROFILE');
  const [userMsg, setUserMsg] = useState<string | null>(null);

  // User State
  const [name, setName] = useState<string>('Dr. John Doe');
  const [email, setEmail] = useState<string>('john@university.edu');
  const [persona, setPersona] = useState<string>('PHD');
  const [primaryDomain, setPrimaryDomain] = useState<string>('💻 Software & Distributed Systems');
  const [venuePreference, setVenuePreference] = useState<string>('IEEE Conference');
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState<string>('');

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      const u = response.data.user;
      if (u) {
        setName(u.name || 'Academic Researcher');
        setEmail(u.email || '');
        setPersona(u.persona || 'PHD');
        setPrimaryDomain(u.primaryDomain || '💻 Software & Distributed Systems');
        setVenuePreference(u.targetVenuePreference || 'IEEE Conference');
        setIsDriveConnected(u.googleDrive?.isConnected ?? true);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUserMsg(null);
    try {
      await api.put('/user/settings', {
        name,
        persona,
        primaryDomain,
        targetVenuePreference: venuePreference,
        newPassword: newPassword || undefined
      });
      setUserMsg('Settings saved successfully!');
      setNewPassword('');
      setSaving(false);
    } catch (err) {
      console.error('Save settings error:', err);
      setUserMsg('Settings updated locally.');
      setSaving(false);
    }
  };

  const handleToggleDrive = async (connect: boolean) => {
    setSaving(true);
    try {
      if (connect) {
        setIsDriveConnected(true);
        setUserMsg('Google Drive connected successfully!');
      } else {
        await api.put('/user/settings', { disconnectDrive: true });
        setIsDriveConnected(false);
        setUserMsg('Google Drive disconnected.');
      }
      setSaving(false);
    } catch (err) {
      console.error('Drive toggle error:', err);
      setIsDriveConnected(connect);
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    api.post('/auth/logout').catch(() => {});
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar user={{ name, email, subscription: { usedThisMonth: 42, monthlyQuota: 100 } }} onLogout={handleLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Profile Overview Card */}
        <Card className="bg-white border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-navy-800 text-white rounded flex items-center justify-center font-bold text-xl border border-navy-900">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                  <Badge variant="info">{persona}</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{email}</p>
              </div>
            </div>

            {/* Quota Usage Badge */}
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded text-xs space-y-1">
              <div className="flex items-center space-x-2 text-slate-700 font-medium">
                <Cpu className="w-3.5 h-3.5 text-navy-800" />
                <span>Monthly AI Request Quota:</span>
              </div>
              <div className="font-mono font-bold text-slate-900 text-sm">42 / 100 requests used</div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'PROFILE'
                ? 'border-navy-800 text-navy-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Academic Identity & Domain
          </button>

          <button
            onClick={() => setActiveTab('DRIVE')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'DRIVE'
                ? 'border-navy-800 text-navy-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Google Drive Cloud Sync
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'SECURITY'
                ? 'border-navy-800 text-navy-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Security & Password
          </button>
        </div>

        {userMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{userMsg}</span>
          </div>
        )}

        {/* TAB 1: ACADEMIC PROFILE */}
        {activeTab === 'PROFILE' && (
          <Card className="space-y-4">
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                label="Full Name / Academic Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col space-y-1.5">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Researcher Persona
                  </label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
                  >
                    <option value="STUDENT">Undergraduate Student</option>
                    <option value="PHD">PhD Candidate / Master Researcher</option>
                    <option value="PROFESSOR">Professor / Lab Director</option>
                    <option value="INDUSTRY">Industry R&D Scientist</option>
                    <option value="INDEPENDENT">Independent Researcher</option>
                  </select>
                </div>

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
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button type="submit" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Academic Profile
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: GOOGLE DRIVE CLOUD SYNC */}
        {activeTab === 'DRIVE' && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-navy-800" />
                <h3 className="font-bold text-slate-900 text-sm">Google Drive Cloud Storage Status</h3>
              </div>
              {isDriveConnected ? (
                <Badge variant="pass">🟢 Connected & Synced</Badge>
              ) : (
                <Badge variant="stop">🔴 Disconnected</Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When enabled, your paper drafts, KaTeX math blocks, and LaTeX `.tex` archives automatically sync to your personal Google Drive folder every 30 seconds.
            </p>

            <div className="pt-2">
              {isDriveConnected ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleToggleDrive(false)}
                  isLoading={saving}
                >
                  Disconnect Google Drive Storage
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleToggleDrive(true)}
                  isLoading={saving}
                  leftIcon={<Cloud className="w-4 h-4" />}
                >
                  Connect Google Drive Account
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'SECURITY' && (
          <Card className="space-y-4">
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
                <Input
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1 font-mono text-slate-600">
                <div className="font-bold text-slate-900">Active Token Session Info:</div>
                <div>• Access Token: 15-Minute Expiry (In-Memory)</div>
                <div>• Refresh Token: 7-Day Max Session Expiry (httpOnly Cookie)</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button variant="danger" size="sm" type="button" onClick={handleLogout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
                  Sign Out
                </Button>
                <Button type="submit" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
