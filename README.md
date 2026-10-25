# VAULT — Intelligent, Trust-First Digital Banking

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12.18-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

**VAULT** transforms everyday banking data into clear, transparent, and actionable financial insights while keeping users firmly in control. Designed with a high-trust philosophy, VAULT combines real-time transaction processing, predictive "Safe-to-Spend" budgeting, "What-If" scenario simulations, shared expense splitting, and automated savings targets with enterprise-grade Cloud Firestore persistence and Google Firebase Authentication.

---

## 🌟 Key Features

### 1. Intelligent Financial Dashboard
- **Safe-to-Spend Engine**: Calculates real disposable income by deducting pending commitments, recurring bills, and savings goal allocations from current balances.
- **Interactive Explainer Modal**: Transparent breakdown showing the exact mathematical formula behind your current spend limit.
- **Cash Flow Analytics**: Visual income vs. expenditure tracking powered by responsive Recharts visualizations.
- **Upcoming Commitments Radar**: Days-until-due alerts for subscriptions, utilities, and mortgage/rent obligations.

### 2. "What-If" Purchase Simulator
- Test major purchase decisions before spending a single dollar.
- Adjust amount sliders to view the projected impact on your monthly runway, safe-to-spend buffer, and automated savings milestones.

### 3. Real-Time Transaction Management
- Categorized financial ledger with instantaneous filtering (income, groceries, travel, bills, dining, health).
- Detailed transaction inspection with merchant logos, location tags, timestamping, and authorization status.
- **Dispute Resolution Flow**: Built-in transaction dispute filing with direct security team routing.
- **Digital Receipts**: Downloadable and printable vector receipts with merchant verification codes.

### 4. Shared Expenses & Bill Splitting
- Create group expenses with custom split ratios (equal, custom amounts, percentages).
- Real-time balances tracking who owes whom.
- One-tap settlement triggers and payment confirmation records.

### 5. Automated Savings Goals
- Target goal progress bars with estimated completion dates.
- Automated deposit schedules (daily, weekly, pay-cycle) and spare-change round-up automation.
- One-click instant deposits with ledger debit synchronisation.

### 6. Security Center & Control
- **Dual Authentication**: Secure 4-digit PIN authentication (`1234` default demo PIN) plus native Google OAuth sign-in.
- **Instant Card Locks**: Freeze virtual or physical cards with a single toggle.
- **Biometric Authentication & Geo-Protection**: Simulated FaceID/TouchID checks and location-based fraud shields.
- **Activity & Security Audit**: Real-time notifications for login attempts, large transfers, and policy changes.

### 7. VAULT AI Financial Assistant
- Integrated AI copilot powered by `@google/genai` (Gemini 2.5).
- Inquire about transaction histories, request budget optimizations, or calculate custom savings strategies in natural language.

---

## ☁️ Cloud Architecture & Firebase Integration

VAULT utilizes **Google Firebase** and **Cloud Firestore** for real-time synchronization, multi-user isolation, and security rule enforcement.

### Firebase Configuration
- **Firebase Project ID**: `dappled-webbing-zc9s2`
- **Firestore Database ID**: `ai-studio-vaultintelligent-01ad6f0a-8c91-4b7a-9060-b96ba8bab989`
- **Authentication**: Firebase Authentication with `GoogleAuthProvider` (`signInWithPopup`) and PIN-based user sessions.

### Firestore Collections Architecture
| Collection | Description | Document ID Scheme |
| :--- | :--- | :--- |
| `/transactions` | Ledger items with amount, type, category, status, and userId | Auto-generated or custom `tx_*` |
| `/commitments` | Recurring bills, subscriptions, and payment schedules | Auto-generated |
| `/savingsGoals` | Target balances, deadlines, and automated round-up settings | Auto-generated |
| `/sharedExpenses` | Group tabs, participants, split calculations, and settlement states | Auto-generated |
| `/notifications` | Security alerts, transaction confirmations, and system notifications | Auto-generated |
| `/users` | User profiles, account settings, balance states, and security flags | `request.auth.uid` or PIN-linked ID |

### Real-time Bidirectional Sync
- When online, all UI collections listen to Cloud Firestore via `onSnapshot` listeners.
- Any change (new payment, bill payment, goal deposit) updates instantly across tabs and devices.
- Built-in graceful fallback to local persistence when disconnected.

