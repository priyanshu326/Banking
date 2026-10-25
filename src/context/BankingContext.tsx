import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Transaction,
  UpcomingCommitment,
  SavingsGoal,
  SharedExpense,
  FinancialInsight,
  NotificationItem,
  SecurityDevice,
  DashboardSectionVisibility,
  AssistantMessage,
  CategoryType
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMITMENTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_SHARED_EXPENSES,
  INITIAL_INSIGHTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DEVICES,
  DEFAULT_SECTION_VISIBILITY
} from '../data/mockData';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  db,
  auth,
  googleAuthProvider,
  signInWithPopup,
  firebaseSignOut,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection
} from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export interface PaymentDraft {
  recipientName: string;
  recipientUpi: string;
  recipientAvatar?: string;
  amount: number;
  note: string;
  category: CategoryType;
}

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'amber' | 'info' | 'error';
}

interface BankingContextType {
  // Navigation & Auth
  currentRoute: string;
  navigateTo: (route: string, params?: { txnId?: string }) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Firebase Cloud State & Console Integration
  firebaseUser: FirebaseUser | null;
  isFirebaseConnected: boolean;
  isSyncingWithFirestore: boolean;
  firebaseProjectId: string;
  firebaseDatabaseId: string;
  firebaseConsoleUrl: string;
  loginWithGoogle: () => Promise<void>;
  seedFirestoreData: () => Promise<void>;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;

  // User & Profile
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Financial State
  transactions: Transaction[];
  addTransaction: (txn: Omit<Transaction, 'id' | 'referenceNumber' | 'balanceBefore' | 'balanceAfter'>) => Transaction;
  selectedTransactionId: string | null;
  setSelectedTransactionId: (id: string | null) => void;
  getTransactionById: (id: string) => Transaction | undefined;

  commitments: UpcomingCommitment[];
  payCommitment: (id: string) => void;
  addCommitment: (commitment: Omit<UpcomingCommitment, 'id'>) => void;

  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  depositToGoal: (id: string, amount: number) => void;
  togglePauseGoal: (id: string) => void;

  sharedExpenses: SharedExpense[];
  addSharedExpense: (expense: Omit<SharedExpense, 'id'>) => void;
  settleParticipant: (expenseId: string, participantId: string) => void;
  sendSplitReminder: (expenseId: string, participantId: string) => void;

  insights: FinancialInsight[];
  dismissInsight: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  devices: SecurityDevice[];
  revokeDevice: (id: string) => void;

  sectionVisibility: DashboardSectionVisibility;
  toggleSectionVisibility: (key: keyof DashboardSectionVisibility) => void;

  // Calculations
  availableBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  upcomingTotal: number;
  safeToSpendAmount: number;
  safeToSpendCalculation: {
    balance: number;
    upcomingCommitments: number;
    savingsAllocation: number;
    flexibleSpending: number;
    disclaimer: string;
  };

  // Payment Flow
  activePaymentDraft: PaymentDraft | null;
  setActivePaymentDraft: (draft: PaymentDraft | null) => void;
  lastSuccessfulPayment: Transaction | null;
  executePayment: () => { success: boolean; transaction?: Transaction; error?: string };

  // AI Assistant
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  assistantMessages: AssistantMessage[];
  sendAssistantMessage: (query: string) => void;

