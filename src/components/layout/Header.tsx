import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ShieldCheck,
  Bell,
  Sparkles,
  Search,
  Sun,
  Moon,
  Check,
  ChevronDown,
  Flame
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
    setIsAssistantOpen,
    setIsFirebaseModalOpen,
    firebaseUser
  } = useBanking();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left: User Greeting & Security Status */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {getGreeting()}, <span className="text-[#0F172A] dark:text-white font-bold">{user.name.split(' ')[0]}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account protected
              </span>
              <span className="opacity-30">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Shortcut */}
          <button
            onClick={() => navigateTo('/transactions')}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search transactions or merchants...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400">
              /
            </kbd>
          </button>

          {/* Firebase Console Button */}
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all shadow-xs"
            title="Google Firebase Console & Database Status"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="hidden md:inline font-mono text-[11px]">Firebase Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Send Money Action Button */}
          <button
            onClick={() => navigateTo('/payments')}
            className="hidden sm:flex items-center gap-2 bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Send Money</span>
          </button>

          {/* Theme Toggle (Mobile/Desktop) */}
          <button
            onClick={toggleTheme}
            className="lg:hidden w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full absolute top-2.5 right-2.5 border-2 border-white dark:border-[#0f172a]" />
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {notifications.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        setShowNotificationsDropdown(false);
                        navigateTo('/notifications');
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !item.read ? 'bg-slate-50/80 dark:bg-slate-800/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotificationsDropdown(false);
                      navigateTo('/notifications');
                    }}
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:underline"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Pill */}
          <div
            onClick={() => navigateTo('/profile')}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-slate-400 dark:group-hover:ring-slate-500 transition-all"
              referrerPolicy="no-referrer"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
