import React, { type ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '' }) => {
    return (
        <section className={`mb-16 ${className}`}>
            {children}
        </section>
    );
};

export default Section;
