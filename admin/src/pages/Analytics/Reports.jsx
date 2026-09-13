import React, { useState, useMemo } from 'react';
import { BarChart3, Download, Printer, Filter, Layers, DollarSign, Users, Award, MapPin } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Button from '../../components/common/Button.jsx';
import { formatCurrency, exportToCSV, triggerPrint } from '../../utils/formatters.js';

export function Reports() {
  const { deals, payments, leads, brokers, properties, units, locations, tenancies } = useCrm();

  const [reportTab, setReportTab] = useState('sales'); // 'sales' | 'revenue' | 'leads' | 'brokers' | 'areas'

  // Calculations
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalSalesVal = deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Booking').reduce((sum, d) => sum + (Number(d.finalValue || d.expectedValue) || 0), 0);
  const totalCommission = brokers.reduce((sum, b) => sum + (Number(b.commissionEarned) || 0), 0);

  // Area Aggregations
  const areaData = useMemo(() => {
    const map = {};
    properties.forEach(p => {
      const a = p.area || 'Other';
      if (!map[a]) map[a] = { area: a, totalProps: 0, totalVal: 0, activeCount: 0 };
      map[a].totalProps += 1;
      map[a].totalVal += Number(p.price) || 0;
      if (p.status === 'Active') map[a].activeCount += 1;
    });
    return Object.values(map);
  }, [properties]);

  // Columns for Sales
  const salesCols = [
    { key: 'dealTitle', header: 'Deal Transaction' },
    { key: 'propertyName', header: 'Property Asset' },
    { key: 'clientName', header: 'Client' },
    { key: 'brokerName', header: 'Broker' },
    {
      key: 'finalValue',
      header: 'Realized Value',
      render: (item) => formatCurrency(item.finalValue || item.expectedValue)
    },
    { key: 'stage', header: 'Stage' }
  ];

  // Columns for Broker Performance
  const brokerCols = [
    { key: 'name', header: 'Broker Agent' },
    { key: 'role', header: 'Role' },
    {
      key: 'revenueGenerated',
      header: 'Total Volume',
      render: (item) => formatCurrency(item.revenueGenerated)
    },
    {
      key: 'dealsClosed',
      header: 'Deals Closed',
      render: (item) => `${item.dealsClosed} deals`
    },
    {
      key: 'commissionEarned',
      header: 'Commission',
      render: (item) => formatCurrency(item.commissionEarned)
    }
  ];

  // Columns for Area Performance
  const areaCols = [
    { key: 'area', header: 'Kolkata Micro-Market' },
    { key: 'totalProps', header: 'Properties Listed' },
    { key: 'activeCount', header: 'Available Units' },
    {
      key: 'totalVal',
      header: 'Total Market Value',
      render: (item) => formatCurrency(item.totalVal)
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence & Executive Reports"
        subtitle="Consolidated analytics covering sales velocity, revenue milestones, broker contributions, and micro-market absorption"
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Reports' }]}
        exportFilename={`Sahara_Report_${reportTab}`}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Gross Sales Volume"
          value={formatCurrency(totalSalesVal)}
          icon={DollarSign}
          accent="emerald"
          description="Closed won & booked transactions"
        />
        <StatCard
          title="Realized Cashflow"
          value={formatCurrency(totalRevenue)}
          icon={BarChart3}
          accent="amber"
          description="Bank cleared payment receipts"
        />
        <StatCard
          title="Disbursed Brokerage"
          value={formatCurrency(totalCommission)}
          icon={Award}
          accent="blue"
          description="Agent partner earnings"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        {[
          { key: 'sales', label: 'Sales Closures' },
          { key: 'brokers', label: 'Broker Leaderboard' },
          { key: 'areas', label: 'Micro-Market Performance' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setReportTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              reportTab === tab.key
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table view based on selected tab */}
      {reportTab === 'sales' && (
        <DataTable
          columns={salesCols}
          data={deals}
          keyField="id"
          searchPlaceholder="Search deal transactions..."
          exportFilename="Sahara_Sales_Report"
        />
      )}

      {reportTab === 'brokers' && (
        <DataTable
          columns={brokerCols}
          data={brokers}
          keyField="id"
          searchPlaceholder="Search broker performance..."
          exportFilename="Sahara_Broker_Performance"
        />
      )}

      {reportTab === 'areas' && (
        <DataTable
          columns={areaCols}
          data={areaData}
          keyField="area"
          searchPlaceholder="Search micro-market..."
          exportFilename="Sahara_Area_Performance"
        />
      )}
    </div>
  );
}

export default Reports;
