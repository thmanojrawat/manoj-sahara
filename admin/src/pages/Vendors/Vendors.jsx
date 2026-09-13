import React, { useState } from 'react';
import { Plus, Users2, Phone, Mail, Building, FileCheck2, Eye, MapPin } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Vendors() {
  const { vendors, properties } = useCrm();

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedVendor(item);
            setIsDetailOpen(true);
          }}
        >
          View Assets
        </Button>
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
          subtitle={`${selectedVendor.company} • Location: ${selectedVendor.location}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Assets</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedVendor.propertyCount} Properties</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Valuation</span>
                <p className="text-sm font-bold text-amber-600 mt-0.5">{formatCurrency(selectedVendor.propertyValue)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Agreement</span>
                <div className="mt-0.5"><StatusBadge status={selectedVendor.agreementStatus} /></div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Relationship Lead</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{selectedVendor.relationshipManager}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-600" />
                Linked Assets in Sahara Portfolio
              </h4>
              <div className="space-y-2">
                {properties.filter(p => p.ownerId === selectedVendor.id).map(prop => (
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
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Owner Dossier & Notes</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedVendor.notes}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Vendors;
