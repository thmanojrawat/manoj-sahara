import React from 'react';
import { Sparkle, Plus, Check } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';

export function Amenities() {
  const { amenities } = useCrm();

  const columns = [
    {
      key: 'name',
      header: 'Amenity Specification',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white text-xs">
          {item.name}
        </span>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
          {item.category}
        </span>
      )
    },
    {
      key: 'popular',
      header: 'Buyer Priority',
      render: (item) => (
        item.popular ? (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> High Demand
          </span>
        ) : (
          <span className="text-xs text-slate-400">Standard</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Standard Amenity Catalog"
        subtitle="Standardized amenity definitions utilized across residential developments and commercial suites"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Amenities' }]}
        exportFilename="Sahara_Amenities"
      />

      <DataTable
        columns={columns}
        data={amenities}
        keyField="id"
        searchPlaceholder="Search amenity, category..."
        exportFilename="Sahara_Amenities"
      />
    </div>
  );
}

export default Amenities;
