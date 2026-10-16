import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-lg shadow-xl border border-neutral-800 text-sm animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
