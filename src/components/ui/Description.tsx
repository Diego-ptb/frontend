import React from 'react';

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Description: React.FC<DescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-gray-600 dark:text-gray-400 text-sm ${className}`}>
      {children}
    </p>
  );
};

export default Description;