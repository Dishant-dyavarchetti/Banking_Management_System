# NovaBank Frontend

A modern, responsive online banking dashboard built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## Project Structure

```text
frontend/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Alert.tsx               # Contextual notification alert banner
│   │   ├── ConfirmationModal.tsx   # Action confirmation modal dialog
│   │   ├── Footer.tsx              # Application footer with navigational links
│   │   ├── Navbar.tsx              # Top navigation bar with active states & mobile menu
│   │   ├── PinVerificationModal.tsx# Secure transaction PIN verification modal
│   │   └── SummaryCard.tsx         # Account summary metrics card
│   ├── context/
│   │   └── AppContext.tsx          # Global application state (auth, user, transactions, loans)
│   ├── pages/
│   │   ├── AboutUs.tsx             # Bank overview and company details
│   │   ├── Account.tsx             # User profile, PIN management, and account settings
│   │   ├── Contact.tsx             # Contact inquiries and customer service form
│   │   ├── Dashboard.tsx           # Main banking dashboard with balance, metrics, quick actions
│   │   ├── Deposit.tsx             # Balance deposit workflow with PIN authorization
│   │   ├── FundTransfer.tsx        # Fund transfer to external accounts with validation & PIN
│   │   ├── Home.tsx                # Public landing page with features & call-to-actions
│   │   ├── Loan.tsx                # Loan eligibility calculator, application, and EMI scheduler
│   │   ├── Login.tsx               # Account authentication portal
│   │   ├── Signup.tsx              # Account registration with automatic account generation
│   │   └── Transactions.tsx        # Searchable transaction history with filtering & statements
│   ├── types/
│   │   └── index.ts                # TypeScript domain models and interfaces
│   ├── utils/
│   │   ├── bankingUtils.ts         # Account numbers, balances, sample transactions
│   │   ├── formatCurrency.ts       # Indian Rupee (₹) currency & date formatters
│   │   ├── loanUtils.ts            # EMI calculation and credit eligibility heuristics
│   │   └── storage.ts              # LocalStorage persistence & session management
│   ├── App.tsx                     # Top-level router with protected routes
│   ├── index.css                   # Tailwind CSS base, components, and custom utilities
│   ├── main.tsx                    # React DOM root entry point
│   └── vite-env.d.ts               # Vite client TypeScript declarations
├── eslint.config.js        # ESLint 9 flat configuration with TypeScript and React hooks
├── index.html              # HTML5 entry template
├── package.json            # Project dependencies and script definitions
├── postcss.config.js       # PostCSS pipeline configuring Tailwind CSS & Autoprefixer
├── tailwind.config.js      # Custom theme, typography, color palette, animations
├── tsconfig.app.json       # Application TypeScript configuration with path alias `@/*`
├── tsconfig.json           # Root TypeScript project references configuration
├── tsconfig.node.json      # Vite Node/tooling TypeScript configuration
└── vite.config.ts          # Vite bundler configuration with `@/` path alias
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

From the `frontend/` directory, install all required dependencies:

```bash
npm install
```

### Development Server

Start Vite in local development mode:

```bash
npm run dev
```

### Type Checking

Validate TypeScript types without emitting JavaScript:

```bash
npm run typecheck
```

### Linting

Run ESLint across the codebase:

```bash
npm run lint
```

### Production Build

Create an optimized production bundle in the `dist/` folder:

```bash
npm run build
```

### Preview Build

Preview the production build locally:

```bash
npm run preview
```
