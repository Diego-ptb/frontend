import React, { type ReactNode } from 'react';

interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

const Title: React.FC<TitleProps> = ({ level = 1, children, className = '', gradient = false }) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const levelClasses = {
    1: gradient ? 'text-6xl font-black text-gradient-primary' : 'text-6xl font-black text-primary',
    2: 'text-4xl font-bold text-primary',
    3: 'text-3xl font-semibold text-base-content',
    4: 'text-2xl font-semibold text-base-content',
    5: 'text-xl font-medium text-base-content',
    6: 'text-lg font-medium text-base-content',
  };

  return (
    <Tag className={`${levelClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Title;