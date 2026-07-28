import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md outline-none transition text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
