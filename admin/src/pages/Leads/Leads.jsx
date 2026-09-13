import React, { useState, useMemo } from 'react';
import {
  Plus,
  Users2,
  Phone,
  Mail,
  UserCheck,
  CalendarCheck,
  Clock,
  ArrowRight,
  List,
  Kanban as KanbanIcon,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal, { ConfirmDialog } from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function Leads() {
  const {
    leads,
    brokers,
    locations,
    addLead,
    updateLead,
    deleteLead,
    convertLeadToClient,
    addFollowUp,
    addSiteVisit
  } = useCrm();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterBroker, setFilterBroker] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState(null);
  const [followUpModalLead, setFollowUpModalLead] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State for Add Lead
  const initialForm = {
    name: '',
    phone: '',
    email: '',
    source: 'Website Inquiry',
    requirement: '',
    budget: '',
    preferredLocation: 'New Town',
    propertyType: 'Apartment',
    assignedBrokerId: brokers[0]?.id || '',
    priority: 'High',
    status: 'New',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [convertNotes, setConvertNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().slice(0, 10));
  const [followUpTime, setFollowUpTime] = useState('03:00 PM');
  const [followUpType, setFollowUpType] = useState('Call');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (filterStatus !== 'ALL' && lead.status !== filterStatus) return false;
      if (filterBroker !== 'ALL' && lead.assignedBrokerId !== filterBroker) return false;
      return true;
    });
  }, [leads, filterStatus, filterBroker]);

  const leadStages = ['New', 'Contacted', 'Qualified', 'Site Visit', 'Negotiation', 'Converted', 'Lost'];

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const broker = brokers.find(b => b.id === formData.assignedBrokerId);
    await addLead({
      ...formData,
      budget: Number(formData.budget) || 0,
      assignedBrokerName: broker?.name || 'Assigned Broker',
      createdDate: new Date().toLocaleDateString('en-GB'),
      lastContact: new Date().toLocaleDateString('en-GB'),
      nextFollowUp: 'Scheduled'
    });
    setIsAddModalOpen(false);
    setFormData(initialForm);
  };

  const handleConfirmConvert = async () => {
    if (!convertModalLead) return;
    await convertLeadToClient(convertModalLead.id, convertNotes);
    setConvertModalLead(null);
    setConvertNotes('');
  };

  const handleScheduleFollowUp = async () => {
    if (!followUpModalLead) return;
    await addFollowUp({
      leadId: followUpModalLead.id,
      leadName: followUpModalLead.name,
      type: followUpType,
      dueDate: followUpDate,
      dueTime: followUpTime,
      assignedBrokerId: followUpModalLead.assignedBrokerId,
      assignedBrokerName: followUpModalLead.assignedBrokerName,
      priority: followUpModalLead.priority,
      status: 'Pending',
      category: 'Upcoming',
      notes: followUpNotes || `Follow-up regarding ${followUpModalLead.requirement}`
    });
    setFollowUpModalLead(null);
    setFollowUpNotes('');
  };

  const columns = [
    {
      key: 'name',
      header: 'Prospect Name & Contact',
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
            Budget: {formatCurrency(item.budget)} • {item.preferredLocation}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'assignedBrokerName',
      header: 'Assigned Agent',
      accessor: 'assignedBrokerName'
    },
    {
      key: 'source',
      header: 'Source',
      render: (item) => (
        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          {item.source}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'CRM Actions',
      sortable: false,
      className: 'text-right actions-column',
      cellClassName: 'text-right actions-column',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          {item.status !== 'Converted' && (
            <button
              onClick={() => setConvertModalLead(item)}
              className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Convert Lead into Client"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Convert
            </button>
          )}
          <button
            onClick={() => setFollowUpModalLead(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Schedule Follow-up"
          >
            <Clock className="w-4 h-4" />
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
        title="Lead Management & Pipeline"
        subtitle="Manage prospective property buyers, schedule inspections, and convert qualified leads into clients"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Leads' }]}
        exportFilename="Sahara_Leads"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                }`}
                title="Pipeline Kanban"
              >
                <KanbanIcon className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 no-print">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Stages</option>
          {leadStages.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <select
          value={filterBroker}
          onChange={e => setFilterBroker(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Agents</option>
          {brokers.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredLeads}
          keyField="id"
          searchPlaceholder="Search lead name, phone, requirement, location..."
          exportFilename="Sahara_Leads"
        />
      ) : (
        /* Kanban Pipeline View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {leadStages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.status === stage);
            return (
              <div
                key={stage}
                className="w-72 shrink-0 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {stage}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="rounded-xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                          {lead.priority}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 line-clamp-2 leading-tight">
                        {lead.requirement}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400">
                          {formatCurrency(lead.budget)}
                        </span>
                        <span className="text-slate-400 text-[10px] truncate max-w-[100px]">
                          {lead.assignedBrokerName}
                        </span>
                      </div>

                      {stage !== 'Converted' && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            onClick={() => setConvertModalLead(lead)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <UserCheck className="w-3 h-3" />
                            Convert to Client
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

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Lead Inquiry"
        subtitle="Capture real estate requirements from Kolkata prospective buyers"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveAdd}>Save Lead</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Soumyajit Chatterjee"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              placeholder="+91 98308 12345"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="prospect@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <Select
              label="Lead Source"
              value={formData.source}
              onChange={e => setFormData({ ...formData, source: e.target.value })}
              options={['Website Inquiry', 'MagicBricks', '99acres', 'Referral', 'Walk-in', 'Billboard', 'Facebook Ad']}
            />
          </div>

          <Input
            label="Specific Requirement"
            required
            placeholder="e.g. 3 BHK near New Town under ₹1 Cr"
            value={formData.requirement}
            onChange={e => setFormData({ ...formData, requirement: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Max Budget (₹ INR)"
              type="number"
              placeholder="9500000"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
            />
            <Select
              label="Preferred Area"
              value={formData.preferredLocation}
              onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
              options={locations.map(l => l.area)}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
              options={['High', 'Medium', 'Low']}
            />
          </div>

          <Select
            label="Assigned Lead Broker"
            value={formData.assignedBrokerId}
            onChange={e => setFormData({ ...formData, assignedBrokerId: e.target.value })}
            options={brokers.map(b => ({ value: b.id, label: `${b.name} (${b.role})` }))}
          />

          <Textarea
            label="Initial Notes & Observations"
            placeholder="Employment details, urgency of possession, financing options..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Convert to Client Modal */}
      {convertModalLead && (
        <Modal
          isOpen={Boolean(convertModalLead)}
          onClose={() => setConvertModalLead(null)}
          title={`Convert ${convertModalLead.name} into Active Client?`}
          subtitle="This will register an active Client profile linked to this lead and advance their CRM lifecycle."
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="outline" onClick={() => setConvertModalLead(null)}>Cancel</Button>
              <Button variant="success" icon={UserCheck} onClick={handleConfirmConvert}>
                Confirm Conversion
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p><span className="font-semibold text-slate-500">Requirement:</span> {convertModalLead.requirement}</p>
              <p><span className="font-semibold text-slate-500">Budget:</span> {formatCurrency(convertModalLead.budget)}</p>
              <p><span className="font-semibold text-slate-500">Assigned Broker:</span> {convertModalLead.assignedBrokerName}</p>
            </div>
            <Textarea
              label="Conversion Notes / Next Steps"
              placeholder="e.g. Prepared token booking draft for Unit A-402..."
              value={convertNotes}
              onChange={e => setConvertNotes(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Schedule Follow-up Modal */}
      {followUpModalLead && (
        <Modal
          isOpen={Boolean(followUpModalLead)}
          onClose={() => setFollowUpModalLead(null)}
          title={`Schedule Follow-Up: ${followUpModalLead.name}`}
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="outline" onClick={() => setFollowUpModalLead(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleScheduleFollowUp}>Schedule</Button>
            </>
          }
        >
          <div className="space-y-3 py-2">
            <Select
              label="Follow-Up Type"
              value={followUpType}
              onChange={e => setFollowUpType(e.target.value)}
              options={['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit']}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
              />
              <Input
                label="Time"
                placeholder="03:00 PM"
                value={followUpTime}
                onChange={e => setFollowUpTime(e.target.value)}
              />
            </div>
            <Textarea
              label="Agenda / Notes"
              placeholder="Discussion points..."
              value={followUpNotes}
              onChange={e => setFollowUpNotes(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteLead(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Move Lead to Trash?"
        message="This will archive the lead and move it to Trash. You can restore it at any time."
      />
    </div>
  );
}

export default Leads;
