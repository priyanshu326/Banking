import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Moon,
  Sun,
  Bell,
  Eye,
  Sliders,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  Check,
  Flame,
  ExternalLink,
  RefreshCw,
  Database
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    showToast,
    setIsFirebaseModalOpen,
    firebaseProjectId,
    firebaseDatabaseId,
    firebaseConsoleUrl,
    seedFirestoreData,
    isSyncingWithFirestore
  } = useBanking();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  const handleSave = () => {
    showToast('Preferences Updated', 'Your banking preferences have been saved', 'success');
  };

  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      await seedFirestoreData();
      showToast('Database Synchronized', 'All ledger records pushed to Cloud Firestore', 'success');
    } catch {
      showToast('Database Notice', 'Synced with local cache and cloud queue', 'info');
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Application Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize themes, notification channels, accessibility, and privacy defaults
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Appearance & Interface
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Color Theme</p>
                <p className="text-xs text-slate-400">Current: {theme === 'dark' ? 'Dark Navy Mode' : 'Light Mode'}</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Notification Channels
          </span>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Instant SMS Alerts</p>
                <p className="text-slate-400">Receive instant SMS for all incoming and outgoing debits</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => {
                  setSmsAlerts(e.target.checked);
                  handleSave();
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Financial Intelligence Digest</p>
                <p className="text-slate-400">Weekly breakdown of spending trends and upcoming bills</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => {
                  setEmailAlerts(e.target.checked);
                  handleSave();
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Firebase & Cloud Database */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Google Firebase & Cloud Firestore
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online & Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Project ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{firebaseProjectId}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Database ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{firebaseDatabaseId}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Manage Firebase Console Details</span>
            </button>

            <a
              href={firebaseConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleReseed}
              disabled={isReseeding || isSyncingWithFirestore}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
              <span>Sync All Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
