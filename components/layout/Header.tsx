
import React from 'react';
import { NavLink } from 'react-router-dom';

const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-emerald-400">
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="M15 12h1v4" />
        <path d="M11 10.37V18" />
        <path d="M12.55 10.37 18 10" />
        <path d="m7.5 10.5 5.5 5.5" />
    </svg>
);

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
                <MoneyIcon />
                <span className="text-white text-xl font-bold">FinanceTracker</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/transactions" className={navLinkClass}>Transactions</NavLink>
                <NavLink to="/budgets" className={navLinkClass}>Budgets</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
