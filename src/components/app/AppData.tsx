import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, errorText, type FinanceSnapshot } from '../../lib/api';
import type { Account, Bill, BillFrequency, CategoryKey, Goal, Transaction } from '../../lib/finance';

interface AppData {
  /** True until the first load from the server finishes. */
  loading: boolean;
  /** Set when the first load failed; the workspace shows a retry screen. */
  loadError: string | null;
  /** Message from the most recent failed change (shown as a banner). */
  error: string | null;
  clearError: () => void;
  reload: () => Promise<void>;

  accounts: Account[];
  addAccount: (a: Omit<Account, 'id'>) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<void>;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<boolean>;
  updateTransactions: (ids: string[], patch: Partial<Omit<Transaction, 'id'>>, addTags?: string[]) => Promise<void>;
  deleteTransactions: (ids: string[]) => Promise<void>;
  bills: Bill[];
  addBill: (b: { name: string; amount: number; dueDate: string; frequency: BillFrequency; category: CategoryKey; autopay: boolean }) => Promise<boolean>;
  markBillPaid: (id: string, account?: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  budgets: Partial<Record<CategoryKey, number>>;
  setBudget: (c: CategoryKey, amount: number) => Promise<void>;
  goals: Goal[];
  addGoal: (g: { name: string; target: number; deadline: string }) => Promise<boolean>;
  contributeGoal: (id: string, amount: number) => Promise<void>;
}

const Ctx = createContext<AppData | null>(null);

const EMPTY: FinanceSnapshot = { accounts: [], transactions: [], bills: [], budgets: {}, goals: [] };

// Every change goes to the backend, which answers with the user's full data;
// that answer replaces local state, so the screen always shows what is saved.
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinanceSnapshot>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setData(await api.finance.get());
    } catch (err) {
      setLoadError(errorText(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /** Run a change; on success store the new snapshot, on failure show the message. */
  const run = useCallback(async (call: () => Promise<FinanceSnapshot>): Promise<boolean> => {
    try {
      setData(await call());
      setError(null);
      return true;
    } catch (err) {
      setError(errorText(err));
      return false;
    }
  }, []);

  const value = useMemo<AppData>(
    () => ({
      loading,
      loadError,
      error,
      clearError: () => setError(null),
      reload,
      accounts: data.accounts,
      addAccount: (a) => run(() => api.finance.addAccount(a)),
      deleteAccount: async (id) => void (await run(() => api.finance.deleteAccount(id))),
      transactions: data.transactions,
      addTransaction: (t) => run(() => api.finance.addTransaction(t)),
      updateTransactions: async (ids, patch, addTags) => void (await run(() => api.finance.updateTransactions(ids, patch, addTags))),
      deleteTransactions: async (ids) => void (await run(() => api.finance.deleteTransactions(ids))),
      bills: data.bills,
      addBill: (b) => run(() => api.finance.addBill(b)),
      markBillPaid: async (id, account) => void (await run(() => api.finance.payBill(id, account))),
      deleteBill: async (id) => void (await run(() => api.finance.deleteBill(id))),
      budgets: data.budgets,
      setBudget: async (c, amount) => void (await run(() => api.finance.setBudget(c, Math.max(0, amount)))),
      goals: data.goals,
      addGoal: (g) => run(() => api.finance.addGoal(g)),
      contributeGoal: async (id, amount) => void (await run(() => api.finance.contributeGoal(id, amount))),
    }),
    [data, loading, loadError, error, reload, run],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = (): AppData => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
};
