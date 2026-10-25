import React from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  SendHorizontal,
  Sparkles,
  Users,
  PiggyBank,
  ShieldCheck,
  Settings,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  Flame
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    theme,
    toggleTheme,
    notifications,
    user,
    logout,
    setIsAssistantOpen,
    setIsFirebaseModalOpen
  } = useBanking();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Overview', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', route: '/transactions', icon: ArrowLeftRight },
    { label: 'Payments', route: '/payments', icon: SendHorizontal },
    { label: 'Insights', route: '/insights', icon: Sparkles, badge: 'AI' },
    { label: 'Shared Expenses', route: '/shared-expenses', icon: Users },
    { label: 'Savings', route: '/savings', icon: PiggyBank },
    { label: 'Security', route: '/security', icon: ShieldCheck },
    { label: 'Notifications', route: '/notifications', icon: Bell, count: unreadNotifications },
    { label: 'Settings', route: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800/80 h-screen sticky top-0 z-30 transition-colors p-6">
      {/* Brand & Security Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigateTo('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#0F172A] dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 border-2 border-current rounded-xs" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                VAULT
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                PRO
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Security Trust Pill */}
        <div
          onClick={() => navigateTo('/security')}
          className="mt-4 px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Account Protected
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            256-bit AES
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-1" aria-label="Main Navigation">
        {navItems.map(item => {
          const isActive = currentRoute === item.route;
          const Icon = item.icon;

          return (
            <button
              key={item.route}
              onClick={() => navigateTo(item.route)}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between transition-all ${
                isActive
                  ? 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F172A] dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white leading-none">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* VAULT AI Assistant Quick Card */}
        <div className="pt-4">
          <div
            onClick={() => setIsAssistantOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold">
                  VAULT AI
                </p>
                <p className="text-[10px] text-white/60 truncate">
                  Ask spending questions
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Footer / Profile Section */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Firebase Console Direct Action */}
        <button
          onClick={() => setIsFirebaseModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Firebase Console</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          onClick={() => navigateTo('/help')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            currentRoute === '/help'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        {/* User Card */}
        <div
          onClick={() => navigateTo('/profile')}
          className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                Premium Member
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Sign out safely"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
