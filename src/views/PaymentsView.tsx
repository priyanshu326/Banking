import React, { useState } from 'react';
import { useBanking, PaymentDraft } from '../context/BankingContext';
import {
  SendHorizontal,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Download,
  Share2,
  X,
  ChevronLeft,
  Search,
  UserCheck,
  CreditCard,
  QrCode
} from 'lucide-react';
import { RECENT_RECIPIENTS } from '../data/mockData';
import { CategoryType, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentsView: React.FC = () => {
  const {
    availableBalance,
    safeToSpendAmount,
    activePaymentDraft,
    setActivePaymentDraft,
    executePayment,
    navigateTo,
    setSelectedTransactionId,
    setActiveExplainerModal,
    setActiveReceiptTxn,
    showToast
  } = useBanking();

  // Payment flow step: 'select_recipient' -> 'enter_amount' -> 'review' -> 'success' | 'failed'
  const [paymentStep, setPaymentStep] = useState<'select' | 'amount' | 'review' | 'success' | 'failed'>('select');
  const [recipient, setRecipient] = useState<{ name: string; upiId: string; avatar?: string }>(
    activePaymentDraft ? { name: activePaymentDraft.recipientName, upiId: activePaymentDraft.recipientUpi, avatar: activePaymentDraft.recipientAvatar } : RECENT_RECIPIENTS[0]
  );
  const [customUpi, setCustomUpi] = useState('');
  const [amount, setAmount] = useState<number>(activePaymentDraft?.amount || 8500);
  const [note, setNote] = useState(activePaymentDraft?.note || 'Rent / Transfer share');
  const [category, setCategory] = useState<CategoryType>('Transfers');
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWhyWarning, setShowWhyWarning] = useState(false);

  const balanceAfter = availableBalance - amount;
  const flexibleAfter = Math.max(0, safeToSpendAmount - amount);
  const isHighSpendWarning = amount >= 5000;
  const isExceedingBalance = amount > availableBalance;

  const handleSelectRecipient = (rec: { name: string; upiId: string; avatar?: string }) => {
    setRecipient(rec);
    setPaymentStep('amount');
  };

  const handleCustomUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUpi.includes('@') && customUpi.length < 5) {
      showToast('Invalid UPI', 'Please enter a valid UPI ID or phone number', 'amber');
      return;
    }
    setRecipient({
      name: customUpi.split('@')[0].toUpperCase(),
      upiId: customUpi
    });
    setPaymentStep('amount');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Invalid Amount', 'Please enter an amount greater than ₹0', 'amber');
      return;
    }
    if (amount > availableBalance) {
      showToast('Insufficient Balance', 'Specified amount exceeds your available funds', 'error');
      return;
    }
    setActivePaymentDraft({
      recipientName: recipient.name,
      recipientUpi: recipient.upiId,
      recipientAvatar: recipient.avatar,
      amount,
      note,
      category
    });
    setPaymentStep('review');
  };

  const handleConfirmPayment = () => {
    if (simulateFailure) {
      setPaymentStep('failed');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = executePayment();
      setIsProcessing(false);
      if (result.success && result.transaction) {
        setCompletedTxn(result.transaction);
        setPaymentStep('success');
      } else {
        setPaymentStep('failed');
      }
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {paymentStep !== 'select' && paymentStep !== 'success' && (
            <button
              onClick={() => {
                if (paymentStep === 'amount') setPaymentStep('select');
                if (paymentStep === 'review') setPaymentStep('amount');
                if (paymentStep === 'failed') setPaymentStep('review');
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {paymentStep === 'review' ? 'Review Payment' : paymentStep === 'success' ? 'Payment Completed' : 'Send Money'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {paymentStep === 'review' ? 'Before You Pay — Know your impact before moving money' : 'Instant 24/7 UPI & Bank Transfer'}
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero-Anxiety Transfer</span>
        </div>
      </div>

      {/* STEP 1: Select Recipient */}
      {paymentStep === 'select' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Custom UPI / Phone Search */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enter Recipient UPI ID or Number
            </span>
            <form onSubmit={handleCustomUpiSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. rahul@okaxis or 9876543210"
                  value={customUpi}
                  onChange={e => setCustomUpi(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shrink-0"
              >
                Continue
              </button>
            </form>
          </div>

          {/* Frequent / Recent Recipients */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recent Recipients
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECENT_RECIPIENTS.map((rec, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectRecipient(rec)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.avatar}
                      alt={rec.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {rec.name}
                      </h4>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {rec.upiId}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {rec.note}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Enter Amount */}
      {paymentStep === 'amount' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
        >
          {/* Chosen Recipient Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recipient.avatar ? (
                <img
                  src={recipient.avatar}
                  alt={recipient.name}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  {recipient.name.slice(0, 2)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Paying to {recipient.name}
                </p>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {recipient.upiId}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPaymentStep('select')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Change
            </button>
          </div>

          {/* Amount Input */}
          <form onSubmit={handleProceedToReview} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  value={amount || ''}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  autoFocus
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-3xl font-extrabold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Amount Presets */}
              <div className="flex items-center gap-2 pt-1">
                {[500, 1200, 2000, 5000, 8500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      amount === amt
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Note & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Note / Reason
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="What is this for?"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CategoryType)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="Transfers">Transfers</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Balance Preview */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Available to spend: <strong className="font-mono text-slate-900 dark:text-white">₹{availableBalance.toLocaleString('en-IN')}</strong>
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                Instant UPI Settlement
              </span>
            </div>

            <button
              type="submit"
              disabled={amount <= 0 || amount > availableBalance}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Review Before Paying</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}

      {/* STEP 3: "Before You Pay" / Review Screen (Section 19) */}
      {paymentStep === 'review' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Main Review Card (Matching Section 19 Exact Specs) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Transparent Summary
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Review payment
              </h2>
            </div>

            {/* Breakdown Fields */}
            <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Recipient</span>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white block">{recipient.name}</span>
                  <span className="text-xs font-mono text-slate-400">{recipient.upiId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Transfer Amount</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Processing Fee</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ₹0.00 (Zero Fee)
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-700 dark:text-slate-200 font-bold">Total Debit</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white text-xl">
                  ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Balance after payment
                  </span>
                  <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                    ₹{balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    Updated Safe-to-Spend
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{flexibleAfter.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Spending Check Warning (Section 19) */}
            {isHighSpendWarning && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>⚠ Spending check</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWhyWarning(!showWhyWarning)}
                    className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Why am I seeing this?</span>
                  </button>
                </div>

                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  “This payment is significantly higher than your typical transaction. After this payment, your estimated flexible spending for the month will decrease from ₹{safeToSpendAmount.toLocaleString('en-IN')} to ₹{flexibleAfter.toLocaleString('en-IN')}.”
                </p>

                {showWhyWarning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 border-t border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-300/90 space-y-1 font-mono"
                  >
                    <p>Calculation: Median P2P transfer = ₹850. Current payment = ₹{amount.toLocaleString('en-IN')} (10x median).</p>
                    <p>Committed bills remain intact (₹13,947). User confirmation is required.</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Simulation switch for testing failure state */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Demo simulation mode:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={e => setSimulateFailure(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Simulate network failure</span>
              </label>
            </div>

            {/* CTAs (Section 19: Primary CTA: Confirm ₹8,500, Secondary CTA: Go Back) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Authorizing Transfer...</span>
                  </span>
                ) : (
                  <span>Confirm ₹{amount.toLocaleString('en-IN')}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentStep('amount')}
                disabled={isProcessing}
                className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors text-center"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Payment Success (Section 20) */}
      {paymentStep === 'success' && completedTxn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl text-center max-w-md mx-auto space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Payment Successful
            </span>
            <p className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Paid to {recipient.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedTxn.timestamp}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Transaction ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {completedTxn.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Updated Balance:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ₹{completedTxn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Actions (Section 20: View transaction, Download receipt, Share receipt, Done) */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                setActiveReceiptTxn(completedTxn);
                setActiveExplainerModal('receipt');
              }}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Receipt</span>
            </button>

            <button
              onClick={() => {
                setSelectedTransactionId(completedTxn.id);
                navigateTo('/transactions', { txnId: completedTxn.id });
              }}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>View Detail</span>
            </button>

            <button
              onClick={() => {
                setPaymentStep('select');
                navigateTo('/dashboard');
              }}
              className="col-span-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: Payment Failure (Section 21) */}
      {paymentStep === 'failed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl text-center max-w-md mx-auto space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Payment could not be completed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your funds remain completely safe in your VAULT account.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
            <p><strong>Reason:</strong> Simulated NPCI bank switch timeout.</p>
            <p><strong>Status:</strong> Money was <strong className="text-emerald-500">NOT deducted</strong>.</p>
            <p><strong>Next Step:</strong> You can safely retry in a few moments.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSimulateFailure(false);
                setPaymentStep('review');
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigateTo('/help')}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              View Support
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
