import type { User, Transaction, Loan, ContactQuery } from '@/types';
import { createSampleTransactions, generateAccountNumber } from '@/utils/bankingUtils';

const KEYS = {
  user: 'novabank_user',
  session: 'novabank_session',
  transactions: 'novabank_transactions',
  loans: 'novabank_loans',
  queries: 'novabank_queries',
  pinAttempts: 'novabank_pin_attempts',
  balanceBlocked: 'novabank_balance_blocked',
  balanceRevealed: 'novabank_balance_revealed',
  accountBalanceRevealed: 'novabank_account_balance_revealed',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- User ---------- */

export function getUser(): User | null {
  return read<User | null>(KEYS.user, null);
}

export function saveUser(user: User): void {
  write(KEYS.user, user);
}

export function clearUser(): void {
  localStorage.removeItem(KEYS.user);
}

/* ---------- Session ---------- */

export function getSession(): boolean {
  return read<boolean>(KEYS.session, false);
}

export function setSession(active: boolean): void {
  write(KEYS.session, active);
}

/* ---------- Transactions ---------- */

export function getTransactions(): Transaction[] {
  return read<Transaction[]>(KEYS.transactions, []);
}

export function saveTransactions(txs: Transaction[]): void {
  write(KEYS.transactions, txs);
}

/* ---------- Loans ---------- */

export function getLoans(): Loan[] {
  return read<Loan[]>(KEYS.loans, []);
}

export function saveLoans(loans: Loan[]): void {
  write(KEYS.loans, loans);
}

/* ---------- Contact Queries ---------- */

export function getQueries(): ContactQuery[] {
  return read<ContactQuery[]>(KEYS.queries, []);
}

export function saveQuery(query: ContactQuery): void {
  const queries = getQueries();
  queries.push(query);
  write(KEYS.queries, queries);
}

/* ---------- PIN Attempt State ---------- */

export function getPinAttempts(): number {
  return read<number>(KEYS.pinAttempts, 0);
}

export function setPinAttempts(count: number): void {
  write(KEYS.pinAttempts, count);
}

export function isBalanceBlocked(): boolean {
  return read<boolean>(KEYS.balanceBlocked, false);
}

export function setBalanceBlocked(blocked: boolean): void {
  write(KEYS.balanceBlocked, blocked);
}

/* ---------- Balance Revealed State (per-page, cleared on logout) ---------- */

export function isBalanceRevealed(): boolean {
  return read<boolean>(KEYS.balanceRevealed, false);
}

export function setBalanceRevealed(revealed: boolean): void {
  write(KEYS.balanceRevealed, revealed);
}

export function isAccountBalanceRevealed(): boolean {
  return read<boolean>(KEYS.accountBalanceRevealed, false);
}

export function setAccountBalanceRevealed(revealed: boolean): void {
  write(KEYS.accountBalanceRevealed, revealed);
}

/* ---------- Full Account Creation ---------- */

export function createDemoAccount(user: Omit<User, 'accountNumber' | 'createdAt'>): void {
  const fullUser: User = {
    ...user,
    accountNumber: generateAccountNumber(),
    createdAt: new Date().toISOString(),
  };
  saveUser(fullUser);
  saveTransactions(createSampleTransactions());
  saveLoans([]);
  setPinAttempts(0);
  setBalanceBlocked(false);
  setBalanceRevealed(false);
  setAccountBalanceRevealed(false);
  setSession(true);
}

/* ---------- Full Reset ---------- */

export function resetAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

/* ---------- Logout cleanup (clears balance reveal, keeps data) ---------- */

export function logoutCleanup(): void {
  setSession(false);
  setBalanceRevealed(false);
  setAccountBalanceRevealed(false);
}
