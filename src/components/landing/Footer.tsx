import React from 'react';
import { AarthWordmark, AarthEmblem, GithubIcon } from './AarthLogo';
import { RainbowStrip } from './RainbowStrip';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
return (
<footer className="w-full pt-16 bg-[#F9F9F9] flex flex-col">
{/* Top CTA Banner */}
<div className="max-w-[720px] mx-auto text-center px-4 mb-24">
<div className="mb-4 flex justify-center">
<AarthEmblem className="w-20 h-20" />
</div>
<h2 className="text-4xl sm:text-5xl md:text-[3.25rem] font-medium tracking-[-0.05em] text-gray-900 leading-[1.1] mb-3">
      Turn your questions,
      <br />
      into financial certainty
    </h2>

    <p className="text-gray-500 text-base leading-relaxed mb-6">
      Start taking control of your money today.
    </p>

    <div className="flex justify-center">
      <a
        href="#try"
        className="rainbow-btn group inline-flex items-center justify-center h-12 px-7 rounded-xl font-medium text-white text-base shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        <span>🚀 Try it (sample data!)</span>
      </a>
    </div>
  </div>

  {/* Main Footer Links */}
  <div className="max-w-[1140px] mx-auto w-full px-4 mb-16">
    <div className="flex flex-col md:flex-row justify-between gap-12">
      {/* Brand */}
      <div className="flex flex-col gap-3 max-w-[280px]">
        <a href="/" aria-label="Artha home">
          <AarthWordmark />
        </a>

        <p className="text-xs text-gray-500 leading-relaxed">
          The personal finance app for everyone (by everyone).
        </p>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs text-gray-500">
        {/* Product */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono uppercase tracking-wider text-gray-900 font-semibold mb-1">
            Product
          </h4>
          <a href="#tracking" className="hover:text-gray-900 transition-colors">Tracking</a>
          <a href="#transactions" className="hover:text-gray-900 transition-colors">Transactions</a>
          <a href="#budgeting" className="hover:text-gray-900 transition-colors">Budgeting</a>
          <a href="#assistant" className="hover:text-gray-900 transition-colors">Assistant</a>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono uppercase tracking-wider text-gray-900 font-semibold mb-1">
            Resources
          </h4>
          <a href="#docs" className="hover:text-gray-900 transition-colors">Documentation</a>
          <a href="#community" className="hover:text-gray-900 transition-colors">Join Community</a>
          <a
            href="https://github.com/Visheshjha11/artha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            Contribute
          </a>
          <a href="#self-host" className="hover:text-gray-900 transition-colors">Self-Host</a>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono uppercase tracking-wider text-gray-900 font-semibold mb-1">
            Tools
          </h4>
          <a href="#tools" className="hover:text-gray-900 transition-colors">Compound Interest</a>
          <a href="#tools" className="hover:text-gray-900 transition-colors">ROI Calculator</a>
          <a href="#tools" className="hover:text-gray-900 transition-colors">Financial Freedom</a>
          <a href="#tools" className="hover:text-gray-900 transition-colors">Exchange Rates</a>
          <a href="#tools" className="hover:text-gray-900 transition-colors">All Tools</a>
        </div>

        {/* Legal and Social */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono uppercase tracking-wider text-gray-900 font-semibold mb-1">
            Legal
          </h4>
          <a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#tos" className="hover:text-gray-900 transition-colors">Terms of Service</a>

          <h4 className="font-mono uppercase tracking-wider text-gray-900 font-semibold mt-3 mb-1">
            Connect
          </h4>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Visheshjha11/artha"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-all shadow-sm"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href="#discord"
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#5865F2] hover:border-gray-300 transition-all shadow-sm"
              aria-label="Discord"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright and Global Badge */}
  <div className="max-w-[1140px] mx-auto w-full px-4 pb-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3 border-t border-gray-200/60 pt-6">
    <p>© {new Date().getFullYear()} Artha Finance. All rights reserved.</p>

    <p className="flex items-center gap-1.5">
      <span>Built by people around the world</span>
      <Globe className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
    </p>
  </div>

  {/* Bottom Rainbow Strip */}
  <RainbowStrip />
</footer>

);
};