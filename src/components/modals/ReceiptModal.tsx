import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { ShieldCheck, CheckCircle2, Download, Share2, X, FileText, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReceiptModal: React.FC = () => {
  const { activeExplainerModal, setActiveExplainerModal, activeReceiptTxn, showToast } = useBanking();

  if (activeExplainerModal !== 'receipt' || !activeReceiptTxn) return null;

  const txn = activeReceiptTxn;
  const isCredit = txn.amount > 0;

  const handleDownload = () => {
    showToast('Receipt Saved', `Exported digital receipt for ${txn.merchant} as PDF`, 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`VAULT Payment Receipt: Ref ${txn.referenceNumber} for ₹${Math.abs(txn.amount)} to ${txn.merchant}`);
    }
    showToast('Receipt Copied', 'Receipt details copied to clipboard', 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Top Banner */}
          <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative">
            <button
              onClick={() => setActiveExplainerModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL VAULT TRANSACTION RECEIPT</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Transaction Amount</span>
                <p className="text-3xl font-extrabold font-mono tracking-tight text-white mt-1">
                  {isCredit ? '+' : '−'}₹{Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settled</span>
                </span>
              </div>
            </div>
          </div>

          {/* Receipt Body Details */}
          <div className="p-6 space-y-4">
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Recipient / Merchant</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">{txn.merchant}</span>
              </div>

              {txn.recipientUpiId && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">UPI ID / Handle</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{txn.recipientUpiId}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Date & Timestamp</span>
                <span className="text-slate-700 dark:text-slate-300">{txn.timestamp}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Payment Channel</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{txn.paymentMethod}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Reference Number (RRN)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{txn.referenceNumber}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Transaction Fee</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹0.00 (Zero Fee)</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Account Balance Post-Transaction</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{txn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Simulated verification badge */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Cryptographically Signed</p>
                  <p>NPCI UPI Verified / SHA-256 Checksum</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">VALID</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
