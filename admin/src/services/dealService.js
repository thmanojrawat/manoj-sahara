import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const base = createCrudService('deals', '/deals');

export const dealService = {
  ...base,

  async create(data) {
    const rate = Number(data.commissionRate) || 2.0;
    const value = Number(data.finalValue || data.expectedValue) || 0;
    const commissionAmount = Math.round((value * rate) / 100);

    const newDeal = await base.create({
      ...data,
      commissionRate: rate,
      commissionAmount,
      stage: data.stage || 'Lead',
      probability: data.probability || 25
    });

    // Create or update Commission record
    if (data.brokerId && commissionAmount > 0) {
      const commissions = getEntityList('commissions');
      const newCom = {
        id: `com-${newDeal.id}`,
        brokerId: data.brokerId,
        brokerName: data.brokerName || 'Agent',
        dealId: newDeal.id,
        propertyName: data.propertyName || 'Property',
        dealValue: value,
        commissionRate: rate,
        commissionAmount,
        paidAmount: 0,
        pendingAmount: commissionAmount,
        status: 'Pending Verification',
        invoiceNumber: null,
        paymentDate: null
      };
      setEntityList('commissions', [newCom, ...commissions]);
    }

    return newDeal;
  },

  async updateStage(dealId, newStage) {
    const probabilities = {
      'Lead': 20,
      'Qualified': 40,
      'Negotiation': 70,
      'Agreement': 85,
      'Booking': 95,
      'Closed Won': 100,
      'Closed Lost': 0
    };
    return base.update(dealId, {
      stage: newStage,
      probability: probabilities[newStage] !== undefined ? probabilities[newStage] : 50
    });
  }
};

export default dealService;
