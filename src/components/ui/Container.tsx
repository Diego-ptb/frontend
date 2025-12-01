import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
};

export default Container;