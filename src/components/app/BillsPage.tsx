import React, { useMemo, useState } from 'react';
import { AlertCircle, CalendarClock, Check, CheckCircle2, Plus, RefreshCw, Trash2, Wallet } from 'lucide-react';
import { useAppData } from './AppData';
import { Card, PageHeader } from './AppShell';
import { CategoryTile } from './categories';
import { primaryBtn } from './Modal';
import {
  billBucket,
  daysUntil,
  dueLabel,
  formatDay,
  formatINR,
  type Bill,
  type BillBucket,
} from '../../lib/finance';

type Filter = 'all' | 'unpaid' | 'paid';

const SECTIONS: { id: BillBucket; title: string; tone: string }[] = [
  { id: 'overdue', title: 'Overdue', tone: 'text-[#F13636]' },
  { id: 'week', title: 'Due in the next 7 days', tone: 'text-[#DC6803]' },
  { id: 'later', title: 'Later', tone: 'text-gray-500' },
  { id: 'paid', title: 'Paid', tone: 'text-[#078C52]' },
];

const Summary: React.FC<{
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  iconBg: string;
}> = ({ label, value, hint, icon, iconBg }) => (
  <Card className="p-4 flex items-start gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">{label}</p>
      <p className="font-mono text-lg font-semibold text-gray-900 tracking-tight">{value}</p>
      <p className="text-[11px] text-gray-400">{hint}</p>
    </div>
  </Card>
);

const BillRow: React.FC<{ bill: Bill; onPay: () => void; onDelete: () => void }> = ({ bill, onPay, onDelete }) => {
  const bucket = billBucket(bill);
  const dueColor =
    bucket === 'overdue' ? 'text-[#F13636] font-medium' : bucket === 'paid' ? 'text-[#078C52]' : bucket === 'week' ? 'text-[#DC6803]' : 'text-gray-400';

  return (
    <li className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-4 py-3 rounded-xl hover:bg-gray-50/80 transition-colors group">
      <CategoryTile category={bill.category} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{bill.name}</p>
        <p className="text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className={dueColor}>{dueLabel(bill)}</span>
          {bill.status === 'unpaid' && <span className="hidden sm:inline text-gray-300">·</span>}
          {bill.status === 'unpaid' && <span className="hidden sm:inline text-gray-400">{formatDay(bill.dueDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
          <RefreshCw className="w-3 h-3" />
          {bill.frequency}
        </span>
        {bill.autopay && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#12B76A]/10 text-[#078C52] border border-emerald-200/60">Auto-pay</span>
        )}
      </div>

      <span className="font-mono text-sm font-semibold text-gray-900 sm:w-24 text-right shrink-0">{formatINR(bill.amount)}</span>

      <div className="flex items-center gap-1 sm:w-[140px] justify-end shrink-0">
        {bill.status === 'unpaid' ? (
          <button
            type="button"
            onClick={onPay}
            aria-label={`Mark ${bill.name} as paid`}
            className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 rounded-lg text-xs font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-[#12B76A]/10 hover:border-emerald-200 hover:text-[#078C52] shadow-2xs transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mark paid</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#078C52]">
            <CheckCircle2 className="w-4 h-4" /> <span className="hidden sm:inline">Paid</span>
          </span>
        )}
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${bill.name}`}
          className="p-1.5 text-gray-300 hover:text-[#F13636] hover:bg-[#F13636]/10 rounded-lg transition-colors cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  );
};

export const BillsPage: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const { bills, markBillPaid, deleteBill } = useAppData();
  const [filter, setFilter] = useState<Filter>('all');

  const stats = useMemo(() => {
    const unpaid = bills.filter((b) => b.status === 'unpaid');
    const overdue = unpaid.filter((b) => daysUntil(b.dueDate) < 0);
    const week = unpaid.filter((b) => {
      const d = daysUntil(b.dueDate);
      return d >= 0 && d <= 7;
    });
    const paid = bills.filter((b) => b.status === 'paid');
    const total = (list: Bill[]) => list.reduce((a, b) => a + b.amount, 0);
    return {
      overdue: { n: overdue.length, amount: total(overdue) },
      week: { n: week.length, amount: total(week) },
      unpaid: { n: unpaid.length, amount: total(unpaid) },
      paid: { n: paid.length, amount: total(paid) },
    };
  }, [bills]);

  const grouped = useMemo(() => {
    const visible = bills.filter((b) => (filter === 'all' ? true : b.status === filter));
    return SECTIONS.map((s) => ({
      ...s,
      items: visible
        .filter((b) => billBucket(b) === s.id)
        .sort((a, b) => (s.id === 'paid' ? (b.paidOn ?? '').localeCompare(a.paidOn ?? '') : daysUntil(a.dueDate) - daysUntil(b.dueDate))),
    })).filter((s) => s.items.length > 0);
  }, [bills, filter]);

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'paid', label: 'Paid' },
  ];

  return (
    <>
      <PageHeader
        crumb="Home / Bills"
        title="Bills"
        subtitle="Track what's due, and mark bills paid as you go"
        action={
          <button type="button" onClick={onAdd} className={primaryBtn}>
            <Plus className="w-3.5 h-3.5" />
            Add bill
          </button>
        }
      />

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Summary
          label="Overdue"
          value={formatINR(stats.overdue.amount)}
          hint={`${stats.overdue.n} bill${stats.overdue.n === 1 ? '' : 's'}`}
          icon={<AlertCircle className="w-4 h-4 text-[#F13636]" />}
          iconBg="bg-[#F13636]/10"
        />
        <Summary
          label="Due in 7 days"
          value={formatINR(stats.week.amount)}
          hint={`${stats.week.n} bill${stats.week.n === 1 ? '' : 's'}`}
          icon={<CalendarClock className="w-4 h-4 text-[#DC6803]" />}
          iconBg="bg-[#F79009]/10"
        />
        <Summary
          label="Total unpaid"
          value={formatINR(stats.unpaid.amount)}
          hint={`${stats.unpaid.n} bill${stats.unpaid.n === 1 ? '' : 's'} pending`}
          icon={<Wallet className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <Summary
          label="Paid"
          value={formatINR(stats.paid.amount)}
          hint={`${stats.paid.n} bill${stats.paid.n === 1 ? '' : 's'} settled`}
          icon={<CheckCircle2 className="w-4 h-4 text-[#078C52]" />}
          iconBg="bg-[#12B76A]/10"
        />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex p-1 bg-gray-100 rounded-xl w-fit mb-4" role="group" aria-label="Filter bills">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-3.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === f.id ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {grouped.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm font-medium text-gray-900">{bills.length === 0 ? 'No bills yet' : 'Nothing here'}</p>
            <p className="text-xs text-gray-400 mt-1">
              {bills.length === 0 ? 'Add a bill to start tracking due dates.' : 'No bills match this filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((s) => (
              <section key={s.id}>
                <h2 className={`px-3 sm:px-4 mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${s.tone}`}>
                  {s.title} · {s.items.length}
                </h2>
                <ul>
                  {s.items.map((b) => (
                    <BillRow key={b.id} bill={b} onPay={() => markBillPaid(b.id)} onDelete={() => deleteBill(b.id)} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};
