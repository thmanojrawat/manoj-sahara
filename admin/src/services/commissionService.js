import { createCrudService } from './baseService.js';

const base = createCrudService('commissions', '/commissions');

export const commissionService = {
  ...base,

  async markPaid(id, paidAmount) {
    const com = await base.getById(id);
    if (!com) return null;
    const totalCom = Number(com.commissionAmount) || 0;
    const currentPaid = Number(com.paidAmount) || 0;
    const newPaid = currentPaid + (Number(paidAmount) || 0);
    const pending = Math.max(0, totalCom - newPaid);

    return base.update(id, {
      paidAmount: newPaid,
      pendingAmount: pending,
      status: pending === 0 ? 'Paid' : 'Partially Paid',
      paymentDate: new Date().toLocaleDateString('en-GB')
    });
  }
};

export default commissionService;
