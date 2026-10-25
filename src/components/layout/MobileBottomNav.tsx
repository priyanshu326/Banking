import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { LayoutDashboard, ArrowLeftRight, SendHorizontal, Sparkles, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigateTo } = useBanking();

  const items = [
    { label: 'Home', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Activity', route: '/transactions', icon: ArrowLeftRight },
    { label: 'Pay', route: '/payments', icon: SendHorizontal, isPrimary: true },
    { label: 'Insights', route: '/insights', icon: Sparkles },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 pb-safe flex items-center justify-around shadow-2xl">
      {items.map(item => {
        const isActive = currentRoute === item.route;
        const Icon = item.icon;

        if (item.isPrimary) {
          return (
            <button
              key={item.route}
              onClick={() => navigateTo(item.route)}
              className="flex flex-col items-center justify-center -mt-5 group"
              aria-label="Pay or Transfer"
            >
              <div className="w-12 h-12 rounded-full bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 group-active:scale-95 transition-transform border-2 border-white dark:border-[#0b1120]">
                <Icon className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.route}
            onClick={() => navigateTo(item.route)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
