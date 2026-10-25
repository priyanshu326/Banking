import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
  CreditCard,
  QrCode,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { CategoryType, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    selectedTransactionId,
    setSelectedTransactionId,
    setActiveExplainerModal,
    setActiveReceiptTxn,
    showToast
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'debit' | 'credit'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeDetailTxn, setActiveDetailTxn] = useState<Transaction | null>(
    selectedTransactionId ? transactions.find(t => t.id === selectedTransactionId) || null : null
  );

  // Filter transactions
  const filteredTxns = transactions.filter(txn => {
    const matchesSearch =
      txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.recipientUpiId && txn.recipientUpiId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || txn.category === selectedCategory;

    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'debit' && txn.amount < 0) ||
      (selectedType === 'credit' && txn.amount > 0);

    const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleExportStatement = () => {
    showToast('Statement Exported', 'Downloaded account ledger as CSV & encrypted PDF', 'success');
  };

  const handleOpenDetail = (txn: Transaction) => {
    setActiveDetailTxn(txn);
    setSelectedTransactionId(txn.id);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Activity & Transactions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time ledger with contextual categorization and balance reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportStatement}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by merchant, note, or reference ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {(['all', 'debit', 'credit'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedType === type
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'All Flow' : type === 'debit' ? 'Debits (−)' : 'Credits (+)'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {['All', 'Food & Dining', 'Subscriptions', 'Income', 'Transfers', 'Shopping', 'Transport', 'Bills & Utilities'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table / Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main List */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Showing {filteredTxns.length} transactions</span>
            <span>Zero Unreconciled</span>
          </div>

          {filteredTxns.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-sm font-semibold">No transactions match your search</p>
              <p className="text-xs">Try searching for a different keyword or reset filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTxns.map(txn => {
                const isCredit = txn.amount > 0;
                const isSelected = activeDetailTxn?.id === txn.id;

                return (
                  <div
                    key={txn.id}
                    onClick={() => handleOpenDetail(txn)}
                    className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {txn.merchant}
                          </p>
                          {txn.isDuplicateCandidate && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              Duplicate?
                            </span>
                          )}
                          {txn.isUnusual && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400">
                              Unusual
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {txn.category} · {txn.timestamp}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {txn.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-base font-mono font-bold ${
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {isCredit ? '+' : '−'}₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Bal: ₹{txn.balanceAfter.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction Detail Panel (Desktop Right Column / Persistent Drawer) */}
        <div className="lg:col-span-4">
          {activeDetailTxn ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Transaction Audit Detail
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeDetailTxn.status}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400">Total Transaction Value</span>
                <p className={`text-3xl font-mono font-extrabold mt-1 ${
                  activeDetailTxn.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {activeDetailTxn.amount > 0 ? '+' : '−'}₹{Math.abs(activeDetailTxn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {activeDetailTxn.merchant}
                </p>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeDetailTxn.timestamp}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDetailTxn.category}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">{activeDetailTxn.paymentMethod}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Reference (RRN):</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{activeDetailTxn.referenceNumber}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Balance Before:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">
                    ₹{activeDetailTxn.balanceBefore.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Balance After:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                    ₹{activeDetailTxn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Context Note */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Deduction Context:</p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {activeDetailTxn.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setActiveReceiptTxn(activeDetailTxn);
                    setActiveExplainerModal('receipt');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified Receipt</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-10 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-3">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Select a transaction
              </p>
              <p className="text-xs text-slate-400">
                Click any item from your ledger to view its cryptographically verifiable audit trail.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
