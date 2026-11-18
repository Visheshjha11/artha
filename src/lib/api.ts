// Thin client for the local auth backend (see /backend).
// Requests go to /api/... and the Vite dev server proxies them to the backend,
// so the session cookie stays same-origin and no CORS setup is needed.

import type { Account, Bill, BillFrequency, CategoryKey, Goal, Transaction } from './finance';

export interface FinanceSnapshot {
  accounts: Account[];
  transactions: Transaction[];
  bills: Bill[];
  budgets: Partial<Record<CategoryKey, number>>;
  goals: Goal[];
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  fields: Record<string, string> | undefined;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const UNREACHABLE =
  'Cannot reach the server. Start the backend with "npm run dev" inside the backend folder.';

async function request<T>(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      ...(body !== undefined
        ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : {}),
    });
  } catch {
    throw new ApiError(0, 'network', UNREACHABLE);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error;
    // The dev proxy answers 5xx with an empty body when the backend is down.
    if (!err && res.status >= 500) throw new ApiError(res.status, 'network', UNREACHABLE);
    throw new ApiError(
      res.status,
      err?.code ?? 'unknown',
      err?.message ?? 'Something went wrong. Please try again.',
      err?.fields,
    );
  }
  return data as T;
}

export const api = {
  signup: (input: { name: string; email: string; password: string }) =>
    request<{ user: ApiUser }>('POST', '/auth/signup', input),
  signin: (input: { email: string; password: string; rememberMe: boolean }) =>
    request<{ user: ApiUser }>('POST', '/auth/signin', input),
  signout: () => request<void>('POST', '/auth/signout', {}),
  me: () => request<{ user: ApiUser }>('GET', '/auth/me'),
  forgotPassword: (email: string) =>
    request<{ message: string }>('POST', '/auth/forgot-password', { email }),
  finance: {
    get: () => request<FinanceSnapshot>('GET', '/finance'),
    addAccount: (a: Omit<Account, 'id'>) => request<FinanceSnapshot>('POST', '/finance/accounts', a),
    deleteAccount: (id: string) => request<FinanceSnapshot>('DELETE', `/finance/accounts/${id}`),
    addTransaction: (t: Omit<Transaction, 'id'>) => request<FinanceSnapshot>('POST', '/finance/transactions', t),
    updateTransactions: (ids: string[], patch: Partial<Omit<Transaction, 'id'>>, addTags?: string[]) =>
      request<FinanceSnapshot>('PATCH', '/finance/transactions', { ids, patch, ...(addTags ? { addTags } : {}) }),
    deleteTransactions: (ids: string[]) => request<FinanceSnapshot>('POST', '/finance/transactions/delete', { ids }),
    addBill: (b: { name: string; amount: number; dueDate: string; frequency: BillFrequency; category: CategoryKey; autopay: boolean }) =>
      request<FinanceSnapshot>('POST', '/finance/bills', b),
    payBill: (id: string, account?: string) => request<FinanceSnapshot>('POST', `/finance/bills/${id}/pay`, account ? { account } : {}),
    deleteBill: (id: string) => request<FinanceSnapshot>('DELETE', `/finance/bills/${id}`),
    setBudget: (category: CategoryKey, amount: number) => request<FinanceSnapshot>('PUT', `/finance/budgets/${category}`, { amount }),
    addGoal: (g: { name: string; target: number; deadline: string }) => request<FinanceSnapshot>('POST', '/finance/goals', g),
    contributeGoal: (id: string, amount: number) => request<FinanceSnapshot>('POST', `/finance/goals/${id}/contribute`, { amount }),
  },
};

/** Text for the toast: the first field problem if there is one, else the general message. */
export const errorText = (err: unknown): string => {
  if (err instanceof ApiError) return Object.values(err.fields ?? {})[0] ?? err.message;
  return 'Something went wrong. Please try again.';
};
