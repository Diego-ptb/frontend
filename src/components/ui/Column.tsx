import React from 'react';

interface ColumnProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string;
}

const Column: React.FC<ColumnProps> = ({
  children,
  className = '',
  justify = 'start',
  align = 'stretch',
  gap = '4'
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  return (
    <div className={`flex flex-col ${justifyClasses[justify]} ${alignClasses[align]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default Column;