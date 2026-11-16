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

type Dialog = 'transaction' | 'bill' | null;

const WorkspaceInner: React.FC<{ email: string; onSignOut: () => void | Promise<void> }> = ({ email, onSignOut }) => {
  const [page, setPage] = useState<Page>('home');
  const [dialog, setDialog] = useState<Dialog>(null);
  const { addTransaction, addBill } = useAppData();

  // Each page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // "jack.brown@x.com" -> "Jack"
  const first = email.split('@')[0].split(/[._\-+\d]+/)[0];
  const name = first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';

  return (
    <AppShell page={page} onNavigate={setPage} email={email} onSignOut={onSignOut}>
      {page === 'home' && <HomePage name={name} onNavigate={setPage} onAdd={() => setDialog('transaction')} />}
      {page === 'transactions' && <TransactionsPage onAdd={() => setDialog('transaction')} />}
      {page === 'bills' && <BillsPage onAdd={() => setDialog('bill')} />}
      {page === 'reports' && <ReportsPage />}
      {page === 'plan' && <PlanPage />}

      {dialog === 'transaction' && <TransactionModal onClose={() => setDialog(null)} onSave={addTransaction} />}
      {dialog === 'bill' && <BillModal onClose={() => setDialog(null)} onSave={addBill} />}
    </AppShell>
  );
};

export const Workspace: React.FC<{ email: string; onSignOut: () => void | Promise<void> }> = (props) => (
  <AppDataProvider>
    <WorkspaceInner {...props} />
  </AppDataProvider>
);
