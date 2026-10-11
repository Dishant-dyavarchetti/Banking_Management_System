import type { User, Transaction, Loan, ContactQuery } from '@/types';

const KEYS = {
  Customer: 'novabank_Customer',
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

/* ---------- Customer ---------- */

function getCustomer(): User | null {
  return read<User | null>(KEYS.Customer, null);
}

export const getUser = getCustomer;

function saveCustomer(Customer: User): void {
  write(KEYS.Customer, Customer); 
}

export const setUser = saveCustomer;

export function clearCustomer(): void {
  localStorage.removeItem(KEYS.Customer);
}

/* ---------- Session ---------- */

export function getSession(): boolean {
  return read<boolean>(KEYS.session, false);
}

export function setSession(active: boolean): void {
  write(KEYS.session, active);
}

/* ---------- Transactions ---------- */

// export function getTransactions(): Transaction[] {
//   return read<Transaction[]>(KEYS.transactions, []);
// }

// export function saveTransactions(txs: Transaction[]): void {
//   write(KEYS.transactions, txs);
// }

/* ---------- Loans ---------- */

// export function getLoans(): Loan[] {
//   return read<Loan[]>(KEYS.loans, []);
// }

// export function saveLoans(loans: Loan[]): void {
//   write(KEYS.loans, loans);
// }


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

// export function createDemoAccount(Customer: Omit<Customer, 'accountNumber' | 'createdAt'>): void {
//   const fullCustomer: Customer = {
//     ...Customer,
//     accountNumber: generateAccountNumber(),
//     createdAt: new Date().toISOString(),
//   };
//   saveCustomer(fullCustomer);
//   saveTransactions(createSampleTransactions());
//   saveLoans([]);
//   setPinAttempts(0);
//   setBalanceBlocked(false);
//   setBalanceRevealed(false);
//   setAccountBalanceRevealed(false);
//   setSession(true);
// }

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
