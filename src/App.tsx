import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardPreview } from './components/DashboardPreview';
import { InteractiveFeaturesText } from './components/InteractiveFeaturesText';
import { TransactionsSection } from './components/TransactionsSection';
import { SecuritySection } from './components/SecuritySection';
import { AiSection } from './components/AiSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header & Navigation with Rainbow Strip */}
      <Navbar />

      <main className="w-full flex-1 flex flex-col">
        {/* 2. img1: Hero Section */}
        <HeroSection />

        {/* 3. img2: Floating Dashboard Preview */}
        <DashboardPreview />

        {/* 4. img3: Interactive Highlighted Features Text */}
        <InteractiveFeaturesText />

        {/* 5. img4: Transactions Handled Your Way */}
        <TransactionsSection />

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
