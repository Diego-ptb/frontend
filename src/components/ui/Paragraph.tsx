import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-base-content leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

export default Paragraph;