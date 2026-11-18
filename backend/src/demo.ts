import { randomUUID } from 'node:crypto';
import { dayOffset } from './dates.js';
import { hashPassword } from './security.js';
import type { Account, Bill, BillFrequency, CategoryKey, FinanceData, JsonStore, Transaction, User } from './store.js';

export const DEMO_EMAIL = 'artha@gmail.com';
export const DEMO_PASSWORD = 'artha1234';

const HDFC = 'HDFC Savings •••• 3432';
const CARD = 'ICICI Credit •••• 8841';
const CASH = 'Cash Wallet';

const acct = (name: string, kind: Account['kind'], type: string, opening: number): Account => ({
  id: randomUUID(),
  name,
  kind,
  type,
  opening,
});

const tx = (name: string, amount: number, daysAgo: number, category: CategoryKey, account: string): Transaction => ({
  id: randomUUID(),
  name,
  amount,
  date: dayOffset(-daysAgo),
  category,
  account,
});

const bill = (
  name: string,
  amount: number,
  due: number,
  frequency: BillFrequency,
  category: CategoryKey,
  autopay: boolean,
  paidDaysAgo?: number,
): Bill => ({
  id: randomUUID(),
  name,
  amount,
  dueDate: dayOffset(due),
  frequency,
  category,
  autopay,
  status: paidDaysAgo === undefined ? 'unpaid' : 'paid',
  ...(paidDaysAgo === undefined ? {} : { paidOn: dayOffset(-paidDaysAgo) }),
});

/** Sample data with dates relative to today, so the demo always looks current. */
export const buildDemoFinance = (): FinanceData => ({
  accounts: [
    acct(HDFC, 'asset', 'Savings', 1_250_000),
    acct(CARD, 'liability', 'Credit card', 42_000),
    acct(CASH, 'asset', 'Cash', 8_000),
    acct('Mutual Funds', 'asset', 'Investment', 940_000),
    acct('Home Loan', 'liability', 'Loan', 2_150_000),
  ],
  transactions: [
    tx('Acme Ltd — Salary', 305000, 12, 'income', HDFC),
    tx('Freelance — Design Project', 85000, 20, 'income', HDFC),
    tx('Dividend — HDFC Bank', 18000, 8, 'income', HDFC),
    tx('Interest Payment', 3214, 5, 'interest', HDFC),
    tx('House Rent — Sector 21', -62000, 11, 'housing', HDFC),
    tx('Swiggy', -684, 0, 'food', CARD),
    tx('Zomato', -512, 1, 'food', CARD),
    tx('BigBasket', -3240, 2, 'food', CARD),
    tx('Starbucks', -420, 2, 'food', CASH),
    tx('Uber', -386, 1, 'transport', CARD),
    tx('Indian Oil — Fuel', -3500, 4, 'transport', CARD),
    tx('Ola', -248, 6, 'transport', CARD),
    tx('Netflix', -649, 7, 'subscriptions', CARD),
    tx('Spotify', -119, 4, 'subscriptions', CARD),
    tx('ChatGPT Plus', -1999, 9, 'subscriptions', CARD),
    tx('PVR Cinemas', -1150, 3, 'entertainment', CARD),
    tx('BookMyShow', -900, 15, 'entertainment', CARD),
    tx('Amazon', -4799, 5, 'shopping', CARD),
    tx('Myntra', -2899, 10, 'shopping', CARD),
    tx('Decathlon', -3650, 18, 'shopping', CARD),
    tx('PSPCL — Electricity', -4120, 17, 'utilities', HDFC),
    tx('Airtel Broadband', -1179, 14, 'utilities', HDFC),
    tx('Apollo Pharmacy', -1340, 8, 'health', CASH),
    tx('Cult.fit Membership', -1800, 16, 'health', CARD),
    tx('Blinkit', -890, 3, 'food', CARD),
    tx('Barbeque Nation', -2860, 13, 'food', CARD),
    tx('Acme Ltd — Salary', 305000, 42, 'income', HDFC),
    tx('House Rent — Sector 21', -62000, 41, 'housing', HDFC),
    tx('Interest Payment', 3102, 35, 'interest', HDFC),
    tx('Amazon', -1999, 28, 'shopping', CARD),
    tx('Cafe Coffee Day', -340, 0, 'food', CASH),
    tx('Metro Recharge', -500, 9, 'transport', CASH),
  ],
  bills: [
    bill('PSPCL Electricity', 4850, -2, 'Monthly', 'utilities', false),
    bill('Car EMI — HDFC Bank', 21300, 1, 'Monthly', 'transport', true),
    bill('House Rent', 62000, 3, 'Monthly', 'housing', false),
    bill('ICICI Credit Card', 18420, 6, 'Monthly', 'shopping', false),
    bill('Airtel Broadband', 1179, 9, 'Monthly', 'utilities', true),
    bill('Netflix', 649, 12, 'Monthly', 'subscriptions', true),
    bill('LIC Health Insurance', 24500, 25, 'Yearly', 'insurance', false),
    bill('Term Insurance', 8200, 48, 'Quarterly', 'insurance', true),
    bill('Spotify', 119, 26, 'Monthly', 'subscriptions', true, 4),
    bill('Society Maintenance', 2200, 24, 'Monthly', 'housing', false, 6),
  ],
  budgets: {
    housing: 65000,
    food: 14000,
    transport: 9000,
    entertainment: 4000,
    shopping: 12000,
    utilities: 7000,
    health: 4000,
    subscriptions: 3500,
    insurance: 3000,
  },
  goals: [
    { id: randomUUID(), name: 'Emergency fund', target: 600000, saved: 410000, deadline: dayOffset(150) },
    { id: randomUUID(), name: 'Goa trip', target: 120000, saved: 45000, deadline: dayOffset(210) },
    { id: randomUUID(), name: 'New laptop', target: 150000, saved: 140000, deadline: dayOffset(60) },
  ],
});

/** Replace the demo user's data with a fresh sample set (dates relative to today). */
export const resetDemoFinance = (store: JsonStore, userId: string) =>
  store.mutate((d) => {
    d.finance[userId] = buildDemoFinance();
  });

/** Create artha@gmail.com on first run and make sure it has sample data. */
export const ensureDemoUser = async (store: JsonStore): Promise<void> => {
  const existing = store.read((d) => d.users.find((u) => u.email === DEMO_EMAIL));
  if (existing) {
    await resetDemoFinance(store, existing.id);
    return;
  }
  const now = new Date().toISOString();
  const user: User = {
    id: randomUUID(),
    name: 'Artha Demo',
    email: DEMO_EMAIL,
    passwordHash: await hashPassword(DEMO_PASSWORD),
    createdAt: now,
    updatedAt: now,
  };
  await store.mutate((d) => {
    d.users.push(user);
    d.finance[user.id] = buildDemoFinance();
  });
};
