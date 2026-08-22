import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api, setAccessToken } from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Google OAuth callback token hash in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const googleToken = params.get('access_token');
      if (googleToken) {
        setLoading(true);
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${googleToken}` }
        })
          .then((res) => res.json())
          .then(async (googleUser) => {
            const response = await api.post('/auth/google', {
              googleId: googleUser.sub,
              name: googleUser.name || 'Google Researcher',
              email: googleUser.email,
              avatarUrl: googleUser.picture
            });
            const { accessToken, user } = response.data;
            setAccessToken(accessToken);
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }
            window.history.replaceState(null, '', window.location.pathname);
            if (!user?.isCompletedOnboarding) {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          })
          .catch((err) => {
            console.error('Google Userinfo error:', err);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'LOGIN') {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, user } = response.data;
        setAccessToken(accessToken);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        if (!user?.isCompletedOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        const response = await api.post('/auth/register', { name, email, password });
        const { accessToken, user } = response.data;
        setAccessToken(accessToken);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        navigate('/onboarding');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const googleClientId = '286990208369-m4649d061kk5ra97n316mh5vkr0rf8br.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('email profile');

    // Trigger Google Account selection OAuth popup/redirect
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-navy-800 text-white rounded flex items-center justify-center font-bold text-lg mx-auto mb-3">
            RC
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Researcher Campus Workstation</h1>
          <p className="text-xs text-slate-600 mt-1">
            Sign in to access your 7-stage research lifecycles and paper studio.
          </p>
        </div>

        <Card className="space-y-5">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setTab('LOGIN')}
              className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                tab === 'LOGIN'
                  ? 'border-navy-800 text-navy-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('REGISTER')}
              className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                tab === 'REGISTER'
                  ? 'border-navy-800 text-navy-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 py-2 px-4 rounded text-xs font-medium text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[11px] text-slate-400 font-mono">OR</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'REGISTER' && (
              <Input
                label="Full Name"
                placeholder="Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            )}

            <Input
              label="Academic / Institutional Email"
              type="email"
              placeholder="john@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === 'LOGIN' ? 'current-password' : 'new-password'}
              required
            />

            {error && <div className="text-xs text-red-600">{error}</div>}

            <Button type="submit" className="w-full" isLoading={loading}>
              {tab === 'LOGIN' ? 'Sign In to Workspace' : 'Create Account & Start Onboarding'}
            </Button>
          </form>

          <div className="text-center pt-2 text-[11px] text-slate-500 font-mono">
            Protected by 7-Day Dual-Token JWT Auth & httpOnly Cookies
          </div>
        </Card>
      </main>
    </div>
  );
}
