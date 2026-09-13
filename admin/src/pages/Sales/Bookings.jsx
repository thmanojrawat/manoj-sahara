import React, { useState } from 'react';
import { Plus, BadgeDollarSign, Ban, CheckCircle, Eye, Printer } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { Input, Select } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Bookings() {
  const { bookings, properties, units, clients, brokers, addBooking, cancelBooking, deleteBooking } = useCrm();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cancelModalId, setCancelModalId] = useState(null);

  const availableUnits = units.filter(u => u.status === 'Available');

  const initialForm = {
    unitId: availableUnits[0]?.id || '',
    clientId: clients[0]?.id || '',
    brokerId: brokers[0]?.id || '',
    bookingAmountPaid: '1000000',
    bookingStatus: 'Confirmed'
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    const unit = units.find(u => u.id === formData.unitId);
    const client = clients.find(c => c.id === formData.clientId);
    const broker = brokers.find(b => b.id === formData.brokerId);

    await addBooking({
      ...formData,
      unitNumber: unit?.unitNumber || 'A-101',
      propertyId: unit?.projectId || properties[0]?.id,
      propertyName: unit?.projectName || properties[0]?.title,
      clientName: client?.name || 'Client',
      clientPhone: client?.phone || '+91 98300 00000',
      brokerName: broker?.name || 'Assigned Agent',
      totalAgreementValue: unit?.basePrice || 7500000,
      bookingAmountPaid: Number(formData.bookingAmountPaid) || 0
    });

    setIsAddOpen(false);
  };

  const columns = [
    {
      key: 'bookingNumber',
      header: 'Booking Number',
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
            {item.bookingNumber}
          </span>
          <span className="text-[10px] text-slate-400">{item.bookingDate}</span>
        </div>
      )
    },
    {
      key: 'unit',
      header: 'Allotted Unit & Asset',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-xs block">
            Unit {item.unitNumber}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {item.propertyName}
          </span>
        </div>
      )
    },
    {
      key: 'clientName',
      header: 'Allottee Client',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
            {item.clientName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{item.clientPhone}</span>
        </div>
      )
    },
    {
      key: 'totalAgreementValue',
      header: 'Agreement Value / Token',
      render: (item) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
            {formatCurrency(item.totalAgreementValue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">
            Paid: {formatCurrency(item.bookingAmountPaid)}
          </span>
        </div>
      )
    },
    {
      key: 'bookingStatus',
      header: 'Booking Status',
      render: (item) => <StatusBadge status={item.bookingStatus} />
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (item) => <StatusBadge status={item.paymentStatus} />
    },
    {
      key: 'brokerName',
      header: 'Originating Agent',
      accessor: 'brokerName'
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {item.bookingStatus !== 'Cancelled' && (
            <Button
              size="sm"
              variant="outline"
              icon={Ban}
              onClick={() => setCancelModalId(item.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unit Bookings & Allotment Registry"
        subtitle="Manage customer unit reservations, token payments, and automatic inventory unit status updates"
        breadcrumbs={[{ label: 'Sales' }, { label: 'Bookings' }]}
        exportFilename="Sahara_Bookings"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
            New Booking Allotment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={bookings}
        keyField="id"
        searchPlaceholder="Search booking number, unit, client, property..."
        exportFilename="Sahara_Bookings"
      />

      {/* New Booking Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Confirm New Unit Booking Allotment"
        subtitle="Allotting a unit marks it as 'Booked' in the inventory matrix and creates an initial payment receipt."
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveBooking}>Confirm Allotment</Button>
          </>
        }
      >
        <form className="space-y-4 text-xs" onSubmit={handleSaveBooking}>
          <Select
            label="Available Inventory Unit to Allot"
            value={formData.unitId}
            onChange={e => setFormData({ ...formData, unitId: e.target.value })}
            options={availableUnits.map(u => ({
              value: u.id,
              label: `Unit ${u.unitNumber} (${u.projectName} • ${formatCurrency(u.basePrice)})`
            }))}
          />

          <Select
            label="Booking Client"
            value={formData.clientId}
            onChange={e => setFormData({ ...formData, clientId: e.target.value })}
            options={clients.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Token Deposit Amount (₹ INR)"
              type="number"
              value={formData.bookingAmountPaid}
              onChange={e => setFormData({ ...formData, bookingAmountPaid: e.target.value })}
            />
            <Select
              label="Originating Agent"
              value={formData.brokerId}
              onChange={e => setFormData({ ...formData, brokerId: e.target.value })}
              options={brokers.map(b => ({ value: b.id, label: b.name }))}
            />
          </div>
        </form>
      </Modal>

      {/* Cancel Booking Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(cancelModalId)}
        onClose={() => setCancelModalId(null)}
        onConfirm={() => {
          if (cancelModalId) {
            cancelBooking(cancelModalId);
            setCancelModalId(null);
          }
        }}
        title="Cancel Unit Booking?"
        message="Cancelling this booking will release the allotted unit back into the Available inventory matrix."
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
      />
    </div>
  );
}

export default Bookings;
