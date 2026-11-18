import React, { useEffect, useState } from 'react';
import { AppDataProvider, useAppData } from './AppData';
import { AppShell, type Page } from './AppShell';
import { HomePage } from './HomePage';
import { TransactionsPage } from './TransactionsPage';
import { BillsPage } from './BillsPage';
import { ReportsPage } from './ReportsPage';
import { PlanPage } from './PlanPage';
import { TransactionModal } from './TransactionModal';
import { BillModal } from './BillModal';
import { AccountModal } from './AccountModal';
import { primaryBtn } from './Modal';

type Dialog = 'transaction' | 'bill' | 'account' | null;

const WorkspaceInner: React.FC<{ email: string; name?: string; onSignOut: () => void | Promise<void> }> = ({ email, name: fullName, onSignOut }) => {
  const [page, setPage] = useState<Page>('home');
  const [dialog, setDialog] = useState<Dialog>(null);
  const { accounts, addTransaction, addBill, addAccount, loading, loadError, reload, error, clearError } = useAppData();

  // Each page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Prefer the real name; fall back to the first part of the email.
  const first = (fullName?.trim().split(/\s+/)[0] ?? '') || email.split('@')[0].split(/[._\-+\d]+/)[0];
  const name = first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';

  // With no accounts yet, "New transaction" starts by adding one.
  const newTransaction = () => setDialog(accounts.length === 0 ? 'account' : 'transaction');

  if (loading && accounts.length === 0) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#F9F9F9] text-sm text-gray-500" role="status">
        Loading your data…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#F9F9F9] p-6 text-center">
        <div>
          <p className="text-sm font-medium text-gray-900">We couldn’t load your data</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">{loadError}</p>
          <div className="flex justify-center gap-2 mt-4">
            <button type="button" onClick={() => void reload()} className={primaryBtn}>Try again</button>
            <button type="button" onClick={() => void onSignOut()} className="text-xs text-gray-500 hover:text-gray-900 px-3 cursor-pointer">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell page={page} onNavigate={setPage} email={email} onSignOut={onSignOut}>
      {error && (
        <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="text-xs font-medium hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {page === 'home' && <HomePage name={name} onNavigate={setPage} onAdd={newTransaction} onAddAccount={() => setDialog('account')} />}
      {page === 'transactions' && <TransactionsPage onAdd={newTransaction} />}
      {page === 'bills' && <BillsPage onAdd={() => setDialog('bill')} />}
      {page === 'reports' && <ReportsPage />}
      {page === 'plan' && <PlanPage />}

      {dialog === 'transaction' && <TransactionModal onClose={() => setDialog(null)} onSave={addTransaction} onAddAccount={() => setDialog('account')} />}
      {dialog === 'bill' && <BillModal onClose={() => setDialog(null)} onSave={addBill} />}
      {dialog === 'account' && <AccountModal onClose={() => setDialog(null)} onSave={addAccount} />}
    </AppShell>
  );
};

export const Workspace: React.FC<{ email: string; name?: string; onSignOut: () => void | Promise<void> }> = (props) => (
  <AppDataProvider>
    <WorkspaceInner {...props} />
  </AppDataProvider>
);
