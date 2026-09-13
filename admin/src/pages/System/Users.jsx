import React, { useState } from 'react';
import { UserCircle, Plus, ShieldCheck, Mail, Clock } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select } from '../../components/common/FormControls.jsx';

export function Users() {
  const { users } = useCrm();

  const columns = [
    {
      key: 'name',
      header: 'Team Member',
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-xs block">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-400">{item.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (item) => (
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
          {item.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Access Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'lastLogin',
      header: 'Last Authentication',
      accessor: 'lastLogin'
    },
    {
      key: 'createdDate',
      header: 'Onboarded Date',
      accessor: 'createdDate'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Users & Roster"
        subtitle="Manage authorized staff, sales directors, accounting officers, and access privileges"
        breadcrumbs={[{ label: 'System' }, { label: 'Users' }]}
        exportFilename="Sahara_Users"
      />

      <DataTable
        columns={columns}
        data={users}
        keyField="id"
        searchPlaceholder="Search team member name, role, email..."
        exportFilename="Sahara_Users"
      />
    </div>
  );
}

export default Users;
