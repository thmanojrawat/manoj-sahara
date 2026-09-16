import React, { useState } from 'react';
import { Plus, Users2, Phone, Mail, Building, FileCheck2, Eye, MapPin, Edit2, Trash2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Vendors() {
  const { vendors, properties, addVendor, updateVendor, deleteVendor } = useCrm();

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialForm = {
    name: '',
    company: '',
    phone: '',
    email: '',
    location: 'New Town, Kolkata',
    status: 'active',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenEdit = (vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name || '',
      company: vendor.company || vendor.companyName || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      location: vendor.location || vendor.city || '',
      status: vendor.status || 'active',
      notes: vendor.notes || ''
    });
    setIsEditOpen(true);
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    await addVendor(formData);
    setIsAddOpen(false);
    setFormData(initialForm);
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;
    await updateVendor(selectedVendor.id, formData);
    setIsEditOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'Owner / Entity',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-sm">
            {item.name}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {item.company}
          </span>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (item) => (
        <div className="text-xs">
          <span className="text-slate-800 dark:text-slate-200 block font-mono">{item.phone}</span>
          <span className="text-slate-400 text-[11px] truncate block">{item.email}</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-600" />
          {item.location}
        </span>
      )
    },
    {
      key: 'propertyValue',
      header: 'Asset Value / Units',
      render: (item) => (
        <div>
          <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs block">
            {formatCurrency(item.propertyValue)}
          </span>
          <span className="text-[10px] text-slate-400">
            {item.propertyCount} Properties
          </span>
        </div>
      )
    },
    {
      key: 'agreementStatus',
      header: 'Mandate Agreement',
      render: (item) => <StatusBadge status={item.agreementStatus} />
    },
    {
      key: 'relationshipManager',
      header: 'Account Manager',
      accessor: 'relationshipManager'
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
              setSelectedVendor(item);
              setIsDetailOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit Vendor"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(item.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Delete Vendor"
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
        title="Property Owners & Institutional Landlords"
        subtitle="Manage individual asset owners, estate families, and corporate landlords under Sahara mandate"
        breadcrumbs={[{ label: 'Catalog' }, { label: 'Owners / Vendors' }]}
        exportFilename="Sahara_Vendors"
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setFormData(initialForm);
              setIsAddOpen(true);
            }}
          >
            Add Vendor
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={vendors}
        keyField="id"
        searchPlaceholder="Search owner name, company, location..."
        onRowClick={(item) => {
          setSelectedVendor(item);
          setIsDetailOpen(true);
        }}
        exportFilename="Sahara_Vendors"
      />

      {/* Vendor Profile Modal */}
      {selectedVendor && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedVendor.name}
          subtitle={`${selectedVendor.company || selectedVendor.companyName || 'Individual Owner'} • Location: ${selectedVendor.location || selectedVendor.city || 'Kolkata'}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Assets</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedVendor.propertyCount || 0} Properties</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Valuation</span>
                <p className="text-sm font-bold text-amber-600 mt-0.5">{formatCurrency(selectedVendor.propertyValue || 0)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Agreement</span>
                <div className="mt-0.5"><StatusBadge status={selectedVendor.agreementStatus || (selectedVendor.status === 'active' ? 'Active' : 'Inactive')} /></div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Relationship Lead</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{selectedVendor.relationshipManager || 'Unassigned'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-600" />
                Linked Assets in Sahara Portfolio
              </h4>
              <div className="space-y-2">
                {properties.filter(p => p.ownerId === selectedVendor.id).length === 0 ? (
                  <p className="text-slate-400 italic py-2">No properties linked to this vendor yet.</p>
                ) : (
                  properties.filter(p => p.ownerId === selectedVendor.id).map(prop => (
                    <div key={prop.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{prop.title}</span>
                        <span className="text-slate-500 block text-[11px]">{prop.locality}, {prop.area}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block">{formatCurrency(prop.price)}</span>
                        <StatusBadge status={prop.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Owner Dossier & Notes</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedVendor.notes || 'No additional dossier notes provided.'}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Property Owner / Vendor"
        subtitle="Register an asset owner or corporate landlord in Sahara MongoDB database"
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveVendor}>Save Vendor</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveVendor}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner / Landlord Name"
              required
              placeholder="e.g. Soumitra Chatterjee"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Company / Firm Name"
              placeholder="e.g. Bengal Heritage Holdings"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
              placeholder="e.g. +91 98301 11223"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. owner@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location / City"
              placeholder="e.g. Salt Lake, Kolkata"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
            <Select
              label="Account Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
          </div>
          <Textarea
            label="Notes / Dossier"
            placeholder="Portfolio background, ownership records, preferences..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Vendor"
        subtitle={`Updating ${selectedVendor?.name || 'Vendor Profile'}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateVendor}>Update Vendor</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleUpdateVendor}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner / Landlord Name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Company / Firm Name"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location / City"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
            <Select
              label="Account Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
          </div>
          <Textarea
            label="Notes / Dossier"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await deleteVendor(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Vendor?"
        message="Are you sure you want to remove this vendor? In MongoDB mode, this will soft-delete the record safely from the database."
        confirmText="Delete Vendor"
      />
    </div>
  );
}

export default Vendors;
