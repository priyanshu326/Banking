export type CategoryType =
  | 'Food & Dining'
  | 'Shopping'
  | 'Transport'
  | 'Subscriptions'
  | 'Bills & Utilities'
  | 'Salary & Income'
  | 'Entertainment'
  | 'Education'
  | 'Healthcare'
  | 'Transfers'
  | 'Other';

export type TransactionStatus = 'completed' | 'processing' | 'pending' | 'failed';
export type PaymentMethodType = 'UPI' | 'VAULT Virtual Card' | 'Bank Transfer' | 'Auto-Debit';

export interface Transaction {
  id: string;
  merchant: string;
  merchantLogo?: string;
  category: CategoryType;
  amount: number; // positive for credit/income, negative for debit
  date: string; // ISO or human readable
  timestamp: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethodType;
  referenceNumber: string;
  balanceBefore: number;
  balanceAfter: number;
  fee: number;
  notes?: string;
  deductionReason?: string;
  isUnusual?: boolean;
  isDuplicateCandidate?: boolean;
  recipientUpiId?: string;
}

export interface UpcomingCommitment {
  id: string;
  title: string;
  category: CategoryType;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  autoDebit: boolean;
  status: 'upcoming' | 'due_today' | 'scheduled';
  paymentMethod: string;
  accountNumber?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: string;
  color: string;
  iconName: string;
  isPaused: boolean;
  createdAt: string;
  notes?: string;
}

export interface SharedExpenseParticipant {
  id: string;
  name: string;
  avatar: string;
  upiId?: string;
  owesAmount: number;
  isSettled: boolean;
  settledAt?: string;
}

export interface SharedExpense {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string; // e.g. "Priyanshu"
  date: string;
  category: CategoryType;
  status: 'partially_settled' | 'all_settled' | 'pending';
  participants: SharedExpenseParticipant[];
  notes?: string;
}

export interface FinancialInsight {
  id: string;
  type: 'spending_increase' | 'subscription_alert' | 'unusual_activity' | 'duplicate_payment' | 'savings_milestone' | 'cashflow_forecast';
  severity: 'info' | 'amber' | 'positive' | 'warning';
  title: string;
  description: string;
  reason: string;
  confidence: 'High confidence' | 'Moderate confidence' | 'Estimated projection';
  dataPoints: string[];
  actionLabel?: string;
  actionRoute?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  isDismissed?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'insight' | 'security' | 'transaction';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  badge?: string;
}

export interface SecurityDevice {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  upiId: string;
  accountNumberMasked: string;
  ifscCode: string;
  kycStatus: 'Verified' | 'Pending';
  tier: 'VAULT Premium Member';
  avatar: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  virtualCardLocked: boolean;
  virtualCardNumber: string;
  virtualCardExpiry: string;
  virtualCardCvv: string;
  monthlyIncome: number;
  monthlyBudget: number;
  dailyTransferLimit: number;
}

export interface DashboardSectionVisibility {
  balanceOverview: boolean;
  safeToSpend: boolean;
  quickActions: boolean;
  spendingSummary: boolean;
  whereMoneyWent: boolean;
  upcomingCommitments: boolean;
  savingsProgress: boolean;
  recentTransactions: boolean;
  aiInsightsBanner: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  calculationBreakdown?: {
    label: string;
    items: { title: string; amount: string; type: 'neutral' | 'minus' | 'plus' | 'total' }[];
    disclaimer: string;
  };
  suggestedActions?: { label: string; action: string }[];
}
