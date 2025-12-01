import React, { type ReactNode } from 'react';

interface StackProps {
    children: ReactNode;
    direction?: 'row' | 'column';
    gap?: '1' | '2' | '3' | '4' | '6' | '8';
    className?: string;
}

const Stack: React.FC<StackProps> = ({
    children,
    direction = 'column',
    gap = '4',
    className = ''
}) => {
    const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
    const gapClass = `gap-${gap}`;

    return (
        <div className={`flex ${directionClass} ${gapClass} ${className}`}>
            {children}
        </div>
    );
};

export default Stack;
