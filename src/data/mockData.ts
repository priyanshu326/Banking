import {
  UserProfile,
  Transaction,
  UpcomingCommitment,
  SavingsGoal,
  SharedExpense,
  FinancialInsight,
  NotificationItem,
  SecurityDevice,
  DashboardSectionVisibility
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Priyanshu',
  email: 'priyanshu@vault.bank',
  phone: '+91 98765 43210',
  upiId: 'priyanshu@vault',
  accountNumberMasked: '•••• •••• •••• 4821',
  ifscCode: 'VAULT0001089',
  kycStatus: 'Verified',
  tier: 'VAULT Premium Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
  biometricEnabled: true,
  virtualCardLocked: false,
  virtualCardNumber: '4821 •••• •••• 9012',
  virtualCardExpiry: '08/29',
  virtualCardCvv: '•••',
  monthlyIncome: 48000,
  monthlyBudget: 30000,
  dailyTransferLimit: 100000,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-90214',
    merchant: 'Netflix India',
    category: 'Entertainment',
    amount: -649,
    date: 'Today',
    timestamp: 'Today · 9:42 PM',
    status: 'completed',
    paymentMethod: 'Auto-Debit',
    referenceNumber: 'UPI/2026/8920194821',
    balanceBefore: 43329.50,
    balanceAfter: 42680.50,
    fee: 0,
    deductionReason: 'Monthly recurring entertainment plan (Premium 4K)',
    notes: 'Auto-renewed subscription',
    recipientUpiId: 'netflix.recurring@payu'
  },
  {
    id: 'TXN-90213',
    merchant: 'Swiggy',
    category: 'Food & Dining',
    amount: -382,
    date: 'Today',
    timestamp: 'Today · 8:10 PM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/8920194112',
    balanceBefore: 43711.50,
    balanceAfter: 43329.50,
    fee: 0,
    deductionReason: 'Dinner order: Gourmet Burger & Iced Tea',
    recipientUpiId: 'swiggyorder@icici'
  },
  {
    id: 'TXN-90209',
    merchant: 'Monthly Salary Credit',
    category: 'Salary & Income',
    amount: 48000,
    date: 'Yesterday',
    timestamp: 'Yesterday · 10:00 AM',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT/CMS/2026884129',
    balanceBefore: 3511.50,
    balanceAfter: 51511.50,
    fee: 0,
    deductionReason: 'August Payroll Disbursement from TechCorp Labs',
    notes: 'Verified salary direct deposit'
  },
  {
    id: 'TXN-90208',
    merchant: 'Delhi Metro Transit',
    category: 'Transport',
    amount: -60,
    date: 'Yesterday',
    timestamp: 'Yesterday · 6:30 PM',
    status: 'completed',
    paymentMethod: 'VAULT Virtual Card',
    referenceNumber: 'CARD/DMRC/9812401',
    balanceBefore: 51571.50,
    balanceAfter: 51511.50,
    fee: 0,
    deductionReason: 'NCMC Contactless Metro Tap-Out'
  },
  {
    id: 'TXN-90198',
    merchant: 'XYZ Electronics Store',
    category: 'Shopping',
    amount: -7800,
    date: '28 Aug 2026',
    timestamp: '28 Aug · 4:15 PM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/78219034',
    balanceBefore: 59371.50,
    balanceAfter: 51571.50,
    fee: 0,
    deductionReason: 'Mechanical Keyboard & USB-C Dock purchase',
    isUnusual: true,
    recipientUpiId: 'xyzelectronics@hdfcbank'
  },
  {
    id: 'TXN-90190',
    merchant: 'Amazon India',
    category: 'Shopping',
    amount: -1299,
    date: '27 Aug 2026',
    timestamp: '27 Aug · 10:44 AM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/6628912',
    balanceBefore: 60670.50,
    balanceAfter: 59371.50,
    fee: 0,
    deductionReason: 'Order #402-981273-1198 (Hard drive case)',
    isDuplicateCandidate: true,
    recipientUpiId: 'amazonpay@apl'
  },
  {
    id: 'TXN-90189',
    merchant: 'Amazon India',
    category: 'Shopping',
    amount: -1299,
    date: '27 Aug 2026',
    timestamp: '27 Aug · 10:42 AM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/6628905',
    balanceBefore: 61969.50,
    balanceAfter: 60670.50,
    fee: 0,
    deductionReason: 'Order #402-981273-1192 (Hard drive case - duplicate retry)',
    isDuplicateCandidate: true,
    recipientUpiId: 'amazonpay@apl'
  },
  {
    id: 'TXN-90175',
    merchant: 'Blue Tokai Coffee Roasters',
    category: 'Food & Dining',
    amount: -280,
    date: '26 Aug 2026',
    timestamp: '26 Aug · 11:15 AM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/5519801',
    balanceBefore: 62249.50,
    balanceAfter: 61969.50,
    fee: 0,
    deductionReason: 'Flat White Coffee & Croissant'
  },
  {
    id: 'TXN-90160',
    merchant: 'Blinkit Groceries',
    category: 'Food & Dining',
    amount: -430,
    date: '25 Aug 2026',
    timestamp: '25 Aug · 7:45 PM',
    status: 'completed',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/2026/4419208',
    balanceBefore: 62679.50,
    balanceAfter: 62249.50,
    fee: 0,
    deductionReason: 'Fresh produce & dairy essentials'
  },
  {
    id: 'TXN-90145',
    merchant: 'Spotify Premium',
    category: 'Subscriptions',
    amount: -119,
    date: '24 Aug 2026',
    timestamp: '24 Aug · 3:00 PM',
    status: 'completed',
    paymentMethod: 'Auto-Debit',
    referenceNumber: 'UPI/2026/3310928',
    balanceBefore: 62798.50,
    balanceAfter: 62679.50,
    fee: 0,
    deductionReason: 'Individual Student Subscription'
  }
];