  // Modals & UI helpers
  activeExplainerModal: 'safe-to-spend' | 'what-if' | 'receipt' | null;
  setActiveExplainerModal: (modal: 'safe-to-spend' | 'what-if' | 'receipt' | null) => void;
  activeReceiptTxn: Transaction | null;
  setActiveReceiptTxn: (txn: Transaction | null) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'amber' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('vault_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('vault_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Auth & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vault_auth') === 'true';
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return localStorage.getItem('vault_auth') === 'true' ? '/dashboard' : '/landing';
  });

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Firebase state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSyncingWithFirestore, setIsSyncingWithFirestore] = useState<boolean>(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  const firebaseProjectId = firebaseConfig.projectId;
  const firebaseDatabaseId = firebaseConfig.firestoreDatabaseId;
  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/firestore/databases/${firebaseDatabaseId}/data`;

  const navigateTo = (route: string, params?: { txnId?: string }) => {
    if (params?.txnId) {
      setSelectedTransactionId(params.txnId);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('vault_auth', 'true');
    setCurrentRoute('/dashboard');
    showToast('Secure Session Established', 'Authenticated via 256-bit encrypted PIN verification', 'success');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('vault_auth', 'false');
    setCurrentRoute('/login');
    showToast('Signed Out', 'You have been safely signed out of VAULT', 'info');
  };

  // Google Login via Firebase Auth
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      setFirebaseUser(result.user);
      setIsAuthenticated(true);
      localStorage.setItem('vault_auth', 'true');
      setCurrentRoute('/dashboard');
      showToast('Google Firebase Connected', `Signed in as ${result.user.displayName || result.user.email}`, 'success');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast('Sign In Notice', err?.message || 'Could not complete Google Sign In', 'amber');
    }
  };

  // User state
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const path = `users/${uid}`;
        setDoc(doc(db, 'users', uid), {
          id: uid,
          name: updated.name,
          email: updated.email,
          phone: updated.phone || '',
          avatar: updated.avatar || '',
          accountNumberMasked: updated.accountNumberMasked || '',
          tier: updated.tier || 'Private Banking',
          kycStatus: updated.kycStatus || 'verified',
          createdAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, path);
        });
      }
      return updated;
    });
    showToast('Profile Updated', 'Security and profile settings synchronized', 'success');
  };

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('vault_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('vault_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Balance calculation
  const availableBalance = transactions.length > 0 ? transactions[0].balanceAfter : 42680.50;

  const monthlyIncome = transactions
    .filter(t => t.amount > 0 && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 48000;

  const monthlySpending = Math.abs(
    transactions
      .filter(t => t.amount < 0 && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  ) || 8420;

  // Commitments
  const [commitments, setCommitments] = useState<UpcomingCommitment[]>(() => {
    const saved = localStorage.getItem('vault_commitments');
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
  });

  useEffect(() => {
    localStorage.setItem('vault_commitments', JSON.stringify(commitments));
  }, [commitments]);

  const upcomingTotal = commitments.reduce((sum, c) => sum + c.amount, 0);

  // Savings Goals
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('vault_savings_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  useEffect(() => {
    localStorage.setItem('vault_savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  // Shared Expenses
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>(() => {
    const saved = localStorage.getItem('vault_shared_expenses');
    return saved ? JSON.parse(saved) : INITIAL_SHARED_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('vault_shared_expenses', JSON.stringify(sharedExpenses));
  }, [sharedExpenses]);

  // Insights & Notifications & Devices
  const [insights, setInsights] = useState<FinancialInsight[]>(() => {
    const saved = localStorage.getItem('vault_insights');
    return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [devices, setDevices] = useState<SecurityDevice[]>(INITIAL_DEVICES);
  const [sectionVisibility, setSectionVisibility] = useState<DashboardSectionVisibility>(DEFAULT_SECTION_VISIBILITY);

  // Safe-to-Spend Transparent Model
  const nearTermCommitments = 4300;
  const targetSavingsReserve = 20000;
  const safeToSpendAmount = Math.max(0, availableBalance - nearTermCommitments - targetSavingsReserve);

  const safeToSpendCalculation = {
    balance: availableBalance,
    upcomingCommitments: nearTermCommitments,
    savingsAllocation: targetSavingsReserve,
    flexibleSpending: safeToSpendAmount,
    disclaimer: 'This is an estimate based on your active balances, near-term recurring bills, and savings target allocations. It is not financial advice and does not enforce hard spending limits.'
  };

  // Seed data function to push records into Firestore
  const seedFirestoreDataForUser = async (uid: string) => {
    setIsSyncingWithFirestore(true);
    try {
      // 1. User Profile
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        name: auth.currentUser?.displayName || user.name,
        email: auth.currentUser?.email || user.email,
        phone: user.phone || '+91 98765 43210',
        avatar: auth.currentUser?.photoURL || user.avatar,
        accountNumberMasked: user.accountNumberMasked || '•••• •••• •••• 4821',
        tier: user.tier || 'Private Banking',
        kycStatus: user.kycStatus || 'verified',
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. Transactions
      for (const txn of INITIAL_TRANSACTIONS.slice(0, 8)) {
        await setDoc(doc(db, 'transactions', txn.id), {
          id: txn.id,
          userId: uid,
          merchant: txn.merchant,
          amount: txn.amount,
          category: txn.category,
          type: txn.amount >= 0 ? 'credit' : 'debit',
          timestamp: txn.timestamp,
          balanceBefore: txn.balanceBefore,
          balanceAfter: txn.balanceAfter,
          referenceNumber: txn.referenceNumber,
          status: txn.status,
          isUnusual: !!txn.isUnusual,
          paymentMethod: txn.paymentMethod || 'UPI',
          note: txn.notes || ''
        });
      }

      // 3. Commitments
      for (const com of INITIAL_COMMITMENTS) {
        await setDoc(doc(db, 'commitments', com.id), {
          id: com.id,
          userId: uid,
          title: com.title,
          amount: com.amount,
          dueDate: com.dueDate,
          daysRemaining: com.daysRemaining,
          autoDebit: com.autoDebit,
          category: com.category,
          status: com.status
        });
      }

      // 4. Savings Goals
      for (const goal of INITIAL_SAVINGS_GOALS) {
        await setDoc(doc(db, 'savingsGoals', goal.id), {
          id: goal.id,
          userId: uid,
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate,
          monthlyContribution: goal.monthlyContribution,
          category: goal.category,
          isPaused: goal.isPaused,
          createdAt: goal.createdAt
        });
      }

      // 5. Shared Expenses
      for (const expense of INITIAL_SHARED_EXPENSES) {
        await setDoc(doc(db, 'sharedExpenses', expense.id), {
          id: expense.id,
          userId: uid,
          title: expense.title,
          totalAmount: expense.totalAmount,
          date: expense.date,
          settled: expense.status === 'all_settled'
        });
      }

      // 6. Notifications
      for (const notif of INITIAL_NOTIFICATIONS.slice(0, 5)) {
        await setDoc(doc(db, 'notifications', notif.id), {
          id: notif.id,
          userId: uid,
          title: notif.title,
          message: notif.message,
          timestamp: notif.timestamp,
          read: notif.read,
          type: notif.type,
          actionUrl: notif.actionUrl || ''
        });
      }
    } catch (err: any) {
      console.error('Error seeding data to Firestore:', err);
    } finally {
      setIsSyncingWithFirestore(false);
    }
  };

  const seedFirestoreData = async () => {
    const uid = auth.currentUser?.uid || 'demo-user-vault';
    await seedFirestoreDataForUser(uid);
  };

  // Listen to Firebase Auth changes and attach Firestore live sync
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);

      if (currentFbUser) {
        const uid = currentFbUser.uid;
        setUser(prev => ({
          ...prev,
          name: currentFbUser.displayName || prev.name,
          email: currentFbUser.email || prev.email,
          avatar: currentFbUser.photoURL || prev.avatar
        }));

        // Check user profile document in Firestore
        try {
          const userDocSnap = await getDoc(doc(db, 'users', uid));
          if (!userDocSnap.exists()) {
            await seedFirestoreDataForUser(uid);
          }
        } catch {
          // If error reading, continue gracefully
        }

        // Live Transactions Subscription
        const txnsQuery = query(collection(db, 'transactions'), where('userId', '==', uid));
        const unsubTxns = onSnapshot(
          txnsQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedTxns: Transaction[] = snapshot.docs.map(d => {
                const data = d.data();
                return {
                  id: data.id || d.id,
                  merchant: data.merchant,
                  category: data.category as CategoryType,
                  amount: data.amount,
                  date: 'Recent',
                  timestamp: data.timestamp,
                  status: data.status,
                  paymentMethod: data.paymentMethod,
                  referenceNumber: data.referenceNumber,
                  balanceBefore: data.balanceBefore,
                  balanceAfter: data.balanceAfter,
                  fee: 0,
                  notes: data.note,
                  isUnusual: data.isUnusual
                };
              });
              // Sort newest first
              setTransactions(loadedTxns);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'transactions');
          }
        );

        // Live Commitments Subscription
        const comQuery = query(collection(db, 'commitments'), where('userId', '==', uid));
        const unsubCom = onSnapshot(
          comQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedCom: UpcomingCommitment[] = snapshot.docs.map(d => {
                const data = d.data();
                return {
                  id: data.id || d.id,
                  title: data.title,
                  category: data.category,
                  amount: data.amount,
                  dueDate: data.dueDate,
                  daysRemaining: data.daysRemaining || 3,
                  autoDebit: data.autoDebit,
                  status: data.status || 'upcoming',
                  paymentMethod: 'Auto-Debit'
                };
              });
              setCommitments(loadedCom);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'commitments');
          }
        );

        // Live Savings Goals Subscription
        const goalsQuery = query(collection(db, 'savingsGoals'), where('userId', '==', uid));
        const unsubGoals = onSnapshot(
          goalsQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedGoals: SavingsGoal[] = snapshot.docs.map(d => {
                const data = d.data();
                return {
                  id: data.id || d.id,
                  name: data.name,
                  targetAmount: data.targetAmount,
                  currentAmount: data.currentAmount,
                  targetDate: data.targetDate,
                  monthlyContribution: data.monthlyContribution,
                  category: data.category,
                  color: 'emerald',
                  iconName: 'Target',
                  isPaused: data.isPaused,
                  createdAt: data.createdAt
                };
              });
              setSavingsGoals(loadedGoals);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'savingsGoals');
          }
        );

        // Live Notifications Subscription
        const notifQuery = query(collection(db, 'notifications'), where('userId', '==', uid));
        const unsubNotif = onSnapshot(
          notifQuery,
          (snapshot) => {
            if (!snapshot.empty) {
              const loadedNotifs: NotificationItem[] = snapshot.docs.map(d => {
                const data = d.data();
                return {
                  id: data.id || d.id,
                  title: data.title,
                  message: data.message,
                  timestamp: data.timestamp,
                  read: data.read,
                  type: data.type || 'security',
                  actionUrl: data.actionUrl
                };
              });
              setNotifications(loadedNotifs);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'notifications');
          }
        );

        return () => {
          unsubTxns();
          unsubCom();
          unsubGoals();
          unsubNotif();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Payment flow draft & execution
  const [activePaymentDraft, setActivePaymentDraft] = useState<PaymentDraft | null>(null);
  const [lastSuccessfulPayment, setLastSuccessfulPayment] = useState<Transaction | null>(null);

  const executePayment = () => {
    if (!activePaymentDraft || activePaymentDraft.amount <= 0) {
      return { success: false, error: 'Invalid payment amount specified' };
    }

    if (activePaymentDraft.amount > availableBalance) {
      return { success: false, error: 'Insufficient available funds in your VAULT account' };
    }

    const newBalance = availableBalance - activePaymentDraft.amount;
    const refNum = `UPI/2026/${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(91000 + Math.random() * 8000)}`,
      merchant: activePaymentDraft.recipientName,
      category: activePaymentDraft.category || 'Transfers',
      amount: -activePaymentDraft.amount,
      date: 'Today',
      timestamp: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'completed',
      paymentMethod: 'UPI',
      referenceNumber: refNum,
      balanceBefore: availableBalance,
      balanceAfter: newBalance,
      fee: 0,
      notes: activePaymentDraft.note || 'Direct UPI Transfer',
      deductionReason: `Instant P2P payment to ${activePaymentDraft.recipientName} (${activePaymentDraft.recipientUpi})`,
      recipientUpiId: activePaymentDraft.recipientUpi
    };

    setTransactions(prev => [newTxn, ...prev]);
    setLastSuccessfulPayment(newTxn);

    // Save to Firestore if user is authenticated
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docPath = `transactions/${newTxn.id}`;
      setDoc(doc(db, 'transactions', newTxn.id), {
        id: newTxn.id,
        userId: uid,
        merchant: newTxn.merchant,
        amount: newTxn.amount,
        category: newTxn.category,
        type: 'debit',
        timestamp: newTxn.timestamp,
        balanceBefore: newTxn.balanceBefore,
        balanceAfter: newTxn.balanceAfter,
        referenceNumber: newTxn.referenceNumber,
        status: newTxn.status,
        isUnusual: false,
        paymentMethod: 'UPI',
        note: newTxn.notes || ''
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      });
    }

    // Also add to notifications
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Paid ₹${activePaymentDraft.amount.toLocaleString('en-IN')}`,
      message: `Successfully transferred to ${activePaymentDraft.recipientName}. Reference: ${refNum}`,
      type: 'transaction',
      timestamp: 'Just now',
      read: false,
      badge: 'Payment Sent'
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const path = `notifications/${newNotif.id}`;
      setDoc(doc(db, 'notifications', newNotif.id), {
        id: newNotif.id,
        userId: uid,
        title: newNotif.title,
        message: newNotif.message,
        timestamp: newNotif.timestamp,
        read: false,
        type: newNotif.type,
        actionRoute: ''
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, path);
      });
    }

    return { success: true, transaction: newTxn };
  };

  const addTransaction = (txnData: Omit<Transaction, 'id' | 'referenceNumber' | 'balanceBefore' | 'balanceAfter'>) => {
    const balBefore = availableBalance;
    const balAfter = balBefore + txnData.amount;
    const newTxn: Transaction = {
      ...txnData,
      id: `TXN-${Math.floor(92000 + Math.random() * 7000)}`,
      referenceNumber: `VAULT/TXN/${Math.floor(10000000 + Math.random() * 90000000)}`,
      balanceBefore: balBefore,
      balanceAfter: balAfter
    };
    setTransactions(prev => [newTxn, ...prev]);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docPath = `transactions/${newTxn.id}`;
      setDoc(doc(db, 'transactions', newTxn.id), {
        id: newTxn.id,
        userId: uid,
        merchant: newTxn.merchant,
        amount: newTxn.amount,
        category: newTxn.category,
        type: newTxn.amount >= 0 ? 'credit' : 'debit',
        timestamp: newTxn.timestamp,
        balanceBefore: newTxn.balanceBefore,
        balanceAfter: newTxn.balanceAfter,
        referenceNumber: newTxn.referenceNumber,
        status: newTxn.status,
        isUnusual: !!newTxn.isUnusual,
        paymentMethod: newTxn.paymentMethod || 'UPI',
        note: newTxn.notes || ''
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      });
    }

    return newTxn;
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const payCommitment = (id: string) => {
    const com = commitments.find(c => c.id === id);
    if (!com) return;

    if (com.amount > availableBalance) {
      showToast('Insufficient Funds', 'Could not complete bill payment due to low balance', 'error');
      return;
    }

    addTransaction({
      merchant: com.title,
      category: com.category,
      amount: -com.amount,
      date: 'Today',
      timestamp: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'completed',
      paymentMethod: 'Auto-Debit',
      fee: 0,
      deductionReason: `Bill settlement for ${com.title}`
    });

    setCommitments(prev => prev.filter(c => c.id !== id));

    if (auth.currentUser) {
      const docPath = `commitments/${id}`;
      deleteDoc(doc(db, 'commitments', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      });
    }

    showToast('Commitment Settled', `Paid ₹${com.amount.toLocaleString('en-IN')} for ${com.title}`, 'success');
  };

  const addCommitment = (comData: Omit<UpcomingCommitment, 'id'>) => {
    const newCom: UpcomingCommitment = {
      ...comData,
      id: `COM-${Date.now()}`
    };
    setCommitments(prev => [...prev, newCom]);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docPath = `commitments/${newCom.id}`;
      setDoc(doc(db, 'commitments', newCom.id), {
        id: newCom.id,
        userId: uid,
        title: newCom.title,
        amount: newCom.amount,
        dueDate: newCom.dueDate,
        daysRemaining: newCom.daysRemaining,
        autoDebit: newCom.autoDebit,
        category: newCom.category,
        status: newCom.status
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      });
    }

    showToast('Commitment Added', `Added recurring bill ${comData.title}`, 'success');
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `GOAL-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavingsGoals(prev => [newGoal, ...prev]);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docPath = `savingsGoals/${newGoal.id}`;
      setDoc(doc(db, 'savingsGoals', newGoal.id), {
        id: newGoal.id,
        userId: uid,
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount,
        targetDate: newGoal.targetDate,
        monthlyContribution: newGoal.monthlyContribution,
        category: newGoal.category,
        isPaused: newGoal.isPaused,
        createdAt: newGoal.createdAt
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      });
    }

    showToast('Savings Goal Created', `Goal for "${goalData.name}" created with monthly target of ₹${goalData.monthlyContribution.toLocaleString('en-IN')}`, 'success');
  };

  const depositToGoal = (id: string, amount: number) => {
    if (amount <= 0 || amount > availableBalance) {
      showToast('Transfer Failed', 'Invalid deposit amount or insufficient balance', 'error');
      return;
    }

    const goal = savingsGoals.find(g => g.id === id);
    if (!goal) return;

    addTransaction({
      merchant: `VAULT Savings: ${goal.name}`,
      category: 'Other',
      amount: -amount,
      date: 'Today',
      timestamp: `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      fee: 0,
      deductionReason: `Allocated funds into goal ${goal.name}`
    });

    const updatedAmount = goal.currentAmount + amount;
    setSavingsGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, currentAmount: updatedAmount } : g))
    );

    if (auth.currentUser) {
      const docPath = `savingsGoals/${id}`;
      updateDoc(doc(db, 'savingsGoals', id), {
        currentAmount: updatedAmount
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      });
    }

    showToast('Goal Allocation Added', `Transferred ₹${amount.toLocaleString('en-IN')} towards "${goal.name}"`, 'success');
  };

  const togglePauseGoal = (id: string) => {
    const goal = savingsGoals.find(g => g.id === id);
    if (!goal) return;
    const newPaused = !goal.isPaused;

    setSavingsGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, isPaused: newPaused } : g))
    );

    if (auth.currentUser) {
      const docPath = `savingsGoals/${id}`;
      updateDoc(doc(db, 'savingsGoals', id), {
        isPaused: newPaused
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      });
    }
  };

  const addSharedExpense = (expenseData: Omit<SharedExpense, 'id'>) => {
    const newExpense: SharedExpense = {
      ...expenseData,
      id: `SPLIT-${Date.now()}`
    };
    setSharedExpenses(prev => [newExpense, ...prev]);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docPath = `sharedExpenses/${newExpense.id}`;
      setDoc(doc(db, 'sharedExpenses', newExpense.id), {
        id: newExpense.id,
        userId: uid,
        title: newExpense.title,
        totalAmount: newExpense.totalAmount,
        date: newExpense.date,
        settled: newExpense.status === 'all_settled'
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      });
    }

    showToast('Shared Expense Created', `Split created for ${expenseData.title}`, 'success');
  };

  const settleParticipant = (expenseId: string, participantId: string) => {
    setSharedExpenses(prev =>
      prev.map(exp => {
        if (exp.id !== expenseId) return exp;
        const updatedParticipants = exp.participants.map(p =>
          p.id === participantId ? { ...p, isSettled: true, settledAt: `Settled on ${new Date().toLocaleDateString()}` } : p
        );
        const allSettled = updatedParticipants.every(p => p.isSettled);

        if (auth.currentUser) {
          const docPath = `sharedExpenses/${expenseId}`;
          updateDoc(doc(db, 'sharedExpenses', expenseId), {
            settled: allSettled
          }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, docPath);
          });
        }

        return {
          ...exp,
          participants: updatedParticipants,
          status: allSettled ? 'all_settled' : 'partially_settled'
        };
      })
    );
    showToast('Settlement Recorded', 'Marked friend’s share as settled', 'success');
  };

  const sendSplitReminder = (expenseId: string, participantId: string) => {
    const expense = sharedExpenses.find(e => e.id === expenseId);
    const participant = expense?.participants.find(p => p.id === participantId);
    if (participant) {
      showToast('Payment Reminder Sent', `Sent a gentle UPI nudge to ${participant.name} for ₹${participant.owesAmount}`, 'info');
    }
  };

  const dismissInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    if (auth.currentUser) {
      const docPath = `notifications/${id}`;
      updateDoc(doc(db, 'notifications', id), {
        read: true
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      });
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All Caught Up', 'Marked all notifications as read', 'info');
  };

  const revokeDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    showToast('Session Revoked', 'Device disconnected from your VAULT account', 'amber');
  };

  const toggleSectionVisibility = (key: keyof DashboardSectionVisibility) => {
    setSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // AI Assistant Engine
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Good day. I am your VAULT Financial Intelligence Assistant. I can help you understand where your money went, simulate upcoming payment impacts, review bills, or check savings projections with transparent, zero-jargon calculations.',
      timestamp: 'Active Now',
      suggestedActions: [
        { label: 'Where did my money go?', action: 'where_money_went' },
        { label: 'What bills are coming up?', action: 'bills_coming_up' },
        { label: 'What happens if I spend ₹5,000?', action: 'what_if_5000' },
        { label: 'Show unusual transactions', action: 'unusual_txns' }
      ]
    }
  ]);

  const sendAssistantMessage = (query: string) => {
    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAssistantMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = '';
      let breakdown: AssistantMessage['calculationBreakdown'] | undefined = undefined;
      let suggestedActions: AssistantMessage['suggestedActions'] = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('where did my money go') || lower.includes('spending') || lower.includes('spend the most')) {
        replyText = `You have spent ₹8,420 this month across 8 transactions. Your top spending contributor is Food & Dining at ₹2,840 (33.7%), followed by Shopping at ₹1,920 (22.8%) and Transport at ₹1,140 (13.5%). Compared to last month, your overall spending increased by 18% primarily due to dining out and one-off electronics purchases.`;
        breakdown = {
          label: 'Monthly Spending Breakdown (August 2026)',
          items: [
            { title: 'Food & Dining (Swiggy, Blue Tokai, Groceries)', amount: '₹2,840', type: 'minus' },
            { title: 'Shopping (Amazon, Apparel)', amount: '₹1,920', type: 'minus' },
            { title: 'Transport (Delhi Metro, Uber)', amount: '₹1,140', type: 'minus' },
            { title: 'Subscriptions (Netflix, Spotify)', amount: '₹1,049', type: 'minus' },
            { title: 'Other Discretionary Transfers', amount: '₹1,471', type: 'minus' },
            { title: 'Total August Spend', amount: '₹8,420', type: 'total' }
          ],
          disclaimer: 'Calculated from completed debits between 1 Aug 2026 and 30 Aug 2026.'
        };
      } else if (lower.includes('what happens if i spend') || lower.includes('5000') || lower.includes('spend')) {
        const matchAmount = query.match(/(\d+[\d,]*)/);
        const amountToSimulate = matchAmount ? parseInt(matchAmount[0].replace(/,/g, ''), 10) : 5000;
        const newBalance = availableBalance - amountToSimulate;
        const newFlexible = Math.max(0, newBalance - nearTermCommitments - targetSavingsReserve);

        replyText = `If you spend ₹${amountToSimulate.toLocaleString('en-IN')} today, your available balance would decrease from ₹${availableBalance.toLocaleString('en-IN')} to approximately ₹${newBalance.toLocaleString('en-IN')}.\n\nBased on your ₹${nearTermCommitments.toLocaleString('en-IN')} upcoming commitments in the next 14 days and your ₹${targetSavingsReserve.toLocaleString('en-IN')} monthly savings goal buffer, your estimated flexible spending would adjust from ₹${safeToSpendAmount.toLocaleString('en-IN')} down to ₹${newFlexible.toLocaleString('en-IN')}.`;
        
        breakdown = {
          label: `Spending Simulation for ₹${amountToSimulate.toLocaleString('en-IN')}`,
          items: [
            { title: 'Current Available Balance', amount: `₹${availableBalance.toLocaleString('en-IN')}`, type: 'neutral' },
            { title: 'Simulated Outflow', amount: `-₹${amountToSimulate.toLocaleString('en-IN')}`, type: 'minus' },
            { title: 'Projected New Balance', amount: `₹${newBalance.toLocaleString('en-IN')}`, type: 'neutral' },
            { title: 'Committed Bills & Subscriptions', amount: `-₹${nearTermCommitments.toLocaleString('en-IN')}`, type: 'minus' },
            { title: 'Savings Allocation Buffer', amount: `-₹${targetSavingsReserve.toLocaleString('en-IN')}`, type: 'minus' },
            { title: 'Updated Flexible Safe-to-Spend', amount: `₹${newFlexible.toLocaleString('en-IN')}`, type: 'total' }
          ],
          disclaimer: 'This simulation model is purely informative. VAULT does not block your transactions and leaves all financial choices in your control.'
        };
      } else if (lower.includes('bills') || lower.includes('coming up') || lower.includes('subscription')) {
        replyText = `You have 4 upcoming commitments totaling ₹13,947 over the next 10 days. The closest is Netflix (₹649) due tomorrow via Auto-Debit, followed by your apartment rent (₹12,000) on 3 September.`;
        breakdown = {
          label: 'Upcoming Commitments Schedule',
          items: [
            { title: 'Netflix Subscription (Tomorrow)', amount: '₹649', type: 'minus' },
            { title: 'Apartment Rent (3 Sep)', amount: '₹12,000', type: 'minus' },
            { title: 'Airtel Fiber Internet (5 Sep)', amount: '₹799', type: 'minus' },
            { title: 'Course Subscription (8 Sep)', amount: '₹499', type: 'minus' },
            { title: 'Total Upcoming Commitments', amount: '₹13,947', type: 'total' }
          ],
          disclaimer: 'Tracked from recurring merchant mandates and user scheduled reminders.'
        };
      } else if (lower.includes('saving') || lower.includes('saved') || lower.includes('goal')) {
        replyText = `You are actively making great progress! You have saved ₹28,500 towards your "New Laptop" goal (47.5% of ₹60,000 target). To meet your target by 15 December 2026, your recommended monthly allocation is approximately ₹7,875. You also have ₹35,000 in your Emergency Cushion.`;
        breakdown = {
          label: 'Savings Goals Summary',
          items: [
            { title: 'New Laptop (Target ₹60k by Dec 2026)', amount: '₹28,500 saved (47.5%)', type: 'plus' },
            { title: 'Emergency Cushion (Target ₹50k by Mar 2027)', amount: '₹35,000 saved (70.0%)', type: 'plus' },
            { title: 'Goa Trip (Target ₹20k by Oct 2026)', amount: '₹8,400 saved (42.0%)', type: 'plus' },
            { title: 'Total Saved Across All Goals', amount: '₹71,900', type: 'total' }
          ],
          disclaimer: 'Projections assume consistent monthly allocations as set in your savings goals.'
        };
      } else if (lower.includes('unusual') || lower.includes('security') || lower.includes('anomaly')) {
        replyText = `We detected one purchase that stood out from your typical patterns: a ₹7,800 payment at XYZ Electronics Store on 28 Aug. Your median shopping transaction is ₹850, making this transaction 9.1x your typical spend. We also flagged a possible duplicate payment of ₹1,299 at Amazon India.`;
        suggestedActions = [
          { label: 'Review Unusual Purchase', action: 'review_unusual' },
          { label: 'Check Duplicate Payments', action: 'review_duplicates' }
        ];
      } else {
        replyText = `I analyzed your account. Your available balance is ₹${availableBalance.toLocaleString('en-IN')}, and your flexible safe-to-spend estimate is ₹${safeToSpendAmount.toLocaleString('en-IN')}. Would you like to explore your recent spending, preview upcoming bills, or test a "What-If" payment simulation?`;
        suggestedActions = [
          { label: 'Where did my money go?', action: 'where_money_went' },
          { label: 'What bills are coming up?', action: 'bills_coming_up' },
          { label: 'What happens if I spend ₹5,000?', action: 'what_if_5000' }
        ];
      }

      const assistantMsg: AssistantMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calculationBreakdown: breakdown,
        suggestedActions
      };

      setAssistantMessages(prev => [...prev, assistantMsg]);
    }, 450);
  };

  // Explainer modals
  const [activeExplainerModal, setActiveExplainerModal] = useState<'safe-to-spend' | 'what-if' | 'receipt' | null>(null);
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<Transaction | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const showToast = (title: string, message: string, type: 'success' | 'amber' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BankingContext.Provider
      value={{
        currentRoute,
        navigateTo,
        isAuthenticated,
        login,
        logout,
        theme,
        toggleTheme,

        firebaseUser,
        isFirebaseConnected,
        isSyncingWithFirestore,
        firebaseProjectId,
        firebaseDatabaseId,
        firebaseConsoleUrl,
        loginWithGoogle,
        seedFirestoreData,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,

        user,
        updateUser,

        transactions,
        addTransaction,
        selectedTransactionId,
        setSelectedTransactionId,
        getTransactionById,

        commitments,
        payCommitment,
        addCommitment,

        savingsGoals,
        addSavingsGoal,
        depositToGoal,
        togglePauseGoal,

        sharedExpenses,
        addSharedExpense,
        settleParticipant,
        sendSplitReminder,

        insights,
        dismissInsight,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,

        devices,
        revokeDevice,

        sectionVisibility,
        toggleSectionVisibility,

        availableBalance,
        monthlyIncome,
        monthlySpending,
        upcomingTotal,
        safeToSpendAmount,
        safeToSpendCalculation,

        activePaymentDraft,
        setActivePaymentDraft,
        lastSuccessfulPayment,
        executePayment,

        isAssistantOpen,
        setIsAssistantOpen,
        assistantMessages,
        sendAssistantMessage,

        activeExplainerModal,
        setActiveExplainerModal,
        activeReceiptTxn,
        setActiveReceiptTxn,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
