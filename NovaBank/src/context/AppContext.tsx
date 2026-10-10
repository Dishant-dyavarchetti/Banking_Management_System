import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Transaction, Loan } from '@/types';
import * as storage from '@/utils/storage';

interface AppContextValue {
  user: User | null;
  isLoggedIn: boolean;
  transactions: Transaction[];
  loans: Loan[];
  login: () => void;
  logout: () => void;
  refreshData: () => void;
  updateUser: (user: User) => void;
  setTransactions: (txs: Transaction[]) => void;
  setLoans: (loans: Loan[]) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [loans, setLoansState] = useState<Loan[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const u = storage.getUser();
    const session = storage.getSession();
    setUser(u);
    setIsLoggedIn(session && !!u);
    setTransactionsState(storage.getTransactions());
    setLoansState(storage.getLoans());
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    storage.setSession(true);
    setUser(storage.getUser());
    setTransactionsState(storage.getTransactions());
    setLoansState(storage.getLoans());
  };

  const logout = () => {
    storage.logoutCleanup();
    setIsLoggedIn(false);
    storage.setBalanceRevealed(false);
    storage.setAccountBalanceRevealed(false);
  };

  const refreshData = () => {
    setUser(storage.getUser());
    setTransactionsState(storage.getTransactions());
    setLoansState(storage.getLoans());
  };

  const updateUser = (updatedUser: User) => {
    storage.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const setTransactions = (txs: Transaction[]) => {
    storage.saveTransactions(txs);
    setTransactionsState(txs);
  };

  const setLoans = (newLoans: Loan[]) => {
    storage.saveLoans(newLoans);
    setLoansState(newLoans);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        transactions,
        loans,
        login,
        logout,
        refreshData,
        updateUser,
        setTransactions,
        setLoans,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
