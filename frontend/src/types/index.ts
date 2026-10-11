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
  accountNumber?: string;
  date: string; // ISO string
  type: TransactionType;
  description: string;
  amount: number; // signed: + credit, - debit
  balanceAfter: number;
  status: TransactionStatus;
  recipientAccount?: string;
  recipientName?: string;
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
  accountNumber: string;
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

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  // password: string;
  accountType: AccountType;
  // pin: string;
  balance: number;
  accountNumber: string;
  transactions: Transaction[];
  loans?: Loan[];
  createdAt: string;
}

export type User = Customer;

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
