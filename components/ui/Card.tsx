
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
