import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, User, FileText, CheckCircle2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';

export function Appointments() {
  const { appointments } = useCrm();

  const columns = [
    {
      key: 'title',
      header: 'Appointment Agenda',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-xs">
            {item.title}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
            {item.agenda}
          </span>
        </div>
      )
    },
    {
      key: 'clientName',
      header: 'Client / Attendee',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {item.clientName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{item.phone}</span>
        </div>
      )
    },
    {
      key: 'timing',
      header: 'Date & Duration',
      render: (item) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white block">
            {item.date} • {item.time}
          </span>
          <span className="text-[10px] text-slate-400">{item.duration} ({item.type})</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location / Venue',
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {item.location}
        </span>
      )
    },
    {
      key: 'agentName',
      header: 'Facilitator',
      accessor: 'agentName'
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultation & Legal Appointments"
        subtitle="Manage in-person headquarters meetings, contract signing sessions, and synchronized showings"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Appointments' }]}
        exportFilename="Sahara_Appointments"
      />

      <DataTable
        columns={columns}
        data={appointments}
        keyField="id"
        searchPlaceholder="Search attendee, agenda, location..."
        exportFilename="Sahara_Appointments"
      />
    </div>
  );
}

export default Appointments;
