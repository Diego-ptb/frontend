import React, { type ReactNode } from 'react';

interface TextProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'muted';
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    className?: string;
}

const Text: React.FC<TextProps> = ({
    children,
    variant = 'primary',
    size = 'base',
    className = ''
}) => {
    const variantClasses = {
        primary: 'text-text-primary',
        secondary: 'text-text-secondary',
        muted: 'text-text-muted'
    };

    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    return (
        <p className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {children}
        </p>
    );
};

export default Text;
