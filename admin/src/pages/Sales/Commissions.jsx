import React, { useState } from 'react';
import { Percent, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Commissions() {
  const { commissions, recordCommissionPayment } = useCrm();

  const [payModalItem, setPayModalItem] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  const totalCommissions = commissions.reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);
  const totalPaid = commissions.reduce((sum, c) => sum + (Number(c.paidAmount) || 0), 0);
  const totalPending = commissions.reduce((sum, c) => sum + (Number(c.pendingAmount) || 0), 0);

  const handleConfirmDisbursement = async () => {
    if (!payModalItem) return;
    await recordCommissionPayment(payModalItem.id, Number(payAmount) || 0);
    setPayModalItem(null);
    setPayAmount('');
  };

  const columns = [
    {
      key: 'brokerName',
      header: 'Broker / Agent',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-xs block">
            {item.brokerName}
          </span>
          <span className="text-[10px] text-slate-400">Deal: {item.dealId}</span>
        </div>
      )
    },
    {
      key: 'propertyName',
      header: 'Property Asset',
      accessor: 'propertyName'
    },
    {
      key: 'dealValue',
      header: 'Deal Value',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {formatCurrency(item.dealValue)}
        </span>
      )
    },
    {
      key: 'commissionAmount',
      header: 'Commission (Rate %)',
      render: (item) => (
        <div>
          <span className="font-bold text-amber-600 dark:text-amber-400 text-xs block">
            {formatCurrency(item.commissionAmount)}
          </span>
          <span className="text-[10px] text-slate-400">{item.commissionRate}% contract rate</span>
        </div>
      )
    },
    {
      key: 'paidAmount',
      header: 'Paid / Pending',
      render: (item) => (
        <div>
          <span className="text-xs font-bold text-emerald-600 block">
            Paid: {formatCurrency(item.paidAmount)}
          </span>
          <span className="text-[10px] text-rose-500 font-medium">
            Pending: {formatCurrency(item.pendingAmount)}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'action',
      header: 'Disbursement',
      sortable: false,
      render: (item) => (
        item.pendingAmount > 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPayModalItem(item);
              setPayAmount(String(item.pendingAmount));
            }}
          >
            Record Payout
          </Button>
        ) : (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Settled
          </span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broker Commissions & Incentive Splits"
        subtitle="Dynamically calculate brokerage entitlements, disburse commissions, and track tax invoices"
        breadcrumbs={[{ label: 'Sales' }, { label: 'Commissions' }]}
        exportFilename="Sahara_Commissions"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Accrued Commission"
          value={formatCurrency(totalCommissions)}
          icon={Percent}
          accent="amber"
          description="Total pipeline entitlements"
        />
        <StatCard
          title="Disbursed Payouts"
          value={formatCurrency(totalPaid)}
          icon={CheckCircle2}
          accent="emerald"
          description="Transferred to broker accounts"
        />
        <StatCard
          title="Pending Disbursals"
          value={formatCurrency(totalPending)}
          icon={Clock}
          accent="rose"
          description="Awaiting milestone clearance"
        />
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        keyField="id"
        searchPlaceholder="Search agent, deal, property..."
        exportFilename="Sahara_Commissions"
      />

      {/* Record Commission Disbursement Modal */}
      {payModalItem && (
        <Modal
          isOpen={Boolean(payModalItem)}
          onClose={() => setPayModalItem(null)}
          title={`Disburse Commission to ${payModalItem.brokerName}`}
          subtitle={`Deal: ${payModalItem.propertyName} • Pending: ${formatCurrency(payModalItem.pendingAmount)}`}
          maxWidth="max-w-sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setPayModalItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmDisbursement}>Confirm Payout</Button>
            </>
          }
        >
          <div className="py-2 space-y-3 text-xs">
            <Input
              label="Disbursement Amount (₹ INR)"
              type="number"
              value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
            />
            <p className="text-slate-500 text-[11px]">
              Recording payout updates the broker's ledger and marks status as Paid / Partially Paid.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Commissions;
