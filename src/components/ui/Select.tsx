import React from 'react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  className?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ className = '', options, onChange, ...props }) => {
  return (
    <select
      className={`select select-bordered w-full hover:shadow-md transition-shadow duration-200 ${className}`}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;