export const INITIAL_COMMITMENTS: UpcomingCommitment[] = [
  {
    id: 'COM-101',
    title: 'Netflix Subscription',
    category: 'Subscriptions',
    amount: 649,
    dueDate: 'Tomorrow, 31 Aug',
    daysRemaining: 1,
    autoDebit: true,
    status: 'upcoming',
    paymentMethod: 'Auto-Debit from VAULT Primary'
  },
  {
    id: 'COM-102',
    title: 'Apartment Rent',
    category: 'Bills & Utilities',
    amount: 12000,
    dueDate: '3 Sep 2026',
    daysRemaining: 4,
    autoDebit: false,
    status: 'upcoming',
    paymentMethod: 'UPI to Landlord (landlord@axisbank)'
  },
  {
    id: 'COM-103',
    title: 'Airtel Fiber High-Speed Internet',
    category: 'Bills & Utilities',
    amount: 799,
    dueDate: '5 Sep 2026',
    daysRemaining: 6,
    autoDebit: true,
    status: 'scheduled',
    paymentMethod: 'Auto-Debit'
  },
  {
    id: 'COM-104',
    title: 'Frontend Mastery Course',
    category: 'Education',
    amount: 499,
    dueDate: '8 Sep 2026',
    daysRemaining: 9,
    autoDebit: true,
    status: 'upcoming',
    paymentMethod: 'Virtual Card Recurring'
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'GOAL-1',
    name: 'New Laptop',
    targetAmount: 60000,
    currentAmount: 28500,
    targetDate: '2026-12-15',
    monthlyContribution: 7875,
    category: 'Tech & Work',
    color: '#10b981',
    iconName: 'Laptop',
    isPaused: false,
    createdAt: '2026-06-01',
    notes: 'MacBook Air M3 for development and freelancing work'
  },
  {
    id: 'GOAL-2',
    name: 'Emergency Cushion',
    targetAmount: 50000,
    currentAmount: 35000,
    targetDate: '2027-03-31',
    monthlyContribution: 2500,
    category: 'Safety Net',
    color: '#3b82f6',
    iconName: 'Shield',
    isPaused: false,
    createdAt: '2026-01-15',
    notes: '3 months of essential buffer funds'
  },
  {
    id: 'GOAL-3',
    name: 'Goa Monsoon Trip',
    targetAmount: 20000,
    currentAmount: 8400,
    targetDate: '2026-10-20',
    monthlyContribution: 5800,
    category: 'Travel',
    color: '#8b5cf6',
    iconName: 'Compass',
    isPaused: false,
    createdAt: '2026-07-10',
    notes: 'Flight tickets and weekend stay with friends'
  }
];

