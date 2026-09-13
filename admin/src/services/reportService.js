import { getEntityList } from '../utils/storage.js';

export const reportService = {
  async getOverviewMetrics() {
    const properties = getEntityList('properties');
    const units = getEntityList('units');
    const leads = getEntityList('leads');
    const deals = getEntityList('deals');
    const bookings = getEntityList('bookings');
    const payments = getEntityList('payments');
    const tenancies = getEntityList('tenancies');
    const siteVisits = getEntityList('siteVisits');

    const totalRevenue = payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingRevenue = payments
      .filter(p => p.status === 'Pending' || p.status === 'Overdue')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const activeListings = properties.filter(p => p.status === 'Active').length;
    const availableUnits = units.filter(u => u.status === 'Available').length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified' || l.status === 'Site Visit' || l.status === 'Negotiation').length;
    const dealsCount = deals.length;
    const activeTenancies = tenancies.filter(t => t.paymentStatus !== 'Terminated').length;

    return {
      totalProperties: properties.length,
      activeListings,
      totalUnits: units.length,
      availableUnits,
      totalLeads: leads.length,
      newLeads,
      qualifiedLeads,
      siteVisits: siteVisits.length,
      dealsThisMonth: dealsCount,
      totalBookings: bookings.length,
      revenue: totalRevenue,
      pendingPayments: pendingRevenue,
      activeTenancies
    };
  },

  async getBrokerPerformance() {
    const brokers = getEntityList('brokers');
    const deals = getEntityList('deals');
    const siteVisits = getEntityList('siteVisits');

    return brokers.map(broker => {
      const brokerDeals = deals.filter(d => d.brokerId === broker.id);
      const wonDeals = brokerDeals.filter(d => d.stage === 'Closed Won' || d.stage === 'Booking');
      const totalVolume = wonDeals.reduce((sum, d) => sum + (Number(d.finalValue || d.expectedValue) || 0), 0);
      const visits = siteVisits.filter(v => v.agentId === broker.id).length;

      return {
        ...broker,
        dealsCount: brokerDeals.length,
        wonCount: wonDeals.length,
        volume: totalVolume || broker.revenueGenerated,
        siteVisitsCount: visits || broker.siteVisitsConducted
      };
    });
  },

  async getAreaWiseStats() {
    const properties = getEntityList('properties');
    const areaMap = {};

    properties.forEach(p => {
      const area = p.area || 'Other';
      if (!areaMap[area]) {
        areaMap[area] = { area, count: 0, totalVal: 0, activeCount: 0 };
      }
      areaMap[area].count += 1;
      areaMap[area].totalVal += Number(p.price) || 0;
      if (p.status === 'Active') areaMap[area].activeCount += 1;
    });

    return Object.values(areaMap);
  }
};

export default reportService;
