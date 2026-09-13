import React, { useState, useMemo } from 'react';
import { Plus, Grid2X2, CheckCircle, ShieldAlert, Wrench, Ban, Bookmark, Sparkles } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Select } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Units() {
  const { units, updateUnitStatus } = useCrm();

  const [filterProject, setFilterProject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [statusModalUnit, setStatusModalUnit] = useState(null);
  const [newStatusVal, setNewStatusVal] = useState('Available');

  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      if (filterProject !== 'ALL' && u.projectName !== filterProject) return false;
      if (filterStatus !== 'ALL' && u.status !== filterStatus) return false;
      return true;
    });
  }, [units, filterProject, filterStatus]);

  const projectsList = Array.from(new Set(units.map(u => u.projectName)));

  const handleOpenStatusChange = (unit) => {
    setStatusModalUnit(unit);
    setNewStatusVal(unit.status);
  };

  const handleSaveStatus = async () => {
    if (!statusModalUnit) return;
    await updateUnitStatus(statusModalUnit.id, newStatusVal);
    setStatusModalUnit(null);
  };

  const columns = [
    {
      key: 'unitNumber',
      header: 'Unit Code',
      render: (item) => (
        <span className="font-mono font-extrabold text-slate-900 dark:text-white">
          {item.unitNumber}
        </span>
      )
    },
    {
      key: 'projectName',
      header: 'Project & Tower',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {item.projectName}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.buildingName} • Floor {item.floor}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type & Direction',
      render: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {item.type}
          </span>
          <span className="text-[10px] text-slate-400">
            Facing: {item.facing}
          </span>
        </div>
      )
    },
    {
      key: 'area',
      header: 'Carpet / SBUA',
      render: (item) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
          {item.carpetArea} / {item.superBuiltUpArea} sq ft
        </span>
      )
    },
    {
      key: 'basePrice',
      header: 'Base Valuation',
      render: (item) => (
        <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
          {formatCurrency(item.basePrice)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Unit Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'action',
      header: 'Change Status',
      sortable: false,
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenStatusChange(item)}
        >
          Update Status
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Units Matrix"
        subtitle="Individual unit availability tracking across projects, floors, and towers"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Units' }]}
        exportFilename="Sahara_Inventory_Units"
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 no-print">
        <select
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Projects</option>
          {projectsList.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Unit Statuses</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Booked">Booked</option>
          <option value="Sold">Sold</option>
          <option value="Blocked">Blocked</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredUnits}
        keyField="id"
        searchPlaceholder="Search unit number, tower, project..."
        exportFilename="Sahara_Inventory_Units"
      />

      {/* Update Status Modal */}
      {statusModalUnit && (
        <Modal
          isOpen={Boolean(statusModalUnit)}
          onClose={() => setStatusModalUnit(null)}
          title={`Update Status: Unit ${statusModalUnit.unitNumber}`}
          subtitle={`${statusModalUnit.projectName} • ${statusModalUnit.buildingName}`}
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="outline" onClick={() => setStatusModalUnit(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveStatus}>Confirm Change</Button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <Select
              label="Select New Status"
              value={newStatusVal}
              onChange={e => setNewStatusVal(e.target.value)}
              options={[
                { value: 'Available', label: 'Available (Open for sale/booking)' },
                { value: 'Reserved', label: 'Reserved (Holding for customer)' },
                { value: 'Booked', label: 'Booked (Token received)' },
                { value: 'Sold', label: 'Sold (Agreement completed)' },
                { value: 'Blocked', label: 'Blocked (Management hold)' },
                { value: 'Under Maintenance', label: 'Under Maintenance (Snag rectification)' }
              ]}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Changing status will automatically synchronize with project absorption percentages and booking availability.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Units;
