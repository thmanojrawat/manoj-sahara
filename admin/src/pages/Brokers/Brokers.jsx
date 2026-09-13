import React, { useState } from 'react';
import { Plus, UserSquare2, Phone, Mail, Award, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Brokers() {
  const { brokers, deals, siteVisits } = useCrm();

  const [selectedBroker, setSelectedBroker] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const columns = [
    {
      key: 'name',
      header: 'Broker / Agent',
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              {item.name}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              {item.role} • {item.type}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'specializedAreas',
      header: 'Specialized Kolkata Areas',
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {item.specializedAreas.map((area, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {area}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'revenueGenerated',
      header: 'Closed Revenue',
      render: (item) => (
        <div>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm block">
            {formatCurrency(item.revenueGenerated)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {item.dealsClosed} deals closed
          </span>
        </div>
      )
    },
    {
      key: 'commissionEarned',
      header: 'Commission (Earned / Due)',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-xs block">
            {formatCurrency(item.commissionEarned)}
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">
            {formatCurrency(item.commissionPending)} pending
          </span>
        </div>
      )
    },
    {
      key: 'siteVisitsConducted',
      header: 'Site Visits',
      render: (item) => (
        <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
          {item.siteVisitsConducted} Visits
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
        title="Brokers & Agency Network"
        subtitle="Manage internal relationship managers and external channel partners specializing across Kolkata micro-markets"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Brokers / Agents' }]}
        exportFilename="Sahara_Brokers"
      />

      <DataTable
        columns={columns}
        data={brokers}
        keyField="id"
        searchPlaceholder="Search agent name, phone, area..."
        onRowClick={(item) => {
          setSelectedBroker(item);
          setIsDetailOpen(true);
        }}
        exportFilename="Sahara_Brokers"
      />

      {/* Broker Profile Modal */}
      {selectedBroker && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedBroker.name}
          subtitle={`${selectedBroker.role} • ${selectedBroker.type}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedBroker.avatar}
                alt={selectedBroker.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedBroker.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedBroker.phone} • {selectedBroker.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                    Rating: {selectedBroker.rating} / 5.0
                  </span>
                  <span className="text-slate-400">Commission split: {selectedBroker.commissionRate}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Closed Volume</span>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatCurrency(selectedBroker.revenueGenerated)}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Deals Closed</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedBroker.dealsClosed}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Paid Commission</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(selectedBroker.commissionEarned)}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Payout</span>
                <p className="text-sm font-bold text-amber-600 mt-0.5">{formatCurrency(selectedBroker.commissionPending)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Specialized Micro-Markets
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedBroker.specializedAreas.map((area, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Brokers;
