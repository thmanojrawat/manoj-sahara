import React from 'react';
import { Layers, Building, Grid2X2, CheckCircle, Clock, ShieldAlert, BarChart3 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function InventoryOverview() {
  const { projects, buildings, units } = useCrm();

  const totalUnits = units.length;
  const available = units.filter(u => u.status === 'Available').length;
  const booked = units.filter(u => u.status === 'Booked').length;
  const sold = units.filter(u => u.status === 'Sold').length;
  const reserved = units.filter(u => u.status === 'Reserved').length;
  const blocked = units.filter(u => u.status === 'Blocked' || u.status === 'Under Maintenance').length;

  const totalInventoryValue = units.reduce((sum, u) => sum + (Number(u.basePrice) || 0), 0);
  const availableValue = units.filter(u => u.status === 'Available').reduce((sum, u) => sum + (Number(u.basePrice) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Matrix & Stock Overview"
        subtitle="Consolidated real-time asset stock, absorption metrics, and unit statuses across Kolkata"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Overview' }]}
        exportFilename="Sahara_Inventory_Overview"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Valuation"
          value={formatCurrency(totalInventoryValue)}
          icon={Layers}
          accent="amber"
          description="Gross development stock"
        />
        <StatCard
          title="Available Stock Value"
          value={formatCurrency(availableValue)}
          icon={CheckCircle}
          accent="emerald"
          description={`${available} Units unallotted`}
        />
        <StatCard
          title="Absorption Rate"
          value={`${Math.round(((sold + booked) / Math.max(1, totalUnits)) * 100)}%`}
          icon={BarChart3}
          accent="blue"
          description={`${sold + booked} of ${totalUnits} converted`}
        />
        <StatCard
          title="Towers & Blocks"
          value={`${buildings.length} Blocks`}
          icon={Building}
          accent="purple"
          description={`Across ${projects.length} master developments`}
        />
      </div>

      {/* Unit Status Distribution Cards */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Unit Status Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Available</span>
            <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">{available}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Reserved</span>
            <p className="text-2xl font-extrabold text-amber-900 dark:text-amber-100 mt-1">{reserved}</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Booked</span>
            <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-1">{booked}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Sold</span>
            <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1">{sold}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Blocked</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{blocked}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Tracked</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalUnits}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryOverview;
