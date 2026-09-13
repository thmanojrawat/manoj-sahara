import React, { useState, useMemo } from 'react';
import { Plus, Kanban as KanbanIcon, List, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Deals() {
  const { deals, properties, clients, brokers, vendors, addDeal, updateDealStage } = useCrm();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [isAddOpen, setIsAddOpen] = useState(false);

  const stages = ['Lead', 'Qualified', 'Negotiation', 'Agreement', 'Booking', 'Closed Won', 'Closed Lost'];

  const initialForm = {
    dealTitle: '',
    propertyId: properties[0]?.id || '',
    clientId: clients[0]?.id || '',
    brokerId: brokers[0]?.id || '',
    expectedValue: '',
    commissionRate: '2.0',
    stage: 'Negotiation',
    expectedClosingDate: '30/09/2026',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === formData.propertyId);
    const client = clients.find(c => c.id === formData.clientId);
    const broker = brokers.find(b => b.id === formData.brokerId);

    await addDeal({
      ...formData,
      propertyName: prop?.title || 'Sahara Property',
      clientName: client?.name || 'Client',
      brokerName: broker?.name || 'Assigned Broker',
      expectedValue: Number(formData.expectedValue) || 0,
      finalValue: Number(formData.expectedValue) || 0,
      commissionRate: Number(formData.commissionRate) || 2.0
    });

    setIsAddOpen(false);
    setFormData(initialForm);
  };

  const columns = [
    {
      key: 'dealTitle',
      header: 'Deal Mandate',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-xs">
            {item.dealTitle}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.propertyName} • Unit {item.unitNumber || 'TBD'}
          </span>
        </div>
      )
    },
    {
      key: 'clientName',
      header: 'Client',
      accessor: 'clientName'
    },
    {
      key: 'stage',
      header: 'Deal Stage',
      render: (item) => <StatusBadge status={item.stage} />
    },
    {
      key: 'value',
      header: 'Deal Value',
      render: (item) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
            {formatCurrency(item.finalValue || item.expectedValue)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Comm: {formatCurrency(item.commissionAmount)} ({item.commissionRate}%)
          </span>
        </div>
      )
    },
    {
      key: 'brokerName',
      header: 'Agent',
      accessor: 'brokerName'
    },
    {
      key: 'closing',
      header: 'Expected Closing',
      accessor: 'expectedClosingDate'
    },
    {
      key: 'advance',
      header: 'Stage Progression',
      sortable: false,
      render: (item) => {
        const nextIdx = stages.indexOf(item.stage) + 1;
        const nextStage = nextIdx < stages.length - 1 ? stages[nextIdx] : null;
        if (!nextStage) return <span className="text-xs text-slate-400">Finalized</span>;
        return (
          <button
            onClick={() => updateDealStage(item.id, nextStage)}
            className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
          >
            Advance to {nextStage} <ChevronRight className="w-3 h-3" />
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals Pipeline & Closures"
        subtitle="Track sales negotiations, value probabilities, and commission projections across deals"
        breadcrumbs={[{ label: 'Sales' }, { label: 'Deals' }]}
        exportFilename="Sahara_Deals"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Kanban View"
              >
                <KanbanIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
              New Deal
            </Button>
          </div>
        }
      />

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={deals}
          keyField="id"
          searchPlaceholder="Search deal title, property, client, broker..."
          exportFilename="Sahara_Deals"
        />
      ) : (
        /* Kanban Board View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.slice(0, 6).map(stg => {
            const stageDeals = deals.filter(d => d.stage === stg);
            const stageVolume = stageDeals.reduce((sum, d) => sum + (Number(d.finalValue || d.expectedValue) || 0), 0);

            return (
              <div
                key={stg}
                className="w-72 shrink-0 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[75vh]"
              >
                <div className="px-2 py-1 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {stg}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
                    Vol: {formatCurrency(stageVolume)}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {deal.dealTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                        {deal.clientName} • {deal.brokerName}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400">
                          {formatCurrency(deal.finalValue || deal.expectedValue)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {deal.expectedClosingDate}
                        </span>
                      </div>

                      {/* Advance Stage button */}
                      {stg !== 'Closed Won' && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            onClick={() => {
                              const curIdx = stages.indexOf(stg);
                              if (curIdx < stages.length - 1) {
                                updateDealStage(deal.id, stages[curIdx + 1]);
                              }
                            }}
                            className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Advance Stage →
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Deal Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Initiate Real Estate Deal"
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveDeal}>Create Deal</Button>
          </>
        }
      >
        <form className="space-y-4 text-xs" onSubmit={handleSaveDeal}>
          <Input
            label="Deal Title"
            required
            placeholder="e.g. Unit A-402 Allotment"
            value={formData.dealTitle}
            onChange={e => setFormData({ ...formData, dealTitle: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Property"
              value={formData.propertyId}
              onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
              options={properties.map(p => ({ value: p.id, label: `${p.title} (${p.area})` }))}
            />
            <Select
              label="Client"
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              options={clients.map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Expected Value (₹ INR)"
              type="number"
              required
              placeholder="6800000"
              value={formData.expectedValue}
              onChange={e => setFormData({ ...formData, expectedValue: e.target.value })}
            />
            <Input
              label="Commission (%)"
              type="number"
              step="0.1"
              value={formData.commissionRate}
              onChange={e => setFormData({ ...formData, commissionRate: e.target.value })}
            />
            <Select
              label="Initial Stage"
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value })}
              options={stages}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Broker"
              value={formData.brokerId}
              onChange={e => setFormData({ ...formData, brokerId: e.target.value })}
              options={brokers.map(b => ({ value: b.id, label: b.name }))}
            />
            <Input
              label="Target Closing Date"
              value={formData.expectedClosingDate}
              onChange={e => setFormData({ ...formData, expectedClosingDate: e.target.value })}
            />
          </div>

          <Textarea
            label="Deal Notes & Specific Clauses"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}

export default Deals;
