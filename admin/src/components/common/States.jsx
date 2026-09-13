import React from 'react';
import { SearchX, Inbox, Loader2 } from 'lucide-react';
import Button from './Button.jsx';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria or currently present in this module.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 ${className}`}>
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 mb-3.5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs max-w-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading Sahara CRM data...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 text-center">
      <Loader2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}
