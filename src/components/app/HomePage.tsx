import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import { useAppData } from './AppData';
import { Card, PageHeader, type Page } from './AppShell';
import { CATEGORIES, CategoryTile } from './categories';
import { primaryBtn } from './Modal';
import {
  accountBalance,
  netWorthSeries,
  netWorthSummary,
  billBucket,
  daysUntil,
  dayOffset,
  dueLabel,
  formatDay,
  formatINR,
  formatSignedINR,
  inLastDays,
  sortByDateDesc,
  sumBy,
  type CategoryKey,
} from '../../lib/finance';


const Sparkline: React.FC<{ points: number[] }> = ({ points }) => {
  const w = 220;
  const h = 56;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  const y = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${y(p).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" role="img" aria-label="Net worth trend, rising">
      <defs>
        <linearGradient id="nw-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill="url(#nw-fill)" />
      <path d={line} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Stat: React.FC<{ label: string; value: string; hint?: string; icon: React.ReactNode; tone?: string }> = ({
  label,
  value,
  hint,
  icon,
  tone = 'text-gray-900',
}) => (
  <Card className="p-4 sm:p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">{label}</span>
      <span className="text-gray-400">{icon}</span>
    </div>
    <p className={`font-mono text-xl sm:text-2xl font-semibold tracking-tight ${tone}`}>{value}</p>
    {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
  </Card>
);

export const HomePage: React.FC<{ name: string; onNavigate: (p: Page) => void; onAdd: () => void; onAddAccount: () => void }> = ({
  name,
  onNavigate,
  onAdd,
  onAddAccount,
}) => {
  const { transactions, bills, accounts } = useAppData();

  const m = useMemo(() => {
    const recent = inLastDays(transactions, 30);
    const income = sumBy(recent, (t) => t.amount > 0);
    const expenses = -sumBy(recent, (t) => t.amount < 0);
    const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0;

    // Spending by category (expenses only), largest first.
    const byCat = new Map<CategoryKey, number>();
    for (const t of recent) if (t.amount < 0) byCat.set(t.category, (byCat.get(t.category) ?? 0) + -t.amount);
    const categories = [...byCat.entries()].sort((a, b) => b[1] - a[1]);

    // Daily spend, oldest -> newest, 30 buckets.
    const daily = Array.from({ length: 30 }, (_, i) => {
      const date = dayOffset(i - 29);
      return { date, spend: -sumBy(recent, (t) => t.date === date && t.amount < 0 && t.category !== 'housing') };
    });

    return { income, expenses, savingsRate, categories, daily };
  }, [transactions]);

  const upcoming = useMemo(
    () =>
      bills
        .filter((b) => b.status === 'unpaid')
        .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
        .slice(0, 4),
    [bills],
  );
  const nw = useMemo(() => netWorthSummary(accounts, transactions), [accounts, transactions]);
  const series = useMemo(() => netWorthSeries(accounts, transactions, 30), [accounts, transactions]);
  const nwChange = series[0].value ? ((nw.net - series[0].value) / Math.abs(series[0].value)) * 100 : 0;
  const recent = useMemo(() => sortByDateDesc(transactions).slice(0, 6), [transactions]);
  const maxDaily = Math.max(...m.daily.map((d) => d.spend), 1);

  return (
    <>
      <PageHeader
        crumb="Home / Dashboard"
        title={`Welcome back, ${name}`}
        subtitle="Here's what's happening with your finances"
        action={
          <button type="button" onClick={onAdd} className={primaryBtn}>
            <Plus className="w-3.5 h-3.5" />
            New transaction
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Net worth */}
        <Card className="lg:col-span-5 p-4 sm:p-5">
          <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">Net worth</span>
          <p className="font-mono text-3xl font-semibold tracking-tight text-gray-900 mt-2">
            {formatINR(nw.net)}
          </p>
          <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${nwChange >= 0 ? 'text-[#078C52]' : 'text-[#F13636]'}`}>
            <TrendingUp className="w-3.5 h-3.5" /> {nwChange >= 0 ? '+' : ''}{nwChange.toFixed(1)}% over 30 days
          </p>
          <div className="mt-3">
            <Sparkline points={series.map((p) => p.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[11px] text-gray-400">Total assets</p>
              <p className="font-mono text-sm font-semibold text-gray-900">{formatINR(nw.assets)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Total liabilities</p>
              <p className="font-mono text-sm font-semibold text-gray-900">{formatINR(nw.liabilities)}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-7 grid grid-cols-1 min-[480px]:grid-cols-3 gap-5">
          <Stat label="Income · 30D" value={formatINR(m.income)} icon={<ArrowDownLeft className="w-4 h-4 text-emerald-500" />} tone="text-[#078C52]" />
          <Stat label="Spent · 30D" value={formatINR(m.expenses)} icon={<ArrowUpRight className="w-4 h-4 text-red-500" />} />
          <Stat
            label="Savings rate"
            value={`${m.savingsRate}%`}
            hint={`${formatINR(Math.max(0, m.income - m.expenses))} kept`}
            icon={<PiggyBank className="w-4 h-4" />}
          />

          {/* Daily spending */}
          <Card className="min-[480px]:col-span-3 p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-base">Daily spending</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Excl. housing · 30 days</span>
            </div>
            <div className="flex items-end gap-[3px] h-24" role="img" aria-label="Bar chart of daily spending for the last 30 days">
              {m.daily.map((d) => (
                <div
                  key={d.date}
                  title={`${formatDay(d.date)}: ${formatINR(d.spend)}`}
                  className={`flex-1 rounded-sm ${d.spend > 0 ? 'bg-[#12B76A]/80 hover:bg-emerald-600' : 'bg-gray-100'} transition-colors`}
                  style={{ height: `${Math.max(4, (d.spend / maxDaily) * 100)}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-2">
              <span>{formatDay(m.daily[0].date)}</span>
              <span>Today</span>
            </div>
          </Card>
        </div>

        {/* Accounts */}
        <Card className="lg:col-span-12 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 text-base">Accounts</h2>
            <button type="button" onClick={onAddAccount} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-950 bg-white border border-gray-300 rounded-lg px-3 h-8 shadow-xs cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add account
            </button>
          </div>
          {accounts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-gray-900">No accounts yet</p>
              <p className="text-xs text-gray-400 mt-1">Add a bank account, card, loan or cash wallet to start tracking your net worth.</p>
            </div>
          ) : (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
            {(['asset', 'liability'] as const).map((kind) => (
              <div key={kind}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {kind === 'asset' ? 'Assets' : 'Liabilities'}
                </p>
                {accounts.filter((a) => a.kind === kind).map((a) => (
                  <div key={a.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{a.name}</p>
                      <p className="text-[11px] text-gray-400">{a.type}</p>
                    </div>
                    <span className="font-mono font-semibold text-gray-900">{formatINR(accountBalance(a, transactions))}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          )}
        </Card>

        {/* Spending by category */}
        <Card className="lg:col-span-5 p-4 sm:p-5">
          <h2 className="font-semibold text-gray-900 text-base mb-3">Where it went</h2>
          {m.categories.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No spending in the last 30 days.</p>
          ) : (
            <>
              <div className="w-full h-2 rounded-full overflow-hidden flex gap-0.5 mb-4 bg-gray-100">
                {m.categories.map(([k, v]) => (
                  <div key={k} className={`h-full ${CATEGORIES[k].dot}`} style={{ width: `${(v / m.expenses) * 100}%` }} />
                ))}
              </div>
              <ul className="space-y-2.5">
                {m.categories.slice(0, 6).map(([k, v]) => (
                  <li key={k} className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${CATEGORIES[k].dot}`} />
                    <span className="text-gray-700 flex-1 truncate">{CATEGORIES[k].label}</span>
                    <span className="font-mono text-[11px] text-gray-400">{Math.round((v / m.expenses) * 100)}%</span>
                    <span className="font-mono text-xs font-semibold text-gray-900 w-24 text-right">{formatINR(v)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        {/* Upcoming bills */}
        <Card className="lg:col-span-7 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900 text-base">Upcoming bills</h2>
            <button type="button" onClick={() => onNavigate('bills')} className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-0.5 cursor-pointer">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">You're all caught up 🎉</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {upcoming.map((b) => (
                <li key={b.id} className="flex items-center gap-3 py-2.5">
                  <CategoryTile category={b.category} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.name}</p>
                    <p className={`text-xs ${billBucket(b) === 'overdue' ? 'text-[#F13636] font-medium' : 'text-gray-400'}`}>
                      {dueLabel(b)}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-gray-900">{formatINR(b.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent transactions */}
        <Card className="lg:col-span-12 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900 text-base">Recent transactions</h2>
            <button type="button" onClick={() => onNavigate('transactions')} className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-0.5 cursor-pointer">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {recent.length === 0 && <p className="text-sm text-gray-400 py-6 text-center">No transactions yet. Use “New transaction” to add your first one.</p>}
          <ul className="divide-y divide-gray-50">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <CategoryTile category={t.category} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {formatDay(t.date)} · {CATEGORIES[t.category].label}
                  </p>
                </div>
                <span className={`font-mono text-sm font-semibold ${t.amount > 0 ? 'text-[#078C52]' : 'text-gray-900'}`}>
                  {formatSignedINR(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
};
