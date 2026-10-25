import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  RefreshCw, 
  Percent, 
  Banknote, 
  ShoppingCart, 
  Repeat,
  CheckSquare,
  Square,
  Zap
} from 'lucide-react';


export const TransactionsSection: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="transactions" className="w-full max-w-[1140px] mx-auto px-4 py-16 md:py-24">
      
      {/* Title matching Image 4 */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-medium tracking-[-0.05em] text-gray-900 leading-[1.08] mb-3">
          Transactions <br />
          <span className="text-gray-400 font-normal">handled your way</span>
        </h2>
      </div>

      {/* Floating Transactions Card (Image 4) */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-black/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] p-4 sm:p-6 mb-16 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search transaction by merchant, category or amount" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              readOnly
              value=""
            />
          </div>

          <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span>Filter</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[680px]">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <div className="col-span-1 flex items-center">
                <Square className="w-4 h-4 text-gray-300" />
              </div>
              <div className="col-span-5">Transaction</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Account</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* Date Group 1: March 8, 2025 */}
            <div className="mt-4">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50/60 rounded-lg text-xs font-mono text-gray-500 mb-1">
                <span className="font-semibold tracking-wider text-[11px]">MARCH 8, 2025 · 2</span>
                <span className="font-semibold text-gray-700">+$6,001.42</span>
              </div>

              {/* Row 1: Interest Payment */}
              <div 
                onClick={() => toggleSelect(1)}
                className={`grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-sm hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer ${selectedRows.includes(1) ? 'bg-emerald-50/40' : ''}`}
              >
                <div className="col-span-1 flex items-center">
                  {selectedRows.includes(1) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1170cf] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Interest Payment</span>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    <Percent className="w-3 h-3 text-emerald-600" />
                    <span>Interest</span>
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                  <div className="w-4 h-4 rounded-full bg-[#1170cf] shrink-0"></div>
                  <span>Savings •••• 3432</span>
                </div>

                <div className="col-span-2 text-right font-mono font-semibold text-emerald-600">
                  +$1.42
                </div>
              </div>

              {/* Row 2: Incoming from Acme Ltd */}
              <div 
                onClick={() => toggleSelect(2)}
                className={`grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-sm hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer ${selectedRows.includes(2) ? 'bg-emerald-50/40' : ''}`}
              >
                <div className="col-span-1 flex items-center">
                  {selectedRows.includes(2) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
                    I
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900">Incoming from Acme Ltd</span>
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                    <Banknote className="w-3 h-3 text-amber-600" />
                    <span>Payroll</span>
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                  <div className="w-4 h-4 rounded-full bg-red-600 shrink-0"></div>
                  <span>Savings •••• 1566</span>
                </div>

                <div className="col-span-2 text-right font-mono font-semibold text-emerald-600">
                  +$6,000.00
                </div>
              </div>
            </div>

            {/* Date Group 2: March 5, 2025 */}
            <div className="mt-4">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50/60 rounded-lg text-xs font-mono text-gray-500 mb-1">
                <span className="font-semibold tracking-wider text-[11px]">MARCH 5, 2025 · 2</span>
                <span className="font-semibold text-gray-700">$124.43</span>
              </div>

              {/* Row 3: Amazon Order */}
              <div 
                onClick={() => toggleSelect(3)}
                className={`grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-sm hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer ${selectedRows.includes(3) ? 'bg-emerald-50/40' : ''}`}
              >
                <div className="col-span-1 flex items-center">
                  {selectedRows.includes(3) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shrink-0">
                    <span className="font-sans text-xs">a</span>
                  </div>
                  <span className="font-medium text-gray-900">Amazon Order</span>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/50">
                    <ShoppingCart className="w-3 h-3 text-blue-600" />
                    <span>Shopping</span>
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                  <div className="w-4 h-4 rounded-full bg-[#1170cf] shrink-0"></div>
                  <span>Savings •••• 2244</span>
                </div>

                <div className="col-span-2 text-right font-mono font-semibold text-gray-900">
                  -$111.44
                </div>
              </div>

              {/* Row 4: Spotify Subscription */}
              <div 
                onClick={() => toggleSelect(4)}
                className={`grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-sm hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer ${selectedRows.includes(4) ? 'bg-emerald-50/40' : ''}`}
              >
                <div className="col-span-1 flex items-center">
                  {selectedRows.includes(4) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-xs shrink-0">
                    <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.502 9.722 1.113.294.18.386.562.207.857zm1.226-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.632-1.102 8.147-.568 11.235 1.332.366.226.482.707.257 1.072zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-.99-.12-1.14-.613-.15-.494.12-.99.613-1.14 3.54-1.074 9.435-.873 13.17 1.344.44.262.585.833.323 1.273-.262.44-.833.585-1.273.323z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900">Spotify Annual Subscription</span>
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200/50">
                    <Repeat className="w-3 h-3 text-pink-600" />
                    <span>Subscription</span>
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                  <div className="w-4 h-4 rounded-full bg-red-600 shrink-0"></div>
                  <span>Checking •••• 2441</span>
                </div>

                <div className="col-span-2 text-right font-mono font-semibold text-gray-900">
                  -$12.99
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3 Feature Grid Cards below Transactions Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 border border-gray-200/70 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-gray-300 transition-colors">
            <div className="w-full max-w-[220px] bg-white rounded-xl shadow-xs border border-gray-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">✓</div>
                <div className="h-2 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded"></div>
              <div className="h-1.5 w-3/4 bg-gray-100 rounded"></div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">Stay on top of every transaction</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Easily track and organize your spending — add details, link transfers, and keep all accounts synchronized in real time.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 border border-gray-200/70 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-gray-300 transition-colors">
            <div className="w-full max-w-[220px] bg-white rounded-xl shadow-xs border border-gray-100 p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-1 border-b border-gray-100">
                <span className="font-medium text-gray-700">Filters Active</span>
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">3</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-700 font-mono">Date: 2025</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] text-blue-700 font-mono">&gt; $100</span>
              </div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">Find exactly what you need, instantly</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Filter transactions by date, account, category, merchant, amount, and tags to get instant and precise results.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col gap-3 group">
          <div className="h-48 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 border border-gray-200/70 p-4 flex items-center justify-center relative overflow-hidden group-hover:border-gray-300 transition-colors">
            <div className="w-full max-w-[220px] bg-white rounded-xl shadow-xs border border-gray-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-gray-800">Auto-Rules</span>
              </div>
              <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 font-mono">
                IF merchant matches "Spotify" THEN category = "Subscription"
              </div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 text-lg">Automate your transactions, your way</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Create powerful rules to automatically clean names, categorize expenses, and split transactions without manual effort.
          </p>
        </div>

      </div>

    </section>
  );
};
