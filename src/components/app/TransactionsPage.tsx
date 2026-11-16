import React, { useMemo, useState } from 'react';
import { CheckSquare, Plus, Search, Square, Trash2, X } from 'lucide-react';
import { useAppData } from './AppData';
import { Card, PageHeader } from './AppShell';
import { CATEGORIES, CATEGORY_KEYS, CategoryChip, CategoryTile } from './categories';
import { inputClass, primaryBtn, secondaryBtn } from './Modal';
import {
  ACCOUNTS,
  formatGroupDate,
  formatINR,
  formatSignedINR,
  sortByDateDesc,
  sumBy,
  type CategoryKey,
  type Transaction,
} from '../../lib/finance';

type TypeFilter = 'all' | 'income' | 'expense';

const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expenses' },
];

export const TransactionsPage: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const { transactions, deleteTransactions } = useAppData();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('all');
  const [category, setCategory] = useState<CategoryKey | 'all'>('all');
  const [account, setAccount] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtersActive = query !== '' || type !== 'all' || category !== 'all' || account !== 'all';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByDateDesc(
      transactions.filter((t) => {
        if (type === 'income' && t.amount <= 0) return false;
        if (type === 'expense' && t.amount >= 0) return false;
        if (category !== 'all' && t.category !== category) return false;
        if (account !== 'all' && t.account !== account) return false;
        if (!q) return true;
        return (
          t.name.toLowerCase().includes(q) ||
          CATEGORIES[t.category].label.toLowerCase().includes(q) ||
          String(Math.abs(t.amount)).includes(q.replace(/[₹,\s]/g, ''))
        );
      }),
    );
  }, [transactions, query, type, category, account]);

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) map.set(t.date, [...(map.get(t.date) ?? []), t]);
    return [...map.entries()];
  }, [filtered]);

  const income = sumBy(filtered, (t) => t.amount > 0);
  const expenses = -sumBy(filtered, (t) => t.amount < 0);

  const visibleIds = filtered.map((t) => t.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(visibleIds));

  const clearFilters = () => {
    setQuery('');
    setType('all');
    setCategory('all');
    setAccount('all');
  };

  const removeSelected = () => {
    deleteTransactions([...selected]);
    setSelected(new Set());
  };

  return (
    <>
      <PageHeader
        crumb="Home / Transactions"
        title="Transactions"
        subtitle={`${transactions.length} transactions across ${ACCOUNTS.length} accounts`}
        action={
          <button type="button" onClick={onAdd} className={primaryBtn}>
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        }
      />

      <Card className="p-4 sm:p-5">
        {/* Search + filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search merchant, category or amount"
              aria-label="Search transactions"
              className={`${inputClass} pl-10 bg-gray-50/70`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 bg-gray-100 rounded-xl" role="group" aria-label="Filter by type">
              {TYPE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setType(o.id)}
                  aria-pressed={type === o.id}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    type === o.id ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey | 'all')}
              className={`${inputClass} !w-auto !py-1.5 text-xs`}
            >
              <option value="all">All categories</option>
              {CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>{CATEGORIES[k].label}</option>
              ))}
            </select>

            <select
              aria-label="Filter by account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className={`${inputClass} !w-auto !py-1.5 text-xs`}
            >
              <option value="all">All accounts</option>
              {ACCOUNTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {filtersActive && (
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 cursor-pointer">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Showing</p>
            <p className="font-mono text-sm font-semibold text-gray-900">{filtered.length}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Income</p>
            <p className="font-mono text-sm font-semibold text-[#078C52]">{formatINR(income)}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Expenses</p>
            <p className="font-mono text-sm font-semibold text-gray-900">{formatINR(expenses)}</p>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 mb-3 px-4 py-2 bg-[#12B76A]/10/70 border border-emerald-100 rounded-xl text-xs">
            <span className="font-medium text-emerald-800">{selected.size} selected</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSelected(new Set())} className={secondaryBtn}>Deselect</button>
              <button type="button" onClick={removeSelected} className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm font-medium text-gray-900">No transactions found</p>
            <p className="text-xs text-gray-400 mt-1">
              {filtersActive ? 'Try changing or clearing your filters.' : 'Add your first transaction to get started.'}
            </p>
            {filtersActive && (
              <button type="button" onClick={clearFilters} className={`${secondaryBtn} mt-4`}>Clear filters</button>
            )}
          </div>
        ) : (
          <div className="w-full">
            {/* Table header */}
            <div className="grid grid-cols-12 px-3 sm:px-4 py-2 text-[11px] font-mono font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <div className="col-span-1 flex items-center">
                <button type="button" onClick={toggleAll} aria-label={allSelected ? 'Deselect all' : 'Select all'} className="cursor-pointer">
                  {allSelected ? <CheckSquare className="w-4 h-4 text-[#078C52]" /> : <Square className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              <div className="col-span-7 sm:col-span-5">Transaction</div>
              <div className="hidden sm:block sm:col-span-3 md:col-span-2">Category</div>
              <div className="hidden md:block col-span-2">Account</div>
              <div className="col-span-4 sm:col-span-3 md:col-span-2 text-right">Amount</div>
            </div>

            {groups.map(([date, rows]) => {
              const dayTotal = sumBy(rows, () => true);
              return (
                <section key={date} className="mt-4">
                  <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-50/60 rounded-lg text-[11px] font-mono text-gray-500 mb-1">
                    <span className="font-semibold tracking-wider uppercase">
                      {formatGroupDate(date)} · {rows.length}
                    </span>
                    <span className="font-semibold text-gray-700">{formatSignedINR(dayTotal)}</span>
                  </div>
                  {rows.map((t) => {
                    const isSel = selected.has(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggle(t.id)}
                        className={`grid grid-cols-12 px-3 sm:px-4 py-3 items-center text-sm rounded-xl transition-colors cursor-pointer hover:bg-gray-50/80 ${isSel ? 'bg-[#12B76A]/10/40' : ''}`}
                      >
                        <div className="col-span-1 flex items-center">
                          <button
                            type="button"
                            aria-label={`${isSel ? 'Deselect' : 'Select'} ${t.name}`}
                            aria-pressed={isSel}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle(t.id);
                            }}
                            className="cursor-pointer"
                          >
                            {isSel ? <CheckSquare className="w-4 h-4 text-[#078C52]" /> : <Square className="w-4 h-4 text-gray-300" />}
                          </button>
                        </div>
                        <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0">
                          <CategoryTile category={t.category} className="!w-8 !h-8 !rounded-full" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{t.name}</p>
                            <p className="sm:hidden text-[11px] text-gray-400 truncate">{CATEGORIES[t.category].label}</p>
                          </div>
                        </div>
                        <div className="hidden sm:block sm:col-span-3 md:col-span-2 min-w-0">
                          <CategoryChip category={t.category} />
                        </div>
                        <div className="hidden md:block col-span-2 text-xs text-gray-600 font-mono truncate pr-2">{t.account}</div>
                        <div className={`col-span-4 sm:col-span-3 md:col-span-2 text-right font-mono font-semibold ${t.amount > 0 ? 'text-[#078C52]' : 'text-gray-900'}`}>
                          {formatSignedINR(t.amount)}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
};
