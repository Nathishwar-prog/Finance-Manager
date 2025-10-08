
import React, { useState, useMemo, FC } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Transaction, TransactionType, Category } from '../types';

const formatCurrency = (amount: number, currencySymbol: string) => {
    return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD for input
};

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Partial<Transaction> | null;
}

const TransactionModal: FC<TransactionModalProps> = ({ isOpen, onClose, transaction }) => {
    const { addTransaction, updateTransaction } = useAppContext();
    const [formData, setFormData] = useState<Partial<Transaction>>(transaction || { type: TransactionType.EXPENSE, date: new Date().toISOString().split('T')[0]});

    React.useEffect(() => {
        setFormData(transaction || { type: TransactionType.EXPENSE, date: new Date().toISOString().split('T')[0] });
    }, [transaction]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.id) {
            updateTransaction(formData as Transaction);
        } else {
            addTransaction(formData as Omit<Transaction, 'id'>);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-4">{formData.id ? 'Edit' : 'Add'} Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                            {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} required className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input type="date" name="date" value={formatDate(formData.date || new Date().toISOString())} onChange={handleChange} required className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Description</label>
                        <input type="text" name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600">{formData.id ? 'Save Changes' : 'Add Transaction'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Transactions: React.FC = () => {
    const { transactions, currency, deleteTransaction } = useAppContext();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'ascending' | 'descending' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Partial<Transaction> | null>(null);

    const sortedTransactions = useMemo(() => {
        let sortableItems = [...transactions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [transactions, sortConfig]);

    const requestSort = (key: keyof Transaction) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAdd = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    }
    
    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    }

    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions</h1>
                <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Transaction
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {(['type', 'amount', 'category', 'date', 'description'] as (keyof Transaction)[]).map((key) => (
                                    <th key={key} onClick={() => requestSort(key)} className="p-4 capitalize cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        {key}
                                        {sortConfig?.key === key && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                                    </th>
                                ))}
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map(t => (
                                <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className={`p-4 font-medium ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>{t.type}</td>
                                    <td className="p-4">{formatCurrency(t.amount, currency.symbol)}</td>
                                    <td className="p-4">{t.category}</td>
                                    <td className="p-4">{formatDate(t.date)}</td>
                                    <td className="p-4 text-gray-500">{t.description}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                            <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={selectedTransaction} />
        </div>
    );
};

export default Transactions;
