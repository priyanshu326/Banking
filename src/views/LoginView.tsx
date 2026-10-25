import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Shield,
  Lock,
  KeyRound,
  Fingerprint,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const { login, loginWithGoogle, navigateTo } = useBanking();
  const [pin, setPin] = useState('');
  const [authStep, setAuthStep] = useState<'pin' | 'otp' | 'biometric'>('pin');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleSigningIn(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setErrorMessage('Please enter your 4 or 6-digit secure VAULT PIN');
      return;
    }
    // Simulate biometric/OTP step or immediate verified login
    login();
  };

  const handleBiometricAuth = () => {
    setAuthStep('biometric');
    setTimeout(() => {
      login();
    }, 800);
  };

  const handleQuickDemoLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-8 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => navigateTo('/landing')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/25 cursor-pointer hover:scale-105 transition-transform"
          >
            <Shield className="w-6 h-6 fill-white/20 stroke-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome to VAULT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent, Trust-First Digital Banking
          </p>
        </div>

        {/* Demo Account Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Priyanshu"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Priyanshu (Demo Account)
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                •••• •••• •••• 4821
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            1-Click Enter
          </button>
        </div>

        {/* Google Firebase Authentication */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleSigningIn}
          className="w-full py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isGoogleSigningIn ? 'Connecting to Google Firebase...' : 'Sign In with Google Firebase'}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span>or use PIN</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* PIN Authentication Form */}
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
              Enter Secure 4-Digit Banking PIN
            </label>
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map(index => {
                const digit = pin[index] || '';
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-mono font-bold transition-all ${
                      digit
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400'
                    }`}
                  >
                    {digit ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Hidden actual input */}
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => {
                setPin(e.target.value.replace(/\D/g, ''));
                setErrorMessage('');
              }}
              autoFocus
              className="sr-only"
              id="pin-input"
            />
          </div>

          {/* Quick PIN Keypad Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (pin.length < 4) setPin(prev => prev + num);
                }}
                className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold text-sm transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBiometricAuth}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors"
              title="Biometric Authentication"
            >
              <Fingerprint className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (pin.length < 4) setPin(prev => prev + '0');
              }}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold text-sm transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPin(prev => prev.slice(0, -1))}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-500/10 text-rose-500 font-bold text-xs transition-colors"
            >
              DEL
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-500 text-center font-medium">
              {errorMessage}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock VAULT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Messaging (Section 8) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Your financial information is protected with multiple layers of security.</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Forgot PIN? Contact verified customer concierge in Help.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
