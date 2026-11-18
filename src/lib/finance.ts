// Types and pure helpers for the signed-in workspace.
// The data itself comes from the backend (see AppDataProvider and lib/api.ts).

export type CategoryKey =
  | 'income'
  | 'interest'
  | 'housing'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'health'
  | 'subscriptions'
  | 'insurance';

export interface Transaction {
  id: string;
  name: string;
  /** Positive = money in, negative = money out (INR). */
  amount: number;
  /** Local calendar date, YYYY-MM-DD. */
  date: string;
  category: CategoryKey;
  account: string;
  /** Free-form labels, e.g. "work", "reimbursable". */
  tags?: string[];
  notes?: string;
  /** Hidden from reports and budgets but kept in account history. */
  excluded?: boolean;
}

export type BillFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  /** Next due date, YYYY-MM-DD. */
  dueDate: string;
  frequency: BillFrequency;
  category: CategoryKey;
  autopay: boolean;
  status: 'unpaid' | 'paid';
  paidOn?: string;
}

export type AccountKind = 'asset' | 'liability';

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  type: string;
  /** Balance before the first recorded transaction (INR; for liabilities, the amount owed). */
  opening: number;
}

export const ACCOUNT_TYPES: Record<AccountKind, string[]> = {
  asset: ['Savings', 'Checking', 'Cash', 'Investment', 'Property', 'Vehicle', 'Other asset'],
  liability: ['Credit card', 'Loan', 'Mortgage', 'Other debt'],
};

/* ------------------------------ dates ------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const startOfToday = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/** ISO date `offset` days from today (negative = past). */
export const dayOffset = (offset: number) => {
  const d = startOfToday();
  d.setDate(d.getDate() + offset);
  return toISO(d);
};

/** Whole days from today until `iso` (negative = already past). */
export const daysUntil = (iso: string) =>
  Math.round((parseISO(iso).getTime() - startOfToday().getTime()) / 86_400_000);

export const formatDay = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  parseISO(iso).toLocaleDateString('en-IN', opts);

export const formatGroupDate = (iso: string) => {
  const diff = daysUntil(iso);
  const long = parseISO(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (diff === 0) return `Today · ${long}`;
  if (diff === -1) return `Yesterday · ${long}`;
  return long;
};

/* ----------------------------- currency ---------------------------- */

const inr0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });

export const formatINR = (n: number, decimals = false) => (decimals ? inr2 : inr0).format(n);

export const formatSignedINR = (n: number, decimals = true) =>
  `${n > 0 ? '+' : n < 0 ? '−' : ''}${formatINR(Math.abs(n), decimals)}`;

/* --------------------------- seed data ----------------------------- */

/* ---------------------------- selectors ---------------------------- */

export const sumBy = (list: Transaction[], pred: (t: Transaction) => boolean) =>
  list.reduce((acc, t) => (pred(t) ? acc + t.amount : acc), 0);

/** Transactions dated within the last `days` days (including today). */
export const inLastDays = (list: Transaction[], days: number) =>
  list.filter((t) => {
    const d = daysUntil(t.date);
    return d <= 0 && d > -days;
  });

export const sortByDateDesc = (list: Transaction[]) =>
  [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export type BillBucket = 'overdue' | 'week' | 'later' | 'paid';

export const billBucket = (b: Bill): BillBucket => {
  if (b.status === 'paid') return 'paid';
  const d = daysUntil(b.dueDate);
  if (d < 0) return 'overdue';
  if (d <= 7) return 'week';
  return 'later';
};

export const dueLabel = (b: Bill) => {
  if (b.status === 'paid') return `Paid ${b.paidOn ? formatDay(b.paidOn) : ''}`.trim();
  const d = daysUntil(b.dueDate);
  if (d < 0) return `Overdue by ${-d} day${d === -1 ? '' : 's'}`;
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  return `Due in ${d} days`;
};

/* ------------------------- budgets & months ------------------------- */

/** Monthly budget (INR) per expense category. */
/** "YYYY-MM" of a date. */
export const monthOf = (iso: string) => iso.slice(0, 7);

export const currentMonth = () => monthOf(toISO(startOfToday()));

export const shiftMonth = (ym: string, delta: number) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const monthLabel = (ym: string, short = false) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', short ? { month: 'short' } : { month: 'long', year: 'numeric' });
};

export const isExpense = (t: Transaction) => !t.excluded && t.amount < 0 && t.category !== 'income' && t.category !== 'interest';

/** Total spent per category, for transactions whose month is in `months`. */
export const spendByCategory = (list: Transaction[], months: string[]) => {
  const out: Partial<Record<CategoryKey, number>> = {};
  for (const t of list) {
    if (isExpense(t) && months.includes(monthOf(t.date))) out[t.category] = (out[t.category] ?? 0) - t.amount;
  }
  return out;
};

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  /** Target date, YYYY-MM-DD. */
  deadline: string;
}


/* ------------------------- accounts & net worth ------------------------- */

/** Current balance of an account: opening balance plus every transaction on it. */
export const accountBalance = (info: Account, list: Transaction[]) => {
  const delta = list.filter((t) => t.account === info.name).reduce((n, t) => n + t.amount, 0);
  // Liabilities are stored as a positive amount owed; spending raises it.
  return info.kind === 'liability' ? info.opening - delta : info.opening + delta;
};

export const netWorthSummary = (accounts: Account[], list: Transaction[]) => {
  let assets = 0;
  let liabilities = 0;
  for (const a of accounts) {
    const b = accountBalance(a, list);
    if (a.kind === 'asset') assets += b;
    else liabilities += b;
  }
  return { assets, liabilities, net: assets - liabilities };
};

/** Net worth at the end of each of the last `days` days (oldest first). */
export const netWorthSeries = (accounts: Account[], list: Transaction[], days = 30) => {
  const today = toISO(startOfToday());
  const { net } = netWorthSummary(accounts, list);
  const byDay = new Map<string, number>();
  for (const t of list) byDay.set(t.date, (byDay.get(t.date) ?? 0) + t.amount);
  const out: { date: string; value: number }[] = [];
  let running = net;
  for (let i = 0; i < days; i++) {
    const date = dayOffset(-i);
    out.unshift({ date, value: running });
    if (date <= today) running -= byDay.get(date) ?? 0;
  }
  return out;
};

export const toCSV = (rows: (string | number)[][]) =>
  rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

export const downloadCSV = (filename: string, rows: (string | number)[][]) => {
  const url = URL.createObjectURL(new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
