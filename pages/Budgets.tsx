
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Budget, Category } from '../types';
import Card from '../components/ui/Card';

const formatCurrency = (amount: number, currencySymbol: string) => {
  return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
};

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ spent, limit }) => {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOverBudget = spent > limit;
  
  let barColor = 'bg-emerald-500';
  if (percentage > 75) barColor = 'bg-yellow-500';
  if (percentage > 90) barColor = 'bg-orange-500';
  if (isOverBudget) barColor = 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
      <div
        className={`h-4 rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};


const Budgets: React.FC = () => {
  const { budgets, currency, getExpensesForMonth, updateBudgets } = useAppContext();
  const [editingBudgets, setEditingBudgets] = useState<Budget[]>(budgets);
  const [isEditing, setIsEditing] = useState(false);

  const handleLimitChange = (category: Category, newLimit: number) => {
    setEditingBudgets(prev => 
      prev.map(b => b.category === category ? { ...b, limit: newLimit } : b)
    );
  };
  
  const handleSaveChanges = () => {
    updateBudgets(editingBudgets);
    setIsEditing(false);
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Budgets</h1>
        {isEditing ? (
             <div className="flex gap-2">
                <button onClick={handleSaveChanges} className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600">Save Changes</button>
                <button onClick={() => {setIsEditing(false); setEditingBudgets(budgets)}} className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600">Cancel</button>
             </div>
        ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Edit Budgets</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isEditing ? editingBudgets : budgets).map(budget => {
          const spent = getExpensesForMonth(today, budget.category);
          const remaining = budget.limit - spent;

          return (
            <Card key={budget.category} title={budget.category}>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                  <span className={`font-bold ${spent > budget.limit ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>{formatCurrency(spent, currency.symbol)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                   {isEditing ? (
                        <div className="flex items-center gap-1">
                            <span>{currency.symbol}</span>
                            <input 
                                type="number"
                                value={budget.limit}
                                onChange={(e) => handleLimitChange(budget.category, parseFloat(e.target.value) || 0)}
                                className="w-24 p-1 text-right bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                        </div>
                   ) : (
                        <span className="font-bold">{formatCurrency(budget.limit, currency.symbol)}</span>
                   )}
                </div>
                <hr className="dark:border-gray-700"/>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
                  <span className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(remaining, currency.symbol)}</span>
                </div>
                <BudgetProgressBar spent={spent} limit={budget.limit} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
