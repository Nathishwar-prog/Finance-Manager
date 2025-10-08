
import { Transaction, Budget, User, Currency, Category, TransactionType } from './types';

export const CURRENCIES: Currency[] = [
  { symbol: '₹', name: 'Indian Rupee' },
  { symbol: '$', name: 'US Dollar' },
  { symbol: '€', name: 'Euro' },
  { symbol: '£', name: 'British Pound' },
];

export const DEFAULT_CURRENCY: Currency = CURRENCIES[0];

export const DEFAULT_USER: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.INCOME, amount: 50000, category: Category.SALARY, date: new Date(new Date().setDate(1)).toISOString(), description: 'Monthly Salary' },
  { id: '2', type: TransactionType.EXPENSE, amount: 15000, category: Category.RENT, date: new Date(new Date().setDate(2)).toISOString(), description: 'Apartment Rent' },
  { id: '3', type: TransactionType.EXPENSE, amount: 3000, category: Category.GROCERIES, date: new Date(new Date().setDate(5)).toISOString(), description: 'Weekly Groceries' },
  { id: '4', type: TransactionType.EXPENSE, amount: 2000, category: Category.UTILITIES, date: new Date().toISOString(), description: 'Electricity Bill' },
  { id: '5', type: TransactionType.INCOME, amount: 5000, category: Category.FREELANCE, date: new Date(new Date().setDate(10)).toISOString(), description: 'Design Project' },
  { id: '6', type: TransactionType.EXPENSE, amount: 1500, category: Category.ENTERTAINMENT, date: new Date().toISOString(), description: 'Movie Tickets' },
];

export const DEFAULT_BUDGETS: Budget[] = [
  { category: Category.GROCERIES, limit: 10000 },
  { category: Category.UTILITIES, limit: 5000 },
  { category: Category.TRANSPORT, limit: 3000 },
  { category: Category.ENTERTAINMENT, limit: 4000 },
  { category: Category.SHOPPING, limit: 8000 },
  { category: Category.HEALTH, limit: 5000 },
];
