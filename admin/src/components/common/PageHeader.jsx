import React from 'react';
import { ChevronRight, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import { triggerPrint } from '../../utils/formatters.js';

export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  onExport,
  showPrint = true
}) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 no-print">
          <Link to="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Sahara</Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700 dark:text-slate-200">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap no-print">
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onExport}
              title="Export filtered records to CSV"
            >
              Export CSV
            </Button>
          )}
          {showPrint && (
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={triggerPrint}
              title="Print document view"
            >
              Print
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
