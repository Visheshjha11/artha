import React from 'react';
import { 
  Plus, 
  Minus, 
  ArrowLeftRight, 
  Pencil, 
  Shapes, 
  Store, 
  Tag, 
  SlidersHorizontal, 
  Upload, 
  Link2, 
  ClipboardList 
} from 'lucide-react';

export const InteractiveFeaturesText: React.FC = () => {
  return (
    <section className="w-full max-w-[960px] mx-auto px-4 py-16 md:py-24 text-center select-none">
      <div className="flex flex-col gap-8 md:gap-10 text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.6rem] font-normal tracking-[-0.03em] leading-[1.3] text-gray-400">
        
        {/* Line 1: Create a new income + expense - or transfer ⇄ transaction */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          <span>Create a new</span>
          <span className="text-gray-900 font-medium">income</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-700 border border-emerald-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span className="text-gray-900 font-medium">expense</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100/80 text-rose-600 border border-rose-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span>or transfer</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 border border-blue-200/50 shadow-2xs hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span>transaction</span>
        </div>

        {/* Line 2: Edit it ✏️ add custom categories ◬ merchants 🏪 and tags 🏷️ */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          <span className="text-gray-900 font-medium">Edit</span>
          <span>it</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100/80 text-purple-600 border border-purple-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Pencil className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span>add custom</span>
          <span className="text-gray-900 font-medium">categories</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100/80 text-teal-600 border border-teal-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Shapes className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span className="text-gray-900 font-medium">merchants</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100/80 text-amber-600 border border-amber-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Store className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span>and</span>
          <span className="text-gray-900 font-medium">tags</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100/80 text-orange-600 border border-orange-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Tag className="w-4 h-4 stroke-[2.2]" />
          </span>
        </div>

        {/* Line 3: Create filters 🪮 Import via CSV 📤 */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          <span>Create</span>
          <span className="text-gray-900 font-medium">filters</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-fuchsia-100/80 text-fuchsia-600 border border-fuchsia-200/50 shadow-2xs hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span className="text-gray-900 font-medium">Import</span>
          <span>via CSV</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100/80 text-indigo-600 border border-indigo-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Upload className="w-4 h-4 stroke-[2.2]" />
          </span>
        </div>

        {/* Line 4: Link transactions 🔗 Set up rules 📋 and more */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          <span className="text-gray-900 font-medium">Link</span>
          <span>transactions</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-100/80 text-sky-600 border border-sky-200/50 shadow-2xs hover:scale-110 transition-transform">
            <Link2 className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span>Set up</span>
          <span className="text-gray-900 font-medium">rules</span>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100/80 text-pink-600 border border-pink-200/50 shadow-2xs hover:scale-110 transition-transform">
            <ClipboardList className="w-4 h-4 stroke-[2.2]" />
          </span>
          <span>and more</span>
        </div>

      </div>
    </section>
  );
};