export const INITIAL_SHARED_EXPENSES: SharedExpense[] = [
  {
    id: 'SPLIT-1',
    title: 'Dinner with Friends at Olive Bistro',
    totalAmount: 2000,
    paidBy: 'Priyanshu',
    date: '29 Aug 2026',
    category: 'Food & Dining',
    status: 'partially_settled',
    notes: 'Split equally 4 ways (₹500 each)',
    participants: [
      {
        id: 'p-1',
        name: 'Priyanshu (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        owesAmount: 500,
        isSettled: true,
        settledAt: 'Paid by you'
      },
      {
        id: 'p-2',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        upiId: 'rahul.s@okhdfcbank',
        owesAmount: 500,
        isSettled: true,
        settledAt: 'Settled via UPI on 29 Aug'
      },
      {
        id: 'p-3',
        name: 'Aman Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        upiId: 'aman.v@icici',
        owesAmount: 500,
        isSettled: false
      },
      {
        id: 'p-4',
        name: 'Karan Mehra',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
        upiId: 'karan99@paytm',
        owesAmount: 500,
        isSettled: false
      }
    ]
  },
  {
    id: 'SPLIT-2',
    title: 'Weekend Cab to Gurgaon',
    totalAmount: 900,
    paidBy: 'Priyanshu',
    date: '22 Aug 2026',
    category: 'Transport',
    status: 'all_settled',
    notes: 'Uber XL split 3 ways',
    participants: [
      {
        id: 'p-1',
        name: 'Priyanshu (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        owesAmount: 300,
        isSettled: true
      },
      {
        id: 'p-2',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        owesAmount: 300,
        isSettled: true
      },
      {
        id: 'p-5',
        name: 'Sneha Roy',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        owesAmount: 300,
        isSettled: true
      }
    ]
  }
];

export const INITIAL_INSIGHTS: FinancialInsight[] = [
  {
    id: 'INS-01',
    type: 'spending_increase',
    severity: 'amber',
    title: 'Spending increased by 18%',
    description: 'You spent ₹8,420 this month, which is 18% higher than last month’s baseline.',
    reason: 'Food spending increased by ₹1,240 and shopping transactions increased by ₹1,920.',
    confidence: 'High confidence',
    dataPoints: [
      'Food & Dining: ₹2,840 (+14%)',
      'Shopping: ₹1,920 (+28%)',
      'Transport: ₹1,140 (stable)',
      'Subscriptions: ₹1,049 (+₹649 new)'
    ],
    actionLabel: 'Explore spending breakdown',
    actionRoute: '/insights',
    timestamp: 'Today · 8:00 AM'
  },
  {
    id: 'INS-02',
    type: 'subscription_alert',
    severity: 'info',
    title: 'Subscription due tomorrow',
    description: 'Your Netflix recurring payment of ₹649 is scheduled for auto-debit tomorrow.',
    reason: 'We automatically matched this against your active recurring auto-debit schedule.',
    confidence: 'High confidence',
    dataPoints: [
      'Current balance: ₹42,680.50',
      'Debit amount: ₹649.00',
      'Post-debit balance: ₹42,031.50'
    ],
    actionLabel: 'View upcoming commitments',
    actionRoute: '/dashboard',
    timestamp: 'Today · 9:00 AM'
  },
  {
    id: 'INS-03',
    type: 'unusual_activity',
    severity: 'amber',
    title: 'Unusual transaction detected',
    description: 'A ₹7,800 transaction at XYZ Electronics Store is higher than 95% of your recent purchases.',
    reason: 'Your median shopping transaction over the last 90 days is ₹850. This single charge represents 9.1x your typical spend.',
    confidence: 'High confidence',
    dataPoints: [
      'Merchant: XYZ Electronics Store',
      'Amount: ₹7,800.00',
      'Date: 28 Aug 2026 · 4:15 PM',
      'Typical shopping average: ₹850'
    ],
    actionLabel: 'Review transaction details',
    actionRoute: '/transactions',
    timestamp: '28 Aug 2026'
  },
  {
    id: 'INS-04',
    type: 'duplicate_payment',
    severity: 'amber',
    title: 'Possible duplicate payment candidate',
    description: 'Two identical payments of ₹1,299 were made to Amazon India within 2 minutes of each other.',
    reason: 'Transactions TXN-90189 and TXN-90190 have identical amounts and consecutive reference IDs.',
    confidence: 'Moderate confidence',
    dataPoints: [
      'Payment 1: ₹1,299 at 10:42 AM',
      'Payment 2: ₹1,299 at 10:44 AM',
      'Merchant: Amazon India'
    ],
    actionLabel: 'Check duplicate payments',
    actionRoute: '/transactions',
    timestamp: '27 Aug 2026'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Airtel Internet bill coming up',
    message: 'Your high-speed internet bill of ₹799 is due in 6 days.',
    type: 'insight',
    timestamp: '2 hours ago',
    read: false,
    badge: 'Bill Alert'
  },
  {
    id: 'NOTIF-2',
    title: 'New login session verified',
    message: 'Chrome on Windows · Delhi, India at 9:22 AM.',
    type: 'security',
    timestamp: '5 hours ago',
    read: false,
    badge: 'Security'
  },
  {
    id: 'NOTIF-3',
    title: 'Savings milestone: 47.5% reached',
    message: 'You have saved ₹28,500 towards your "New Laptop" goal!',
    type: 'insight',
    timestamp: 'Yesterday',
    read: true,
    badge: 'Goal Progress'
  },
  {
    id: 'NOTIF-4',
    title: 'Salary credited successfully',
    message: '₹48,000 received from TechCorp Labs via NEFT.',
    type: 'transaction',
    timestamp: 'Yesterday',
    read: true,
    badge: 'Income'
  }
];

