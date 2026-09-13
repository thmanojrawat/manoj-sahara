import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const base = createCrudService('payments', '/payments');

export const paymentService = {
  ...base,

  async create(data) {
    const payments = getEntityList('payments');
    const receiptNumber = data.receiptNumber || `RCP-2026-${String(payments.length + 1).padStart(5, '0')}`;

    const newPayment = await base.create({
      ...data,
      receiptNumber,
      amount: Number(data.amount) || 0,
      paymentDate: data.status === 'Paid' ? (data.paymentDate || new Date().toLocaleDateString('en-GB')) : null
    });

    // Recalculate Booking's paid amount & status if linked to a booking
    if (data.bookingId) {
      const bookings = getEntityList('bookings');
      const allPayments = getEntityList('payments'); // includes newly created
      
      const totalPaidForBooking = allPayments
        .filter(p => p.bookingId === data.bookingId && p.status === 'Paid')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      const updatedBookings = bookings.map(b => {
        if (b.id === data.bookingId) {
          const totalVal = Number(b.totalAgreementValue) || 0;
          let paymentStatus = 'Pending';
          if (totalPaidForBooking >= totalVal && totalVal > 0) {
            paymentStatus = 'Paid';
          } else if (totalPaidForBooking > 0) {
            paymentStatus = 'Partial';
          }
          return {
            ...b,
            bookingAmountPaid: totalPaidForBooking,
            paymentStatus
          };
        }
        return b;
      });
      setEntityList('bookings', updatedBookings);
    }

    return newPayment;
  }
};

export default paymentService;
