import {
  Banknote,
  Clapperboard,
  House,
  HeartPulse,
  Percent,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryKey } from '../../lib/finance';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  /** Pill styling (full class strings so Tailwind can see them). */
  chip: string;
  /** Solid dot / bar colour. */
  dot: string;
  /** Icon tile styling. */
  tile: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  income: { label: 'Income', icon: Banknote, chip: 'bg-[#12B76A]/10 text-[#078C52] border-emerald-200/60', dot: 'bg-[#12B76A]', tile: 'bg-[#12B76A]/10 text-[#078C52]' },
  interest: { label: 'Interest', icon: Percent, chip: 'bg-teal-50 text-teal-700 border-teal-200/60', dot: 'bg-teal-500', tile: 'bg-teal-50 text-teal-600' },
  housing: { label: 'Housing', icon: House, chip: 'bg-[#F13636]/10 text-[#F13636] border-red-200/60', dot: 'bg-[#F13636]', tile: 'bg-[#F13636]/10 text-[#F13636]' },
  food: { label: 'Food & Dining', icon: Utensils, chip: 'bg-orange-50 text-orange-700 border-orange-200/60', dot: 'bg-orange-500', tile: 'bg-orange-50 text-orange-600' },
  transport: { label: 'Transportation', icon: Car, chip: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500', tile: 'bg-blue-50 text-blue-600' },
  entertainment: { label: 'Entertainment', icon: Clapperboard, chip: 'bg-violet-50 text-violet-700 border-violet-200/60', dot: 'bg-violet-500', tile: 'bg-violet-50 text-violet-600' },
  shopping: { label: 'Shopping', icon: ShoppingBag, chip: 'bg-pink-50 text-pink-700 border-pink-200/60', dot: 'bg-pink-500', tile: 'bg-pink-50 text-pink-600' },
  utilities: { label: 'Utilities', icon: Zap, chip: 'bg-[#F79009]/10 text-[#DC6803] border-amber-200/60', dot: 'bg-amber-500', tile: 'bg-[#F79009]/10 text-[#DC6803]' },
  health: { label: 'Health', icon: HeartPulse, chip: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500', tile: 'bg-rose-50 text-rose-600' },
  subscriptions: { label: 'Subscriptions', icon: Repeat, chip: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', dot: 'bg-indigo-500', tile: 'bg-indigo-50 text-indigo-600' },
  insurance: { label: 'Insurance', icon: ShieldCheck, chip: 'bg-slate-100 text-slate-700 border-slate-200/70', dot: 'bg-slate-500', tile: 'bg-slate-100 text-slate-600' },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];
export const EXPENSE_CATEGORY_KEYS = CATEGORY_KEYS.filter((k) => k !== 'income' && k !== 'interest');
export const INCOME_CATEGORY_KEYS: CategoryKey[] = ['income', 'interest'];

export const CategoryChip: React.FC<{ category: CategoryKey }> = ({ category }) => {
  const { label, icon: Icon, chip } = CATEGORIES[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${chip}`}>
      <Icon className="w-3 h-3" />
      <span className="truncate">{label}</span>
    </span>
  );
};

export const CategoryTile: React.FC<{ category: CategoryKey; className?: string }> = ({ category, className = '' }) => {
  const { icon: Icon, tile } = CATEGORIES[category];
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tile} ${className}`}>
      <Icon className="w-4 h-4" />
    </div>
  );
};

/** Hex colours matching each category's `dot`, for SVG charts. */
export const CATEGORY_HEX: Record<CategoryKey, string> = {
  income: '#10b981', interest: '#14b8a6', housing: '#ef4444', food: '#f97316', transport: '#3b82f6',
  entertainment: '#8b5cf6', shopping: '#ec4899', utilities: '#f59e0b', health: '#f43f5e',
  subscriptions: '#6366f1', insurance: '#64748b',
};
