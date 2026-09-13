import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const base = createCrudService('leads', '/leads');

export const leadService = {
  ...base,

  async convertToClient(leadId, customNotes = '') {
    const lead = await base.getById(leadId);
    if (!lead) throw new Error('Lead not found');

    // 1. Mark lead as converted
    await base.update(leadId, {
      status: 'Converted',
      nextFollowUp: 'Completed',
      convertedDate: new Date().toLocaleDateString('en-GB')
    });

    // 2. Create new client record linked to this lead
    const clients = getEntityList('clients');
    const newClient = {
      id: `cli-${Date.now()}`,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      convertedFromLeadId: lead.id,
      requirement: lead.requirement,
      budget: lead.budget,
      preferredLocations: [lead.preferredLocation],
      propertyType: lead.propertyType,
      status: 'Active',
      assignedBrokerId: lead.assignedBrokerId,
      assignedBrokerName: lead.assignedBrokerName,
      lastInteraction: new Date().toLocaleDateString('en-GB'),
      nextFollowUp: 'Scheduled',
      totalBookings: 0,
      totalDeals: 0,
      totalPaid: 0,
      notes: customNotes || `Converted from Lead ${lead.id}. ${lead.notes || ''}`
    };

    setEntityList('clients', [newClient, ...clients]);
    return newClient;
  }
};

export default leadService;
