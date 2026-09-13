import React from 'react';
import { History, User, Clock, Shield } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';

export function ActivityLogs() {
  const { activities } = useCrm();

  const columns = [
    {
      key: 'action',
      header: 'Operation Executed',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-xs block">
            {item.action}
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.entity}</span>
        </div>
      )
    },
    {
      key: 'user',
      header: 'Authenticated User',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{item.user}</span>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Audit Trail Details',
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 max-w-md truncate block">
          {item.details}
        </span>
      )
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (item) => (
        <span className="text-xs text-slate-500 font-mono">
          {item.timestamp}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Audit & Activity Logs"
        subtitle="Tamper-evident operational audit trail tracking all property listings, lead status conversions, and payment entries"
        breadcrumbs={[{ label: 'System' }, { label: 'Activity Logs' }]}
        exportFilename="Sahara_Audit_Logs"
      />

      <DataTable
        columns={columns}
        data={activities}
        keyField="id"
        searchPlaceholder="Search action, user, entity..."
        exportFilename="Sahara_Audit_Logs"
      />
    </div>
  );
}

export default ActivityLogs;
