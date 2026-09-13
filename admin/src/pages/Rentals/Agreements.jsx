import React from 'react';
import { FileCheck2, Plus, Download, Eye, FileText } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Agreements() {
  const { agreements } = useCrm();

  const columns = [
    {
      key: 'agreementNumber',
      header: 'Agreement Ref / Title',
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
            {item.agreementNumber}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{item.title}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Contract Type',
      render: (item) => (
        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
          {item.type}
        </span>
      )
    },
    {
      key: 'parties',
      header: 'Executing Parties',
      render: (item) => (
        <div className="text-[11px]">
          <span className="text-slate-900 dark:text-white font-medium block">1st: {item.firstParty}</span>
          <span className="text-slate-500 block">2nd: {item.secondParty}</span>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Validity Horizon',
      render: (item) => (
        <div>
          <span className="text-xs text-slate-800 dark:text-slate-200 block">
            {item.executionDate} to {item.expiryDate}
          </span>
          <span className="text-[10px] text-slate-400">{item.registeredOffice}</span>
        </div>
      )
    },
    {
      key: 'value',
      header: 'Contract Value',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(item.value)}
        </span>
      )
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
        title="Agreements & Legal Deeds"
        subtitle="Repository of registered lease deeds, buyer sale agreements, and sole-selling agency contracts"
        breadcrumbs={[{ label: 'Rentals' }, { label: 'Agreements' }]}
        exportFilename="Sahara_Agreements"
      />

      <DataTable
        columns={columns}
        data={agreements}
        keyField="id"
        searchPlaceholder="Search agreement ref, parties, type..."
        exportFilename="Sahara_Agreements"
      />
    </div>
  );
}

export default Agreements;
