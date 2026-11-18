import React, { useState } from 'react';
import { Field, Modal, inputClass, primaryBtn, secondaryBtn } from './Modal';
import { CATEGORIES, EXPENSE_CATEGORY_KEYS } from './categories';
import { dayOffset, type Bill, type BillFrequency, type CategoryKey } from '../../lib/finance';

const FREQUENCIES: BillFrequency[] = ['Monthly', 'Quarterly', 'Yearly'];

export const BillModal: React.FC<{
  onClose: () => void;
  onSave: (b: Omit<Bill, 'id' | 'status' | 'paidOn'>) => Promise<boolean>;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(dayOffset(7));
  const [frequency, setFrequency] = useState<BillFrequency>('Monthly');
  const [category, setCategory] = useState<CategoryKey>('utilities');
  const [autopay, setAutopay] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const value = Number(amount);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter a bill name.';
    if (!Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount greater than 0.';
    if (!dueDate) next.dueDate = 'Pick a due date.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const ok = await onSave({ name: name.trim(), amount: value, dueDate, frequency, category, autopay });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal title="Add a bill" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Bill name" htmlFor="bill-name" error={errors.name}>
          <input id="bill-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Water bill" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)" htmlFor="bill-amount" error={errors.amount}>
            <input id="bill-amount" className={`${inputClass} font-mono`} type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </Field>
          <Field label="Due date" htmlFor="bill-due" error={errors.dueDate}>
            <input id="bill-due" className={inputClass} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Repeats" htmlFor="bill-freq">
            <select id="bill-freq" className={inputClass} value={frequency} onChange={(e) => setFrequency(e.target.value as BillFrequency)}>
              {FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Category" htmlFor="bill-cat">
            <select id="bill-cat" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as CategoryKey)}>
              {EXPENSE_CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>{CATEGORIES[k].label}</option>
              ))}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer select-none">
          <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
          Paid automatically (auto-pay)
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Add bill'}</button>
        </div>
      </form>
    </Modal>
  );
};
