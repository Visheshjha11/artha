import React, { useState } from 'react';
import { AarthWordmark, GithubIcon } from './AarthLogo';
import { RainbowStrip } from './RainbowStrip';
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Menu, 
  X, 
  LineChart, 
  CreditCard, 
  PieChart, 
  Sparkles,
  Calculator,
  BookOpen,
  Users,
  Server
} from 'lucide-react';


export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <RainbowStrip />
      
      <nav className="w-full bg-[#f9f9f9]/90 backdrop-blur-md border-b border-black/[0.06] transition-all">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <AarthWordmark />
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-gray-700">
            
            {/* Product Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProductDropdownOpen(true)}
              onMouseLeave={() => setProductDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-gray-950 hover:bg-black/[0.04] transition-colors">
                <span>Product</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {productDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[380px] bg-white rounded-2xl shadow-xl border border-black/10 p-2.5 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <a href="#tracking" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                      <LineChart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Tracking</p>
                      <p className="text-xs text-gray-500">Link all your assets, bank accounts and debts</p>
                    </div>
                  </a>

                  <a href="#transactions" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Transactions</p>
                      <p className="text-xs text-gray-500">Edit and automate transactions effortlessly</p>
                    </div>
                  </a>

                  <a href="#budgeting" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Budgeting</p>
                      <p className="text-xs text-gray-500">Set category limits, track spending & optimize</p>
                    </div>
                  </a>

                  <a href="#assistant" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Assistant</p>
                      <p className="text-xs text-gray-500">Private AI trained on your personal finances</p>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-gray-950 hover:bg-black/[0.04] transition-colors">
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[460px] bg-white rounded-2xl shadow-xl border border-black/10 p-3 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-800 mb-2">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">Try our financial tools</h4>
                      <p className="text-xs text-gray-500 mt-1">Interactive calculators for compound interest, FIRE, and ROI</p>
                    </div>
                    <a href="#tools" className="mt-3 text-xs font-semibold text-gray-900 hover:text-emerald-700 flex items-center gap-1">
                      Explore tools <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold px-2 mb-1">Links</span>
                    <a href="#docs" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400" /> Documentation
                    </a>
                    <a href="#community" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> Join Community
                    </a>
                    <a href="#self-host" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100">
                      <Server className="w-3.5 h-3.5 text-gray-400" /> Self-Host
                    </a>
                    <a href="https://github.com/Visheshjha11/artha" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100">
                      <GithubIcon className="w-3.5 h-3.5 text-gray-400" /> GitHub Repo
                    </a>

                  </div>
                </div>
              )}
            </div>
            
            <a href="https://github.com/Visheshjha11/artha" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg hover:text-gray-950 hover:bg-black/[0.04] transition-colors flex items-center gap-1">
              Contribute
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>

          {/* Right: CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <a 
              href="#docs" 
              className="py-1.5 px-3.5 text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition-colors"
            >
              Docs
            </a>
            <a 
              href="#try" 
              className="rainbow-btn py-1.5 px-4 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>🚀 Try it</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-950 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile slide down drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <a href="#tracking" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between">
                <span>Product</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between">
                <span>Resources</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-2 border-b border-gray-100">
                Pricing
              </a>
              <a href="https://github.com/Visheshjha11/artha" target="_blank" rel="noreferrer" className="text-base font-medium text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between">
                <span>Contribute</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#docs" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-gray-900 py-2">
                Docs
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a 
                href="#try" 
                onClick={() => setMobileMenuOpen(false)}
                className="rainbow-btn w-full py-2.5 text-center text-sm font-medium text-white rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🚀 Try it (sample data!)</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
