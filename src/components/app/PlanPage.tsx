import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useAppData } from './AppData';
import { Card, PageHeader } from './AppShell';
import { GoalsCard } from './GoalsCard';
import { CATEGORIES, CATEGORY_HEX, CategoryTile, EXPENSE_CATEGORY_KEYS } from './categories';
import { currentMonth, formatINR, monthLabel, shiftMonth, spendByCategory, type CategoryKey } from '../../lib/finance';

const Donut: React.FC<{ spent: number; budget: number; parts: { key: CategoryKey; value: number }[] }> = ({ spent, budget, parts }) => {
  const r = 70;
  const c = 2 * Math.PI * r;
  const total = Math.max(budget, spent) || 1;
  let offset = 0;
  const over = spent > budget;
  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90" role="img" aria-label="Budget used">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#f3f4f6" strokeWidth="16" />
        {parts.map((p) => {
          const len = (p.value / total) * c;
          const el = (
            <circle key={p.key} cx="90" cy="90" r={r} fill="none" stroke={CATEGORY_HEX[p.key]} strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">{over ? 'Over by' : 'Left'}</span>
        <span className={`text-2xl font-semibold tabular-nums ${over ? 'text-[#F13636]' : 'text-gray-900'}`}>
          {formatINR(Math.abs(budget - spent))}
        </span>
        <span className="text-xs text-gray-500">of {formatINR(budget)}</span>
      </div>
    </div>
  );
};

export const PlanPage: React.FC = () => {
  const { transactions, budgets, setBudget } = useAppData();
  const [month, setMonth] = useState(currentMonth());
  const [editing, setEditing] = useState<CategoryKey | null>(null);
  const [draft, setDraft] = useState('');

  const spend = useMemo(() => spendByCategory(transactions, [month]), [transactions, month]);
  const budgeted = EXPENSE_CATEGORY_KEYS.reduce((a, k) => a + (budgets[k] ?? 0), 0);
  const spent = EXPENSE_CATEGORY_KEYS.reduce((a, k) => a + (spend[k] ?? 0), 0);
  const parts = EXPENSE_CATEGORY_KEYS.filter((k) => (spend[k] ?? 0) > 0).map((k) => ({ key: k, value: spend[k] ?? 0 }));
  const isCurrent = month === currentMonth();

  const save = (k: CategoryKey) => {
    const n = Number(draft);
    if (Number.isFinite(n)) setBudget(k, n);
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        crumb="Plan"
        title="Plan"
        subtitle="Decide where your money goes — what you spend, and what you save."
        action={
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
            <button type="button" aria-label="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-2 text-sm font-medium min-w-32 text-center">{monthLabel(month)}</span>
            <button type="button" aria-label="Next month" disabled={isCurrent} onClick={() => setMonth(shiftMonth(month, 1))}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Card className="p-5 self-start">
          <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold mb-3">Spent vs budgeted</p>
          <Donut spent={spent} budget={budgeted} parts={parts} />
          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <div><p className="text-xs text-gray-500">Spent</p><p className="font-semibold tabular-nums">{formatINR(spent)}</p></div>
            <div><p className="text-xs text-gray-500">Budgeted</p><p className="font-semibold tabular-nums">{formatINR(budgeted)}</p></div>
          </div>
        </Card>

        <Card className="divide-y divide-gray-100">
          {EXPENSE_CATEGORY_KEYS.map((k) => {
            const limit = budgets[k] ?? 0;
            const used = spend[k] ?? 0;
            const pct = limit ? Math.min(100, (used / limit) * 100) : used ? 100 : 0;
            const over = used > limit;
            return (
              <div key={k} className="p-4 flex items-center gap-3">
                <CategoryTile category={k} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{CATEGORIES[k].label}</span>
                    <span className={`text-xs tabular-nums ${over ? 'text-[#F13636] font-semibold' : used >= limit * 0.8 && limit > 0 ? 'text-[#DC6803] font-medium' : 'text-gray-500'}`}>
                      {formatINR(used)} / {formatINR(limit)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${over ? 'bg-[#F13636]' : CATEGORIES[k].dot}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {editing === k ? (
                  <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); save(k); }}>
                    <input autoFocus type="number" min="0" value={draft} onChange={(e) => setDraft(e.target.value)}
                      className="w-24 h-8 px-2 text-sm border border-gray-300 rounded-lg" aria-label={`${CATEGORIES[k].label} budget`} />
                    <button type="submit" aria-label="Save budget" className="p-1.5 text-[#078C52] hover:bg-[#12B76A]/10 rounded-lg cursor-pointer"><Check className="w-4 h-4" /></button>
                  </form>
                ) : (
                  <button type="button" aria-label={`Edit ${CATEGORIES[k].label} budget`}
                    onClick={() => { setEditing(k); setDraft(String(limit)); }}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"><Pencil className="w-4 h-4" /></button>
                )}
              </div>
            );
          })}
        </Card>
      </div>

      <div className="mt-4">
        <GoalsCard />
      </div>
    </>
  );
};
