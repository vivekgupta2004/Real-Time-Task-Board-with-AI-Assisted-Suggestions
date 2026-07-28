import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-md shadow transition flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
