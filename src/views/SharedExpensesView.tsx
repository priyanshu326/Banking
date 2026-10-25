import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Users,
  Plus,
  CheckCircle2,
  Clock,
  SendHorizontal,
  Bell,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SharedExpensesView: React.FC = () => {
  const { sharedExpenses, markParticipantSettled, addSharedExpense, showToast } = useBanking();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTotal, setNewTotal] = useState<number>(1200);
  const [newCategory, setNewCategory] = useState('Food & Dining');
  const [participantsText, setParticipantsText] = useState('Rahul Sharma, Sneha Roy, Aman Verma');

  const handleNudge = (name: string, amount: number) => {
    showToast('UPI Nudge Sent', `Sent a payment reminder to ${name} for ₹${amount}`, 'info');
  };

  const handleCreateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTotal <= 0) return;

    const names = participantsText.split(',').map(s => s.trim()).filter(Boolean);
    const allMembers = ['Priyanshu (You)', ...names];
    const splitAmount = Math.round(newTotal / allMembers.length);

    addSharedExpense({
      title: newTitle,
      totalAmount: newTotal,
      paidBy: 'Priyanshu (You)',
      date: 'Today',
      category: newCategory,
      settledAmount: splitAmount, // Priyanshu's own share settled
      participants: allMembers.map(name => ({
        id: `p-${Date.now()}-${Math.random()}`,
        name,
        amount: splitAmount,
        settled: name.includes('You')
      }))
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewTotal(1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shared Expenses & Group Splits
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Built-in UPI Reconciliation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Split meals, travel, and shared subscriptions with direct bank reconciliation
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Shared Split</span>
        </button>
      </div>

      {/* Shared Expenses Feed */}
      <div className="space-y-6">
        {sharedExpenses.map(group => {
          const isFullySettled = group.settledAmount >= group.totalAmount;
          const pendingAmount = group.totalAmount - group.settledAmount;

          return (
            <div
              key={group.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              {/* Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {group.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {group.category} · Paid by {group.paidBy} on {group.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Expense</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                    ₹{group.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Settlement Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Settled: ₹{group.settledAmount.toLocaleString('en-IN')}
                  </span>
                  <span className={isFullySettled ? 'text-emerald-600' : 'text-amber-500'}>
                    {isFullySettled ? 'All Settled ✓' : `₹${pendingAmount.toLocaleString('en-IN')} Pending`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (group.settledAmount / group.totalAmount) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Participant Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.participants.map(p => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      p.settled
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </span>
                      {p.settled ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Settled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </span>

                      {!p.settled && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleNudge(p.name, p.amount)}
                            className="p-1 text-slate-400 hover:text-amber-500 rounded-lg"
                            title="Send UPI Nudge"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => markParticipantSettled(group.id, p.id)}
                            className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                          >
                            Mark Paid
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Shared Split Modal */}
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
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Create New Shared Split
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSplit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event / Expense Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekend Goa Trip or Cafe Brunch"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Amount (INR)
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newTotal}
                    onChange={e => setNewTotal(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Other Participants (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma, Sneha Roy, Aman Verma"
                    value={participantsText}
                    onChange={e => setParticipantsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  Split equally between you and {participantsText.split(',').length} friends = <strong className="font-mono text-slate-900 dark:text-white">₹{Math.round(newTotal / (participantsText.split(',').length + 1))} each</strong>.
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
                    Create Split
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
