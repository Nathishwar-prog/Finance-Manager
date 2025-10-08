
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { useAppContext } from '../hooks/useAppContext';
import { Transaction, TransactionType, Category } from '../types';
import Card from '../components/ui/Card';

const formatCurrency = (amount: number, currencySymbol: string) => {
  return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
};

const TodayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IncomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ExpenseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const BudgetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><path d="M12 12v6"/><path d="M15 12v6"/><path d="m18 12 3-3-3-3"/></svg>;
const SavingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/></svg>;

const Dashboard: React.FC = () => {
  const { transactions, currency, budgets } = useAppContext();
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const filteredTransactions = useMemo(() => {
    if (!dateRange.start || !dateRange.end) {
      return transactions;
    }
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  }, [transactions, dateRange]);

  const { totalIncome, totalExpenses, totalBudget } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const budget = budgets.reduce((sum, b) => sum + b.limit, 0);

    return { totalIncome: income, totalExpenses: expenses, totalBudget: budget };
  }, [filteredTransactions, budgets]);

  const remainingBudget = totalBudget - totalExpenses;
  const savings = totalIncome - totalExpenses;

  const monthlySpendingData = useMemo(() => {
    const data: { [key: string]: number } = {};
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!data[month]) {
          data[month] = 0;
        }
        data[month] += t.amount;
      });
    return Object.keys(data).map(month => ({ name: month, Expenses: data[month] }));
  }, [filteredTransactions]);

  const categoryExpenseData = useMemo(() => {
    const data: { [key: string]: number } = {};
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        if (!data[t.category]) {
          data[t.category] = 0;
        }
        data[t.category] += t.amount;
      });
    return Object.keys(data).map(category => ({ name: category, value: data[category] }));
  }, [filteredTransactions]);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysExpenses = filteredTransactions.filter(t => t.date.startsWith(today) && t.type === TransactionType.EXPENSE);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF42A1'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))} className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600"/>
            <span className="text-gray-500">to</span>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))} className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Income" icon={<IncomeIcon/>}>
          <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome, currency.symbol)}</p>
        </Card>
        <Card title="Total Expenses" icon={<ExpenseIcon/>}>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses, currency.symbol)}</p>
        </Card>
        <Card title="Remaining Budget" icon={<BudgetIcon/>}>
          <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>{formatCurrency(remainingBudget, currency.symbol)}</p>
        </Card>
        <Card title="Savings" icon={<SavingsIcon/>}>
          <p className={`text-2xl font-bold ${savings >= 0 ? 'text-purple-500' : 'text-yellow-500'}`}>{formatCurrency(savings, currency.symbol)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Spending Trend">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpendingData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" tickFormatter={(tick) => formatCurrency(tick, currency.symbol)}/>
              <Tooltip formatter={(value: number) => formatCurrency(value, currency.symbol)} contentStyle={{ backgroundColor: '#333', border: 'none' }}/>
              <Legend />
              <Bar dataKey="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Category-wise Expense Split">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryExpenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {categoryExpenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, currency.symbol)}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Today's Expenses" icon={<TodayIcon/>}>
        {todaysExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {todaysExpenses.map(t => (
                  <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2 font-medium text-red-500">{formatCurrency(t.amount, currency.symbol)}</td>
                    <td className="p-2">{t.category}</td>
                    <td className="p-2 text-gray-500">{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No expenses recorded today.</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
