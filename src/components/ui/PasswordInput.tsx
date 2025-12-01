import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './index';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    className?: string;
    fullWidth?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ className = '', fullWidth = false, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
            <Input
                type={showPassword ? 'text' : 'password'}
                className={`pr-12 ${className}`}
                fullWidth={fullWidth}
                {...props}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 px-4 flex items-center text-text-muted hover:text-text-primary transition-colors duration-200"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;