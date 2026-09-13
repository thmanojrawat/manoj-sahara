import React, { useState } from 'react';
import { Plus, ReceiptText, CheckCircle2, Clock, AlertTriangle, Download, ArrowUpRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Payments() {
  const { payments, bookings, clients, addPayment, deletePayment } = useCrm();

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Financial Ledger Computations
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const paidTotal = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingTotal = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const overdueTotal = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const initialForm = {
    bookingId: bookings[0]?.id || '',
    clientId: clients[0]?.id || '',
    amount: '',
    paymentMethod: 'NEFT / RTGS',
    status: 'Paid',
    dueDate: new Date().toLocaleDateString('en-GB'),
    transactionRef: '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSavePayment = async (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId);

    await addPayment({
      ...formData,
      clientName: client?.name || 'Client',
      amount: Number(formData.amount) || 0,
      paymentDate: formData.status === 'Paid' ? new Date().toLocaleDateString('en-GB') : null
    });

    setIsAddOpen(false);
  };

  const columns = [
    {
      key: 'receiptNumber',
      header: 'Receipt / Txn Ref',
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
            {item.receiptNumber}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{item.transactionRef || 'Ref Pending'}</span>
        </div>
      )
    },
    {
      key: 'clientName',
      header: 'Payee Client',
      accessor: 'clientName'
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-sm font-mono">
          {formatCurrency(item.amount)}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      header: 'Channel',
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {item.paymentMethod}
        </span>
      )
    },
    {
      key: 'dates',
      header: 'Received / Due Date',
      render: (item) => (
        <div>
          <span className="text-xs text-slate-800 dark:text-slate-200 block">
            {item.paymentDate ? `Paid: ${item.paymentDate}` : 'Unpaid'}
          </span>
          <span className="text-[10px] text-slate-400">Due: {item.dueDate}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Ledger Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'notes',
      header: 'Milestone / Notes',
      render: (item) => (
        <span className="text-xs text-slate-500 max-w-xs truncate block">
          {item.notes || '—'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Ledger & Payments"
        subtitle="Track customer installment receipts, RTGS remittances, and calculate overdue balances"
        breadcrumbs={[{ label: 'Sales' }, { label: 'Payments' }]}
        exportFilename="Sahara_Payments_Ledger"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Record Payment Receipt
          </Button>
        }
      />

      {/* Ledger Calculation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Ledger Value"
          value={formatCurrency(totalAmount)}
          icon={ReceiptText}
          accent="amber"
          description="Total installments tracked"
        />
        <StatCard
          title="Realized & Paid"
          value={formatCurrency(paidTotal)}
          icon={CheckCircle2}
          accent="emerald"
          description="Cleared funds in Sahara account"
        />
        <StatCard
          title="Pending Clearance"
          value={formatCurrency(pendingTotal)}
          icon={Clock}
          accent="blue"
          description="Invoices awaiting collection"
        />
        <StatCard
          title="Overdue Arrears"
          value={formatCurrency(overdueTotal)}
          icon={AlertTriangle}
          accent="rose"
          description="Urgent banker reminder required"
        />
      </div>

      <DataTable
        columns={columns}
        data={payments}
        keyField="id"
        searchPlaceholder="Search receipt, client, transaction ref..."
        exportFilename="Sahara_Payments_Ledger"
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record Client Payment Receipt"
        subtitle="Adding a payment updates the client's booking ledger and total paid balance."
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePayment}>Submit Receipt</Button>
          </>
        }
      >
        <form className="space-y-4 text-xs" onSubmit={handleSavePayment}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Linked Booking"
              value={formData.bookingId}
              onChange={e => setFormData({ ...formData, bookingId: e.target.value })}
              options={bookings.map(b => ({
                value: b.id,
                label: `${b.bookingNumber} (${b.clientName} • Unit ${b.unitNumber})`
              }))}
            />
            <Select
              label="Payee Client"
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              options={clients.map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Receipt Amount (₹ INR)"
              type="number"
              required
              placeholder="1000000"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
            />
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={['NEFT / RTGS', 'Cheque', 'UPI / IMPS', 'Bank Transfer', 'Demand Draft']}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={['Paid', 'Pending', 'Partial', 'Overdue']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bank Transaction Ref / UTR"
              placeholder="e.g. HDFCN26250912401"
              value={formData.transactionRef}
              onChange={e => setFormData({ ...formData, transactionRef: e.target.value })}
            />
            <Input
              label="Due Date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <Textarea
            label="Milestone Specification / Notes"
            placeholder="e.g. 2nd construction slab casting installment..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}

export default Payments;
