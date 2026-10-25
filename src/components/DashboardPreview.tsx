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
        <div className="flex flex-col md:flex-row min-h-[780px]">
          
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
                <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
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
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[440px] h-[270px] relative">
                      <svg viewBox="0 0 520 260" className="w-full h-full text-xs font-mono select-none">
                        <defs>
                          {/* Flow Gradients */}
                          <linearGradient id="flow-salary" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.45" />
                          </linearGradient>
                          <linearGradient id="flow-freelance" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.45" />
                          </linearGradient>
                          <linearGradient id="flow-uncat-in" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#64748b" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.45" />
                          </linearGradient>
                          <linearGradient id="flow-housing" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="flow-food" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="flow-transport" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="flow-entertainment" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="flow-surplus" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.55" />
                          </linearGradient>
                        </defs>

                        {/* --- INCOMING FLOWS (Left to Center) --- */}
                        {/* Salary to Central Node */}
                        <path d="M 75 90 C 130 90, 150 115, 205 115 L 205 165 C 150 165, 130 125, 75 125 Z" fill="url(#flow-salary)" />
                        {/* Freelance */}
                        <path d="M 75 133 C 130 133, 150 165, 205 165 L 205 174 C 150 174, 130 142, 75 142 Z" fill="url(#flow-freelance)" />
                        {/* Uncategorized */}
                        <path d="M 75 165 C 130 165, 150 175, 205 175 L 205 205 C 150 205, 130 195, 75 195 Z" fill="url(#flow-uncat-in)" />

                        {/* --- OUTGOING FLOWS (Center to Right) --- */}
                        {/* Housing */}
                        <path d="M 215 110 C 265 110, 290 35, 345 35 L 345 52 C 290 52, 265 125, 215 125 Z" fill="url(#flow-housing)" />
                        {/* Food */}
                        <path d="M 215 125 C 265 125, 290 60, 345 60 L 345 68 C 290 68, 265 133, 215 133 Z" fill="url(#flow-food)" />
                        {/* Transportation */}
                        <path d="M 215 133 C 265 133, 290 76, 345 76 L 345 83 C 290 83, 265 140, 215 140 Z" fill="url(#flow-transport)" />
                        {/* Entertainment */}
                        <path d="M 215 140 C 265 140, 290 92, 345 92 L 345 98 C 290 98, 265 146, 215 146 Z" fill="url(#flow-entertainment)" />
                        {/* Multiple subtle expense ribbons */}
                        <path d="M 215 146 C 270 146, 295 120, 345 120 L 345 155 C 295 155, 270 180, 215 180 Z" fill="#94a3b8" opacity="0.3" />
                        {/* Surplus flow */}
                        <path d="M 215 180 C 265 180, 290 220, 345 220 L 345 238 C 290 238, 265 205, 215 205 Z" fill="url(#flow-surplus)" />

                        {/* --- LEFT NODES (Labels + Bars) --- */}
                        {/* Salary */}
                        <rect x="68" y="90" width="7" height="35" rx="2" fill="#22c55e" />
                        <text x="60" y="102" textAnchor="end" className="text-[10px] font-sans fill-gray-900 font-medium">Salary</text>
                        <text x="60" y="115" textAnchor="end" className="text-[9px] fill-gray-400 font-mono">$17,248.00</text>

                        {/* Freelance */}
                        <rect x="68" y="133" width="7" height="9" rx="2" fill="#22c55e" />
                        <text x="60" y="138" textAnchor="end" className="text-[9px] font-sans fill-gray-900 font-medium">Freelance</text>
                        <text x="60" y="148" textAnchor="end" className="text-[8px] fill-gray-400 font-mono">$1,419.00</text>

                        {/* Uncategorized In */}
                        <rect x="68" y="165" width="7" height="30" rx="2" fill="#64748b" />
                        <text x="60" y="177" textAnchor="end" className="text-[9px] font-sans fill-gray-900 font-medium">Uncategorized</text>
                        <text x="60" y="188" textAnchor="end" className="text-[8px] fill-gray-400 font-mono">$10,834.00</text>

                        {/* --- CENTER JUNCTION NODE --- */}
                        <rect x="205" y="105" width="10" height="100" rx="2" fill="#22c55e" />
                        <text x="210" y="218" textAnchor="middle" className="text-[9px] font-sans fill-gray-900 font-semibold">Cash Flow</text>
                        <text x="210" y="228" textAnchor="middle" className="text-[8px] fill-gray-400 font-mono">$29,501.00</text>

                        {/* --- RIGHT DESTINATION NODES --- */}
                        {/* Housing */}
                        <rect x="345" y="35" width="6" height="17" rx="1.5" fill="#b91c1c" />
                        <text x="358" y="42" className="text-[9px] font-sans fill-gray-900 font-medium">Housing</text>
                        <text x="358" y="51" className="text-[8px] fill-gray-400 font-mono">$9,559.00</text>

                        {/* Food & Dining */}
                        <rect x="345" y="60" width="6" height="8" rx="1" fill="#f97316" />
                        <text x="358" y="66" className="text-[8px] font-sans fill-gray-900 font-medium">Food & Dining</text>
                        <text x="358" y="74" className="text-[7.5px] fill-gray-400 font-mono">$761.00</text>

                        {/* Transportation */}
                        <rect x="345" y="78" width="6" height="6" rx="1" fill="#3b82f6" />
                        <text x="358" y="83" className="text-[8px] font-sans fill-gray-900 font-medium">Transportation</text>
                        <text x="358" y="90" className="text-[7.5px] fill-gray-400 font-mono">$555.00</text>

                        {/* Entertainment */}
                        <rect x="345" y="94" width="6" height="5" rx="1" fill="#8b5cf6" />
                        <text x="358" y="99" className="text-[8px] font-sans fill-gray-900 font-medium">Entertainment</text>
                        <text x="358" y="106" className="text-[7.5px] fill-gray-400 font-mono">$445.00</text>

                        {/* Others */}
                        <text x="358" y="125" className="text-[8px] font-sans fill-gray-700">Shopping / Travel / Care</text>
                        <text x="358" y="134" className="text-[7.5px] fill-gray-400 font-mono">$1,221.00</text>

                        <rect x="345" y="148" width="6" height="24" rx="1.5" fill="#64748b" />
                        <text x="358" y="156" className="text-[8px] font-sans fill-gray-900 font-medium">Uncategorized</text>
                        <text x="358" y="165" className="text-[7.5px] fill-gray-400 font-mono">$10,034.00</text>

                        {/* Surplus */}
                        <rect x="345" y="215" width="6" height="20" rx="1.5" fill="#10b981" />
                        <text x="358" y="224" className="text-[9px] font-sans fill-emerald-700 font-semibold">Surplus</text>
                        <text x="358" y="233" className="text-[8px] fill-emerald-600 font-mono font-medium">$6,810.00</text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. Assets Card ($811,067) */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-semibold text-gray-900 text-base">Assets</h3>
                      <span className="text-gray-400 font-mono text-sm">· $811,067</span>
                    </div>
                  </div>

                  {/* Segmented bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex gap-1 mb-3 bg-gray-100">
                    <div className="h-full bg-purple-500 rounded-sm" style={{ width: '19%' }}></div>
                    <div className="h-full bg-blue-500 rounded-sm" style={{ width: '34%' }}></div>
                    <div className="h-full bg-gray-700 rounded-sm" style={{ width: '1%' }}></div>
                    <div className="h-full bg-cyan-400 rounded-sm" style={{ width: '43%' }}></div>
                    <div className="h-full bg-pink-400 rounded-sm" style={{ width: '3%' }}></div>
                  </div>

                  {/* Asset Legend Pills */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Cash <strong className="text-gray-900 font-mono">19%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Investments <strong className="text-gray-900 font-mono">34%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                      <span>Crypto <strong className="text-gray-900 font-mono">0%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>Properties <strong className="text-gray-900 font-mono">43%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                      <span>Vehicles <strong className="text-gray-900 font-mono">3%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Other Assets <strong className="text-gray-900 font-mono">0%</strong></span>
                    </div>
                  </div>

                  {/* Assets Table */}
                  <div className="w-full text-xs">
                    <div className="grid grid-cols-12 text-[10px] uppercase font-mono text-gray-400 tracking-wider pb-2 border-b border-gray-100">
                      <div className="col-span-6 font-medium">Name</div>
                      <div className="col-span-3 font-medium">Weight</div>
                      <div className="col-span-3 text-right font-medium">Value</div>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {/* Cash */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-6 flex items-center gap-1.5 font-medium text-gray-900">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Cash</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-purple-500 rounded-xs"></span>
                            <span className="w-1 h-3 bg-purple-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-purple-100 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">19.08%</span>
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-gray-900">$154,736.00</div>
                      </div>

                      {/* Investments */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-6 flex items-center gap-1.5 font-medium text-gray-900">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Investments</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-blue-500 rounded-xs"></span>
                            <span className="w-1 h-3 bg-blue-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-blue-300 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">34.32%</span>
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-gray-900">$278,330.76</div>
                      </div>

                      {/* Crypto */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-6 flex items-center gap-1.5 font-medium text-gray-900">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Crypto</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-gray-700 rounded-xs"></span>
                            <span className="w-1 h-3 bg-gray-200 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">0.43%</span>
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-gray-900">$3,500.00</div>
                      </div>

                      {/* Properties */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-6 flex items-center gap-1.5 font-medium text-gray-900">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Properties</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-cyan-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-300 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-200 rounded-xs"></span>
                            <span className="w-1 h-3 bg-cyan-100 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">43.15%</span>
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-gray-900">$350,000.00</div>
                      </div>

                      {/* Vehicles */}
                      <div className="grid grid-cols-12 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                        <div className="col-span-6 flex items-center gap-1.5 font-medium text-gray-900">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          <span>Vehicles</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-pink-400 rounded-xs"></span>
                            <span className="w-1 h-3 bg-pink-200 rounded-xs"></span>
                          </div>
                          <span className="font-mono text-gray-700 font-medium">2.77%</span>
                        </div>
                        <div className="col-span-3 text-right font-mono font-semibold text-gray-900">$22,500.00</div>
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
                        Yeah? Well when can I afford that Ferrari?
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
                        <p>I can help estimate when you'd be able to afford a Ferrari! First, I'll need to know:</p>
                        <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                          <li>The approximate price of the Ferrari you're considering (or I can use an average, like $250,000).</li>
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
                          Your current net worth: <strong className="text-gray-900 font-mono">$560,196.76</strong>
                        </p>
                        <div className="bg-white p-2 rounded-lg border border-gray-100 text-[11px] space-y-0.5 font-mono">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total assets:</span>
                            <span className="font-semibold text-gray-900">$811,066.76</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total liabilities:</span>
                            <span className="font-semibold text-gray-900">$250,870.00</span>
                          </div>
                        </div>
                        <p>
                          Do you want to estimate when you can afford a Ferrari (about $250,000), or would you like to see how much you can save each year first?
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
