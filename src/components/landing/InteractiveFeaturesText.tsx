import React from 'react';
import { 
  Plus, 
  Minus, 
  ArrowLeftRight, 
  Pencil, 
  Store, 
  Tag, 
  SlidersHorizontal, 
  Upload, 
  Link2, 
  ClipboardList 
} from 'lucide-react';

export const InteractiveFeaturesText: React.FC = () => {
  return (
    <section className="w-full max-w-[1000px] mx-auto px-4 py-20 md:py-28 text-center select-none">
      <div className="flex flex-col gap-8 md:gap-10 text-2xl sm:text-3xl md:text-[2.35rem] lg:text-[2.65rem] font-normal tracking-[-0.03em] leading-[1.38] text-[#8A95A5]">
        
        {/* Block 1: Create a new income + expense - or transfer ⇄ / transaction */}
        <div>
          <div>
            <span>Create a new </span>
            <span className="text-[#111827] font-medium">income</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E1F8EC] text-[#059669] border border-[#B7F4D3] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>{' '}
            <span className="text-[#111827] font-medium">expense</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEE2E2] text-[#E11D48] border border-[#FECDD3] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>{' '}
            <span>or transfer</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E0EDFF] text-[#2563EB] border border-[#BFDBFE] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>
          </div>
          <div className="mt-1">
            <span>transaction</span>
          </div>
        </div>

        {/* Block 2: Edit it ✏️ add custom categories ◬ merchants 🏪 and / tags 🏷️ */}
        <div>
          <div>
            <span className="text-[#111827] font-medium">Edit</span> <span>it</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5EEFF] text-[#9333EA] border border-[#E9D5FF] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </span>{' '}
            <span>add custom </span>
            <span className="text-[#111827] font-medium">categories</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E0F7F4] text-[#0D9488] border border-[#99F6E4] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D9488]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="5" r="2.5" />
                <circle cx="5" cy="15" r="2.5" />
                <circle cx="15" cy="15" r="2.5" />
                <line x1="8" y1="7" x2="6.5" y2="13" />
                <line x1="12" y1="7" x2="13.5" y2="13" />
              </svg>
            </span>{' '}
            <span className="text-[#111827] font-medium">merchants</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </span>{' '}
            <span>and</span>
          </div>
          <div className="mt-1">
            <span className="text-[#111827] font-medium">tags</span>{' '}
            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFEDD5] text-[#EA580C] border border-[#FED7AA] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </span>
          </div>
        </div>

        {/* Block 3: Create filters 🎚️ Import via CSV ⇪ */}
        <div>
          <span>Create </span>
          <span className="text-[#111827] font-medium">filters</span>{' '}
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FCE7F3] text-[#DB2777] border border-[#FBCFE8] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </span>{' '}
          <span className="text-[#111827] font-medium">Import</span>{' '}
          <span>via CSV</span>{' '}
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </span>
        </div>

        {/* Block 4: Link transactions 🔗 Set up rules 📋 and more */}
        <div>
          <span className="text-[#111827] font-medium">Link</span>{' '}
          <span>transactions</span>{' '}
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
            <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </span>{' '}
          <span>Set up </span>
          <span className="text-[#111827] font-medium">rules</span>{' '}
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDF2F8] text-[#E11D48] border border-[#FCE7F3] align-middle mx-1 shadow-2xs hover:scale-110 transition-transform">
            <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </span>{' '}
          <span>and more</span>
        </div>

      </div>
    </section>
  );
};
