import React from 'react';
import { Badge } from './Badge.jsx';

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
  } else if (['new', 'contacted', 'qualified', 'site visit', 'ready to move', 'near possession'].includes(s)) {
    variant = 'info';
  } else if (['sold', 'booked', 'agreement'].includes(s)) {
    variant = 'purple';
  }

  return (
    <Badge variant={variant} size="xs">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </Badge>
  );
}

export default StatusBadge;
