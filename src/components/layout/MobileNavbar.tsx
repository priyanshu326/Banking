import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { Shield, Sparkles, Bell, Flame } from 'lucide-react';

export const MobileNavbar: React.FC = () => {
  const { user, navigateTo, notifications, setIsAssistantOpen, setIsFirebaseModalOpen } = useBanking();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
      <div
        onClick={() => navigateTo('/dashboard')}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-[#0F172A] dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xs">
          <div className="w-3.5 h-3.5 border-2 border-current rounded-xs" />
        </div>
        <span className="font-bold text-base tracking-tight text-[#0F172A] dark:text-white">
          VAULT
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFirebaseModalOpen(true)}
          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          title="Firebase Console"
          aria-label="Firebase Console"
        >
          <Flame className="w-4 h-4 fill-amber-500" />
        </button>

        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>

        <button
          onClick={() => navigateTo('/notifications')}
          className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <div
          onClick={() => navigateTo('/profile')}
          className="cursor-pointer"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/40"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};
