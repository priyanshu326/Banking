import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Flame,
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  X,
  User,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FirebaseConsoleModal: React.FC = () => {
  const {
    isFirebaseModalOpen,
    setIsFirebaseModalOpen,
    firebaseUser,
    isFirebaseConnected,
    isSyncingWithFirestore,
    firebaseProjectId,
    firebaseDatabaseId,
    firebaseConsoleUrl,
    loginWithGoogle,
    seedFirestoreData,
    transactions,
    commitments,
    savingsGoals,
    sharedExpenses,
    notifications,
    showToast
  } = useBanking();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  if (!isFirebaseModalOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied', `Copied ${key} to clipboard`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedFirestoreData();
      showToast('Cloud Database Synchronized', 'All ledger records, commitments, and goals pushed to Firestore', 'success');
    } catch (err: any) {
      showToast('Sync Notice', err?.message || 'Could not sync database', 'amber');
    } finally {
      setIsSeeding(false);
    }
  };

  const firestoreOverviewUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/overview`;
  const firestoreAuthUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/users`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Google Firebase Console
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live Cloud Firestore & Google Authentication Integration
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFirebaseModalOpen(false)}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Connection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Firebase Project ID
                </span>
                <button
                  onClick={() => copyToClipboard(firebaseProjectId, 'Project ID')}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Copy Project ID"
                >
                  {copiedKey === 'Project ID' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
                {firebaseProjectId}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Firestore Database ID
                </span>
                <button
                  onClick={() => copyToClipboard(firebaseDatabaseId, 'Database ID')}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Copy Database ID"
                >
                  {copiedKey === 'Database ID' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                {firebaseDatabaseId}
              </p>
            </div>
          </div>

          {/* Current Auth Session */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900/90 dark:to-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 overflow-hidden">
                {firebaseUser?.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={firebaseUser.displayName || 'Google User'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {firebaseUser ? firebaseUser.displayName || firebaseUser.email : 'Google Firebase Auth Session'}
                  {firebaseUser && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Active
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {firebaseUser?.email ? firebaseUser.email : 'Authenticated or local sandbox session'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!firebaseUser ? (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xs active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Sign In with Google</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Switch Account
                </button>
              )}
            </div>
          </div>

          {/* Active Cloud Firestore Collections */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                Active Firestore Collections
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Protected by ABAC Firestore Rules
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/transactions</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{transactions.length} docs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/commitments</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{commitments.length} docs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/savingsGoals</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{savingsGoals.length} docs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/sharedExpenses</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{sharedExpenses.length} docs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/notifications</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{notifications.length} docs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-mono">/users</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">Profile</span>
              </div>
            </div>
          </div>

          {/* Console Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={firebaseConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all text-center"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Open Firestore Database in Firebase Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={firestoreOverviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Project Overview</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSeed}
                disabled={isSeeding || isSyncingWithFirestore}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>Sync / Reseed Demo Ledger to Firebase</span>
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Rules Deployed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
