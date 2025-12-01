import React, { type ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    outline?: boolean;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    outline = false,
    className = ''
}) => {
    const variantClass = `badge-${variant}`;
    const sizeClass = `badge-${size}`;
    const outlineClass = outline ? 'badge-outline' : '';

    return (
        <span className={`badge ${variantClass} ${sizeClass} ${outlineClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
