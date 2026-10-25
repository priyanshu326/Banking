import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { Calculator, X, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SimulationWhatIfModal: React.FC = () => {
  const {
    activeExplainerModal,
    setActiveExplainerModal,
    availableBalance,
    safeToSpendAmount,
    navigateTo,
    setActivePaymentDraft
  } = useBanking();

  const [simulateAmount, setSimulateAmount] = useState<number>(5000);

  if (activeExplainerModal !== 'what-if') return null;

  const newBalance = Math.max(0, availableBalance - simulateAmount);
  const newSafeToSpend = Math.max(0, safeToSpendAmount - simulateAmount);
  const isHigherThanNormal = simulateAmount >= 5000;
  const isExceedingBalance = simulateAmount > availableBalance;

  const handleStartPaymentWithAmount = () => {
    setActivePaymentDraft({
      recipientName: 'Rahul Sharma',
      recipientUpi: 'rahul.sharma@okaxis',
      amount: simulateAmount,
      note: 'Simulated Payment',
      category: 'Transfers'
    });
    setActiveExplainerModal(null);
    navigateTo('/payments');
  };

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
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Spending Impact Simulator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Know how a planned expense affects your balance and goals
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

          <div className="p-6 space-y-5">
            {/* Amount input & presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Simulate an expenditure amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="500"
                  value={simulateAmount}
                  onChange={e => setSimulateAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xl font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Preset Pills */}
              <div className="flex items-center gap-2 mt-2.5">
                {[1500, 5000, 8500, 12000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSimulateAmount(amt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      simulateAmount === amt
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Calculation Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Available Balance
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm line-through text-slate-400 font-mono">
                    ₹{Math.round(availableBalance).toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ₹{Math.round(newBalance).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-rose-500 font-medium">
                  −₹{simulateAmount.toLocaleString('en-IN')} debit
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Safe-to-Spend
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm line-through text-slate-400 font-mono">
                    ₹{safeToSpendAmount.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{newSafeToSpend.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {newSafeToSpend > 5000 ? 'Comfortable buffer' : 'Tight buffer'}
                </span>
              </div>
            </div>

            {/* Contextual Intelligence Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isExceedingBalance ? (
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                ) : isHigherThanNormal ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <span>
                  {isExceedingBalance
                    ? 'Exceeds current account balance'
                    : isHigherThanNormal
                    ? 'Higher than your median monthly purchase'
                    : 'Within normal spending comfort range'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isExceedingBalance
                  ? `You currently have ₹${availableBalance.toLocaleString('en-IN')} available. An outlay of ₹${simulateAmount.toLocaleString('en-IN')} would require funding from linked accounts.`
                  : `After this expenditure, your committed bills (₹13,947) remain completely covered. Your "New Laptop" goal timeline may adjust by approximately ~3 days.`}
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveExplainerModal(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Close Simulator
            </button>

            {!isExceedingBalance && (
              <button
                onClick={handleStartPaymentWithAmount}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Proceed to Pay ₹{simulateAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
