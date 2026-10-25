import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const HelpView: React.FC = () => {
  const { navigateTo, showToast } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(FAQS[0].id);

  const filteredFaqs = FAQS.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = () => {
    showToast('Concierge Connected', 'Connecting to 24/7 Priority Support Agent...', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Help & Support Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Search verified guides, dispute an unrecognized charge, or connect with our human concierge
        </p>
      </div>

      {/* Emergency Freeze Action Banner */}
      <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Suspect Fraud or Lost Phone?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Instantly lock your virtual card and revoke all remote device sessions.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('/security')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security Emergency Hub</span>
        </button>
      </div>

      {/* FAQ Search */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. 'Safe-to-Spend', 'Charge dispute', 'UPI limit')..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredFaqs.map(faq => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div key={faq.id} className="py-4 first:pt-0">
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {faq.question}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <MessageSquare className="w-6 h-6 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Support Concierge</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Average response time: &lt; 2 minutes. Human banking experts available 24/7.
          </p>
          <button
            onClick={handleStartChat}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Start secure chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <PhoneCall className="w-6 h-6 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Toll-Free Priority Line</h3>
          <p className="text-xs font-slate-500 text-slate-500 dark:text-slate-400">
            Toll-free 1800-82858-VAULT (1800-82858-82858) for immediate telephone support.
          </p>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
            1800-82858-82858
          </span>
        </div>
      </div>
    </div>
  );
};
