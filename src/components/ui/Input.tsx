import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  bordered?: boolean;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
  fullWidth = false,
  bordered = true,
  error = false,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const borderedClass = bordered ? 'input-bordered' : '';
  const errorClass = error ? 'input-error' : '';

  return (
    <input
      className={`input ${borderedClass} ${errorClass} ${widthClass} hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    />
  );
};

export default Input;