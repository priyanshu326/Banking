import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { ShieldCheck, Info, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SafeToSpendExplainerModal: React.FC = () => {
  const { activeExplainerModal, setActiveExplainerModal, safeToSpendCalculation, navigateTo } = useBanking();

  if (activeExplainerModal !== 'safe-to-spend') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  How Safe-to-Spend is Calculated
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transparent breakdown of your flexible monthly budget
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveExplainerModal(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Math & Calculation Table */}
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Current Available Balance
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  +₹{safeToSpendCalculation.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-amber-600 dark:text-amber-400">
                <div className="flex items-center gap-1.5">
                  <span>− Upcoming Commitments (next 14 days)</span>
                </div>
                <span className="font-mono font-bold">
                  −₹{safeToSpendCalculation.upcomingCommitments.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400">
                <div className="flex items-center gap-1.5">
                  <span>− Monthly Savings Allocation Target</span>
                </div>
                <span className="font-mono font-bold">
                  −₹{safeToSpendCalculation.savingsAllocation.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Flexible Safe-to-Spend
                  </span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Freely available for discretionary purchases
                  </p>
                </div>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{safeToSpendCalculation.flexibleSpending.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Explanatory Context */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                <p className="font-semibold mb-0.5">Trust & Control Principle:</p>
                <p className="opacity-90">{safeToSpendCalculation.disclaimer}</p>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Real-time calculation recalculated after every transaction.</span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveExplainerModal(null);
                navigateTo('/insights');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore full spending breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setActiveExplainerModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
