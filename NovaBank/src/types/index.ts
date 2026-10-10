// Type definitions for NovaBank

export type AccountType = 'Savings' | 'Current';

export type TransactionType =
  | 'Deposit'
  | 'Fund Transfer'
  | 'Loan Disbursement'
  | 'Loan EMI'
  | 'Withdrawal';

export type TransactionStatus = 'Success' | 'Failed' | 'Pending';

export interface Transaction {
  id: string;
  date: string; // ISO string
  type: TransactionType;
  description: string;
  amount: number; // signed: + credit, - debit
  balanceAfter: number;
  status: TransactionStatus;
}

export type LoanType = 'Home Loan' | 'Car Loan' | 'Education Loan';
export type LoanStatus = 'Pending' | 'Approved' | 'Rejected' | 'Fully Repaid';

export interface LoanPayment {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Missed';
  balanceAfter: number;
}

export interface Loan {
  id: string;
  type: LoanType;
  principal: number;
  interestRate: number; // annual %
  durationMonths: number;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
  monthlyIncome: number;
  purpose: string;
  applicantName: string;
  applicantEmail: string;
  status: LoanStatus;
  remainingBalance: number;
  installmentsRemaining: number;
  totalInstallments: number;
  nextPaymentDate: string; // ISO
  paymentHistory: LoanPayment[];
  disbursementTransactionId?: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
  pin: string;
  accountNumber: string;
  createdAt: string;
}

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  details: string;
  date: string;
}

export interface Summary {
  totalDeposited: number;
  totalWithdrawn: number;
  totalTransferred: number;
  totalLoanDisbursed: number;
  totalEmiPaid: number;
  totalTransactions: number;
}
