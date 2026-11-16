import React, { useEffect, useState } from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { DashboardPreview } from './components/landing/DashboardPreview';
import { TransactionsSection } from './components/landing/TransactionsSection';
import { InteractiveFeaturesText } from './components/landing/InteractiveFeaturesText';
import { SecuritySection } from './components/landing/SecuritySection';
import { AiSection } from './components/landing/AiSection';
import { Footer } from './components/landing/Footer';
import { AuthPage } from './components/auth/AuthPage';
import { Workspace } from './components/app/Workspace';
import { api } from './lib/api';
import { useScrollReveal } from './lib/motion';

type View = 'landing' | 'signin' | 'signup' | 'demo';

const DEMO_EMAIL = 'demo.user@artha.finance';

// Every "Try it" button on the landing page links to #try, so a tiny hash
// router is all that's needed. Other hashes (#tracking, #terms, …) are
// in-page anchors and must not change the current view.
const viewFromHash = (current: View): View => {
  switch (window.location.hash) {
    case '#try':
      return 'signin';
    case '#signup':
      return 'signup';
    case '#demo':
      return 'demo';
    case '':
    case '#':
      return 'landing';
    default:
      return current;
  }
};

const Landing: React.FC = () => {
  useScrollReveal();
  return (
  <div className="min-h-dvh w-full flex flex-col overflow-x-clip bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
    <Navbar />

    <main className="w-full flex-1 flex flex-col">
      <HeroSection />
      <DashboardPreview />
      <TransactionsSection />
      <InteractiveFeaturesText />
      <SecuritySection />
      <AiSection />
    </main>

    <Footer />
  </div>
  );
};

export const App: React.FC = () => {
  const [view, setView] = useState<View>(() => viewFromHash('landing'));
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // "#demo" skips the login screen and opens the workspace with the same demo
  // account the "Try demo" button on the login page uses (sample data only).
  const activeEmail = userEmail ?? (view === 'demo' ? DEMO_EMAIL : null);

  // Restore an existing session (cookie) so a refresh keeps you signed in.
  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then(({ user }) => !cancelled && setUserEmail(user.email))
      .catch(() => undefined)
      .finally(() => !cancelled && setCheckingSession(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => setView((v) => viewFromHash(v));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Start every screen at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const goLanding = () => {
    setView('landing');
    // Drop the hash without leaving a "#" behind or reloading.
    window.history.pushState(null, '', window.location.pathname + window.location.search);
  };

  // Wait for the session check so a signed-in user never sees the login form flash.
  if (checkingSession && (view === 'signin' || view === 'signup')) return null;

  // Signed-in users go straight to the workspace instead of the login page.
  if (activeEmail && view !== 'landing') {
    return (
      <Workspace
        email={activeEmail}
        onSignOut={async () => {
          await api.signout().catch(() => undefined);
          setUserEmail(null);
          goLanding();
        }}
      />
    );
  }

  if (view === 'signin' || view === 'signup') {
    return (
      <AuthPage
        key={view}
        initialMode={view}
        onBack={goLanding}
        onSuccess={(email) => {
          setUserEmail(email ?? DEMO_EMAIL);
          setView('demo');
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }}
      />
    );
  }

  return <Landing />;
};

export default App;
