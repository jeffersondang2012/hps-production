import { FC, SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', options, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        >
          {options ? (
            options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select'; 