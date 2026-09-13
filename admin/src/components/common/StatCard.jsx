import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  isIncreasePositive = true,
  icon: Icon,
  description,
  accent = 'amber', // amber, emerald, blue, purple, rose
  onClick
}) {
  const accentStyles = {
    amber: 'from-amber-500/10 to-transparent text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40',
    emerald: 'from-emerald-500/10 to-transparent text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40',
    blue: 'from-blue-500/10 to-transparent text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40',
    purple: 'from-purple-500/10 to-transparent text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40',
    rose: 'from-rose-500/10 to-transparent text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40'
  };

  const isPositive = change && String(change).startsWith('+');

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              (isPositive && isIncreasePositive) || (!isPositive && !isIncreasePositive)
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
