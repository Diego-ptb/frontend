import React from 'react';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = 1,
  gap = '4'
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  return (
    <div className={`grid ${colsClasses[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;