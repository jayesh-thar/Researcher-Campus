import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  header,
  footer,
  noPadding = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'bg-white border border-slate-200 rounded text-slate-800 shadow-sm transition-shadow hover:shadow',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-5')}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
