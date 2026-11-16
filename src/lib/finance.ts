// Sample finance data + helpers for the signed-in workspace.
// Nothing here is persisted: it all lives in memory (see AppDataProvider).

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

export const ACCOUNTS = ['HDFC Savings •••• 3432', 'ICICI Credit •••• 8841', 'Cash Wallet'] as const;

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

const [HDFC, CARD, CASH] = ACCOUNTS;

const tx = (
  id: number,
  name: string,
  amount: number,
  daysAgo: number,
  category: CategoryKey,
  account: string,
): Transaction => ({ id: `t${id}`, name, amount, date: dayOffset(-daysAgo), category, account });

export const SEED_TRANSACTIONS: Transaction[] = [
  tx(1, 'Acme Ltd — Salary', 305000, 12, 'income', HDFC),
  tx(2, 'Freelance — Design Project', 85000, 20, 'income', HDFC),
  tx(3, 'Dividend — HDFC Bank', 18000, 8, 'income', HDFC),
  tx(4, 'Interest Payment', 3214, 5, 'interest', HDFC),
  tx(5, 'House Rent — Sector 21', -62000, 11, 'housing', HDFC),
  tx(6, 'Swiggy', -684, 0, 'food', CARD),
  tx(7, 'Zomato', -512, 1, 'food', CARD),
  tx(8, 'BigBasket', -3240, 2, 'food', CARD),
  tx(9, 'Starbucks', -420, 2, 'food', CASH),
  tx(10, 'Uber', -386, 1, 'transport', CARD),
  tx(11, 'Indian Oil — Fuel', -3500, 4, 'transport', CARD),
  tx(12, 'Ola', -248, 6, 'transport', CARD),
  tx(13, 'Netflix', -649, 7, 'subscriptions', CARD),
  tx(14, 'Spotify', -119, 4, 'subscriptions', CARD),
  tx(15, 'ChatGPT Plus', -1999, 9, 'subscriptions', CARD),
  tx(16, 'PVR Cinemas', -1150, 3, 'entertainment', CARD),
  tx(17, 'BookMyShow', -900, 15, 'entertainment', CARD),
  tx(18, 'Amazon', -4799, 5, 'shopping', CARD),
  tx(19, 'Myntra', -2899, 10, 'shopping', CARD),
  tx(20, 'Decathlon', -3650, 18, 'shopping', CARD),
  tx(21, 'PSPCL — Electricity', -4120, 17, 'utilities', HDFC),
  tx(22, 'Airtel Broadband', -1179, 14, 'utilities', HDFC),
  tx(23, 'Apollo Pharmacy', -1340, 8, 'health', CASH),
  tx(24, 'Cult.fit Membership', -1800, 16, 'health', CARD),
  tx(25, 'Blinkit', -890, 3, 'food', CARD),
  tx(26, 'Barbeque Nation', -2860, 13, 'food', CARD),
  tx(27, 'Acme Ltd — Salary', 305000, 42, 'income', HDFC),
  tx(28, 'House Rent — Sector 21', -62000, 41, 'housing', HDFC),
  tx(29, 'Interest Payment', 3102, 35, 'interest', HDFC),
  tx(30, 'Amazon', -1999, 28, 'shopping', CARD),
  tx(31, 'Cafe Coffee Day', -340, 0, 'food', CASH),
  tx(32, 'Metro Recharge', -500, 9, 'transport', CASH),
];

const bill = (
  id: number,
  name: string,
  amount: number,
  due: number,
  frequency: BillFrequency,
  category: CategoryKey,
  autopay: boolean,
  paidDaysAgo?: number,
): Bill => ({
  id: `b${id}`,
  name,
  amount,
  dueDate: dayOffset(due),
  frequency,
  category,
  autopay,
  status: paidDaysAgo === undefined ? 'unpaid' : 'paid',
  paidOn: paidDaysAgo === undefined ? undefined : dayOffset(-paidDaysAgo),
});

export const SEED_BILLS: Bill[] = [
  bill(1, 'PSPCL Electricity', 4850, -2, 'Monthly', 'utilities', false),
  bill(2, 'Car EMI — HDFC Bank', 21300, 1, 'Monthly', 'transport', true),
  bill(3, 'House Rent', 62000, 3, 'Monthly', 'housing', false),
  bill(4, 'ICICI Credit Card', 18420, 6, 'Monthly', 'shopping', false),
  bill(5, 'Airtel Broadband', 1179, 9, 'Monthly', 'utilities', true),
  bill(6, 'Netflix', 649, 12, 'Monthly', 'subscriptions', true),
  bill(7, 'LIC Health Insurance', 24500, 25, 'Yearly', 'insurance', false),
  bill(8, 'Term Insurance', 8200, 48, 'Quarterly', 'insurance', true),
  bill(9, 'Spotify', 119, 26, 'Monthly', 'subscriptions', true, 4),
  bill(10, 'Society Maintenance', 2200, 24, 'Monthly', 'housing', false, 6),
];

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
export const SEED_BUDGETS: Partial<Record<CategoryKey, number>> = {
  housing: 65000,
  food: 14000,
  transport: 9000,
  entertainment: 4000,
  shopping: 12000,
  utilities: 7000,
  health: 4000,
  subscriptions: 3500,
  insurance: 3000,
};

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

export const isExpense = (t: Transaction) => t.amount < 0 && t.category !== 'income' && t.category !== 'interest';

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

export const SEED_GOALS: Goal[] = [
  { id: 'g1', name: 'Emergency fund', target: 600000, saved: 410000, deadline: dayOffset(150) },
  { id: 'g2', name: 'Goa trip', target: 120000, saved: 45000, deadline: dayOffset(210) },
  { id: 'g3', name: 'New laptop', target: 150000, saved: 140000, deadline: dayOffset(60) },
];
