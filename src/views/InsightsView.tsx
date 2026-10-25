import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const InsightsView: React.FC = () => {
  const {
    insights,
    monthlySpending,
    safeToSpendAmount,
    availableBalance,
    dismissInsight,
    setActiveExplainerModal,
    navigateTo,
    showToast
  } = useBanking();

  const [activeInsightExplainer, setActiveInsightExplainer] = useState<string | null>(null);

  const categoryData = [
    { name: 'Food & Dining', value: 2840, color: '#f59e0b', share: '33.7%' },
    { name: 'Shopping', value: 1920, color: '#3b82f6', share: '22.8%' },
    { name: 'Transport', value: 1140, color: '#10b981', share: '13.5%' },
    { name: 'Subscriptions', value: 1049, color: '#a855f7', share: '12.5%' },
    { name: 'Other', value: 1471, color: '#64748b', share: '17.5%' },
  ];

  const monthlyTrendData = [
    { month: 'Apr', spend: 6950 },
    { month: 'May', spend: 7200 },
    { month: 'Jun', spend: 7100 },
    { month: 'Jul', spend: 7520 },
    { month: 'Aug (Current)', spend: 8420 },
  ];

  const handleAction = (route?: string) => {
    if (route) {
      navigateTo(route);
    } else {
      showToast('Action Taken', 'Updated ledger preferences accordingly', 'info');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Spending Intelligence
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Explainable AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Contextual insights, anomaly detection, and forward-looking budget projections
          </p>
        </div>

        <button
          onClick={() => setActiveExplainerModal('what-if')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>Launch What-If Simulator</span>
        </button>
      </div>

      {/* Intelligence Cards Section (Section 25 & 26) */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Active Actionable Insights ({insights.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      item.type === 'alert' ? 'bg-rose-500' : item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {item.confidence}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Explainability & Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveInsightExplainer(activeInsightExplainer === item.id ? null : item.id)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why am I seeing this?</span>
                  </button>

                  <button
                    onClick={() => dismissInsight(item.id)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Inline Explainability Drawer */}
                {activeInsightExplainer === item.id && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Data points analyzed:</p>
                    <p>• Ledger transactions from 1 Aug to 30 Aug 2026</p>
                    <p>• Historical 90-day baseline comparison</p>
                    <p>• No external data shared or processed</p>
                  </div>
                )}

                {item.actionLabel && (
                  <button
                    onClick={() => handleAction(item.actionRoute)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Charts: Spending Distribution & Historical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category Distribution
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Monthly Breakdown (₹8,420)
              </h2>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white ml-auto">
                  {cat.share}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Month Spending Trend */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Velocity & Trend
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              5-Month Spending Trajectory
            </h2>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Total Outflow']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="spend" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">Analysis:</p>
            <p className="mt-0.5">
              August spending is slightly above your 90-day baseline (+₹900) due to 2 dining events and annual cloud subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
