import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  PieChart,
  Users,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Eye,
  SendHorizontal,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingView: React.FC = () => {
  const { navigateTo, theme, toggleTheme } = useBanking();
  const [activeTab, setActiveTab] = useState<'understand' | 'transact' | 'manage' | 'save' | 'anticipate' | 'trust'>('understand');

  const featureTabs = [
    {
      id: 'understand',
      label: 'Understand',
      title: 'Turn transactions into meaningful financial context',
      desc: 'Instead of forcing you to decipher cryptic transaction strings, VAULT categorizes and explains where every rupee went with zero guesswork.',
      stats: 'Food (+14%) and Subscriptions drove 80% of monthly variance'
    },
    {
      id: 'transact',
      label: 'Transact',
      title: 'Know the amount, recipient, fees and final debit before you confirm',
      desc: 'Our "Before You Pay" experience eliminates transfer anxiety by projecting your remaining flexible balance before the money leaves your account.',
      stats: 'Zero hidden fees · Instant UPI RRN verification'
    },
    {
      id: 'manage',
      label: 'Manage',
      title: 'Track shared expenses, subscriptions and recurring payments',
      desc: 'Seamlessly split dining and travel expenses with friends directly inside your bank. Track who has settled and send gentle UPI nudges.',
      stats: 'Built-in group balances with one-tap settlement'
    },
    {
      id: 'save',
      label: 'Save',
      title: 'Build realistic goals around your actual financial activity',
      desc: 'VAULT computes honest monthly allocation targets that automatically adjust as your income and recurring commitments change.',
      stats: 'Dynamic projections · No pressure, total flexibility'
    },
    {
      id: 'anticipate',
      label: 'Anticipate',
      title: 'See upcoming commitments before they surprise you',
      desc: 'Track monthly rent, utility bills, and auto-renewing subscriptions in a unified forward-looking calendar.',
      stats: '4 upcoming bills (₹13,947) monitored in real-time'
    },
    {
      id: 'trust',
      label: 'Trust',
      title: 'Every intelligent insight is explainable and user-controlled',
      desc: 'AI is strictly an explainable assistant, never an autonomous decision-maker. Click "Why?" on any estimate to see the exact formula.',
      stats: '256-bit AES encryption · User-verified authority'
    }
  ];

  const currentFeature = featureTabs.find(t => t.id === activeTab) || featureTabs[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('/landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Shield className="w-5 h-5 fill-white/20 stroke-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                VAULT
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Digital Bank
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => navigateTo('/login')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => navigateTo('/login')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 pb-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {/* Trust Philosophy Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Intelligent, Trust-First Financial Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Banking that <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 decoration-wavy">explains</span> your money.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            VAULT transforms everyday banking data into clear, transparent, and actionable financial understanding—so you know what happens before you move your money.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => navigateTo('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore VAULT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('features-tour');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700/80 transition-colors"
            >
              See How It Works
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Zero Hidden Fees
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              256-Bit Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Explainable Calculations
            </span>
          </div>
        </motion.div>

        {/* Live Interactive Hero Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Preview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Live Prototype Preview
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Good morning, Priyanshu
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Lock className="w-3.5 h-3.5" />
                Account Protected
              </span>
            </div>
          </div>

          {/* Balances Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Available Balance */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Available Balance
              </span>
              <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                ₹42,680.50
              </p>
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <p>↓ ₹8,420 spent this month</p>
                <p>↓ ₹4,300 upcoming commitments</p>
                <p>↓ ₹20,000 savings allocation</p>
              </div>
            </div>

            {/* Safe-to-Spend Feature Highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-slate-900/40 border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Safe-to-Spend Indicator
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Estimate
                </span>
              </div>
              <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                ₹18,420.00
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Available for flexible spending based on current balance, upcoming bills, and laptop goal.
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Zero guesswork before paying
                </span>
                <button
                  onClick={() => navigateTo('/login')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Test in App</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Before VAULT vs With VAULT Comparison (Section 65) */}
      <section className="px-4 sm:px-8 py-16 bg-white dark:bg-[#0b1120] border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Traditional Banking Creates Anxiety
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Old apps show cryptic balances. VAULT delivers clear, forward-looking understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before VAULT */}
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/80 dark:border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <AlertCircle className="w-5 h-5" />
                <h3>Before VAULT: The Fragmented Routine</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>Multiple disconnected apps:</strong> Switching between UPI apps, split tools, and spreadsheets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>Raw transaction lists:</strong> Cryptic strings like <code className="text-xs bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded">UPI/291884/NETFLIX/CMS</code> with zero spending insight.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>Manual mental math:</strong> Guessing how much money you can actually afford to spend this weekend.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>Financial uncertainty:</strong> Surprises from auto-debits that silently wipe out savings.</span>
                </li>
              </ul>
            </div>

            {/* With VAULT */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <h3>With VAULT: Intelligent Command Center</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>One financial command center:</strong> Banking, UPI, shared expenses, and goals together.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Contextual understanding:</strong> "Swiggy dinner order" with balance before and after.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Transparent decisions:</strong> Safe-to-Spend projections with one-click math breakdowns.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Greater financial confidence:</strong> Proactive alerts before auto-debits process.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Tabs (Section 64 & 66) */}
      <section id="features-tour" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Engineered for Clarity
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Six Pillars of Financial Intelligence
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {featureTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Feature Display Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {currentFeature.label}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentFeature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentFeature.desc}
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ⚡ {currentFeature.stats}
            </div>
            <button
              onClick={() => navigateTo('/login')}
              className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
            >
              <span>Experience {currentFeature.label} in VAULT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Mock Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-sans text-[11px]">Simulated Ledger Context</span>
              <span className="text-emerald-500 font-bold text-[10px]">VERIFIED</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-sans">Swiggy Dinner Order</span>
                <span className="text-rose-500 font-bold">−₹382.00</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-sans">TechCorp Salary Direct</span>
                <span className="text-emerald-500 font-bold">+₹48,000.00</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex justify-between">
                <span className="text-emerald-800 dark:text-emerald-300 font-sans font-semibold">Safe-to-Spend Balance</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹18,420.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Brand Message (Section 67) */}
      <section className="px-4 sm:px-8 py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your money deserves more than a balance.
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            VAULT helps you understand what happened, what is coming next, and what a decision could mean—without taking control away from you.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigateTo('/login')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
            >
              <span>Enter VAULT Bank</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 pt-4">
            Encrypted with 256-bit AES. Demo prototype pre-seeded for hackathon evaluation.
          </p>
        </div>
      </section>
    </div>
  );
};
