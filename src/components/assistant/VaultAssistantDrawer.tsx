import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { Sparkles, X, Send, Calculator, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VaultAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    assistantMessages,
    sendAssistantMessage,
    navigateTo,
    setActiveExplainerModal
  } = useBanking();

  const [inputQuery, setInputQuery] = useState('');

  if (!isAssistantOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;
    sendAssistantMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleActionClick = (action: string) => {
    if (action === 'where_money_went') {
      sendAssistantMessage('Where did my money go this month?');
    } else if (action === 'bills_coming_up') {
      sendAssistantMessage('What bills and subscriptions are coming up?');
    } else if (action === 'what_if_5000') {
      sendAssistantMessage('What happens if I spend ₹5,000 today?');
    } else if (action === 'unusual_txns') {
      sendAssistantMessage('Show me unusual transactions');
    } else if (action === 'review_unusual') {
      setIsAssistantOpen(false);
      navigateTo('/transactions');
    } else if (action === 'review_duplicates') {
      setIsAssistantOpen(false);
      navigateTo('/transactions');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="w-full max-w-md bg-white dark:bg-[#0b1120] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    VAULT Assistant
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Explainable AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Zero jargon · Grounded on your ledger
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Context Prompt Pills */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/20 overflow-x-auto no-scrollbar flex items-center gap-2">
            {[
              { label: 'Where did money go?', q: 'Where did my money go?' },
              { label: 'Bills coming up?', q: 'What bills are coming up?' },
              { label: 'Spend ₹5,000 impact', q: 'What happens if I spend ₹5,000?' },
              { label: 'Savings status', q: 'How am I doing with my savings?' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => sendAssistantMessage(p.q)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700/60 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {assistantMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Calculation Breakdown Table */}
                  {msg.calculationBreakdown && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                        <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{msg.calculationBreakdown.label}</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {msg.calculationBreakdown.items.map((it, idx) => (
                          <div
                            key={idx}
                            className={`flex justify-between py-1 px-2 rounded ${
                              it.type === 'total'
                                ? 'font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span>{it.title}</span>
                            <span className="font-mono font-semibold">{it.amount}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1">
                        {msg.calculationBreakdown.disclaimer}
                      </p>
                    </div>
                  )}

                  {/* Interactive Action Buttons inside response */}
                  {msg.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about spending, bills, what-ifs..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="absolute right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Assistance is explainable, never speculative</span>
              </span>
              <button
                onClick={() => {
                  setIsAssistantOpen(false);
                  setActiveExplainerModal('what-if');
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Open Simulator
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
