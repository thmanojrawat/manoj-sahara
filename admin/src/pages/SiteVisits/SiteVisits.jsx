import React, { useState } from 'react';
import { Plus, CalendarCheck, MapPin, Clock, User, Building, CheckCircle } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';

export function SiteVisits() {
  const { siteVisits, properties, brokers, leads, clients, addSiteVisit, updateSiteVisit, deleteSiteVisit } = useCrm();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [statusModalItem, setStatusModalItem] = useState(null);
  const [newStatusVal, setNewStatusVal] = useState('Scheduled');

  const initialForm = {
    prospectId: leads[0]?.id || '',
    propertyId: properties[0]?.id || '',
    agentId: brokers[0]?.id || '',
    date: new Date().toISOString().slice(0, 10),
    time: '11:00 AM',
    location: 'Sahara Solitaire Heights, New Town',
    notes: 'Guided site inspection with client family'
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSaveVisit = async (e) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === formData.prospectId);
    const prop = properties.find(p => p.id === formData.propertyId);
    const broker = brokers.find(b => b.id === formData.agentId);

    await addSiteVisit({
      ...formData,
      leadName: lead?.name || 'Prospect',
      propertyTitle: prop?.title || 'Sahara Property',
      agentName: broker?.name || 'Assigned Agent',
      status: 'Scheduled'
    });
    setIsAddOpen(false);
    setFormData(initialForm);
  };

  const handleSaveStatus = async () => {
    if (!statusModalItem) return;
    await updateSiteVisit(statusModalItem.id, { status: newStatusVal });
    setStatusModalItem(null);
  };

  const columns = [
    {
      key: 'propertyTitle',
      header: 'Inspection Property',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block text-xs">
            {item.propertyTitle}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-amber-600" />
            {item.location}
          </span>
        </div>
      )
    },
    {
      key: 'client',
      header: 'Buyer / Prospect',
      render: (item) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
          {item.clientName || item.leadName || 'Client'}
        </span>
      )
    },
    {
      key: 'schedule',
      header: 'Date & Time',
      render: (item) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white block">
            {item.date}
          </span>
          <span className="text-[10px] text-slate-400">{item.time}</span>
        </div>
      )
    },
    {
      key: 'agentName',
      header: 'Tour Escort Agent',
      accessor: 'agentName'
    },
    {
      key: 'status',
      header: 'Inspection Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Update Status',
      sortable: false,
      render: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setStatusModalItem(item);
            setNewStatusVal(item.status);
          }}
        >
          Status
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Visits & On-Site Showings"
        subtitle="Manage escorted physical tours, unit inspections, and customer feedback across project sites"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Site Visits' }]}
        exportFilename="Sahara_Site_Visits"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Schedule Site Visit
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={siteVisits}
        keyField="id"
        searchPlaceholder="Search property, prospect, location, agent..."
        exportFilename="Sahara_Site_Visits"
      />

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Property Site Inspection"
        subtitle="Booking a site visit automatically syncs with the company appointments calendar."
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveVisit}>Confirm Schedule</Button>
          </>
        }
      >
        <form className="space-y-4 text-xs" onSubmit={handleSaveVisit}>
          <Select
            label="Prospect / Buyer"
            value={formData.prospectId}
            onChange={e => setFormData({ ...formData, prospectId: e.target.value })}
            options={leads.map(l => ({ value: l.id, label: `${l.name} (${l.phone})` }))}
          />

          <Select
            label="Property Location"
            value={formData.propertyId}
            onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
            options={properties.map(p => ({ value: p.id, label: `${p.title} (${p.area})` }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <Select
            label="Escorting Agent"
            value={formData.agentId}
            onChange={e => setFormData({ ...formData, agentId: e.target.value })}
            options={brokers.map(b => ({ value: b.id, label: b.name }))}
          />

          <Input
            label="Meeting Rendezvous Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />

          <Textarea
            label="Showing Notes / Special Instructions"
            placeholder="Key preferences, parking pass requirements..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Status Update Modal */}
      {statusModalItem && (
        <Modal
          isOpen={Boolean(statusModalItem)}
          onClose={() => setStatusModalItem(null)}
          title="Update Site Visit Status"
          subtitle={`${statusModalItem.propertyTitle} with ${statusModalItem.clientName || statusModalItem.leadName}`}
          maxWidth="max-w-sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setStatusModalItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveStatus}>Update Status</Button>
            </>
          }
        >
          <div className="py-2 space-y-3 text-xs">
            <Select
              label="Inspection Status"
              value={newStatusVal}
              onChange={e => setNewStatusVal(e.target.value)}
              options={['Scheduled', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled', 'No Show']}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SiteVisits;
