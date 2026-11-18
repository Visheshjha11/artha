import React, { useState } from 'react';
import { Field, Modal, inputClass, primaryBtn, secondaryBtn } from './Modal';
import { CATEGORIES, EXPENSE_CATEGORY_KEYS, INCOME_CATEGORY_KEYS } from './categories';
import { useAppData } from './AppData';
import { dayOffset, type CategoryKey, type Transaction } from '../../lib/finance';

export const TransactionModal: React.FC<{
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id'>) => Promise<boolean>;
  onAddAccount: () => void;
}> = ({ onClose, onSave, onAddAccount }) => {
  const { accounts } = useAppData();
  const [kind, setKind] = useState<'expense' | 'income'>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey>('food');
  const [account, setAccount] = useState<string>('');
  const [date, setDate] = useState(dayOffset(0));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const accountName = account || accounts[0]?.name || '';

  const categories = kind === 'expense' ? EXPENSE_CATEGORY_KEYS : INCOME_CATEGORY_KEYS;

  const switchKind = (k: 'expense' | 'income') => {
    setKind(k);
    setCategory(k === 'expense' ? 'food' : 'income');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const value = Number(amount);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter a name or merchant.';
    if (!Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount greater than 0.';
    if (!date) next.date = 'Pick a date.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const ok = await onSave({
      name: name.trim(),
      amount: kind === 'expense' ? -value : value,
      date,
      category,
      account: accountName,
    });
    setSaving(false);
    if (ok) onClose();
  };

  if (accounts.length === 0) {
    return (
      <Modal title="New transaction" onClose={onClose}>
        <p className="text-sm text-gray-600">Add an account first, such as a bank account, card or cash wallet. Every transaction belongs to one.</p>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="button" onClick={onAddAccount} className={primaryBtn}>Add account</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="New transaction" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl" role="group" aria-label="Transaction type">
          {(['expense', 'income'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={kind === k}
              className={`py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                kind === k ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <Field label="Name" htmlFor="tx-name" error={errors.name}>
          <input id="tx-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Swiggy" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)" htmlFor="tx-amount" error={errors.amount}>
            <input id="tx-amount" className={`${inputClass} font-mono`} inputMode="decimal" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Date" htmlFor="tx-date" error={errors.date}>
            <input id="tx-date" className={inputClass} type="date" value={date} max={dayOffset(0)} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category" htmlFor="tx-cat">
            <select id="tx-cat" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as CategoryKey)}>
              {categories.map((k) => (
                <option key={k} value={k}>{CATEGORIES[k].label}</option>
              ))}
            </select>
          </Field>
          <Field label="Account" htmlFor="tx-acct">
            <select id="tx-acct" className={inputClass} value={accountName} onChange={(e) => setAccount(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Add transaction'}</button>
        </div>
      </form>
    </Modal>
  );
};
