import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  User,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  LogOut,
  Sliders,
  Sparkles,
  QrCode
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, logout, showToast } = useBanking();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (val: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val);
    }
    setCopiedField(label);
    showToast('Copied to Clipboard', `${label} copied successfully`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20"
          referrerPolicy="no-referrer"
        />

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full KYC Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.email} · {user.phoneNumber}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Details & Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Banking Identifiers
          </span>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-slate-400 block">Account Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {user.accountNumberMasked}
                </span>
              </div>
              <button
                onClick={() => handleCopy(user.accountNumberMasked, 'Account Number')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {copiedField === 'Account Number' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-slate-400 block">IFSC Code</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {user.ifsc}
                </span>
              </div>
              <button
                onClick={() => handleCopy(user.ifsc, 'IFSC Code')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {copiedField === 'IFSC Code' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-slate-400 block">Primary UPI Handle</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {user.upiId}
                </span>
              </div>
              <button
                onClick={() => handleCopy(user.upiId, 'UPI Handle')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {copiedField === 'UPI Handle' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Transfer Limits */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Daily Transfer Limits
          </span>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">UPI Instant Transfer Limit</span>
                <span className="font-mono text-slate-900 dark:text-white">₹1,00,000 / day</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8.5%' }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">₹8,500 used today</span>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">IMPS / NEFT Transfer Limit</span>
                <span className="font-mono text-slate-900 dark:text-white">₹10,00,000 / day</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">₹0 used today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
