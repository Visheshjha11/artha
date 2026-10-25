import React from 'react';
import { 
  ShieldCheck, 
  Key, 
  Landmark, 
  Database, 
  Ban, 
  Lock, 
  Code2, 
  HeartHandshake, 
  ArrowUpRight
} from 'lucide-react';
import { GithubIcon } from './AarthLogo';


export const SecuritySection: React.FC = () => {
  // Generate GitHub-style commit grid squares
  const commitRows = 14;
  const commitCols = 18;
  const greenShades = [
    '#f1f5f9', // empty
    '#dcfce7', // level 1
    '#86efac', // level 2
    '#22c55e', // level 3
    '#15803d', // level 4
  ];

  // Deterministic pattern of commits for realistic git heatmap
  const getCellColor = (row: number, col: number) => {
    const seed = (row * 37 + col * 17) % 19;
    if (seed < 4) return greenShades[0];
    if (seed < 8) return greenShades[1];
    if (seed < 13) return greenShades[2];
    if (seed < 17) return greenShades[3];
    return greenShades[4];
  };

  return (
    <section id="security" className="w-full max-w-[1140px] mx-auto px-4 py-16 md:py-24">
      
      {/* Section Title matching Image 5 */}
      <div className="text-center mb-14">
        <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-medium tracking-[-0.05em] text-gray-900 leading-[1.08] mb-3">
          Uncompromising Security <br />
          <span className="text-gray-400 font-normal">Radical Transparency</span>
        </h2>
      </div>

      {/* Visual Showcase Banner matching Image 5 */}
      <div className="bg-[#F8F9FA] rounded-2xl md:rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-10 mb-16 relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px]">
          
          {/* Left Zone: Binary Stream with Security Badges */}
          <div className="lg:col-span-4 relative flex flex-col justify-center gap-2.5">
            {/* Background 0101 matrix stream */}
            <div className="absolute inset-0 select-none pointer-events-none text-[11px] font-mono leading-relaxed text-gray-300/70 overflow-hidden break-all -z-0">
              01010111011010000110010101110010
              01000001101001011101000010000001
              100011011011110110101100101011
              10011001000000111010001110010
              0000011010110100000111001100
              0010110100000011101000001111
              0101101100000111000111001000
              1011000111010000110111101101
              0110110000110010010000011000
              0101100001100100001010101100
            </div>

            {/* Floating Security Pills */}
            <div className="relative z-10 flex flex-col items-start gap-2.5">
              
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2.5 text-xs font-medium text-gray-800 hover:scale-102 transition-transform">
                <Ban className="w-3.5 h-3.5 text-gray-400" />
                <span>No internal access</span>
              </div>

              <div className="bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2.5 text-xs font-medium text-gray-800 hover:scale-102 transition-transform ml-2">
                <Key className="w-3.5 h-3.5 text-gray-400" />
                <span>Encrypted data</span>
              </div>

              <div className="bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2.5 text-xs font-medium text-gray-800 hover:scale-102 transition-transform">
                <Landmark className="w-3.5 h-3.5 text-gray-400" />
                <span>Bank-grade security</span>
              </div>

              <div className="bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2.5 text-xs font-medium text-gray-800 hover:scale-102 transition-transform ml-1">
                <Database className="w-3.5 h-3.5 text-gray-400" />
                <span>Credentials not stored</span>
              </div>

              <div className="bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-xl px-3.5 py-1.5 shadow-xs flex items-center gap-2.5 text-xs font-medium text-gray-800 hover:scale-102 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>No ads or upsells</span>
              </div>

            </div>
          </div>

          {/* Center Zone: GitHub Heatmap Grid + Center Aarth Badge */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative p-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xs">
              
              {/* Commit grid */}
              <div className="grid grid-cols-18 gap-1.5">
                {Array.from({ length: commitRows }).map((_, r) => (
                  <React.Fragment key={r}>
                    {Array.from({ length: commitCols }).map((_, c) => (
                      <div 
                        key={`${r}-${c}`}
                        className="w-3 h-3 rounded-[2.5px] transition-colors"
                        style={{ backgroundColor: getCellColor(r, c) }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Centered Floating GitHub Pill with name 'artha' */}
              <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href="https://github.com/Visheshjha11/artha" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white/95 hover:bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-md flex items-center gap-2 text-sm font-semibold text-gray-900 hover:scale-105 transition-all"
                >
                  <GithubIcon className="w-4 h-4 text-gray-900" />
                  <span>artha</span>
                </a>
              </div>



            </div>
          </div>

          {/* Right Zone: Discord Community Watermark & Pill */}
          <div className="lg:col-span-3 flex items-center justify-center relative min-h-[160px]">
            {/* Watermark Discord pattern */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <div className="grid grid-cols-4 gap-4 text-3xl font-black">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i}>$$$</span>
                ))}
              </div>
            </div>

            {/* Discord Pill */}
            <a 
              href="#discord" 
              className="relative z-10 bg-white/95 hover:bg-white border border-gray-300 rounded-xl px-5 py-2.5 shadow-md flex items-center gap-2.5 text-sm font-semibold text-gray-900 hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join community</span>
            </a>
          </div>

        </div>

      </div>

      {/* 3 Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pillar 1 */}
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-800 shadow-2xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Secure by design</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              We treat your financial data like we'd want ours to be treated, by using strong encryption and secure authentication.
            </p>
          </div>
          <a href="#security-details" className="text-gray-900 text-sm font-medium flex items-center gap-1.5 hover:text-emerald-700 transition-colors group mt-auto">
            <span>Ask about security</span>
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-emerald-700" />
            </span>
          </a>
        </div>

        {/* Pillar 2 */}
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-800 shadow-2xs">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Open source</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              We believe financial tools should be transparent. Artha is open-source — you can review the code, contribute, or self-host for full control.
            </p>
          </div>
          <a href="https://github.com/Visheshjha11/artha" target="_blank" rel="noreferrer" className="text-gray-900 text-sm font-medium flex items-center gap-1.5 hover:text-emerald-700 transition-colors group mt-auto">
            <span>Start contributing</span>
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-emerald-700" />
            </span>
          </a>
        </div>


        {/* Pillar 3 */}
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-gray-800 shadow-2xs">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Built in public</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              No hidden agendas, no gatekeeping — just a transparent, community-driven approach to creating the best financial tool possible.
            </p>
          </div>
          <a href="#community" className="text-gray-900 text-sm font-medium flex items-center gap-1.5 hover:text-emerald-700 transition-colors group mt-auto">
            <span>Join community</span>
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-emerald-700" />
            </span>
          </a>
        </div>

      </div>

    </section>
  );
};
