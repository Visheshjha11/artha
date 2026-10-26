import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { ArthaWordmark, GithubIcon } from '../landing/AarthLogo';
import { RainbowStrip } from '../landing/RainbowStrip';

type Mode = 'signin' | 'signup';
type Provider = 'google' | 'github';

interface AuthPageProps {
  initialMode?: Mode;
  onBack?: () => void;
  onSuccess?: (userEmail?: string) => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.34 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

const strengthLabels = ['Too short', 'Weak', 'Good', 'Strong'];
const strengthColors = ['bg-red-400', 'bg-amber-400', 'bg-sky-500', 'bg-emerald-500'];

const getPasswordStrength = (pass: string): number => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

const inputClass =
  'w-full h-10 [@media(max-height:700px)]:h-9 bg-white border border-gray-200 rounded-xl pl-9 pr-3 text-[13px] text-gray-900 placeholder-gray-400 ' +
  'focus:outline-none focus:border-emerald-600/60 focus:ring-2 focus:ring-emerald-500/15 transition-all';

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onBack,
  onSuccess,
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<Provider | null>(null);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Track timers so nothing fires after the page unmounts.
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  // Escape closes the reset modal.
  useEffect(() => {
    if (!showForgot) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowForgot(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showForgot]);

  const busy = loading || socialLoading !== null;
  const strength = getPasswordStrength(password);
  const isSignup = mode === 'signup';

  const switchMode = (next: Mode) => {
    setMode(next);
    setToast(null);
  };

  const showToast = (kind: 'success' | 'error', text: string) => setToast({ kind, text });

  // NOTE: there is no backend yet, so every flow below is simulated.
  const finish = (message: string, userEmail: string) => {
    showToast('success', message);
    later(() => onSuccess?.(userEmail), 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (isSignup && !agreeTerms) {
      showToast('error', 'Please accept the Terms of Service to continue.');
      return;
    }
    setToast(null);
    setLoading(true);
    later(() => {
      setLoading(false);
      finish(
        isSignup ? 'Account created. Welcome to Artha!' : 'Welcome back! Signing you in…',
        email || 'demo@artha.finance',
      );
    }, 800);
  };

  const handleSocial = (provider: Provider) => {
    if (busy) return;
    setToast(null);
    setSocialLoading(provider);
    later(() => {
      setSocialLoading(null);
      finish(
        `Connected with ${provider === 'google' ? 'Google' : 'GitHub'}. Opening your dashboard…`,
        `${provider}-user@artha.finance`,
      );
    }, 700);
  };

  const handleDemo = () => {
    if (busy) return;
    setEmail('demo.user@artha.finance');
    setPassword('Demopassword123!');
    setToast(null);
    setLoading(true);
    later(() => {
      setLoading(false);
      finish('Launching the demo with sample data…', 'demo.user@artha.finance');
    }, 600);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || forgotSent) return;
    setForgotSent(true);
    later(() => {
      setShowForgot(false);
      setForgotSent(false);
      showToast('success', `Recovery link sent to ${forgotEmail}`);
      later(() => setToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
      <RainbowStrip className="shrink-0" />

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="shrink-0 w-full border-b border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }} aria-label="Artha home">
            <ArthaWordmark />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-gray-700 hover:text-gray-950 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Back</span>
            </button>
            <button
              type="button"
              onClick={handleDemo}
              disabled={busy}
              className="rainbow-btn h-8 px-3.5 text-xs font-medium text-white rounded-lg flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              <span>🚀 Try it</span>
              <span className="hidden sm:inline text-gray-300">(sample data)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main: form + showcase ───────────────────────────────── */}
      <main className="flex-1 min-h-0 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-4 [@media(max-height:700px)]:py-2 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-12">
        {/* Form column */}
        <section className="min-h-0 flex items-center justify-center lg:order-2">
          <div className="relative isolate w-full max-w-[420px] bg-white border border-gray-200/90 rounded-2xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] p-5 sm:p-6 [@media(max-height:700px)]:p-4 flex flex-col gap-3.5 [@media(max-height:700px)]:gap-2.5">
            {/* Heading */}
            <div>
              <h1 className="text-[1.6rem] sm:text-[1.75rem] font-medium tracking-[-0.04em] text-gray-900 leading-tight">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-xs text-gray-500 mt-1 [@media(max-height:700px)]:hidden">
                {isSignup
                  ? 'Track net worth, accounts and bills with zero telemetry.'
                  : 'Sign in to your private financial dashboard.'}
              </p>
            </div>

            {/* Mode switch */}
            <div role="tablist" aria-label="Authentication mode" className="grid grid-cols-2 p-1 rounded-xl bg-gray-100 text-xs font-medium select-none">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={`h-8 rounded-lg transition-all cursor-pointer ${
                    mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-2.5">
              {(['google', 'github'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSocial(p)}
                  disabled={busy}
                  className="h-10 flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-gray-50 active:scale-[0.98] border border-gray-200 hover:border-gray-300 text-xs font-medium text-gray-800 transition-all cursor-pointer disabled:opacity-60"
                >
                  {socialLoading === p ? (
                    <span className="w-4 h-4 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                  ) : p === 'google' ? (
                    <GoogleIcon />
                  ) : (
                    <GithubIcon className="w-4 h-4 text-gray-900" />
                  )}
                  <span>{p === 'google' ? 'Google' : 'GitHub'}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">or with email</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 [@media(max-height:700px)]:gap-2 text-xs">
              {isSignup && (
                <label className="block space-y-1">
                  <span className="block font-medium text-gray-700">Full name</span>
                  <span className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className={inputClass}
                    />
                  </span>
                </label>
              )}

              <label className="block space-y-1">
                <span className="block font-medium text-gray-700">Email address</span>
                <span className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className={inputClass}
                  />
                </span>
              </label>

              <div className="space-y-1">
                <div className="flex items-center justify-between h-4">
                  <label htmlFor="auth-password" className="font-medium text-gray-700">Password</label>
                  {isSignup ? (
                    password.length > 0 && (
                      <span className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="flex gap-1" aria-hidden="true">
                          {[0, 1, 2, 3].map((step) => (
                            <span
                              key={step}
                              className={`w-5 h-1 rounded-full transition-colors ${
                                strength > step ? strengthColors[strength - 1] : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </span>
                        <span className="font-semibold text-gray-700">{strengthLabels[Math.min(strength, 3)]}</span>
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setForgotEmail(email); setShowForgot(true); }}
                      className="text-[11px] text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <span className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={isSignup ? 8 : undefined}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? 'At least 8 characters' : '••••••••••••'}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </span>
              </div>

              {/* Remember me / Terms — same row height in both modes */}
              {isSignup ? (
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 accent-emerald-600 cursor-pointer shrink-0"
                  />
                  <span className="text-[11px] leading-snug text-gray-500">
                    I agree to the{' '}
                    <a href="#terms" className="text-gray-900 underline underline-offset-2 hover:text-emerald-700">Terms</a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-gray-900 underline underline-offset-2 hover:text-emerald-700">Privacy Policy</a>.
                  </span>
                </label>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-500">Keep me signed in on this device</span>
                </label>
              )}

              <button
                type="submit"
                disabled={busy}
                className="rainbow-btn w-full h-11 [@media(max-height:700px)]:h-10 mt-0.5 text-[13px] font-medium text-white rounded-xl flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignup ? 'Create free account' : 'Sign in to Artha'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                  </>
                )}
              </button>
            </form>

            {/* Mode prompt */}
            <p className="text-center text-xs text-gray-500">
              {isSignup ? 'Already have an account?' : 'New to Artha?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
                className="font-semibold text-gray-900 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {isSignup ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </section>

        {/* Showcase column (desktop only) */}
        <aside className="hidden lg:flex min-h-0 items-center lg:order-1">
          <div className="relative w-full max-h-full overflow-hidden rounded-3xl bg-[#F8F9FA] border border-gray-200/80 shadow-xs p-8 xl:p-10 [@media(max-height:700px)]:p-6 flex flex-col gap-6 [@media(max-height:700px)]:gap-4">
            {/* dot grid + glow */}
            <div className="absolute inset-0 bg-subtle-grid opacity-70 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

            <div className="relative">
              <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold mb-3 [@media(max-height:700px)]:mb-2">
                Personal finance · Your data, your rules
              </p>
              <h2 className="text-[2.4rem] xl:text-[2.8rem] [@media(max-height:700px)]:text-[2rem] font-medium tracking-[-0.05em] leading-[1.08] text-gray-900">
                Know where every rupee goes.{' '}
                <span className="text-gray-400 font-normal">Privately.</span>
              </h2>
            </div>

            {/* Sample dashboard card */}
            <div className="relative bg-white rounded-2xl border border-gray-200/90 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] p-5 [@media(max-height:700px)]:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] text-gray-400">Net worth · sample data</p>
                  <p className="font-mono text-2xl font-semibold text-gray-900 mt-0.5">₹83,19,764.52</p>
                </div>
                <span className="font-mono text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +₹33,280 (+0.4%)
                </span>
              </div>

              <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="w-full h-16 [@media(max-height:700px)]:h-10 mt-3 [@media(max-height:700px)]:mt-2" aria-hidden="true">
                <defs>
                  <linearGradient id="auth-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5b9347" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#5b9347" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 70 C40 66 70 74 110 58 C150 42 180 52 220 38 C260 24 300 34 340 18 C365 10 385 8 400 4 L400 90 L0 90 Z" fill="url(#auth-spark)" />
                <path d="M0 70 C40 66 70 74 110 58 C150 42 180 52 220 38 C260 24 300 34 340 18 C365 10 385 8 400 4" fill="none" stroke="#5b9347" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>

              <ul className="mt-3 [@media(max-height:700px)]:mt-1 divide-y divide-gray-100 text-xs">
                {[
                  { Icon: Landmark, tone: 'bg-blue-50 border-blue-100 text-blue-600', label: 'Savings accounts', value: '₹4,82,300' },
                  { Icon: TrendingUp, tone: 'bg-emerald-50 border-emerald-100 text-emerald-600', label: 'Mutual funds & stocks', value: '₹38,40,150' },
                  { Icon: PiggyBank, tone: 'bg-amber-50 border-amber-100 text-amber-600', label: 'Fixed deposits', value: '₹25,00,000' },
                ].map(({ Icon, tone, label, value }) => (
                  <li key={label} className="flex items-center justify-between py-2 [@media(max-height:700px)]:py-1.5">
                    <span className="flex items-center gap-2.5 text-gray-700 font-medium">
                      <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${tone}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      {label}
                    </span>
                    <span className="font-mono text-gray-900">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges (hidden on short screens) */}
            <div className="relative grid grid-cols-3 gap-3 [@media(max-height:760px)]:hidden">
              {[
                { top: '100%', bottom: 'Offline-first' },
                { top: 'Zero', bottom: 'Tracking or ads' },
                { top: '256-bit', bottom: 'AES encrypted' },
              ].map(({ top, bottom }) => (
                <div key={top} className="p-3 rounded-2xl bg-white/80 border border-gray-200/80 text-center">
                  <p className="font-mono font-bold text-sm text-gray-900">{top}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{bottom}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="shrink-0 w-full border-t border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-10 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>End-to-end encrypted</span>
          </span>
          <nav className="flex items-center gap-3">
            <a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#self-host" className="hover:text-gray-900 transition-colors">Self-host</a>
          </nav>
        </div>
      </footer>

      {/* ── Toast ───────────────────────────────────────────────── */}
      <div aria-live="polite" className="pointer-events-none fixed top-[4.75rem] inset-x-0 z-40 flex justify-center px-4">
        {toast && (
          <div
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto max-w-sm flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
              toast.kind === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {toast.kind === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        )}
      </div>

      {/* ── Forgot password modal ───────────────────────────────── */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => e.target === e.currentTarget && setShowForgot(false)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="forgot-title" className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 id="forgot-title" className="text-base font-medium tracking-[-0.02em] text-gray-900">Reset your password</h3>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                aria-label="Close"
                className="p-1 -mr-1 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500">Enter your account email and we’ll send you a recovery link.</p>
            <form onSubmit={handleForgot} className="space-y-3">
              <span className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@domain.com"
                  aria-label="Account email"
                  className={inputClass}
                />
              </span>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="h-9 px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="rainbow-btn h-9 px-4 rounded-lg font-medium text-white cursor-pointer disabled:opacity-70"
                >
                  {forgotSent ? 'Sending…' : 'Send link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
