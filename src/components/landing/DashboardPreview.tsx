import React, { useState } from 'react';
import { 
  Clock, 
  CreditCard, 
  Map, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  SlidersHorizontal,
  Sparkles,
  Command,
  AtSign,
  ArrowUp,
  LayoutGrid,
  MoreVertical,
  BookOpen
} from 'lucide-react';
import { AarthIcon } from './AarthLogo';

export const DashboardPreview: React.FC = () => {
  const [toolCallsOpen, setToolCallsOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <section className="w-full max-w-[1240px] mx-auto px-2 sm:px-4 mb-20 -mt-6">
      
      {/* Floating Dashboard Card */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
        
        {/* Layout container: Left sidebar + Main workspace */}
        <div className="flex flex-col md:flex-row md:min-h-[780px]">
          
          {/* Left Mini Rail / Navigation (Sidebar) */}
          <aside className="hidden md:flex flex-col items-center justify-between py-5 px-3 border-r border-gray-100 bg-[#FAFAFA] w-18 shrink-0">
            {/* Top Logo */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-8 h-8 rounded-lg bg-[#5b9347] flex items-center justify-center text-white font-black text-sm shadow-xs">
                <AarthIcon className="w-6 h-6" />
              </div>

              {/* Navigation icons */}
              <nav className="flex flex-col items-center gap-5">
                <button className="flex flex-col items-center text-[#18181b] group">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/90 shadow-xs flex items-center justify-center text-gray-900">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 mt-1">Home</span>
                </button>

                <button className="flex flex-col items-center text-gray-400 hover:text-gray-700 group transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 mt-1">Transactions</span>
                </button>

                <button className="flex flex-col items-center text-gray-400 hover:text-gray-700 group transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-700">
                    <Map className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 mt-1">Budgets</span>
                </button>
              </nav>
            </div>

            {/* Bottom Support & User */}
            <div className="flex flex-col items-center gap-4">
              <button className="text-gray-400 hover:text-gray-700 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
                JB
              </div>
            </div>
          </aside>

          {/* Right Main Dashboard Area */}
          <div className="flex-1 flex flex-col bg-[#FDFDFD]">
            
            {/* Top Workspace Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-gray-700 font-medium">Dashboard</span>
                </div>
                <h2 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-gray-900">
                  Welcome back, Jack
                </h2>
                <p className="text-xs text-gray-400 font-normal">
                  Here's what's happening with your finances
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="hidden sm:flex p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="bg-[#18181b] hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* Content 2-Column Split: Visual Metrics (Left) & AI Assistant (Right) */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Cashflow Sankey + Assets Breakdown (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                
                {/* 1. Cashflow Card */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">Cashflow</h3>
                    <div className="relative">
                      <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 py-1 pl-2.5 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="30D">30D</option>
                        <option value="90D">90D</option>
                        <option value="YTD">YTD</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                    </div>
                  </div>

                  {/* SVG Sankey Diagram */}
                  <p className="sm:hidden text-[10px] font-mono text-gray-400 text-right mb-1">Swipe sideways to explore →</p>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[440px] h-[240px] sm:h-[270px] relative">
                      <svg viewBox="0 0 520 260" role="img" aria-label="Monthly cashflow: income flowing into expenses and surplus" className="w-full h-full select-none">
                        <defs>
                          <linearGradient id="sk-in-0" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#10b981" stopOpacity="0.22" /><stop offset="1" stopColor="#16a34a" stopOpacity="0.10" /></linearGradient>
                          <linearGradient id="sk-in-1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#059669" stopOpacity="0.22" /><stop offset="1" stopColor="#16a34a" stopOpacity="0.10" /></linearGradient>
                          <linearGradient id="sk-in-2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#34d399" stopOpacity="0.22" /><stop offset="1" stopColor="#16a34a" stopOpacity="0.10" /></linearGradient>
                          <linearGradient id="sk-out-0" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#dc2626" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#ea580c" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#2563eb" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-4" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#db2777" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#64748b" stopOpacity="0.24" /></linearGradient>
                          <linearGradient id="sk-out-6" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#16a34a" stopOpacity="0.10" /><stop offset="1" stopColor="#16a34a" stopOpacity="0.24" /></linearGradient>
                        </defs>

                        {/* Ribbons */}
                        <path d="M 18 60.9 C 134 60.9, 134 74.9, 250 74.9 L 250 157.3 C 134 157.3, 134 143.3, 18 143.3 Z" fill="url(#sk-in-0)"><title>Salary: ₹3,05,000</title></path>
                        <path d="M 18 157.3 C 134 157.3, 134 157.3, 250 157.3 L 250 180.2 C 134 180.2, 134 180.2, 18 180.2 Z" fill="url(#sk-in-1)"><title>Freelance: ₹85,000</title></path>
                        <path d="M 18 194.2 C 134 194.2, 134 180.2, 250 180.2 L 250 185.1 C 134 185.1, 134 199.1, 18 199.1 Z" fill="url(#sk-in-2)"><title>Dividends: ₹18,000</title></path>
                        <path d="M 262 74.9 C 380 74.9, 380 20.9, 498 20.9 L 498 37.7 C 380 37.7, 380 91.7, 262 91.7 Z" fill="url(#sk-out-0)"><title>Housing: ₹62,000</title></path>
                        <path d="M 262 91.7 C 380 91.7, 380 55.7, 498 55.7 L 498 63.2 C 380 63.2, 380 99.2, 262 99.2 Z" fill="url(#sk-out-1)"><title>Food &amp; Dining: ₹28,000</title></path>
                        <path d="M 262 99.2 C 380 99.2, 380 81.2, 498 81.2 L 498 85 C 380 85, 380 103, 262 103 Z" fill="url(#sk-out-2)"><title>Transportation: ₹14,000</title></path>
                        <path d="M 262 103 C 380 103, 380 103, 498 103 L 498 106 C 380 106, 380 106, 262 106 Z" fill="url(#sk-out-3)"><title>Entertainment: ₹11,000</title></path>
                        <path d="M 262 106 C 380 106, 380 124, 498 124 L 498 134.5 C 380 134.5, 380 116.5, 262 116.5 Z" fill="url(#sk-out-4)"><title>Shopping / Travel / Care: ₹39,000</title></path>
                        <path d="M 262 116.5 C 380 116.5, 380 152.5, 498 152.5 L 498 163.3 C 380 163.3, 380 127.3, 262 127.3 Z" fill="url(#sk-out-5)"><title>Taxes (advance + TDS): ₹40,000</title></path>
                        <path d="M 262 127.3 C 380 127.3, 380 181.3, 498 181.3 L 498 239.1 C 380 239.1, 380 185.1, 262 185.1 Z" fill="url(#sk-out-6)"><title>Surplus: ₹2,14,000</title></path>

                        {/* Nodes + labels */}
                        <rect x="8" y="60.9" width="10" height="82.3" rx="3" fill="#10b981" />
                        <text x="26" y="101.1" className="text-[10px] font-sans fill-gray-900 font-medium">Salary</text>
                        <text x="26" y="112.1" className="text-[8.5px] font-mono fill-gray-500">₹3,05,000</text>
                        <rect x="8" y="157.3" width="10" height="22.9" rx="3" fill="#059669" />
                        <text x="26" y="167.7" className="text-[10px] font-sans fill-gray-900 font-medium">Freelance</text>
                        <text x="26" y="178.7" className="text-[8.5px] font-mono fill-gray-500">₹85,000</text>
                        <rect x="8" y="194.2" width="10" height="4.9" rx="3" fill="#34d399" />
                        <text x="26" y="195.6" className="text-[10px] font-sans fill-gray-900 font-medium">Dividends</text>
                        <text x="26" y="206.6" className="text-[8.5px] font-mono fill-gray-500">₹18,000</text>
                        <rect x="498" y="20.9" width="10" height="16.7" rx="3" fill="#dc2626" />
                        <text x="490" y="28.3" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Housing</text>
                        <text x="490" y="39.3" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹62,000</text>
                        <rect x="498" y="55.7" width="10" height="7.6" rx="1.25" fill="#ea580c" />
                        <text x="490" y="58.4" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Food &amp; Dining</text>
                        <text x="490" y="69.4" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹28,000</text>
                        <rect x="498" y="81.2" width="10" height="3.8" rx="1.25" fill="#2563eb" />
                        <text x="490" y="82.1" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Transportation</text>
                        <text x="490" y="93.1" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹14,000</text>
                        <rect x="498" y="103" width="10" height="3" rx="1.25" fill="#7c3aed" />
                        <text x="490" y="103.5" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Entertainment</text>
                        <text x="490" y="114.5" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹11,000</text>
                        <rect x="498" y="124" width="10" height="10.5" rx="3" fill="#db2777" />
                        <text x="490" y="128.2" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Shopping / Travel / Care</text>
                        <text x="490" y="139.2" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹39,000</text>
                        <rect x="498" y="152.5" width="10" height="10.8" rx="3" fill="#64748b" />
                        <text x="490" y="156.9" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Taxes (advance + TDS)</text>
                        <text x="490" y="167.9" textAnchor="end" className="text-[8.5px] font-mono fill-gray-500">₹40,000</text>
                        <rect x="498" y="181.3" width="10" height="57.8" rx="3" fill="#16a34a" />
                        <text x="490" y="209.2" textAnchor="end" className="text-[10px] font-sans fill-emerald-700 font-semibold">Surplus</text>
                        <text x="490" y="220.2" textAnchor="end" className="text-[8.5px] font-mono fill-emerald-600 font-medium">₹2,14,000</text>
                        <rect x="250" y="74.9" width="12" height="110.2" rx="3" fill="#16a34a" />
                        <text x="270" y="129" className="text-[10px] font-sans fill-gray-900 font-medium">Cash Flow</text>
                        <text x="270" y="140" className="text-[8.5px] font-mono fill-gray-500">₹4,08,000</text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. Assets Card (₹1,33,30,000) */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-semibold text-gray-900 text-base">Assets</h3>
                      <span className="text-gray-400 font-mono text-sm">· ₹1,33,30,000</span>
                    </div>
                  </div>

                  {/* Segmented bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex gap-1 mb-3 bg-gray-100">
                    <div className="h-full bg-purple-500 rounded-sm" style={{ width: '7%' }}></div>
                    <div className="h-full bg-blue-500 rounded-sm" style={{ width: '31%' }}></div>
                    <div className="h-full bg-gray-700 rounded-sm" style={{ width: '1%' }}></div>
                    <div className="h-full bg-cyan-400 rounded-sm" style={{ width: '56%' }}></div>
                    <div className="h-full bg-pink-400 rounded-sm" style={{ width: '5%' }}></div>
                  </div>

                  {/* Asset Legend Pills */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Cash <strong className="text-gray-900 font-mono">7%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Investments <strong className="text-gray-900 font-mono">32%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                      <span>Crypto <strong className="text-gray-900 font-mono">0%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>Properties <strong className="text-gray-900 font-mono">56%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                      <span>Vehicles <strong className="text-gray-900 font-mono">5%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Other Assets <strong className="text-gray-900 font-mono">0%</strong></span>
                    </div>
                  </div>

                  {/* Assets Table */}
                  <div className="w-full text-xs">
                    <div className="grid grid-cols-12 text-[10px] uppercase font-mono text-gray-400 tracking-wider pb-2 border-b border-gray-100">
                      <div className="col-span-7 sm:col-span-6 font-medium">Name</div>
                      <div className="hidden sm:block col-span-3 font-medium">Weight</div>
                      <div className="col-span-5 sm:col-span-3 text-right font-medium">Value</div>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {/* Cash */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-7 sm:col-span-6 flex items-center gap-1.5 font-medium text-gray-900 min-w-0">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Cash</span>
                        </div>
                        <div className="hidden sm:flex col-span-3 items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-purple-500 rounded-xs"></span>
                            <span className="w-1 h-3 bg-purple-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-purple-100 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">7.13%</span>
                        </div>
                        <div className="col-span-5 sm:col-span-3 text-right font-mono font-semibold text-gray-900">₹9,50,000.00</div>
                      </div>

                      {/* Investments */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-7 sm:col-span-6 flex items-center gap-1.5 font-medium text-gray-900 min-w-0">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Investments</span>
                        </div>
                        <div className="hidden sm:flex col-span-3 items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-blue-500 rounded-xs"></span>
                            <span className="w-1 h-3 bg-blue-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-blue-300 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">31.51%</span>
                        </div>
                        <div className="col-span-5 sm:col-span-3 text-right font-mono font-semibold text-gray-900">₹42,00,000.00</div>
                      </div>

                      {/* Crypto */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-7 sm:col-span-6 flex items-center gap-1.5 font-medium text-gray-900 min-w-0">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Crypto</span>
                        </div>
                        <div className="hidden sm:flex col-span-3 items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-gray-700 rounded-xs"></span>
                            <span className="w-1 h-3 bg-gray-200 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">0.45%</span>
                        </div>
                        <div className="col-span-5 sm:col-span-3 text-right font-mono font-semibold text-gray-900">₹60,000.00</div>
                      </div>

                      {/* Properties */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-7 sm:col-span-6 flex items-center gap-1.5 font-medium text-gray-900 min-w-0">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Properties</span>
                        </div>
                        <div className="hidden sm:flex col-span-3 items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-cyan-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-300 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-200 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-100 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">56.26%</span>
                        </div>
                        <div className="col-span-5 sm:col-span-3 text-right font-mono font-semibold text-gray-900">₹75,00,000.00</div>
                      </div>

                      {/* Vehicles */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-7 sm:col-span-6 flex items-center gap-1.5 font-medium text-gray-900 min-w-0">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Vehicles</span>
                        </div>
                        <div className="hidden sm:flex col-span-3 items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-pink-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-pink-200 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">4.65%</span>
                        </div>
                        <div className="col-span-5 sm:col-span-3 text-right font-mono font-semibold text-gray-900">₹6,20,000.00</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Assistant Panel (5 cols) matching Image 2 */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
                
                {/* Assistant Top bar */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 text-xs font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700 font-semibold tracking-tight">
                        Don't trust OpenAI with your financial data!
                      </span>
                    </div>
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  {/* Chat Stream */}
                  <div className="space-y-3.5 overflow-y-auto max-h-[520px] pr-1">
                    
                    {/* Assistant Message 1 */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 p-[1.5px] shrink-0 mt-0.5">
                        <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center text-indigo-600 font-bold text-[11px]">
                          ✦
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-2xl rounded-tl-sm border border-gray-100">
                        I'm your financial assistant for <strong className="text-gray-900">Artha Finances</strong>. I help you understand and manage your financial data, including spending, income, account balances, and net worth. Want to check your recent transactions or get an overview of your finances?
                      </div>

                    </div>

                    {/* User Message 1 */}
                    <div className="flex justify-end">
                      <div className="text-xs text-gray-900 bg-gray-100 px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[85%] font-medium">
                        Yeah? Well when can I afford that car?
                      </div>
                    </div>

                    {/* Assistant Message 2 */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 p-[1.5px] shrink-0 mt-0.5">
                        <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center text-indigo-600 font-bold text-[11px]">
                          ✦
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-2xl rounded-tl-sm border border-gray-100 space-y-2">
                        <p>I can help estimate when you'd be able to afford a car! First, I'll need to know:</p>
                        <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                          <li>The approximate price of the car you're considering (or I can use an average, like ₹12,00,000).</li>
                          <li>How much you currently have saved for this goal (if any).</li>
                          <li>How much you save each month toward major purchases.</li>
                        </ol>
                        <p>Would you like to provide those details, or should I give a rough estimate based on typical prices and your recent financial trends?</p>
                      </div>
                    </div>

                    {/* User Message 2 */}
                    <div className="flex justify-end">
                      <div className="text-xs text-gray-900 bg-gray-100 px-3.5 py-2 rounded-2xl rounded-tr-sm font-medium">
                        Look at my finances first, buddy!
                      </div>
                    </div>

                    {/* Tool Calls Accordion */}
                    <div className="border border-blue-100 bg-blue-50/30 rounded-xl overflow-hidden text-xs">
                      <button 
                        onClick={() => setToolCallsOpen(!toolCallsOpen)}
                        className="w-full px-3 py-2 flex items-center justify-between text-gray-600 hover:text-gray-900 text-[11px] font-medium"
                      >
                        <div className="flex items-center gap-1.5 text-blue-700">
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolCallsOpen ? '' : '-rotate-90'}`} />
                          <span>Tool Calls</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">1 call executed</span>
                      </button>

                      {toolCallsOpen && (
                        <div className="p-2.5 pt-0 font-mono text-[11px] space-y-1 text-gray-600">
                          <div>
                            <span className="text-gray-400">Function: </span>
                            <span className="text-purple-600 font-medium">get_balance_sheet</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Arguments: </span>
                            <span className="text-gray-700">{'{}'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Assistant Message 3 (Final Answer) */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 p-[1.5px] shrink-0 mt-0.5">
                        <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center text-indigo-600 font-bold text-[11px]">
                          ✦
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3 rounded-2xl rounded-tl-sm border border-gray-100 space-y-2">
                        <p>
                          Your current net worth: <strong className="text-gray-900 font-mono">₹83,20,000.00</strong>
                        </p>
                        <div className="bg-white p-2 rounded-lg border border-gray-100 text-[11px] space-y-0.5 font-mono">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total assets:</span>
                            <span className="font-semibold text-gray-900">₹1,33,30,000.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total liabilities:</span>
                            <span className="font-semibold text-gray-900">₹50,10,000.00</span>
                          </div>
                        </div>
                        <p>
                          Do you want to estimate when you can afford a car (about ₹12,00,000), or would you like to see how much you can save each year first?
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Assistant Input Bar */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="border border-gray-200 rounded-xl p-2 bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                    <input 
                      type="text" 
                      placeholder="Ask anything ..." 
                      className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none px-1"
                      readOnly
                      defaultValue="How much can I safely invest each month?"
                    />
                    
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 text-gray-400">
                      <div className="flex items-center gap-2">
                        <button className="hover:text-gray-700 p-0.5"><Plus className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-gray-700 p-0.5"><Command className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-gray-700 p-0.5"><AtSign className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-gray-700 p-0.5"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /></button>
                      </div>
                      <button className="w-6 h-6 rounded-md bg-gray-900 hover:bg-black text-white flex items-center justify-center transition-colors">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-1.5 font-normal">
                    AI responses are informational only and are not financial advice.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
