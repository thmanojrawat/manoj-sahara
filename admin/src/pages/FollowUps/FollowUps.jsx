import React, { useState, useMemo } from 'react';
import { Plus, Clock, CheckCircle2, AlertTriangle, Calendar, Phone, MessageSquare, Mail, Users, Trash2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';

export function FollowUps() {
  const { followUps, brokers, leads, completeFollowUp, rescheduleFollowUp, deleteFollowUp, addFollowUp } = useCrm();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Today' | 'Overdue' | 'Upcoming' | 'Completed'
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState('02:00 PM');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const initialForm = {
    leadId: leads[0]?.id || '',
    type: 'Call',
    dueDate: new Date().toLocaleDateString('en-GB'),
    dueTime: '11:00 AM',
    assignedBrokerId: brokers[0]?.id || '',
    priority: 'High',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter(f => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'Today') return f.category === 'Today';
      if (activeTab === 'Overdue') return f.category === 'Overdue';
      if (activeTab === 'Upcoming') return f.category === 'Upcoming';
      if (activeTab === 'Completed') return f.status === 'Completed';
      return true;
    });
  }, [followUps, activeTab]);

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === formData.leadId);
    const broker = brokers.find(b => b.id === formData.assignedBrokerId);

    await addFollowUp({
      ...formData,
      leadName: lead?.name || 'Prospect',
      assignedBrokerName: broker?.name || 'Assigned Broker',
      status: 'Pending',
      category: 'Upcoming'
    });
    setIsAddOpen(false);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleItem) return;
    await rescheduleFollowUp(rescheduleItem.id, newDate, newTime);
    setRescheduleItem(null);
  };

  const columns = [
    {
      key: 'type',
      header: 'Activity Type',
      render: (item) => {
        const icons = {
          Call: Phone,
          WhatsApp: MessageSquare,
          Email: Mail,
          Meeting: Users,
          'Site Visit': Calendar
        };
        const Icon = icons[item.type] || Clock;
        return (
          <span className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
            <Icon className="w-3.5 h-3.5 text-amber-600" />
            {item.type}
          </span>
        );
      }
    },
    {
      key: 'target',
      header: 'Prospect / Client',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white text-xs">
          {item.leadName || item.clientName || 'Lead'}
        </span>
      )
    },
    {
      key: 'notes',
      header: 'Follow-Up Mandate & Agenda',
      render: (item) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm truncate">
          {item.notes}
        </p>
      )
    },
    {
      key: 'due',
      header: 'Scheduled Date & Time',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
            {item.dueDate}
          </span>
          <span className="text-[10px] text-slate-400">{item.dueTime}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Category / Status',
      render: (item) => (
        <StatusBadge status={item.status === 'Completed' ? 'Completed' : item.category} />
      )
    },
    {
      key: 'assignedBrokerName',
      header: 'Assigned Agent',
      accessor: 'assignedBrokerName'
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {item.status !== 'Completed' ? (
            <>
              <button
                onClick={() => completeFollowUp(item.id)}
                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                title="Mark Completed"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRescheduleItem(item)}
                className="p-1 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
                title="Reschedule"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-bold">Done</span>
          )}
          <button
            onClick={() => deleteFollowUp(item.id)}
            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
            title="Delete"
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
        title="Follow-Up Execution Center"
        subtitle="Ensure zero lead leakage with scheduled calls, WhatsApp tours, and on-site buyer consultations"
        breadcrumbs={[{ label: 'CRM' }, { label: 'Follow-Ups' }]}
        exportFilename="Sahara_FollowUps"
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Schedule Follow-Up
          </Button>
        }
      />

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
        {['ALL', 'Today', 'Overdue', 'Upcoming', 'Completed'].map(tab => {
          const count = tab === 'ALL'
            ? followUps.length
            : tab === 'Completed'
            ? followUps.filter(f => f.status === 'Completed').length
            : followUps.filter(f => f.category === tab && f.status !== 'Completed').length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filteredFollowUps}
        keyField="id"
        searchPlaceholder="Search prospect, agent, agenda..."
        exportFilename="Sahara_FollowUps"
      />

      {/* Add Follow-Up Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Follow-Up Task"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveAdd}>Save Task</Button>
          </>
        }
      >
        <form className="space-y-4 text-xs" onSubmit={handleSaveAdd}>
          <Select
            label="Prospect / Lead"
            value={formData.leadId}
            onChange={e => setFormData({ ...formData, leadId: e.target.value })}
            options={leads.map(l => ({ value: l.id, label: `${l.name} (${l.requirement})` }))}
          />
          <Select
            label="Communication Mode"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            options={['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit']}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <Input
              label="Time"
              value={formData.dueTime}
              onChange={e => setFormData({ ...formData, dueTime: e.target.value })}
            />
          </div>
          <Select
            label="Assigned Agent"
            value={formData.assignedBrokerId}
            onChange={e => setFormData({ ...formData, assignedBrokerId: e.target.value })}
            options={brokers.map(b => ({ value: b.id, label: b.name }))}
          />
          <Textarea
            label="Task Objective"
            placeholder="e.g. Discuss revised payment milestone draft..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* Reschedule Modal */}
      {rescheduleItem && (
        <Modal
          isOpen={Boolean(rescheduleItem)}
          onClose={() => setRescheduleItem(null)}
          title="Reschedule Follow-Up"
          subtitle={`Current: ${rescheduleItem.dueDate} at ${rescheduleItem.dueTime}`}
          maxWidth="max-w-sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setRescheduleItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmReschedule}>Update Date</Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-xs">
            <Input
              label="New Due Date"
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
            />
            <Input
              label="New Due Time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default FollowUps;
