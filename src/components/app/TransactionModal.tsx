import React, { useState } from 'react';
import { Field, Modal, inputClass, primaryBtn, secondaryBtn } from './Modal';
import { CATEGORIES, EXPENSE_CATEGORY_KEYS, INCOME_CATEGORY_KEYS } from './categories';
import { ACCOUNTS, dayOffset, type CategoryKey, type Transaction } from '../../lib/finance';

export const TransactionModal: React.FC<{
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [kind, setKind] = useState<'expense' | 'income'>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey>('food');
  const [account, setAccount] = useState<string>(ACCOUNTS[0]);
  const [date, setDate] = useState(dayOffset(0));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = kind === 'expense' ? EXPENSE_CATEGORY_KEYS : INCOME_CATEGORY_KEYS;

  const switchKind = (k: 'expense' | 'income') => {
    setKind(k);
    setCategory(k === 'expense' ? 'food' : 'income');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter a name or merchant.';
    if (!Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount greater than 0.';
    if (!date) next.date = 'Pick a date.';
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({
      name: name.trim(),
      amount: kind === 'expense' ? -value : value,
      date,
      category,
      account,
    });
    onClose();
  };

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
            <select id="tx-acct" className={inputClass} value={account} onChange={(e) => setAccount(e.target.value)}>
              {ACCOUNTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" className={primaryBtn}>Add transaction</button>
        </div>
      </form>
    </Modal>
  );
};
