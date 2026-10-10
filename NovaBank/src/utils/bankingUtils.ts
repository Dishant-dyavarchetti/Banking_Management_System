import type { Transaction, Summary } from '@/types';

// The opening balance for every new demo account
export const OPENING_BALANCE = 25000;

// Single source of truth: balance is derived from the last transaction's
// balanceAfter, or the opening balance if there are no transactions.
export function calculateBalance(transactions: Transaction[]): number {
  if (transactions.length === 0) return OPENING_BALANCE;
  return transactions[transactions.length - 1].balanceAfter;
}

// Compute summary figures from the transaction list
export function calculateSummary(transactions: Transaction[]): Summary {
  let totalDeposited = 0;
  let totalWithdrawn = 0;
  let totalTransferred = 0;
  let totalLoanDisbursed = 0;
  let totalEmiPaid = 0;

  for (const tx of transactions) {
    if (tx.status !== 'Success') continue;
    switch (tx.type) {
      case 'Deposit':
        totalDeposited += tx.amount;
        break;
      case 'Withdrawal':
        totalWithdrawn += Math.abs(tx.amount);
        break;
      case 'Fund Transfer':
        totalTransferred += Math.abs(tx.amount);
        break;
      case 'Loan Disbursement':
        totalLoanDisbursed += tx.amount;
        break;
      case 'Loan EMI':
        totalEmiPaid += Math.abs(tx.amount);
        break;
    }
  }

  return {
    totalDeposited,
    totalWithdrawn,
    totalTransferred,
    totalLoanDisbursed,
    totalEmiPaid,
    totalTransactions: transactions.length,
  };
}

// Generate a unique transaction ID
export function generateTransactionId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TXN${ts}${rand}`;
}

// Generate a demo account number
export function generateAccountNumber(): string {
  let num = '';
  for (let i = 0; i < 12; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// Mask an account number, showing only the last 4 digits
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return '••••••••' + accountNumber.slice(-4);
}

// Create the fictional sample transactions that reconcile with the opening balance.
// Net total of these transactions is 0, so current balance stays at ₹25,000.
export function createSampleTransactions(): Transaction[] {
  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    d.setHours(10, 30, 0, 0);
    return d.toISOString();
  };

  const txns: Omit<Transaction, 'id' | 'balanceAfter'>[] = [
    { date: daysAgo(20), type: 'Deposit', description: 'Salary Credit – Acme Corp', amount: 30000, status: 'Success' },
    { date: daysAgo(18), type: 'Withdrawal', description: 'ATM Withdrawal – Sector 12', amount: -10000, status: 'Success' },
    { date: daysAgo(10), type: 'Fund Transfer', description: 'Transfer to Rahul Sharma', amount: -5000, status: 'Success' },
    { date: daysAgo(5), type: 'Withdrawal', description: 'Online Shopping – Flipkart', amount: -15000, status: 'Success' },
  ];

  let runningBalance = OPENING_BALANCE;
  return txns.map((tx) => {
    runningBalance += tx.amount;
    return {
      ...tx,
      id: generateTransactionId(),
      balanceAfter: runningBalance,
    };
  });
}
