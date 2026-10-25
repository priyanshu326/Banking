import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  PiggyBank,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SavingsView: React.FC = () => {
  const { savingsGoals, addSavingsDeposit, createSavingsGoal, availableBalance, showToast } = useBanking();
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(2000);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New goal state
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(30000);
  const [newGoalCategory, setNewGoalCategory] = useState('Travel');
  const [newGoalMonths, setNewGoalMonths] = useState<number>(6);

  const handleDepositSubmit = (goalId: string) => {
    if (depositAmount <= 0) return;
    if (depositAmount > availableBalance) {
      showToast('Insufficient Balance', 'Deposit amount exceeds available funds', 'error');
      return;
    }

    addSavingsDeposit(goalId, depositAmount);
    setShowDepositModal(null);
    setDepositAmount(2000);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || newGoalTarget <= 0) return;

    const monthlyRequired = Math.round(newGoalTarget / newGoalMonths);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + newGoalMonths);

    createSavingsGoal({
      name: newGoalName,
      targetAmount: newGoalTarget,
      currentAmount: 0,
      monthlyContribution: monthlyRequired,
      targetDate: targetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: newGoalCategory,
      autoSave: true,
      status: 'active'
    });

    setShowCreateModal(false);
    setNewGoalName('');
    setNewGoalTarget(30000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dynamic Savings & Planning
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Zero Pressure Goals
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Goals that adjust dynamically to your true cashflow without penalizing you
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map(goal => {
          const progressPercent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const remainingAmount = goal.targetAmount - goal.currentAmount;

          return (
            <div
              key={goal.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <PiggyBank className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {goal.category} · Target {goal.targetDate}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {progressPercent.toFixed(1)}%
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Saved: <strong className="font-mono text-slate-900 dark:text-white font-bold">₹{goal.currentAmount.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="text-slate-500 font-medium">
                      Target: <strong className="font-mono text-slate-900 dark:text-white font-bold">₹{goal.targetAmount.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Intelligent Allocation Card */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Allocation:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{goal.monthlyContribution.toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining to Save:</span>
                    <span className="font-mono font-bold text-amber-500">
                      ₹{remainingAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>On schedule for on-time completion with current income flow</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDepositModal(goal.id)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Money</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Add Funds to Goal
                </h3>
                <button
                  onClick={() => setShowDepositModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Deposit Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="100"
                      max={availableBalance}
                      step="500"
                      value={depositAmount}
                      onChange={e => setDepositAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xl font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    >
                      +₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  Deducted from available balance (₹{availableBalance.toLocaleString('en-IN')}).
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDepositSubmit(showDepositModal)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Goal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Create Savings Goal
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emergency Fund or Japan Vacation"
                    value={newGoalName}
                    onChange={e => setNewGoalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Amount (INR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newGoalTarget}
                    onChange={e => setNewGoalTarget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Timeline (Months)
                    </label>
                    <select
                      value={newGoalMonths}
                      onChange={e => setNewGoalMonths(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                      <option value={24}>24 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newGoalCategory}
                      onChange={e => setNewGoalCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Travel">Travel</option>
                      <option value="Emergency Fund">Emergency Fund</option>
                      <option value="Investment">Investment</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  Recommended allocation: <strong className="font-mono text-slate-900 dark:text-white">₹{Math.round(newGoalTarget / newGoalMonths).toLocaleString('en-IN')} / month</strong>.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
