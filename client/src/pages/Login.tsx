import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user: authUser } = useAuth();
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect returning logged-in users directly to dashboard
  useEffect(() => {
    if (isAuthenticated && authUser && !window.location.hash.includes('access_token=')) {
      if (authUser.isCompletedOnboarding) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, authUser, navigate]);

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
            login(accessToken, user);
            window.history.replaceState(null, '', window.location.pathname);
            if (!user?.isCompletedOnboarding) {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          })
          .catch((err) => {
            console.error('Google Userinfo error:', err);
            setError('Google sign-in failed. Please try again.');
          })
          .finally(() => setLoading(false));
      }
    }
  }, [login, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'LOGIN') {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, user } = response.data;
        login(accessToken, user);
        if (!user?.isCompletedOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        const response = await api.post('/auth/register', { name, email, password });
        const { accessToken, user } = response.data;
        login(accessToken, user);
        navigate('/onboarding');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = '286990208369-m4649d061kk5ra97n316mh5vkr0rf8br.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/login';
    const scope = 'openid email profile';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scope)}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200/90 shadow-sm rounded-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-navy-800 text-white rounded-xl shadow-xs font-bold text-lg flex items-center justify-center mx-auto tracking-wider ring-4 ring-navy-50">
              RC
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {tab === 'LOGIN' ? 'Sign In to Researcher Campus' : 'Create Academic Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Autonomous AI Operating System for Computer Scientists
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTab('LOGIN');
                setError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                tab === 'LOGIN'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('REGISTER');
                setError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                tab === 'REGISTER'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'REGISTER' && (
              <Input
                label="Full Name / Academic Title"
                placeholder="Dr. Jayesh Thar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Institutional / Research Email"
              type="email"
              placeholder="researcher@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" size="md" className="w-full justify-center text-sm font-semibold py-2.5" isLoading={loading}>
              {tab === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full justify-center border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium py-2.5 text-sm"
            onClick={handleGoogleLogin}
            leftIcon={
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            }
          >
            Sign in with Google Workspace
          </Button>
        </Card>
      </main>
    </div>
  );
}
