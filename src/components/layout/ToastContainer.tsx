import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBanking();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let Icon = Info;
          let colorClass = 'border-blue-500/30 bg-slate-900/95 text-blue-300 dark:bg-slate-900/95';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            colorClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-400 dark:bg-slate-900/95';
          } else if (toast.type === 'amber') {
            Icon = AlertCircle;
            colorClass = 'border-amber-500/40 bg-slate-900/95 text-amber-400 dark:bg-slate-900/95';
          } else if (toast.type === 'error') {
            Icon = ShieldAlert;
            colorClass = 'border-rose-500/40 bg-slate-900/95 text-rose-400 dark:bg-slate-900/95';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 ${colorClass}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
