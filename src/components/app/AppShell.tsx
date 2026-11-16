import React, { useMemo, useState } from 'react';
import {
  ChartColumnIncreasing,
  ChartPie,
  CircleHelp,
  Compass,
  CreditCard,
  LogOut,
  ReceiptText,
  type LucideIcon,
} from 'lucide-react';
import { AarthIcon, AarthWordmark } from '../landing/AarthLogo';
import { RainbowStrip } from '../landing/RainbowStrip';
import { useAppData } from './AppData';
import { EXPENSE_CATEGORY_KEYS } from './categories';
import { billBucket, currentMonth, spendByCategory } from '../../lib/finance';

export type Page = 'home' | 'transactions' | 'bills' | 'reports' | 'plan';

const NAV: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: ChartPie },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'bills', label: 'Bills', icon: ReceiptText },
  { id: 'reports', label: 'Reports', icon: ChartColumnIncreasing },
  { id: 'plan', label: 'Plan', icon: Compass },
];

const RING = 'shadow-[0_1px_2px_rgba(11,11,11,0.06),0_0_0_1px_rgba(11,11,11,0.05)]';

export const AppShell: React.FC<{
  page: Page;
  onNavigate: (p: Page) => void;
  email: string;
  onSignOut: () => void | Promise<void>;
  children: React.ReactNode;
}> = ({ page, onNavigate, email, onSignOut, children }) => {
  const initials = email.slice(0, 2).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);
  const { bills, transactions, budgets } = useAppData();

  // Purple dot = something needs attention: an overdue bill, or a category over budget this month.
  const attention = useMemo<Partial<Record<Page, boolean>>>(() => {
    const spend = spendByCategory(transactions, [currentMonth()]);
    return {
      bills: bills.some((b) => billBucket(b) === 'overdue'),
      plan: EXPENSE_CATEGORY_KEYS.some((k) => (budgets[k] ?? 0) > 0 && (spend[k] ?? 0) > (budgets[k] ?? 0)),
    };
  }, [bills, transactions, budgets]);

  return (
    <div className="min-h-dvh w-full flex bg-[#F7F7F7] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Desktop icon rail */}
      <aside className="hidden md:flex sticky top-0 h-dvh w-[88px] shrink-0 flex-col items-center justify-between border-r border-[#E7E7E7] bg-[#F7F7F7] py-5">
        <div className="w-full flex flex-col items-center">
          <AarthIcon className="w-9 h-9 mb-6" />
          <nav aria-label="Main" className="w-full flex flex-col gap-2">
            {NAV.map(({ id, label, icon: Icon }) => {
              const active = id === page;
              return (
                <div key={id} className="relative flex justify-center">
                  {active && <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#0B0B0B]" />}
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex w-[76px] flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors cursor-pointer ${
                      active ? `bg-white text-[#0B0B0B] ${RING}` : 'text-gray-500 hover:text-gray-900 hover:bg-white/70'
                    }`}
                  >
                    <span className="relative">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                      {attention[id] && (
                        <span aria-label="Needs attention" className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
                      )}
                    </span>
                    <span className="max-w-full truncate">{label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label="Help"
            title="Help"
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
          >
            <CircleHelp className="w-6 h-6" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            title={email}
            className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors"
          >
            {initials}
          </button>
          {menuOpen && (
            <>
              <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenuOpen(false)} />
              <div className={`absolute left-full bottom-0 ml-2 z-50 w-56 rounded-xl bg-white p-2 ${RING}`}>
                <p className="px-2 py-1.5 font-mono text-[11px] text-gray-500 truncate">{email}</p>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex w-full items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 w-full">
          <RainbowStrip />
          <div className="bg-[#f9f9f9]/90 backdrop-blur-md border-b border-black/[0.06] h-14 px-4 flex items-center justify-between">
            <AarthWordmark />
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-gray-700 bg-white rounded-lg shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] grid grid-cols-5 pb-[env(safe-area-inset-bottom,0px)]"
      >
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = id === page;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium cursor-pointer ${
                active ? 'text-[#0B0B0B]' : 'text-gray-400'
              }`}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {attention[id] && <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />}
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export const PageHeader: React.FC<{
  crumb: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ crumb, title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold mb-1">{crumb}</p>
      <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-gray-900">{title}</h1>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl shadow-[0_1px_2px_rgba(11,11,11,0.06),0_0_0_1px_rgba(11,11,11,0.05)] ${className}`}>{children}</div>
);