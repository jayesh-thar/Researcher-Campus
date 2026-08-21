import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 border border-transparent',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300',
    outline: 'bg-transparent text-navy-800 hover:bg-navy-800/5 active:bg-navy-800/10 border border-navy-800',
    danger: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-900 border border-transparent',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 space-x-1.5',
    md: 'text-sm px-3.5 py-2 space-x-2',
    lg: 'text-base px-5 py-2.5 space-x-2.5',
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
