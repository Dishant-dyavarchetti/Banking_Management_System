import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Transaction, Loan } from '@/types';
import * as storage from '@/utils/storage';

interface AppContextValue {
  user: User | null;
  isLoggedIn: boolean;
  transactions: Transaction[];
  loans: Loan[];
  login: (customer: User) => void;
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
    setTransactionsState(u?.transactions || []);
    setLoansState(u?.loans || []);
  }, []);

  const login = (customer: User) => {
    setIsLoggedIn(true);
    storage.setSession(true);
    storage.setUser(customer);
    setUser(customer);
    setTransactionsState(customer.transactions || []);
    setLoansState(customer.loans || []);
  };

  const logout = () => {
    storage.logoutCleanup();
    setIsLoggedIn(false);
    storage.setBalanceRevealed(false);
    storage.setAccountBalanceRevealed(false);
  };

  const refreshData = () => {
    const u = storage.getUser();
    setUser(u);
    setTransactionsState(u?.transactions || []);
    setLoansState(u?.loans || []);
  };

  const updateUser = (updatedUser: User) => {
    storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  const setTransactions = (txs: Transaction[]) => {
    setTransactionsState(txs);
    if(user){
      const updated = { ...user, transactions: txs};
      setUser(updated);
      storage.setUser(updated);
    }
  };

  const setLoans = (newLoans: Loan[]) => {
    
    setLoansState(newLoans);
    if(user){
      const updated = {...user, loans: newLoans};
      setUser(updated);
      storage.setUser(updated);
    }
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
