import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const base = createCrudService('bookings', '/crm/bookings');

export const bookingService = {
  ...base,

  async create(data) {
    const bookingCount = getEntityList('bookings').length + 1;
    const bookingNumber = data.bookingNumber || `BOK-2026-${String(bookingCount).padStart(3, '0')}`;
    
    const newBooking = await base.create({
      ...data,
      bookingNumber,
      bookingDate: data.bookingDate || new Date().toLocaleDateString('en-GB'),
      bookingStatus: data.bookingStatus || 'Confirmed',
      paymentStatus: data.paymentStatus || 'Pending',
      documentsVerified: data.documentsVerified ?? false
    });

    // 1. Affect Inventory: mark unit as 'Booked'
    if (data.unitId) {
      const units = getEntityList('units');
      const updatedUnits = units.map(u => {
        if (u.id === data.unitId) {
          return {
            ...u,
            status: 'Booked',
            clientId: data.clientId,
            bookingId: newBooking.id
          };
        }
        return u;
      });
      setEntityList('units', updatedUnits);
    }

    // 2. If token payment was provided, create initial payment record
    if (Number(data.bookingAmountPaid) > 0) {
      const payments = getEntityList('payments');
      const newPay = {
        id: `pay-${newBooking.id}`,
        receiptNumber: `RCP-2026-${String(payments.length + 1).padStart(5, '0')}`,
        bookingId: newBooking.id,
        clientId: data.clientId,
        clientName: data.clientName,
        amount: Number(data.bookingAmountPaid),
        paymentMethod: data.paymentMethod || 'NEFT / RTGS',
        paymentDate: new Date().toLocaleDateString('en-GB'),
        dueDate: new Date().toLocaleDateString('en-GB'),
        status: 'Paid',
        transactionRef: data.transactionRef || `ONLINE-INIT-${Date.now().toString().slice(-6)}`,
        notes: `Initial booking token deposit for ${data.propertyName} Unit ${data.unitNumber || ''}`
      };
      setEntityList('payments', [newPay, ...payments]);
    }

    return newBooking;
  },

  async cancelBooking(bookingId) {
    const booking = await base.getById(bookingId);
    if (!booking) return false;

    // Set booking status to Cancelled
    const updated = await base.update(bookingId, { bookingStatus: 'Cancelled' });

    // Release unit in inventory
    if (booking.unitId) {
      const units = getEntityList('units');
      const updatedUnits = units.map(u => {
        if (u.id === booking.unitId) {
          return { ...u, status: 'Available', clientId: null, bookingId: null };
        }
        return u;
      });
      setEntityList('units', updatedUnits);
    }

    return updated;
  }
};

export default bookingService;
