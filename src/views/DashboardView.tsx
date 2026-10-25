import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  ShieldCheck,
  Sparkles,
  SendHorizontal,
  Download,
  QrCode,
  Users,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  ArrowRight,
  CreditCard,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const {
    user,
    availableBalance,
    monthlySpending,
    monthlyIncome,
    upcomingTotal,
    safeToSpendAmount,
    transactions,
    commitments,
    savingsGoals,
    insights,
    navigateTo,
    setActiveExplainerModal,
    setSelectedTransactionId,
    setActiveReceiptTxn,
    sectionVisibility,
    toggleSectionVisibility
  } = useBanking();

  const [hideBalances, setHideBalances] = useState(false);
  const [showPersonalizeMenu, setShowPersonalizeMenu] = useState(false);

  const recentTxns = transactions.slice(0, 5);
  const primarySavingsGoal = savingsGoals[0] || {
    name: 'New Laptop (M3 Max)',
    currentAmount: 28500,
    targetAmount: 60000,
    monthlyContribution: 5000
  };

  const balanceInt = Math.floor(availableBalance);
  const balanceDec = (availableBalance % 1).toFixed(2).substring(2);

  const getCategoryIconStyle = (category: string, isCredit: boolean) => {
    if (isCredit) {
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' };
    }
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('dining')) {
      return { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-500' };
    }
    if (cat.includes('entertainment') || cat.includes('subscription')) {
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-500' };
    }
    return { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-500' };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner / AI Alert if any unusual activity or duplicate */}
      {sectionVisibility.aiInsightsBanner && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {insights[0].title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-800/40 text-amber-900 dark:text-amber-200">
                  {insights[0].confidence}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {insights[0].description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => navigateTo(insights[0].actionRoute || '/insights')}
              className="px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-300/70 dark:bg-amber-800/50 dark:hover:bg-amber-800/80 text-amber-950 dark:text-amber-100 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>{insights[0].actionLabel || 'Review'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Top Controls: Section Title & Utility Actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Command Center
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Financial Overview
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs transition-colors text-xs font-medium flex items-center gap-1.5"
            title={hideBalances ? 'Show Balances' : 'Hide Balances'}
          >
            {hideBalances ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{hideBalances ? 'Balances Hidden' : 'Hide Balance'}</span>
          </button>

          <button
            onClick={() => setShowPersonalizeMenu(!showPersonalizeMenu)}
            className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xs transition-colors text-xs font-medium flex items-center gap-1.5"
            title="Personalize Dashboard"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
      </div>

      {/* Personalization Drawer Toggle */}
      {showPersonalizeMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Dashboard View Customization
            </span>
            <span className="text-[11px] text-slate-400">
              Toggle dashboard widgets
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(sectionVisibility).map(([key, isVisible]) => (
              <button
                key={key}
                onClick={() => toggleSectionVisibility(key as any)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isVisible
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-medium shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-[10px] font-mono font-bold">{isVisible ? 'ON' : 'OFF'}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Primary Sleek Cards Grid (Available Balance + Savings Goal) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Available Balance Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                Available Balance
              </span>
              <span className="text-xs font-mono text-slate-400">
                {user.accountNumberMasked}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {hideBalances ? '••••••' : `₹${balanceInt.toLocaleString('en-IN')}`}
              </span>
              {!hideBalances && (
                <span className="text-2xl sm:text-3xl opacity-40 font-medium text-slate-900 dark:text-white">
                  .{balanceDec}
                </span>
              )}
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                12% ↑
              </span>
            </div>
          </div>

          {/* Sub-grid with top border: Safe to Spend & Upcoming Commitment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Safe to Spend
                </span>
                <button
                  onClick={() => setActiveExplainerModal('safe-to-spend')}
                  className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-[10px] flex items-center justify-center font-bold transition-colors"
                  title="How is this calculated?"
                >
                  ?
                </button>
              </div>
              <p className="text-2xl font-bold text-[#0F172A] dark:text-white">
                {hideBalances ? '••••' : `₹${safeToSpendAmount.toLocaleString('en-IN')}`}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Flexible spending available this cycle
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 block">
                Next Commitment
              </span>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {commitments[0] ? `₹${commitments[0].amount.toLocaleString('en-IN')}` : '₹0'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {commitments[0] ? `${commitments[0].title} • Due in ${commitments[0].daysRemaining} days` : 'No upcoming bills'}
              </p>
            </div>
          </div>

          {/* Decorative Subtle Background Circle */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-slate-50 dark:bg-slate-800/20 rounded-full opacity-50 pointer-events-none" />
        </div>

        {/* Right Sleek Dark Savings Goal Card (1 Col) */}
        <div className="bg-[#0F172A] dark:bg-slate-900 rounded-[32px] p-8 text-white flex flex-col justify-between border border-slate-800 shadow-sm relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                Savings Goal
              </h3>
              <button
                onClick={() => navigateTo('/savings')}
                className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-white/60 text-sm mb-6">
              {primarySavingsGoal.name}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-emerald-400 font-bold">
                  {((primarySavingsGoal.currentAmount / primarySavingsGoal.targetAmount) * 100).toFixed(1)}% Complete
                </span>
                <span className="text-white/60 font-mono">
                  Goal: ₹{primarySavingsGoal.targetAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(primarySavingsGoal.currentAmount / primarySavingsGoal.targetAmount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Allocation Badge */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold font-mono text-white">
                ₹{primarySavingsGoal.currentAmount.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">
                Current Allocation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      {sectionVisibility.quickActions && (
        <div className="bg-white dark:bg-[#0f172a] rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => navigateTo('/payments')}
              className="p-3.5 rounded-2xl bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm hover:opacity-90 transition-all active:scale-95"
            >
              <SendHorizontal className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Send Money</span>
            </button>

            <button
              onClick={() => navigateTo('/shared-expenses')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Split Expense</span>
            </button>

            <button
              onClick={() => navigateTo('/savings')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <span>Add Goal</span>
            </button>

            <button
              onClick={() => setActiveExplainerModal('what-if')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>What-If Test</span>
            </button>

            <button
              onClick={() => navigateTo('/security')}
              className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Security Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Split: Recent Transactions (Left) + Insights & Commitments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Transactions Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Recent Transactions
            </h3>
            <button
              onClick={() => navigateTo('/transactions')}
              className="text-xs font-semibold text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-colors"
            >
              View all
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm">
            {recentTxns.map(txn => {
              const isCredit = txn.amount > 0;
              const catStyle = getCategoryIconStyle(txn.category, isCredit);

              return (
                <div
                  key={txn.id}
                  onClick={() => {
                    setSelectedTransactionId(txn.id);
                    navigateTo('/transactions', { txnId: txn.id });
                  }}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/80 last:border-b-0 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 ${catStyle.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                      {isCredit ? (
                        <ArrowDownLeft className={`w-5 h-5 ${catStyle.text}`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 ${catStyle.text}`} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {txn.merchant}
                        </span>
                        {txn.isUnusual && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                            Unusual
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {txn.category} • {txn.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${
                      isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {isCredit ? '+' : '−'}₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {txn.paymentMethod}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Financial Insight & Coming Up (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Financial Insight Card (Blue) */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-[24px] p-6 border border-blue-100 dark:border-blue-900/50 flex flex-col gap-3 relative overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                Spending Optimization
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed mt-1">
                Your dining spend was 12% lower this week than usual. You could save ₹1,400 if this trend continues.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/insights')}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider text-left hover:underline flex items-center gap-1"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Coming Up Commitments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">
                Coming Up
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">
                ₹{upcomingTotal.toLocaleString('en-IN')} total
              </span>
            </div>

            <div className="space-y-3">
              {commitments.slice(0, 3).map((com, idx) => (
                <div
                  key={com.id}
                  className="bg-white dark:bg-[#0f172a] p-4 rounded-[20px] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {com.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Due in {com.daysRemaining} days • {com.autoDebit ? 'Auto-debit' : 'Manual'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    ₹{com.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigateTo('/payments')}
              className="w-full mt-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors text-center"
            >
              Manage Commitments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
