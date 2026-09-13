import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const base = createCrudService('siteVisits', '/site-visits');

export const siteVisitService = {
  ...base,

  async create(data) {
    const createdVisit = await base.create(data);

    // Synchronize to Appointments: "Creating a site visit appears in appointments."
    try {
      const appointments = getEntityList('appointments');
      const newApt = {
        id: `apt-sv-${createdVisit.id}`,
        title: `Site Visit: ${createdVisit.propertyTitle || 'Property Showing'}`,
        clientName: createdVisit.clientName || createdVisit.leadName || 'Client',
        phone: createdVisit.phone || '+91 98300 00000',
        agentName: createdVisit.agentName || 'Assigned Agent',
        date: createdVisit.date,
        time: createdVisit.time,
        duration: '60 mins',
        location: createdVisit.location || 'On-Site',
        type: 'Site Visit',
        status: createdVisit.status === 'Cancelled' ? 'Cancelled' : 'Confirmed',
        agenda: `Guided inspection of property with ${createdVisit.clientName || createdVisit.leadName}`
      };
      setEntityList('appointments', [newApt, ...appointments]);
    } catch (err) {
      console.warn('Failed to sync appointment for site visit:', err);
    }

    return createdVisit;
  }
};

export default siteVisitService;
