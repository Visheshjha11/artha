import React from 'react';
import { CalendarClock, CreditCard, House, LogOut, type LucideIcon } from 'lucide-react';
import { AarthIcon, AarthWordmark } from '../landing/AarthLogo';
import { RainbowStrip } from '../landing/RainbowStrip';

export type Page = 'home' | 'transactions' | 'bills';

const NAV: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'bills', label: 'Bills', icon: CalendarClock },
];

export const AppShell: React.FC<{
  page: Page;
  onNavigate: (p: Page) => void;
  email: string;
  onSignOut: () => void | Promise<void>;
  children: React.ReactNode;
}> = ({ page, onNavigate, email, onSignOut, children }) => {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-dvh w-full flex bg-[#F9F9F9] text-[#1a1a1a] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex sticky top-0 h-dvh w-60 shrink-0 flex-col justify-between border-r border-black/[0.06] bg-[#FAFAFA] px-3 py-5">
        <div>
          <div className="px-2 mb-6 flex items-center gap-2.5">
            <AarthIcon className="w-8 h-8" />
            <AarthWordmark />
          </div>
          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV.map(({ id, label, icon: Icon }) => {
              const active = id === page;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-gray-900 border border-gray-200/90 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/70 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="px-3 font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">
            Sample data · not saved
          </p>
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
              {initials}
            </div>
            <span className="truncate font-mono text-[11px] text-gray-500 min-w-0 flex-1">{email}</span>
            <button
              type="button"
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
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
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-xs cursor-pointer"
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
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] grid grid-cols-3 pb-[env(safe-area-inset-bottom,0px)]"
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
                active ? 'text-emerald-700' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
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
  <div className={`bg-white rounded-2xl border border-gray-200/80 shadow-xs ${className}`}>{children}</div>
);
