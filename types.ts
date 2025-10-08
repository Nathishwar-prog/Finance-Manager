
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum Category {
  GROCERIES = 'Groceries',
  RENT = 'Rent',
  UTILITIES = 'Utilities',
  TRANSPORT = 'Transport',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  SHOPPING = 'Shopping',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  date: string; // ISO string
  description: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface User {
  name: string;
  email: string;
}

export interface Currency {
  symbol: string;
  name: string;
}
