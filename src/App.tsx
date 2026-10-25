/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/layout/ToastContainer';
import { SafeToSpendExplainerModal } from './components/modals/SafeToSpendExplainerModal';
import { SimulationWhatIfModal } from './components/modals/SimulationWhatIfModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { FirebaseConsoleModal } from './components/modals/FirebaseConsoleModal';
import { VaultAssistantDrawer } from './components/assistant/VaultAssistantDrawer';

// Views
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PaymentsView } from './views/PaymentsView';
import { TransactionsView } from './views/TransactionsView';
import { InsightsView } from './views/InsightsView';
import { SharedExpensesView } from './views/SharedExpensesView';
import { SavingsView } from './views/SavingsView';
import { SecurityCenterView } from './views/SecurityCenterView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { HelpView } from './views/HelpView';

const MainAppContent: React.FC = () => {
  const { currentRoute, isAuthenticated } = useBanking();

  // If user is on landing page, show full Landing page
  if (currentRoute === '/landing') {
    return <LandingView />;
  }

  // If user is not authenticated or explicitly at /login, show Login view
  if (!isAuthenticated || currentRoute === '/login') {
    return <LoginView />;
  }

  // Authenticated App Shell
  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardView />;
      case '/payments':
      case '/payment/review':
        return <PaymentsView />;
      case '/transactions':
        return <TransactionsView />;
      case '/insights':
        return <InsightsView />;
      case '/shared-expenses':
        return <SharedExpensesView />;
      case '/savings':
        return <SavingsView />;
      case '/security':
        return <SecurityCenterView />;
      case '/notifications':
        return <NotificationsView />;
      case '/profile':
        return <ProfileView />;
      case '/settings':
        return <SettingsView />;
      case '/help':
        return <HelpView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Top Navbar (visible only < lg) */}
        <MobileNavbar />

        {/* Desktop & Tablet Sticky Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Scrollable View Area */}
        <main className="flex-1 pb-24 lg:pb-12">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation (visible only < lg) */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <SafeToSpendExplainerModal />
      <SimulationWhatIfModal />
      <ReceiptModal />
      <FirebaseConsoleModal />
      <VaultAssistantDrawer />

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <MainAppContent />
    </BankingProvider>
  );
}