### Firebase Console Management Modal
- Accessible via the **Firebase** button in the header, sidebar, mobile navigation, and Settings tab.
- **Direct Console Access**: Opens the live Firestore database in the Google Firebase Console.
- **Quick-Copy Keys**: One-click clipboard copy for Project ID and Database ID.
- **Database Reseeding**: 1-click sync button to populate clean demo accounts, transactions, and commitments.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict type checking)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API (`BankingContext.tsx`) with optimistic updates and Firestore listeners
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/)
- **Backend / DB**: [Firebase v12](https://firebase.google.com/) (Firestore, Firebase Auth)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)

---

## 📂 Project Structure

```text
├── .env.example                  # Environment template
├── firebase-applet-config.json   # Google Cloud / Firebase credentials
├── firebase-blueprint.json       # Database schema blueprint & indexes
├── firestore.rules               # Production-grade Firestore security rules
├── metadata.json                 # AI Studio applet metadata & capabilities
├── package.json                  # NPM scripts & dependencies
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build pipeline with Tailwind CSS v4
├── src/
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Master router, auth guard, view switcher
│   ├── types.ts                  # Domain models, banking types, interfaces
│   ├── index.css                 # Global Tailwind CSS styles
│   ├── context/
│   │   └── BankingContext.tsx    # Central state store & Firestore sync engine
│   ├── lib/
│   │   └── firebase.ts           # Firebase App, Firestore DB, and Auth instances
│   ├── data/
│   │   └── mockData.ts           # Demo baseline data for initial state
│   ├── views/
│   │   ├── DashboardView.tsx     # Overview, Safe-to-Spend, Cash Flow chart
│   │   ├── TransactionsView.tsx  # Ledger history, filters, search, receipts
│   │   ├── PaymentsView.tsx      # Transfers, bill pay, recurring commitments
│   │   ├── SavingsView.tsx       # Savings goals, round-up rules, deposits
│   │   ├── SharedExpensesView.tsx# Split expenses, group tabs, settlements
│   │   ├── InsightsView.tsx      # Predictive analytics & spending habits
│   │   ├── SecurityCenterView.tsx# Card locks, PIN setup, biometrics, 2FA
│   │   ├── NotificationsView.tsx # Actionable notification feed
│   │   ├── SettingsView.tsx      # Preferences, database management, theme
│   │   ├── ProfileView.tsx       # Account details & credentials
│   │   ├── LoginView.tsx         # PIN pad & Google Sign-In access
│   │   └── LandingView.tsx       # Marketing landing page & value showcase
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx        # Top navigation, theme toggle, Firebase button
│       │   ├── Sidebar.tsx       # Desktop navigation & quick account switcher
│       │   ├── MobileNavbar.tsx  # Mobile top header
│       │   ├── MobileBottomNav.tsx # Mobile navigation bar
│       │   └── ToastContainer.tsx# Alert toasts
│       ├── assistant/
│       │   └── VaultAssistantDrawer.tsx # Gemini AI financial copilot
│       └── modals/
│           ├── FirebaseConsoleModal.tsx # Firebase console details & reseed
│           ├── ReceiptModal.tsx         # Digital receipt viewer & print/export
│           ├── SafeToSpendExplainerModal.tsx # Detailed budget calculation guide
│           └── SimulationWhatIfModal.tsx    # Scenario sandbox calculator
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `18.x` or higher
- **Package Manager**: `npm` (or `bun` / `pnpm`)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Development Server
Start the local Vite dev server on port `3000`:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
Create an optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

### 5. TypeScript Linting
Validate all types and catch potential syntax errors:
```bash
npm run lint
```

---

## 🔒 Security & Privacy Rules

- **Zero-Trust Access**: Firestore access is secured via `firestore.rules`.
- **Sensitive Operations**: High-value transfers and credential changes enforce re-authentication with the security PIN.
- **Card Safeguards**: Cards can be immediately frozen from the Security Center with live status feedback.
- **Audit Trails**: All transactions, disputes, and settings adjustments log timestamps and user metadata.

---

## 📄 License
MIT © 2026 VAULT Banking Technologies.