export const SECURITY_SESSIONS = [
  {
    id: 'DEV-1',
    deviceName: 'Chrome on Windows 11',
    browser: 'Chrome 128.0',
    location: 'New Delhi, India',
    ipAddress: '103.21.244.18',
    lastActive: 'Active right now',
    isCurrent: true
  },
  {
    id: 'DEV-2',
    deviceName: 'VAULT Mobile App · iPhone 15 Pro',
    browser: 'iOS 18.0 App',
    location: 'New Delhi, India',
    ipAddress: '103.21.244.20',
    lastActive: '2 hours ago',
    isCurrent: false
  },
  {
    id: 'DEV-3',
    deviceName: 'MacBook Pro · macOS Sonoma',
    browser: 'Safari 17.5',
    location: 'Gurgaon, India',
    ipAddress: '122.160.18.99',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

export const FAQS = [
  {
    id: 'FAQ-1',
    question: 'How is "Safe-to-Spend" calculated?',
    answer: 'Safe-to-Spend is computed transparently by taking your available bank balance (₹42,680.50), subtracting all upcoming commitments and auto-debits in the next 14 days (₹4,300), and reserving your chosen monthly savings allocation (₹20,000). The remainder (₹18,380.50) is your flexible discretionary spending cushion.',
    category: 'Calculations'
  },
  {
    id: 'FAQ-2',
    question: 'What is the "Before You Pay" transparency screen?',
    answer: 'Before confirming any transaction or transfer, VAULT shows you the exact deduction, zero hidden fees, updated post-transaction balance, and the net effect on your monthly flexible spending cushion so you never face transaction anxiety.',
    category: 'Payments'
  },
  {
    id: 'FAQ-3',
    question: 'How does duplicate payment detection work?',
    answer: 'When VAULT detects identical amounts sent to the exact same merchant handle within 5 minutes (such as Amazon retry charges), it flags the transaction for your review without interrupting your account authority.',
    category: 'Security'
  },
  {
    id: 'FAQ-4',
    question: 'Can AI make autonomous transfers without my permission?',
    answer: 'No. At VAULT, AI is strictly an explainable financial assistant. It never makes unilateral decisions, moves funds, or changes account credentials without your explicit review and authorization.',
    category: 'Trust & Security'
  },
  {
    id: 'FAQ-5',
    question: 'How do I dispute an unrecognized charge?',
    answer: 'Open the transaction detail from your Activity ledger and click "Download Verified Receipt" or contact our 24/7 priority concierge in the Help Hub for instant chargeback assistance with NPCI.',
    category: 'Support'
  }
];

export const INITIAL_DEVICES: SecurityDevice[] = [
  {
    id: 'DEV-1',
    device: 'Chrome on Windows 11',
    browser: 'Chrome 128.0',
    location: 'New Delhi, India',
    ip: '103.21.244.18',
    lastActive: 'Active right now',
    isCurrent: true
  },
  {
    id: 'DEV-2',
    device: 'VAULT Mobile App · iPhone 15 Pro',
    browser: 'iOS 18.0 App',
    location: 'New Delhi, India',
    ip: '103.21.244.20',
    lastActive: '2 hours ago',
    isCurrent: false
  },
  {
    id: 'DEV-3',
    device: 'MacBook Pro · macOS Sonoma',
    browser: 'Safari 17.5',
    location: 'Gurgaon, India',
    ip: '122.160.18.99',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

export const DEFAULT_SECTION_VISIBILITY: DashboardSectionVisibility = {
  balanceOverview: true,
  safeToSpend: true,
  quickActions: true,
  spendingSummary: true,
  whereMoneyWent: true,
  upcomingCommitments: true,
  savingsProgress: true,
  recentTransactions: true,
  aiInsightsBanner: true
};

export const RECENT_RECIPIENTS = [
  {
    name: 'Rahul Sharma',
    upiId: 'rahul.sharma@okaxis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    recentAmount: 8500,
    note: 'Rent share / Transfer'
  },
  {
    name: 'Sneha Roy',
    upiId: 'sneharoy@okhdfcbank',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    recentAmount: 1200,
    note: 'Design project split'
  },
  {
    name: 'Aman Verma',
    upiId: 'aman.verma@icici',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    recentAmount: 500,
    note: 'Dinner settle up'
  },
  {
    name: 'Mom & Dad',
    upiId: 'family.home@sbi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    recentAmount: 10000,
    note: 'Home allowance'
  }
];
