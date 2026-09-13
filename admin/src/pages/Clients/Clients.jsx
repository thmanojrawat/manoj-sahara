import React, { useState } from 'react';
import { Plus, UserCheck, Phone, Mail, MapPin, Eye, Edit2, Trash2, Building, Calendar, Receipt } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Clients() {
  const { clients, brokers, locations, properties, deals, bookings, payments, addClient, updateClient, deleteClient } = useCrm();

  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const initialForm = {
    name: '',
    phone: '',
    email: '',
    requirement: '',
    budget: '',
    preferredLocation: 'New Town',
    propertyType: 'Apartment',
    status: 'Active',
    assignedBrokerId: brokers[0]?.id || '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSaveClient = async (e) => {
    e.preventDefault();
    const broker = brokers.find(b => b.id === formData.assignedBrokerId);
    await addClient({
      ...formData,
      budget: Number(formData.budget) || 0,
      preferredLocations: [formData.preferredLocation],
      assignedBrokerName: broker?.name || 'Assigned Agent',
      lastInteraction: new Date().toLocaleDateString('en-GB'),
      nextFollowUp: 'Scheduled',
      totalBookings: 0,
      totalDeals: 0,
      totalPaid: 0
    });
    setIsAddOpen(false);
    setFormData(initialForm);
  };

  const columns = [
    {
      key: 'name',
      header: 'Client Profile',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-sm">
            {item.name}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-slate-400" />
              {item.phone}
            </span>
            <span className="truncate max-w-[140px]">{item.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'requirement',
      header: 'Requirement & Budget',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {item.requirement}
          </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs mt-0.5 block">
            Budget: {formatCurrency(item.budget)}
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
      key: 'assignedBrokerName',
      header: 'Relationship Manager',
      accessor: 'assignedBrokerName'
    },
    {
      key: 'totalPaid',
      header: 'Total Paid',
      render: (item) => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
          {formatCurrency(item.totalPaid || 0)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      className: 'text-right actions-column',
      cellClassName: 'text-right actions-column',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedClient(item);
              setIsDetailOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="View Profile & Ledger"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Database & Accounts"
        subtitle="Manage converted high-net-worth real estate buyers, investment portfolios, and booking records"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Clients' }]}
        exportFilename="Sahara_Clients"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Add Client
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={clients}
        keyField="id"
        searchPlaceholder="Search client name, requirement, email, phone..."
        onRowClick={(item) => {
          setSelectedClient(item);
          setIsDetailOpen(true);
        }}
        exportFilename="Sahara_Clients"
      />

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Client Profile"
        subtitle="Create a direct verified client record"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveClient}>Save Client</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveClient}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              required
              placeholder="e.g. Rajesh Kumar Agarwal"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              placeholder="+91 98300 11223"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="client@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <Select
              label="Assigned Agent"
              value={formData.assignedBrokerId}
              onChange={e => setFormData({ ...formData, assignedBrokerId: e.target.value })}
              options={brokers.map(b => ({ value: b.id, label: `${b.name} (${b.role})` }))}
            />
          </div>

          <Input
            label="Property Requirement"
            required
            placeholder="e.g. 3 BHK Lakeview in New Town"
            value={formData.requirement}
            onChange={e => setFormData({ ...formData, requirement: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Budget (₹ INR)"
              type="number"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
            />
            <Select
              label="Preferred Location"
              value={formData.preferredLocation}
              onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
              options={locations.map(l => l.area)}
            />
          </div>

          <Textarea
            label="Client Background / Notes"
            placeholder="Investment horizon, payment mode preferences..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Client Detail & Ledger Drawer */}
      {selectedClient && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedClient.name}
          subtitle={`Client ID: ${selectedClient.id} • Assigned to ${selectedClient.assignedBrokerName}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs">
            {/* Contact & Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedClient.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{selectedClient.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Account Status</span>
                <div className="mt-0.5"><StatusBadge status={selectedClient.status} /></div>
              </div>
            </div>

            {/* Requirement Summary */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Mandate & Specifications
              </h4>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedClient.requirement}
              </p>
              <div className="mt-2 flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <span>Budget: <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(selectedClient.budget)}</strong></span>
                <span>Locations: <strong>{(selectedClient.preferredLocations || []).join(', ')}</strong></span>
              </div>
            </div>

            {/* Bookings & Payments Linked to this Client */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-600" />
                Bookings & Allotments ({bookings.filter(b => b.clientId === selectedClient.id).length})
              </h4>
              <div className="space-y-2">
                {bookings.filter(b => b.clientId === selectedClient.id).map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{b.bookingNumber}</span>
                      <span className="text-slate-400 ml-2">Unit: {b.unitNumber} ({b.propertyName})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 block">{formatCurrency(b.totalAgreementValue)}</span>
                      <StatusBadge status={b.bookingStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Relationship History & Notes
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedClient.notes || 'No notes available.'}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteClient(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Move Client to Trash?"
        message="This will archive the client account and move it to Trash. You can restore it at any time."
      />
    </div>
  );
}

export default Clients;
