import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';
import { useAppData } from './AppData';
import { Card, PageHeader } from './AppShell';
import { CATEGORIES, CATEGORY_HEX, CategoryTile, EXPENSE_CATEGORY_KEYS } from './categories';
import {
  currentMonth, formatINR, isExpense, monthLabel, monthOf, shiftMonth, spendByCategory, type Transaction,
} from '../../lib/finance';

type PeriodType = 'monthly' | 'quarterly' | 'ytd' | 'last6';

const PERIODS: { id: PeriodType; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'ytd', label: 'Year to Date' },
  { id: 'last6', label: 'Last 6 Months' },
];

const range = (end: string, n: number) => Array.from({ length: n }, (_, i) => shiftMonth(end, i - n + 1));

/** Months in the selected period and the equally long period before it. */
const periodMonths = (type: PeriodType, offset: number) => {
  const now = currentMonth();
  if (type === 'monthly') return { cur: [shiftMonth(now, offset)], prev: [shiftMonth(now, offset - 1)] };
  if (type === 'quarterly') {
    const end = shiftMonth(now, offset * 3);
    return { cur: range(end, 3), prev: range(shiftMonth(end, -3), 3) };
  }
  if (type === 'ytd') {
    const n = Number(now.slice(5));
    const cur = range(now, n);
    return { cur, prev: cur.map((m) => shiftMonth(m, -12)) };
  }
  return { cur: range(now, 6), prev: range(shiftMonth(now, -6), 6) };
};

const totals = (list: Transaction[], months: string[]) => {
  const rows = list.filter((t) => months.includes(monthOf(t.date)));
  const income = rows.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expenses = rows.filter(isExpense).reduce((a, t) => a - t.amount, 0);
  return { rows, income, expenses, net: income - expenses };
};

const Delta: React.FC<{ now: number; before: number; goodWhenUp: boolean }> = ({ now, before, goodWhenUp }) => {
  if (!before) return <span className="text-xs text-gray-400">no prior data</span>;
  const pct = ((now - before) / before) * 100;
  const good = pct === 0 || pct > 0 === goodWhenUp;
  return (
    <span className={`text-xs font-medium ${good ? 'text-emerald-700' : 'text-red-600'}`}>
      {pct > 0 ? '+' : ''}{pct.toFixed(0)}% vs previous period
    </span>
  );
};

