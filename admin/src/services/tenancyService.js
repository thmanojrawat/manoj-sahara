import { createCrudService } from './baseService.js';

const base = createCrudService('tenancies', '/rentals/tenancies');

export const tenancyService = {
  ...base,

  async recordRentPayment(id, amountReceived) {
    const tenancy = await base.getById(id);
    if (!tenancy) return null;

    const arrears = Math.max(0, (Number(tenancy.arrearsAmount) || 0) - Number(amountReceived));
    return base.update(id, {
      arrearsAmount: arrears,
      paymentStatus: arrears === 0 ? 'Current' : 'Arrears',
      lastPaymentReceivedDate: new Date().toLocaleDateString('en-GB')
    });
  }
};

export default tenancyService;
