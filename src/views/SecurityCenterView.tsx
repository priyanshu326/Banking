import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Fingerprint,
  CreditCard,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  X
} from 'lucide-react';
import { SECURITY_SESSIONS } from '../data/mockData';

export const SecurityCenterView: React.FC = () => {
  const { user, showToast } = useBanking();
  const [sessions, setSessions] = useState(SECURITY_SESSIONS);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [virtualCardFrozen, setVirtualCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session Revoked', `Disconnected session on ${deviceName}`, 'info');
  };

  const handleToggleCardFreeze = () => {
    setVirtualCardFrozen(prev => !prev);
    showToast(
      virtualCardFrozen ? 'Virtual Card Unfrozen' : 'Virtual Card Frozen',
      virtualCardFrozen ? 'Your virtual card is now active for online transactions' : 'Card transactions temporarily blocked for safety',
      virtualCardFrozen ? 'success' : 'amber'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Security Command Center
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Account Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage device credentials, biometrics, multi-factor authentication, and card freeze controls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Protections & Virtual Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Virtual Card Security */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Instant Card Protection
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                virtualCardFrozen
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}>
                {virtualCardFrozen ? 'Card Frozen' : 'Active & Protected'}
              </span>
            </div>

            {/* Virtual Card Visual */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl space-y-6 relative overflow-hidden border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="font-extrabold tracking-tight text-lg">VAULT Platinum</span>
                </div>
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>

              <div>
                <p className="text-xs text-slate-400">Card Number</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="font-mono text-lg sm:text-xl font-bold tracking-widest">
                    {showCardNumber ? '4821 9912 8402 4821' : '•••• •••• •••• 4821'}
                  </p>
                  <button
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="text-slate-400 hover:text-white"
                  >
                    {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2 text-xs">
                <div>
                  <p className="text-slate-400">Cardholder</p>
                  <p className="font-bold">{user.name.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Expires</p>
                  <p className="font-mono font-bold">08/29</p>
                </div>
                <div>
                  <p className="text-slate-400">CVV</p>
                  <p className="font-mono font-bold">{showCardNumber ? '819' : '•••'}</p>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex gap-3">
              <button
                onClick={handleToggleCardFreeze}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  virtualCardFrozen
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{virtualCardFrozen ? 'Unfreeze Card Now' : 'Freeze Card Instantly'}</span>
              </button>
            </div>
          </div>

          {/* Authentication Rules */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Authentication & PIN
            </span>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Biometric Unlock (FaceID / TouchID)</p>
                    <p className="text-xs text-slate-400">Use device biometrics for instant authentication</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={biometricsEnabled}
                  onChange={e => setBiometricsEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-slate-400">Require hardware key or SMS OTP for payments &gt; ₹10,000</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={e => setTwoFactorEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Change Banking PIN</p>
                    <p className="text-xs text-slate-400">Last changed 42 days ago</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('PIN Change Triggered', 'Verification SMS dispatched to registered mobile', 'info')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 text-slate-800 dark:text-slate-200"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Sessions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Device Management
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Active Sessions ({sessions.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
              {sessions.map(s => (
                <div key={s.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      s.isCurrent
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {s.deviceName}
                        </p>
                        {s.isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {s.location} · {s.ipAddress}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Active {s.lastActive}
                      </p>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(s.id, s.deviceName)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Revoke session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSessions(sessions.filter(s => s.isCurrent));
                  showToast('Sessions Terminated', 'Logged out of all other remote devices', 'info');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Log Out All Other Devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
