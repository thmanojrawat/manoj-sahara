import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1 font-semibold'
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;

  const s = String(status).toLowerCase();

  let variant = 'neutral';
  if (['active', 'paid', 'confirmed', 'completed', 'available', 'closed won', 'verified'].includes(s)) {
    variant = 'success';
  } else if (['pending', 'in deal', 'under construction', 'negotiation', 'scheduled', 'draft', 'reserved'].includes(s)) {
    variant = 'warning';
  } else if (['cancelled', 'lost', 'closed lost', 'overdue', 'arrears', 'blocked', 'expired', 'terminated'].includes(s)) {
    variant = 'danger';
  } else if (['new', 'contacted', 'qualified', 'site visit', 'ready to move'].includes(s)) {
    variant = 'info';
  } else if (['sold', 'booked', 'agreement'].includes(s)) {
    variant = 'purple';
  }

  return (
    <Badge variant={variant} size="xs">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </Badge>
  );
}

export default Badge;
