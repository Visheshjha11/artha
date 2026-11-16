import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    // Focus the first field so the form is keyboard-ready.
    panelRef.current?.querySelector<HTMLElement>('input, select, button[type="submit"]')?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px] p-0 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] max-h-[92dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
};

export const Field: React.FC<{ label: string; htmlFor: string; error?: string; children: React.ReactNode }> = ({
  label,
  htmlFor,
  error,
  children,
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export const inputClass =
  'w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all';

export const primaryBtn =
  'inline-flex items-center justify-center gap-1.5 bg-[#18181b] hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50';

export const secondaryBtn =
  'inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-lg text-xs font-medium shadow-2xs transition-colors cursor-pointer';
