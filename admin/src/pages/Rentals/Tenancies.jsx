import React, { useState } from 'react';
import { Plus, KeyRound, AlertTriangle, CheckCircle2, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Tenancies() {
  const { tenancies, recordRentPayment } = useCrm();

  const [rentModalItem, setRentModalItem] = useState(null);
  const [rentAmount, setRentAmount] = useState('');

  const totalMonthlyRent = tenancies.reduce((sum, t) => sum + (Number(t.monthlyRent) || 0), 0);
  const totalArrears = tenancies.reduce((sum, t) => sum + (Number(t.arrearsAmount) || 0), 0);
  const activeCount = tenancies.filter(t => t.paymentStatus !== 'Terminated').length;

  const handleConfirmRentCollection = async () => {
    if (!rentModalItem) return;
    await recordRentPayment(rentModalItem.id, Number(rentAmount) || 0);
    setRentModalItem(null);
    setRentAmount('');
  };

  const columns = [
    {
      key: 'tenantName',
      header: 'Tenant Entity & Contact',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-xs block">
            {item.tenantName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{item.tenantPhone}</span>
        </div>
      )
    },
    {
      key: 'property',
      header: 'Leased Asset / Unit',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
            Unit {item.unitNumber}
          </span>
          <span className="text-[11px] text-slate-500 truncate block max-w-xs">{item.propertyName}</span>
        </div>
      )
    },
    {
      key: 'monthlyRent',
      header: 'Monthly Rent',
      render: (item) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
            {formatCurrency(item.monthlyRent)} / mo
          </span>
          <span className="text-[10px] text-slate-400">
            Deposit: {formatCurrency(item.securityDeposit)}
          </span>
        </div>
      )
    },
    {
      key: 'leaseDates',
      header: 'Lease Expiry',
      render: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
            {item.leaseEndDate}
          </span>
          <span className="text-[10px] text-slate-400">Start: {item.leaseStartDate}</span>
        </div>
      )
    },
    {
      key: 'paymentStatus',
      header: 'Rent Status',
      render: (item) => <StatusBadge status={item.paymentStatus} />
    },
    {
      key: 'arrearsAmount',
      header: 'Arrears Balance',
      render: (item) => (
        item.arrearsAmount > 0 ? (
          <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs">
            {formatCurrency(item.arrearsAmount)}
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-600">Cleared</span>
        )
      )
    },
    {
      key: 'action',
      header: 'Collect Rent',
      sortable: false,
      render: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRentModalItem(item);
            setRentAmount(String(item.monthlyRent));
          }}
        >
          Collect
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenancies & Rental Arrears"
        subtitle="Manage commercial & residential lease agreements, monthly rent collections, and lock-in expiries"
        breadcrumbs={[{ label: 'Rentals' }, { label: 'Tenancies' }]}
        exportFilename="Sahara_Tenancies"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Rental Yield"
          value={formatCurrency(totalMonthlyRent)}
          icon={KeyRound}
          accent="amber"
          description={`${activeCount} Active commercial/residential leases`}
        />
        <StatCard
          title="Rental Arrears Overdue"
          value={formatCurrency(totalArrears)}
          icon={AlertTriangle}
          accent="rose"
          description="Delayed corporate tenant remittances"
        />
        <StatCard
          title="Lease Renewals (Next 60 Days)"
          value="1 Contract"
          icon={Calendar}
          accent="blue"
          description="CloudMatrix Tech Vista expiring soon"
        />
      </div>

      <DataTable
        columns={columns}
        data={tenancies}
        keyField="id"
        searchPlaceholder="Search tenant, unit, property..."
        exportFilename="Sahara_Tenancies"
      />

      {/* Collect Rent Modal */}
      {rentModalItem && (
        <Modal
          isOpen={Boolean(rentModalItem)}
          onClose={() => setRentModalItem(null)}
          title={`Record Rent Payment from ${rentModalItem.tenantName}`}
          subtitle={`Monthly Rent: ${formatCurrency(rentModalItem.monthlyRent)} • Arrears: ${formatCurrency(rentModalItem.arrearsAmount)}`}
          maxWidth="max-w-sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setRentModalItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmRentCollection}>Record Collection</Button>
            </>
          }
        >
          <div className="py-2 space-y-3 text-xs">
            <Input
              label="Amount Received (₹ INR)"
              type="number"
              value={rentAmount}
              onChange={e => setRentAmount(e.target.value)}
            />
            <p className="text-slate-500 text-[11px]">
              Recording rent automatically reduces tenant arrears and logs an audit transaction.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Tenancies;
