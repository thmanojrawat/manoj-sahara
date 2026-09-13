import React, { useState } from 'react';
import { MapPin, Plus, Building2, TrendingUp } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select } from '../../components/common/FormControls.jsx';

export function Locations() {
  const { locations } = useCrm();

  const columns = [
    {
      key: 'area',
      header: 'Kolkata Micro-Market',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm block">
            {item.area}
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.zone}</span>
        </div>
      )
    },
    {
      key: 'localities',
      header: 'Key Localities & Hubs',
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-sm">
          {item.localities.map((loc, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {loc}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'propertyCount',
      header: 'Active Listings',
      render: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
          {item.propertyCount} Properties
        </span>
      )
    },
    {
      key: 'averagePricePerSqFt',
      header: 'Benchmark Rate',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs font-mono">
          ₹{item.averagePricePerSqFt.toLocaleString('en-IN')} / sq ft
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
        title="Kolkata Micro-Market Hierarchy"
        subtitle="Manage primary real estate zones, sub-localities, and per-square-foot benchmark valuations"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Locations' }]}
        exportFilename="Sahara_Locations"
      />

      <DataTable
        columns={columns}
        data={locations}
        keyField="id"
        searchPlaceholder="Search micro-market, zone, locality..."
        exportFilename="Sahara_Locations"
      />
    </div>
  );
}

export default Locations;
