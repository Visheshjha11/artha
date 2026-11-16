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
  income: { label: 'Income', icon: Banknote, chip: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500', tile: 'bg-emerald-50 text-emerald-600' },
  interest: { label: 'Interest', icon: Percent, chip: 'bg-teal-50 text-teal-700 border-teal-200/60', dot: 'bg-teal-500', tile: 'bg-teal-50 text-teal-600' },
  housing: { label: 'Housing', icon: House, chip: 'bg-red-50 text-red-700 border-red-200/60', dot: 'bg-red-500', tile: 'bg-red-50 text-red-600' },
  food: { label: 'Food & Dining', icon: Utensils, chip: 'bg-orange-50 text-orange-700 border-orange-200/60', dot: 'bg-orange-500', tile: 'bg-orange-50 text-orange-600' },
  transport: { label: 'Transportation', icon: Car, chip: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500', tile: 'bg-blue-50 text-blue-600' },
  entertainment: { label: 'Entertainment', icon: Clapperboard, chip: 'bg-violet-50 text-violet-700 border-violet-200/60', dot: 'bg-violet-500', tile: 'bg-violet-50 text-violet-600' },
  shopping: { label: 'Shopping', icon: ShoppingBag, chip: 'bg-pink-50 text-pink-700 border-pink-200/60', dot: 'bg-pink-500', tile: 'bg-pink-50 text-pink-600' },
  utilities: { label: 'Utilities', icon: Zap, chip: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500', tile: 'bg-amber-50 text-amber-600' },
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
