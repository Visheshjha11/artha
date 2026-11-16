import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useAppData } from './AppData';
import { Card } from './AppShell';
import { daysUntil, formatDay, formatINR, toISO, startOfToday } from '../../lib/finance';

export const GoalsCard: React.FC = () => {
  const { goals, addGoal, contributeGoal } = useAppData();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(target);
    if (!name.trim() || !(t > 0) || !deadline) return;
    addGoal({ name: name.trim(), target: t, deadline });
    setName(''); setTarget(''); setDeadline(''); setAdding(false);
  };
  const field = 'h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white min-w-0';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 font-bold">Your goals</p>
          <p className="text-xs text-gray-500 mt-0.5">{goals.length} active</p>
        </div>
        <button type="button" onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-white border border-gray-300 rounded-lg shadow-xs cursor-pointer">
          <Plus className="w-3.5 h-3.5" />New goal
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} className="flex flex-wrap gap-2 mb-4">
          <input className={`${field} flex-1`} placeholder="Goal name" aria-label="Goal name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={`${field} w-28`} type="number" min="1" placeholder="Target ₹" aria-label="Target amount" value={target} onChange={(e) => setTarget(e.target.value)} />
          <input className={field} type="date" min={toISO(startOfToday())} aria-label="Target date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <button type="submit" className="h-9 px-4 text-sm font-medium bg-gray-900 text-white rounded-lg cursor-pointer">Add</button>
        </form>
      )}

      <ul className="flex flex-col gap-4">
        {goals.map((g) => {
          const pct = Math.min(100, (g.saved / g.target) * 100);
          const done = g.saved >= g.target;
          const left = daysUntil(g.deadline);
          return (
            <li key={g.id}>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-900 truncate flex-1">{g.name}</span>
                <span className="text-xs tabular-nums text-gray-500">{formatINR(g.saved)} / {formatINR(g.target)}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${done ? 'bg-[#12B76A]' : 'bg-gray-800'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
                <span>{done ? 'Goal reached' : `By ${formatDay(g.deadline, { day: 'numeric', month: 'short', year: 'numeric' })}${left < 0 ? ' · past due' : ''}`}</span>
                {!done && (
                  <button type="button" onClick={() => contributeGoal(g.id, 5000)}
                    className="font-medium text-[#078C52] hover:underline cursor-pointer">+ ₹5,000</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};
