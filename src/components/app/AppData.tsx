import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  ACCOUNTS,
  SEED_BILLS,
  SEED_TRANSACTIONS,
  dayOffset,
  type Bill,
  type Transaction,
} from '../../lib/finance';

interface AppData {
  transactions: Transaction[];
  bills: Bill[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransactions: (ids: string[]) => void;
  addBill: (b: Omit<Bill, 'id' | 'status' | 'paidOn'>) => void;
  markBillPaid: (id: string) => void;
  deleteBill: (id: string) => void;
}

const Ctx = createContext<AppData | null>(null);

let counter = 0;
const nextId = (prefix: string) => `${prefix}-new-${Date.now()}-${counter++}`;

// In-memory store shared by every page, so paying a bill adds a transaction
// and the dashboard stays in sync. Swap for real API calls once those exist.
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [bills, setBills] = useState<Bill[]>(SEED_BILLS);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [{ ...t, id: nextId('t') }, ...prev]);
  }, []);

  const deleteTransactions = useCallback((ids: string[]) => {
    const drop = new Set(ids);
    setTransactions((prev) => prev.filter((t) => !drop.has(t.id)));
  }, []);

  const addBill = useCallback((b: Omit<Bill, 'id' | 'status' | 'paidOn'>) => {
    setBills((prev) => [...prev, { ...b, id: nextId('b'), status: 'unpaid' }]);
  }, []);

  const markBillPaid = useCallback(
    (id: string) => {
      const target = bills.find((b) => b.id === id);
      if (!target || target.status === 'paid') return;
      const today = dayOffset(0);
      setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'paid', paidOn: today } : b)));
      setTransactions((prev) => [
        {
          id: nextId('t'),
          name: target.name,
          amount: -target.amount,
          date: today,
          category: target.category,
          account: ACCOUNTS[0],
        },
        ...prev,
      ]);
    },
    [bills],
  );

  const deleteBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const value = useMemo(
    () => ({ transactions, bills, addTransaction, deleteTransactions, addBill, markBillPaid, deleteBill }),
    [transactions, bills, addTransaction, deleteTransactions, addBill, markBillPaid, deleteBill],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = (): AppData => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
};
