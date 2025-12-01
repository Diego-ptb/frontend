import React, { type ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const widthClass = fullWidth ? 'btn-block' : '';
    const loadingClass = loading ? 'loading' : '';

    // Add glow effect to primary buttons
    const glowClass = variant === 'primary' ? 'shadow-lg hover:shadow-glow-primary' : '';

    return (
        <button
            className={`btn ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${glowClass} hover-scale ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;