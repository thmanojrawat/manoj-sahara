import React from 'react';
import { Building, Layers, Plus } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';

export function BuildingsFloors() {
  const { buildings, floors, projects } = useCrm();

  const buildingCols = [
    {
      key: 'name',
      header: 'Tower / Block Name',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {item.name}
        </span>
      )
    },
    {
      key: 'projectName',
      header: 'Parent Project',
      render: (item) => {
        const proj = projects.find(p => p.id === item.projectId);
        return <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{proj?.name || item.projectId}</span>;
      }
    },
    {
      key: 'totalFloors',
      header: 'Total Floors',
      render: (item) => `${item.totalFloors} Storeys`
    },
    {
      key: 'totalUnits',
      header: 'Total Units',
      render: (item) => `${item.totalUnits} Units`
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    }
  ];

  const floorCols = [
    {
      key: 'label',
      header: 'Floor Plate',
      render: (item) => <span className="font-bold text-slate-900 dark:text-white">{item.label}</span>
    },
    {
      key: 'building',
      header: 'Building Tower',
      render: (item) => {
        const b = buildings.find(b => b.id === item.buildingId);
        return <span className="text-xs text-slate-600 dark:text-slate-300">{b?.name || item.buildingId}</span>;
      }
    },
    {
      key: 'unitCount',
      header: 'Units on Floor',
      render: (item) => `${item.unitCount} Units per Plate`
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Buildings & Floor Plates"
        subtitle="Configure physical towers, elevations, and typical floor-plate configurations"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Buildings & Floors' }]}
        exportFilename="Sahara_Buildings_Floors"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            Towers & Blocks Roster
          </h2>
        </div>
        <DataTable
          columns={buildingCols}
          data={buildings}
          keyField="id"
          searchPlaceholder="Search towers..."
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Standard Floor Plates
          </h2>
        </div>
        <DataTable
          columns={floorCols}
          data={floors}
          keyField="id"
          searchPlaceholder="Search floor levels..."
        />
      </div>
    </div>
  );
}

export default BuildingsFloors;