export const ReportsPage: React.FC = () => {
  const { transactions, budgets } = useAppData();
  const [type, setType] = useState<PeriodType>('monthly');
  const [offset, setOffset] = useState(0);

  const { cur, prev } = useMemo(() => periodMonths(type, offset), [type, offset]);
  const now = useMemo(() => totals(transactions, cur), [transactions, cur]);
  const before = useMemo(() => totals(transactions, prev), [transactions, prev]);
  const byCat = spendByCategory(transactions, cur);
  const byCatPrev = spendByCategory(transactions, prev);
  const ranked = EXPENSE_CATEGORY_KEYS.filter((k) => (byCat[k] ?? 0) > 0).sort((a, b) => (byCat[b] ?? 0) - (byCat[a] ?? 0));
  const navigable = type === 'monthly' || type === 'quarterly';

  const perf = EXPENSE_CATEGORY_KEYS.filter((k) => (budgets[k] ?? 0) > 0).map((k) => {
    const limit = (budgets[k] ?? 0) * cur.length;
    const used = byCat[k] ?? 0;
    const ratio = used / limit;
    return { k, limit, used, status: ratio > 1 ? 'over' : ratio >= 0.8 ? 'warning' : 'good' } as const;
  });
  const pill = { good: 'bg-emerald-50 text-emerald-700', warning: 'bg-amber-50 text-amber-700', over: 'bg-red-50 text-red-700' };

  const exportCsv = () => {
    const rows = [['Date', 'Name', 'Category', 'Account', 'Amount'], ...now.rows.map((t) => [t.date, t.name, CATEGORIES[t.category].label, t.account, String(t.amount)])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `artha-report-${cur[0]}-to-${cur[cur.length - 1]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const iconBtn = 'p-2 bg-white border border-gray-200 rounded-xl shadow-xs text-gray-600 hover:text-gray-900 disabled:opacity-30 cursor-pointer';
  const label = 'font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold';

  return (
    <>
      <PageHeader
        crumb="Reports"
        title="Reports"
        subtitle={`Showing data from ${monthLabel(cur[0])} to ${monthLabel(cur[cur.length - 1])}`}
        action={
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-xs overflow-x-auto" role="group" aria-label="Report period">
              {PERIODS.map((p) => (
                <button key={p.id} type="button" aria-pressed={type === p.id} onClick={() => { setType(p.id); setOffset(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${type === p.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            {navigable && (
              <>
                <button type="button" className={iconBtn} aria-label="Previous period" onClick={() => setOffset(offset - 1)}><ChevronLeft className="w-4 h-4" /></button>
                <button type="button" className={iconBtn} aria-label="Next period" disabled={offset >= 0} onClick={() => setOffset(offset + 1)}><ChevronRight className="w-4 h-4" /></button>
              </>
            )}
            <button type="button" className={iconBtn} aria-label="Export CSV" title="Export CSV" onClick={exportCsv}><Download className="w-4 h-4" /></button>
            <button type="button" className={iconBtn} aria-label="Print report" title="Print report" onClick={() => window.print()}><Printer className="w-4 h-4" /></button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {[
          { l: 'Income', v: now.income, b: before.income, up: true, tone: 'text-emerald-700' },
          { l: 'Expenses', v: now.expenses, b: before.expenses, up: false, tone: 'text-gray-900' },
          { l: 'Net savings', v: now.net, b: before.net, up: true, tone: now.net >= 0 ? 'text-emerald-700' : 'text-red-600' },
        ].map((s) => (
          <Card key={s.l} className="p-4 sm:p-5">
            <p className={`${label} mb-2`}>{s.l}</p>
            <p className={`text-xl sm:text-2xl font-semibold tabular-nums ${s.tone}`}>{formatINR(s.v)}</p>
            <div className="mt-1"><Delta now={s.v} before={s.b} goodWhenUp={s.up} /></div>
          </Card>
        ))}
      </div>

      {perf.length > 0 && (
        <Card className="p-5 mb-4">
          <p className={`${label} mb-4`}>Budget performance</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {perf.map(({ k, limit, used, status }) => (
              <div key={k} className="flex items-center gap-3">
                <CategoryTile category={k} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-gray-900 truncate">{CATEGORIES[k].label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${pill[status]}`}>{status === 'good' ? 'On track' : status === 'warning' ? 'Close' : 'Over'}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (used / limit) * 100)}%`, background: status === 'over' ? '#ef4444' : CATEGORY_HEX[k] }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 tabular-nums">{formatINR(used)} of {formatINR(limit)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <p className={`${label} mb-4`}>Spending breakdown</p>
        {ranked.length === 0 && <p className="text-sm text-gray-500">No spending in this period.</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="font-medium pb-2">Category</th>
                <th className="font-medium pb-2 text-right">Amount</th>
                <th className="font-medium pb-2 text-right">Share</th>
                <th className="font-medium pb-2 text-right">vs previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ranked.map((k) => {
                const v = byCat[k] ?? 0;
                const p = byCatPrev[k] ?? 0;
                const diff = p ? ((v - p) / p) * 100 : null;
                return (
                  <tr key={k}>
                    <td className="py-2.5"><span className="inline-flex items-center gap-2 text-gray-900"><i className="w-2 h-2 rounded-full" style={{ background: CATEGORY_HEX[k] }} />{CATEGORIES[k].label}</span></td>
                    <td className="py-2.5 text-right tabular-nums">{formatINR(v)}</td>
                    <td className="py-2.5 text-right tabular-nums text-gray-500">{now.expenses ? ((v / now.expenses) * 100).toFixed(0) : 0}%</td>
                    <td className={`py-2.5 text-right tabular-nums ${diff === null ? 'text-gray-400' : diff > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {diff === null ? '—' : `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
