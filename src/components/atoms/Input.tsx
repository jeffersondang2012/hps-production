import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseInputProps = {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea';
};

type InputElementProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaElementProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputProps = BaseInputProps & (
  | ({ as?: 'input' } & InputElementProps)
  | ({ as: 'textarea' } & TextareaElementProps)
);

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  className = '',
  as = 'input',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const inputClassName = `
    w-full
    px-3
    py-2
    border
    rounded-md
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    disabled:bg-gray-100
    disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          {...(props as TextareaElementProps)}
          ref={ref as any}
          id={inputId}
          className={inputClassName}
          rows={(props as TextareaElementProps).rows || 3}
        />
      ) : (
        <input
          {...(props as InputElementProps)}
          ref={ref as any}
          id={inputId}
          className={inputClassName}
        />
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input'; 