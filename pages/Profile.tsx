
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import { CURRENCIES } from '../constants';
import { TransactionType, User } from '../types';

const formatCurrency = (amount: number, currencySymbol: string) => {
    return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
};

const Profile: React.FC = () => {
    const { user, currency, setCurrency, transactions, updateUser } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);

    const lifetimeStats = useMemo(() => {
        const totalExpenses = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalExpenses,
            totalSavings: totalIncome - totalExpenses
        };
    }, [transactions]);
    
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCurrency = CURRENCIES.find(c => c.symbol === e.target.value);
        if (selectedCurrency) {
            setCurrency(selectedCurrency);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile</h1>
                {isEditing ? (
                     <div className="flex gap-2">
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600">Save Profile</button>
                        <button onClick={() => { setIsEditing(false); setFormData(user); }} className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Edit Profile</button>
                )}
            </div>

            <Card title="User Details">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                )}
            </Card>

            <Card title="Settings">
                 <div className="space-y-2">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                    <select
                        id="currency"
                        value={currency.symbol}
                        onChange={handleCurrencyChange}
                        className="w-full max-w-xs p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                        {CURRENCIES.map(c => (
                            <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
                        ))}
                    </select>
                </div>
            </Card>

            <Card title="Lifetime Stats">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Expenses</h4>
                        <p className="text-2xl font-bold text-red-500">{formatCurrency(lifetimeStats.totalExpenses, currency.symbol)}</p>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Savings</h4>
                        <p className="text-2xl font-bold text-green-500">{formatCurrency(lifetimeStats.totalSavings, currency.symbol)}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
