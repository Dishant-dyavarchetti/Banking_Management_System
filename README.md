# 🏦 NovaBank – Banking Management System

A full-stack modern banking management web application built with a **React + TypeScript (Vite)** frontend and an **Express.js (Node.js)** REST API backend.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Project Directory Structure](#-project-directory-structure)
- [How Modules Are Connected](#-how-modules-are-connected)
- [Unified Data Model](#-unified-data-model)
- [Backend REST API Specification](#-backend-rest-api-specification)
- [Prerequisites](#-prerequisites)
- [Getting Started & Running Locally](#-getting-started--running-locally)
- [Roadmap & Team Development Guide](#-roadmap--team-development-guide)

---

## 🏛️ Architecture Overview

The application follows a decoupled client-server architecture:

```
┌────────────────────────────────┐            ┌────────────────────────────────┐
│       Frontend (Client)        │            │        Backend (Server)        │
│    React 18 + TypeScript       │            │       Express.js (Node.js)     │
│   TailwindCSS + Lucide Icons   │            │                                │
│       Port: 5173 (Vite)        │            │           Port: 5000           │
└───────────────┬────────────────┘            └────────────────┬───────────────┘
                │                                              │
                │  HTTP /api/*                                 │
                │  (Proxied by Vite)                           │
                ▼                                              ▼
    ┌────────────────────────┐                    ┌────────────────────────┐
    │     Vite Dev Proxy     ├───────────────────►│      server.js         │
    │  target: localhost:5000│                    │  REST API Controllers  │
    └────────────────────────┘                    └────────────┬───────────┘
                                                               │
                                                               ▼
                                                  ┌────────────────────────┐
                                                  │   backend/data/        │
                                                  │   customers.json       │
                                                  │   (Persistent Store)   │
                                                  └────────────────────────┘
```

1. **Frontend**: Vite dev server serves the Single Page Application (SPA) on `http://localhost:5173`.
2. **Reverse Proxy**: Vite automatically forwards all requests matching `/api/*` to the Express backend running on `http://localhost:5000`. This prevents CORS issues in development.
3. **Backend**: Express handles authentication, validations, business logic, and saves customer data to `backend/data/customers.json`.

---

## 📁 Project Directory Structure

```
Banking_Management_System/
├── README.md                           # Main project documentation (this file)
│
├── backend/                            # Express.js Backend Service
│   ├── package.json                    # Backend dependencies & metadata
│   ├── server.js                       # Express server, route handlers & file persistence
│   └── data/
│       └── customers.json              # Local JSON database storing registered customers
│
└── frontend/                           # React + TypeScript Frontend Application
    ├── index.html                      # HTML entrypoint
    ├── package.json                    # Frontend dependencies & scripts
    ├── vite.config.ts                  # Vite configuration & /api reverse proxy
    ├── tailwind.config.js              # TailwindCSS styling configuration
    ├── tsconfig.json                   # TypeScript project references
    └── src/
        ├── main.tsx                    # React DOM bootstrap
        ├── App.tsx                     # Main router and route definitions
        ├── index.css                   # Global styles & design system tokens
        │
        ├── types/                      # Shared TypeScript definitions
        │   └── index.ts                # Customer, Transaction, Loan, and Query interfaces
        │
        ├── utils/                      # Helper utilities and services
        │   ├── api.ts                  # Centralized HTTP client communicating with backend
        │   ├── storage.ts              # Local session & UI preferences storage
        │   ├── bankingUtils.ts         # Financial calculations and currency formatters
        │   ├── formatCurrency.ts       # Currency & date formatting helpers
        │   └── loanUtils.ts            # EMI calculation and loan scheduling helpers
        │
        ├── context/                    # React Context State Management
        │   └── AppContext.tsx          # Global user session, transactions, and loans state
        │
        ├── components/                 # Reusable UI Components
        │   ├── Navbar.tsx              # Top navigation bar & active route indicator
        │   ├── Footer.tsx              # Application footer
        │   ├── Alert.tsx               # Status notifications (success, error, warning)
        │   ├── SummaryCard.tsx         # Dashboard financial metric cards
        │   ├── PinVerificationModal.tsx# 4-digit PIN security dialog
        │   └── ConfirmationModal.tsx   # Action confirmation modal dialog
        │
        └── pages/                      # Application Page Views
            ├── Home.tsx                # Marketing landing page
            ├── Signup.tsx              # Customer registration page
            ├── Login.tsx               # Authentication & login page
            ├── Dashboard.tsx           # Main banking overview & balance display
            ├── Deposit.tsx             # Deposit funds page
            ├── FundTransfer.tsx        # Internal fund transfer page
            ├── Transactions.tsx        # Transaction history and filtering
            ├── Loan.tsx                # Loan application & EMI payment page
            ├── Account.tsx             # Customer profile details and settings
            ├── AboutUs.tsx             # About company page
            └── Contact.tsx             # Customer support & inquiry form
```

---

## 🔄 How Modules Are Connected

### 1. Registration Flow (`/signup`)
- **[frontend/src/pages/Signup.tsx](file:///home/dishant/dishant_dev/Banking_Management_System/frontend/src/pages/Signup.tsx)** captures:
  - Full Name, Email, Phone (10 digits), Password ($\ge 6$ chars), Account Type (`Savings` | `Current`), and 4-Digit PIN.
- It calls `registerCustomer()` in **[frontend/src/utils/api.ts](file:///home/dishant/dishant_dev/Banking_Management_System/frontend/src/utils/api.ts)** via `POST /api/register`.
- The Express backend creates a customer record, allocates a unique sequential **8-digit Account Number** (e.g., `10000001`), saves it in `customers.json`, and returns `{ message, accountNumber }`.
- `Signup.tsx` intercepts the response and navigates to `/login`, passing the new account number inside `location.state.successMessage`.

### 2. Authentication Flow (`/login`)
- **[frontend/src/pages/Login.tsx](file:///home/dishant/dishant_dev/Banking_Management_System/frontend/src/pages/Login.tsx)** reads the incoming success message (if any) and renders an alert.
- The user provides `email` and `password`.
- Calling `authenticateCustomer()` in **[frontend/src/utils/api.ts](file:///home/dishant/dishant_dev/Banking_Management_System/frontend/src/utils/api.ts)** triggers `POST /api/login`.
- If credentials match, Express returns `{ message: "Login successful", customer }`.
- `Login.tsx` calls `login(customer)` provided by **[frontend/src/context/AppContext.tsx](file:///home/dishant/dishant_dev/Banking_Management_System/frontend/src/context/AppContext.tsx)**.
- `AppContext` stores the session in `localStorage` and populates the global user, transaction list, and loan list.
- User is navigated to `/dashboard`.

### 3. Global State Management (`AppContext`)
- Provides centralized state across all components:
  - `user`: Active logged-in `Customer` object.
  - `isLoggedIn`: Boolean session flag.
  - `transactions`: Array of transactions for the customer.
  - `loans`: Array of active and repaid loans.
  - Actions: `login(customer)`, `logout()`, `refreshData()`, `updateUser(user)`, `setTransactions()`, `setLoans()`.

---

## 🧱 Unified Data Model

Both frontend (`src/types/index.ts`) and backend (`server.js`) share the identical data schema:

### Customer (`User`)
```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountType: 'Savings' | 'Current';
  accountNumber: string;        // E.g. "10000001"
  balance: number;              // Current balance
  pin?: string;                 // 4-digit security PIN
  transactions: Transaction[];  // Customer transaction ledger
  loans?: Loan[];               // Customer loan applications
  createdAt: string;            // Timestamp string
}
```

### Transaction
```typescript
interface Transaction {
  id: string;                   // E.g. "TXN-..."
  accountNumber?: string;
  type: 'Deposit' | 'Fund Transfer' | 'Loan Disbursement' | 'Loan EMI' | 'Withdrawal';
  description: string;
  amount: number;               // Positive for credit (+), negative for debit (-)
  balanceAfter: number;
  date: string;                 // ISO string
  status: 'Success' | 'Failed' | 'Pending';
  recipientAccount?: string;
  recipientName?: string;
}
```

---

## 📡 Backend REST API Specification

### 1. Implemented Endpoints

#### Register Customer
- **Endpoint**: `POST /api/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "accountType": "Savings",
    "password": "secretpassword",
    "pin": "1234"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Account created successfully",
    "accountNumber": "10000001"
  }
  ```

#### Login Customer
- **Endpoint**: `POST /api/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "secretpassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "customer": { ... }
  }
  ```

#### Forgot Password
- **Endpoint**: `POST /api/forgot-password`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "phone": "9876543210",
    "newPassword": "newsecretpassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

---

### 2. Next-Phase Endpoints to Assign to Backend Team

These endpoints will replace in-memory transaction modifications in the frontend:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customer/:accountNumber` | Fetch full customer data for the Dashboard. |
| `PUT` | `/api/customer/profile` | Update customer name and email. |
| `POST` | `/api/transactions/deposit` | Credit account balance and record a deposit. |
| `POST` | `/api/transactions/transfer` | Transfer funds to another account and update balances. |
| `POST` | `/api/loans/apply` | Submit a loan application and disburse funds. |
| `POST` | `/api/loans/repay` | Pay monthly EMI and deduct remaining balance. |

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher recommended
- **npm**: `v9.0.0` or higher

---

## 🚀 Getting Started & Running Locally

### 1. Clone & Setup

```bash
git clone <repository-url>
cd Banking_Management_System
```

### 2. Start the Backend Server

Open Terminal 1:
```bash
cd backend
npm install
node server.js
```
The backend server will run on: **`http://localhost:5000`**

### 3. Start the Frontend Client

Open Terminal 2:
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will start on: **`http://localhost:5173`**

### 4. Verify the Integration

1. Visit **`http://localhost:5173/signup`** in your browser.
2. Complete the form and register an account.
3. Observe automatic redirection to `/login` with your new generated Account Number.
4. Log in using your email and password.
5. You will land on **`/dashboard`** with your authenticated session.

---

## 🛠️ Roadmap & Team Development Guide

1. **Backend Team**:
   - Implement the remaining REST endpoints in `backend/server.js` (`/api/transactions/deposit`, `/api/transactions/transfer`, `/api/loans/*`).
   - Keep `backend/data/customers.json` as the persistence store until migrating to a SQL/NoSQL database.
2. **Frontend Team**:
   - In `frontend/src/utils/api.ts`, add helper methods corresponding to the new endpoints (`depositAmount`, `transferFunds`, `applyLoan`).
   - Wire `Deposit.tsx`, `FundTransfer.tsx`, and `Loan.tsx` to invoke these API methods rather than updating local arrays.
