
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Transaction, Budget, User, Currency, TransactionType, Category } from '../types';
import { storageService } from '../services/storageService';
import { DEFAULT_TRANSACTIONS, DEFAULT_BUDGETS, DEFAULT_USER, DEFAULT_CURRENCY, CURRENCIES } from '../constants';

interface AppContextType {
  transactions: Transaction[];
  budgets: Budget[];
  user: User;
  currency: Currency;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateBudgets: (budgets: Budget[]) => void;
  updateUser: (user: User) => void;
  setCurrency: (currency: Currency) => void;
  getExpensesForMonth: (date: Date, category: Category) => number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getItem('transactions', DEFAULT_TRANSACTIONS));
  const [budgets, setBudgets] = useState<Budget[]>(() => storageService.getItem('budgets', DEFAULT_BUDGETS));
  const [user, setUser] = useState<User>(() => storageService.getItem('user', DEFAULT_USER));
  const [currency, setCurrency] = useState<Currency>(() => storageService.getItem('currency', DEFAULT_CURRENCY));

  useEffect(() => {
    storageService.setItem('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    storageService.setItem('budgets', budgets);
  }, [budgets]);

  useEffect(() => {
    storageService.setItem('user', user);
  }, [user]);

  useEffect(() => {
    storageService.setItem('currency', currency);
  }, [currency]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transaction, id: new Date().getTime().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transaction added successfully!');

    // Check for overspending
    if (newTransaction.type === TransactionType.EXPENSE) {
      const budget = budgets.find(b => b.category === newTransaction.category);
      if (budget) {
        const monthExpenses = getExpensesForMonth(new Date(newTransaction.date), newTransaction.category) + newTransaction.amount;
        if (monthExpenses > budget.limit) {
          toast.warn(`You've exceeded your budget for ${newTransaction.category}!`);
        }
      }
    }
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    toast.success('Transaction updated successfully!');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.error('Transaction deleted.');
  };

  const updateBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    toast.success('Budgets updated!');
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    toast.success('Profile updated!');
  };

  const getExpensesForMonth = (date: Date, category: Category) => {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === category)
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === date.getFullYear() && tDate.getMonth() === date.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };
  

  const value = {
    transactions,
    budgets,
    user,
    currency,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudgets,
    updateUser,
    setCurrency,
    getExpensesForMonth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
