import React from 'react';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { DashboardPreview } from './components/landing/DashboardPreview';
import { TransactionsSection } from './components/landing/TransactionsSection';
import { InteractiveFeaturesText } from './components/landing/InteractiveFeaturesText';
import { SecuritySection } from './components/landing/SecuritySection';
import { AiSection } from './components/landing/AiSection';
import { Footer } from './components/landing/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-dvh w-full flex flex-col overflow-x-clip bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header & Navigation with Rainbow Strip */}
      <Navbar />

      <main className="w-full flex-1 flex flex-col">
        {/* 2. img1: Hero Section */}
        <HeroSection />

        {/* 3. img2: Floating Dashboard Preview */}
        <DashboardPreview />

        {/* 4. img4: Transactions Handled Your Way */}
        <TransactionsSection />

        {/* 5. img3: Interactive Highlighted Features Text */}
        <InteractiveFeaturesText />

        {/* 6. img5: Uncompromising Security & Radical Transparency */}
        <SecuritySection />

        {/* 7. img6: One more thing. And yes, it's AI. */}
        <AiSection />
      </main>

      {/* 8. Footer with CTA and Bottom Rainbow Strip */}
      <Footer />
    </div>
  );
};

export default App;
