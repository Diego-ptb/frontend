import React, { type ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    bordered?: boolean;
    compact?: boolean;
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    bordered = true,
    compact = false,
    hover = true,
    ...props
}) => {
    const borderedClass = bordered ? 'card-bordered border-primary/10' : '';
    const compactClass = compact ? 'card-compact' : '';
    const hoverEffects = hover ? 'hover:shadow-lg transition-all duration-300' : '';

    return (
        <div className={`card bg-base-200/70 backdrop-blur-xl ${borderedClass} ${compactClass} shadow-lg ${hoverEffects} ${className}`} {...props}>
            {children}
        </div>
    );
};

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => {
    return <div className={`card-body ${className}`} {...props}>{children}</div>;
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => {
    return <h2 className={`card-title text-primary ${className}`} {...props}>{children}</h2>;
};

interface CardActionsProps {
    children: ReactNode;
    className?: string;
    justify?: 'start' | 'center' | 'end';
}

export const CardActions: React.FC<CardActionsProps> = ({ children, className = '', justify = 'end' }) => {
    const justifyClass = `justify-${justify}`;
    return <div className={`card-actions ${justifyClass} ${className}`}>{children}</div>;
};

export default Card;
