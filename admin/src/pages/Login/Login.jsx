import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Building2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    { icon: Building2, label: 'Full Property & Inventory Management' },
    { icon: Shield,   label: 'Role-Based Access Control' },
    { icon: Lock,     label: 'Secure Session Management' },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">

      {/* ── Left brand panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full bg-black/10" />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sahara</h1>
              <p className="text-amber-200 text-[11px] font-medium uppercase tracking-widest -mt-0.5">Real Estate CRM</p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Manage every deal,<br />every client,<br />
            <span className="text-amber-200">every opportunity.</span>
          </h2>
          <p className="text-amber-100/80 text-sm leading-relaxed mb-8">
            Your all-in-one command centre for properties, leads, sales pipelines, and more.
          </p>
          <ul className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-amber-100">
                <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-amber-200/60 text-xs">
          &copy; {new Date().getFullYear()} Sahara Real Estate. All rights reserved.
        </p>
      </div>

      {/* ── Right login panel ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Sahara CRM</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1.5">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to your Sahara Admin account to continue.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sahara.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1.5">Demo Credentials</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 font-mono">admin@sahara.com</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 font-mono">admin123</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
