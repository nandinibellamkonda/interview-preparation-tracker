import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, Terminal, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLocalError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass rounded-2xl shadow-2xl p-8 relative z-10 border border-slate-800 animate-fade-in">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">PrepPilot AI</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Placement OS</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Unlock your placement metrics and tracker dashboard.</p>
        </div>

        {localError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/40 text-red-400 text-sm flex items-start gap-2">
            <span className="font-semibold">Error:</span> {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                name="email"
                autoComplete="email"
                type="email"
                required
                className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-400 text-sm font-semibold">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset is simulated. Please re-register a new account.'); }} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot Password?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Key className="h-4.5 w-4.5" />
              </span>
              <input
                name="current-password"
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full bg-[#161B26] border border-slate-700/50 rounded-xl py-3 pl-10 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-indigo-500 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <span className="text-slate-500">Secure sign-in</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          New to PrepPilot?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
