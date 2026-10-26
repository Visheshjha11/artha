import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { DashboardPreview } from './components/landing/DashboardPreview';
import { TransactionsSection } from './components/landing/TransactionsSection';
import { InteractiveFeaturesText } from './components/landing/InteractiveFeaturesText';
import { SecuritySection } from './components/landing/SecuritySection';
import { AiSection } from './components/landing/AiSection';
import { Footer } from './components/landing/Footer';
import { AarthWordmark } from './components/landing/AarthLogo';
import { RainbowStrip } from './components/landing/RainbowStrip';
import { AuthPage } from './components/auth/AuthPage';

type View = 'landing' | 'signin' | 'signup' | 'demo';

// Every "Try it" button on the landing page links to #try, so a tiny hash
// router is all that's needed. Other hashes (#tracking, #terms, …) are
// in-page anchors and must not change the current view.
const viewFromHash = (current: View): View => {
  switch (window.location.hash) {
    case '#try':
      return 'signin';
    case '#signup':
      return 'signup';
    case '':
    case '#':
      return 'landing';
    default:
      return current;
  }
};

const Landing: React.FC = () => (
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

// Post-login screen. There is no real app yet, so this shows the sample
// dashboard behind a slim account bar.
const DemoWorkspace: React.FC<{ email: string; onSignOut: () => void }> = ({ email, onSignOut }) => (
  <div className="min-h-dvh w-full flex flex-col bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
    <header className="sticky top-0 z-50 w-full">
      <RainbowStrip />
      <div className="bg-[#f9f9f9]/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <AarthWordmark />
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:block truncate max-w-[220px] font-mono text-[11px] text-gray-500">{email}</span>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-gray-700 hover:text-gray-950 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main className="flex-1 w-full pt-10">
      <p className="text-center font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold mb-8">
        Sample data · nothing here is saved
      </p>
      <DashboardPreview />
    </main>
  </div>
);

export const App: React.FC = () => {
  const [view, setView] = useState<View>(() => viewFromHash('landing'));
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  if (view === 'demo' && userEmail) {
    return (
      <DemoWorkspace
        email={userEmail}
        onSignOut={() => {
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
          setUserEmail(email ?? 'demo@artha.finance');
          setView('demo');
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }}
      />
    );
  }

  return <Landing />;
};

export default App;
