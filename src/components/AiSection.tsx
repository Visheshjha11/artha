import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  AlertCircle, 
  BarChart3,
  Bot
} from 'lucide-react';


export const AiSection: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState(0);

  const prompts = [
    "How is my investment portfolio doing compared to S&P 500?",
    "Detect any unusual spending spikes in the last 30 days",
    "Simulate my net worth in 10 years if I save $1,500/mo"
  ];

  return (
    <section id="assistant" className="w-full max-w-[1360px] mx-auto px-4 mb-20">
      
      {/* Dark Radial Gradient Container */}
      <div 
        className="rounded-3xl md:rounded-[36px] overflow-hidden p-8 sm:p-14 md:p-20 text-center relative border border-white/10 shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #262626 0%, #171717 70%, #0f0f10 100%)'
        }}
      >
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Floating AI Emblem */}
        <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center">
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[2px] mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <div className="w-full h-full bg-[#1c1c1f] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Bot className="w-7 h-7" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-[3.75rem] font-medium tracking-[-0.05em] text-white leading-[1.08] mb-4">
            One more thing. <br />
            <span className="text-gray-400 font-normal">And yes, it's AI.</span>
          </h2>

          {/* Prompter Pill Box */}
          <div className="w-full max-w-[560px] my-6 p-1.5 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-inner flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0 ml-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left text-xs sm:text-sm text-gray-200 font-mono truncate">
              {prompts[activePrompt]}
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-white text-gray-950 font-medium text-xs hover:bg-gray-100 transition-colors shrink-0">
              Ask
            </button>
          </div>

          {/* Subtitle with Question Chips */}
          <div className="text-lg sm:text-xl md:text-2xl text-gray-400 font-normal leading-relaxed mb-8 flex flex-wrap items-center justify-center gap-2">
            <span>Ask</span>
            <span className="text-white font-medium">anything</span>
            <span>like</span>

            <button 
              onClick={() => setActivePrompt(0)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>How is my portfolio doing?</span>
            </button>

            <span>or</span>

            <button 
              onClick={() => setActivePrompt(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Unusual spend this month?</span>
            </button>

            <span>or even</span>

            <button 
              onClick={() => setActivePrompt(2)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate net worth in 10 years</span>
            </button>

            <span>and get answered,</span>
            <span className="text-white font-medium">really fast.</span>
          </div>

          {/* CTA Link */}
          <a 
            href="#try" 
            className="inline-flex items-center gap-2 text-white font-medium text-sm group hover:text-emerald-400 transition-colors"
          >
            <span>Explore Artha AI</span>
            <span className="w-6 h-6 rounded-full bg-white/15 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-emerald-400" />
            </span>
          </a>


        </div>

        {/* Visual Cards Row in Dark Mode */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          
          {/* Card 1: Pattern Detection */}
          <div className="bg-[#1e1e22]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono uppercase text-[10px] tracking-wider text-emerald-400">Pattern Insight</span>
              <span>Today</span>
            </div>
            <h4 className="text-white font-medium text-sm">Recurring subscriptions increased</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Detected 3 software services renewed with a 15% price hike over last quarter.
            </p>
            <div className="h-12 bg-white/5 rounded-xl flex items-end p-2 gap-1.5">
              <div className="w-1/6 bg-emerald-500/40 h-1/3 rounded-xs"></div>
              <div className="w-1/6 bg-emerald-500/50 h-1/2 rounded-xs"></div>
              <div className="w-1/6 bg-emerald-500/60 h-2/3 rounded-xs"></div>
              <div className="w-1/6 bg-emerald-500/70 h-3/5 rounded-xs"></div>
              <div className="w-1/6 bg-emerald-500/80 h-4/5 rounded-xs"></div>
              <div className="w-1/6 bg-emerald-400 h-full rounded-xs"></div>
            </div>
          </div>

          {/* Card 2: Safe to spend projection */}
          <div className="bg-[#1e1e22]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono uppercase text-[10px] tracking-wider text-cyan-400">Simulation</span>
              <span>Projection</span>
            </div>
            <h4 className="text-white font-medium text-sm">Target FIRE Date: October 2038</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Based on your 43.15% real estate & savings trajectory, you are 3 years ahead of your goal.
            </p>
            <div className="flex items-center justify-between pt-2 text-xs font-mono border-t border-white/5">
              <span className="text-gray-400">Projected Portfolio:</span>
              <span className="text-emerald-400 font-semibold">$2,450,000</span>
            </div>
          </div>

          {/* Card 3: Asset allocation balance */}
          <div className="bg-[#1e1e22]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono uppercase text-[10px] tracking-wider text-purple-400">Rebalance Alert</span>
              <span>Actionable</span>
            </div>
            <h4 className="text-white font-medium text-sm">Cash balance higher than usual</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Holding $154k in cash (19%). Reallocating $45k into index funds saves $2,100 in inflation drag.
            </p>
            <div className="flex gap-2 pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">+4.8% APY Boost</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
