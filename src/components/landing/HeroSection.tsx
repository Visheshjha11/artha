import React, { useEffect, useRef } from 'react';
import { d } from '../../lib/motion';
import { AarthEmblem, GithubIcon } from './AarthLogo';


// Headline words rise out of a mask one after another.
const Words: React.FC<{ text: string; start: number }> = ({ text, start }) => (
  <>
    {text.split(' ').map((word, i, all) => (
      <React.Fragment key={i}>
        <span className="inline-block overflow-hidden align-bottom py-[0.1em] -my-[0.1em]">
          <span className="hero-word" style={d(start + i * 90)}>{word}</span>
        </span>
        {i < all.length - 1 && ' '}
      </React.Fragment>
    ))}
  </>
);

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const frame = useRef(0);

  // Pointer parallax: publishes the cursor position (-1..1) as CSS variables.
  const setPointer = (x: number, y: number) => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty('--px', x.toFixed(3));
    el.style.setProperty('--py', y.toFixed(3));
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !sectionRef.current) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (r) setPointer(((clientX - r.left) / r.width) * 2 - 1, ((clientY - r.top) / r.height) * 2 - 1);
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer(0, 0)}
      className="relative w-full pt-12 md:pt-16 pb-16 md:pb-24 px-4 overflow-hidden"
    >
      {/* Ambient light: slow drifting emerald and champagne orbs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="parallax absolute -top-20 left-[4%]" style={{ ['--k' as string]: '-28px' }}>
          <div className="orb-a w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full bg-emerald-300/25 blur-[80px] sm:blur-[100px]" />
        </div>
        <div className="parallax absolute top-8 right-[2%]" style={{ ['--k' as string]: '34px' }}>
          <div className="orb-b w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#e8cf94]/40 blur-[80px] sm:blur-[100px]" />
        </div>
      </div>
      
      {/* Background financial grid & chart lines (matching Image 1) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-60">
        {/* Subtle grid lines & currency values on left edge */}
        <div className="hero-fade hidden md:flex absolute left-16 top-1/4 bottom-1/4 flex-col justify-between text-[11px] font-mono text-gray-400/80" style={d(1400)}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-[1px] bg-gray-300"></span>
            <span>₹1Cr</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-[1px] bg-gray-300"></span>
            <span>₹80L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-[1px] bg-gray-300"></span>
            <span>₹60L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-[1px] bg-gray-300"></span>
            <span>₹40L</span>
          </div>
        </div>

        {/* Financial SVG line tracing behind hero */}
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none" 
          viewBox="0 0 1440 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle dotted vertical guide lines */}
          <line x1="260" y1="40" x2="260" y2="560" stroke="#e5e7eb" strokeDasharray="3 4" strokeWidth="1" opacity="0.7" />
          <line x1="1180" y1="40" x2="1180" y2="560" stroke="#e5e7eb" strokeDasharray="3 4" strokeWidth="1" opacity="0.7" />

          {/* Upward climbing financial path */}
          <path 
            d="M 50 480 C 300 460, 520 490, 750 380 C 950 290, 1100 240, 1390 160" 
            stroke="#d1d5db" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            opacity="0.8"
          />
          {/* Solid line draws itself left to right, then the area beneath fades in */}
          <path
            d="M 50 480 C 300 460, 520 490, 750 380 C 950 290, 1100 240, 1390 160"
            pathLength="1"
            stroke="url(#hero-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="hero-chart-line"
          />
          <g className="hero-chart-fill">
            <path 
              d="M 50 480 C 300 460, 520 490, 750 380 C 950 290, 1100 240, 1390 160 L 1390 600 L 50 600 Z" 
              fill="url(#hero-gradient)" 
              opacity="0.25"
            />
          </g>
          <defs>
            <linearGradient id="hero-line" x1="50" y1="0" x2="1390" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5b9347" />
              <stop offset="1" stopColor="#c9a24b" />
            </linearGradient>
            <linearGradient id="hero-gradient" x1="720" y1="160" x2="720" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5b9347" stopOpacity="0.12" />
              <stop offset="1" stopColor="#5b9347" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating financial price tag pill matching Image 1 */}
        {/* <div className="hidden lg:flex absolute right-[10%] top-[34%] bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-xl px-3.5 py-2 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-[11px] font-mono text-gray-400">27 Feb 2025</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-gray-800">₹83,19,764.52</span>
            <span className="text-[11px] font-mono font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +₹33,280 (+0.4%)
            </span>
          </div>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-[900px] mx-auto text-center z-10 flex flex-col items-center">
        
        {/* Top Centered Stylized Aarth Emblem */}
        <div className="hero-in mb-6 transform hover:scale-105 transition-transform duration-300" style={d(0)}>
          <div className="parallax" style={{ ['--k' as string]: '14px' }}>
            <div className="float-slow">
              <AarthEmblem className="w-24 h-24 md:w-32 md:h-32" />
            </div>
          </div>
        </div>

        {/* Primary Headline matching Image 1 */}
        <h1 className="text-[2rem] min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium tracking-[-0.04em] text-gray-900 leading-[1.08] mb-5">
          <Words text="The personal finance" start={250} />{' '}
          <br className="hidden sm:inline" />
          <Words text="app for everyone" start={610} />
        </h1>

        {/* Subtitle */}
        <p className="hero-in text-base sm:text-xl text-gray-500 max-w-[620px] font-normal leading-relaxed mb-8" style={d(1000)}>
          Artha is an all-in-one personal finance platform. Track, optimize, 
          grow, and manage your money through every stage of life.
        </p>

        {/* CTA Button with Rainbow Border */}
        <div className="hero-in flex flex-col items-center gap-4 mb-7" style={d(1250)}>
          <a
            href="#try"
            className="rainbow-btn group inline-flex items-center justify-center h-12 px-7 rounded-xl font-medium text-white text-base shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>🚀 Try it (sample data!)</span>
          </a>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a 
              href="https://github.com/Visheshjha11/artha" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-white border border-gray-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-950 transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-gray-800" />
              <span>Star on GitHub</span>
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono">18.4k</span>
            </a>



            <a 
              href="#community" 
              className="flex items-center gap-1.5 bg-white border border-gray-200/90 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-950 transition-colors"
            >
              <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join community</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
