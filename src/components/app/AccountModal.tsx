import React, { useState } from 'react';
import { Field, Modal, inputClass, primaryBtn, secondaryBtn } from './Modal';
import { ACCOUNT_TYPES, type Account, type AccountKind } from '../../lib/finance';

export const AccountModal: React.FC<{
  onClose: () => void;
  onSave: (a: Omit<Account, 'id'>) => Promise<boolean>;
}> = ({ onClose, onSave }) => {
  const [kind, setKind] = useState<AccountKind>('asset');
  const [name, setName] = useState('');
  const [type, setType] = useState(ACCOUNT_TYPES.asset[0]);
  const [opening, setOpening] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const switchKind = (k: AccountKind) => {
    setKind(k);
    setType(ACCOUNT_TYPES[k][0]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const value = opening.trim() === '' ? 0 : Number(opening);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter an account name.';
    if (!Number.isFinite(value) || value < 0) next.opening = 'Enter 0 or a positive amount.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const ok = await onSave({ name: name.trim(), kind, type, opening: value });
    setSaving(false);
    if (ok) onClose();
    else setErrors({ name: 'Could not save. Check that the name is not already used.' });
  };

  return (
    <Modal title="Add an account" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl" role="group" aria-label="Account kind">
          {(['asset', 'liability'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={kind === k}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                kind === k ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {k === 'asset' ? 'Asset (you own)' : 'Liability (you owe)'}
            </button>
          ))}
        </div>

        <Field label="Account name" htmlFor="acct-name" error={errors.name}>
          <input id="acct-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HDFC Savings" autoFocus />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" htmlFor="acct-type">
            <select id="acct-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
              {ACCOUNT_TYPES[kind].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label={kind === 'asset' ? 'Current balance (₹)' : 'Amount owed (₹)'} htmlFor="acct-opening" error={errors.opening}>
            <input id="acct-opening" className={`${inputClass} font-mono`} type="number" inputMode="decimal" min="0" step="0.01" value={opening} onChange={(e) => setOpening(e.target.value)} placeholder="0.00" />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryBtn}>{saving ? 'Saving…' : 'Add account'}</button>
        </div>
      </form>
    </Modal>
  );
};
