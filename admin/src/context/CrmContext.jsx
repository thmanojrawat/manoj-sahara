import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getEntityList, setEntityList, resetAllStorage } from '../utils/storage.js';
import { useToast } from './ToastContext.jsx';
import { USE_MOCK } from '../services/api.js';
import vendorService from '../services/vendorService.js';
import brokerService from '../services/brokerService.js';
import propertyService from '../services/propertyService.js';
import leadService from '../services/leadService.js';
import clientService from '../services/clientService.js';
import dealService from '../services/dealService.js';
import bookingService from '../services/bookingService.js';
import paymentService from '../services/paymentService.js';
import followUpService from '../services/followUpService.js';
import siteVisitService from '../services/siteVisitService.js';
import tenancyService from '../services/tenancyService.js';
import inventoryService from '../services/inventoryService.js';
import commissionService from '../services/commissionService.js';

const CrmContext = createContext();

export function CrmProvider({ children }) {
  const { addToast } = useToast();

  // State slices
  const [properties, setProperties] = useState(() => USE_MOCK ? getEntityList('properties') : []);
  const [projects, setProjects] = useState(() => getEntityList('projects'));
  const [buildings, setBuildings] = useState(() => getEntityList('buildings'));
  const [floors, setFloors] = useState(() => getEntityList('floors'));
  const [units, setUnits] = useState(() => getEntityList('units'));
  const [vendors, setVendors] = useState(() => USE_MOCK ? getEntityList('vendors') : []);
  const [vendorsLoading, setVendorsLoading] = useState(!USE_MOCK);
  const [brokers, setBrokers] = useState(() => USE_MOCK ? getEntityList('brokers') : []);
  const [leads, setLeads] = useState(() => USE_MOCK ? getEntityList('leads') : []);
  const [clients, setClients] = useState(() => USE_MOCK ? getEntityList('clients') : []);
  const [followUps, setFollowUps] = useState(() => getEntityList('followUps'));
  const [siteVisits, setSiteVisits] = useState(() => getEntityList('siteVisits'));
  const [appointments, setAppointments] = useState(() => getEntityList('appointments'));
  const [deals, setDeals] = useState(() => getEntityList('deals'));
  const [bookings, setBookings] = useState(() => USE_MOCK ? getEntityList('bookings') : []);
  const [payments, setPayments] = useState(() => getEntityList('payments'));
  const [commissions, setCommissions] = useState(() => getEntityList('commissions'));
  const [tenancies, setTenancies] = useState(() => getEntityList('tenancies'));
  const [agreements, setAgreements] = useState(() => getEntityList('agreements'));
  const [locations, setLocations] = useState(() => getEntityList('locations'));
  const [amenities, setAmenities] = useState(() => getEntityList('amenities'));
  const [users, setUsers] = useState(() => getEntityList('users'));
  const [roles, setRoles] = useState(() => getEntityList('roles'));
  const [notifications, setNotifications] = useState(() => getEntityList('notifications'));
  const [activities, setActivities] = useState(() => getEntityList('activities'));
  const [trash, setTrash] = useState(() => getEntityList('trash'));

  // Sync helper to refresh from storage after cross-entity cascading changes.
  // NOTE: Migrated modules are only refreshed from localStorage in mock mode.
  const refreshAllState = useCallback(() => {
    if (USE_MOCK) {
      setProperties(getEntityList('properties'));
      setVendors(getEntityList('vendors'));
      setBrokers(getEntityList('brokers'));
      setLeads(getEntityList('leads'));
      setClients(getEntityList('clients'));
      setBookings(getEntityList('bookings'));
    }
    setProjects(getEntityList('projects'));
    setBuildings(getEntityList('buildings'));
    setFloors(getEntityList('floors'));
    setUnits(getEntityList('units'));
    setFollowUps(getEntityList('followUps'));
    setSiteVisits(getEntityList('siteVisits'));
    setAppointments(getEntityList('appointments'));
    setDeals(getEntityList('deals'));
    setPayments(getEntityList('payments'));
    setCommissions(getEntityList('commissions'));
    setTenancies(getEntityList('tenancies'));
    setAgreements(getEntityList('agreements'));
    setLocations(getEntityList('locations'));
    setAmenities(getEntityList('amenities'));
    setUsers(getEntityList('users'));
    setRoles(getEntityList('roles'));
    setNotifications(getEntityList('notifications'));
    setActivities(getEntityList('activities'));
    setTrash(getEntityList('trash'));
  }, []);

  // ── API Loaders for Migrated Modules ─────────────────────────────
  const loadVendorsFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    setVendorsLoading(true);
    try {
      console.log('[CRM API] Loading vendors...');
      const result = await vendorService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Vendors fetched:', list.length, 'records');
      setVendors(list);
    } catch (err) {
      console.error('[CRM API] Failed to load vendors:', err);
      addToast({ type: 'error', title: 'Vendor Load Failed', message: 'Could not fetch vendors from server' });
    } finally {
      setVendorsLoading(false);
    }
  }, [addToast]);

  const loadBrokersFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      console.log('[CRM API] Loading brokers...');
      const result = await brokerService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Brokers fetched:', list.length, 'records');
      setBrokers(list);
    } catch (err) {
      console.error('[CRM API] Failed to load brokers:', err);
      addToast({ type: 'error', title: 'Broker Load Failed', message: 'Could not fetch brokers from server' });
    }
  }, [addToast]);

  const loadPropertiesFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      console.log('[CRM API] Loading properties...');
      const result = await propertyService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Properties fetched:', list.length, 'records');
      setProperties(list);
    } catch (err) {
      console.error('[CRM API] Failed to load properties:', err);
      addToast({ type: 'error', title: 'Property Load Failed', message: 'Could not fetch properties from server' });
    }
  }, [addToast]);

  const loadLeadsFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      console.log('[CRM API] Loading leads...');
      const result = await leadService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Leads fetched:', list.length, 'records');
      setLeads(list);
    } catch (err) {
      console.error('[CRM API] Failed to load leads:', err);
      addToast({ type: 'error', title: 'Lead Load Failed', message: 'Could not fetch leads from server' });
    }
  }, [addToast]);

  const loadClientsFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      console.log('[CRM API] Loading clients...');
      const result = await clientService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Clients fetched:', list.length, 'records');
      setClients(list);
    } catch (err) {
      console.error('[CRM API] Failed to load clients:', err);
      addToast({ type: 'error', title: 'Client Load Failed', message: 'Could not fetch clients from server' });
    }
  }, [addToast]);

  const loadBookingsFromApi = useCallback(async () => {
    if (USE_MOCK) return;
    try {
      console.log('[CRM API] Loading bookings...');
      const result = await bookingService.getAll();
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      console.log('[CRM API] Bookings fetched:', list.length, 'records');
      setBookings(list);
    } catch (err) {
      console.error('[CRM API] Failed to load bookings:', err);
      addToast({ type: 'error', title: 'Booking Load Failed', message: 'Could not fetch bookings from server' });
    }
  }, [addToast]);

  // On mount: if API mode, fetch migrated modules from MongoDB
  useEffect(() => {
    if (!USE_MOCK) {
      console.log('[CRM Context] Initializing data from MongoDB backend...');
      loadVendorsFromApi();
      loadBrokersFromApi();
      loadPropertiesFromApi();
      loadLeadsFromApi();
      loadClientsFromApi();
      loadBookingsFromApi();
    }
  }, [
    loadVendorsFromApi,
    loadBrokersFromApi,
    loadPropertiesFromApi,
    loadLeadsFromApi,
    loadClientsFromApi,
    loadBookingsFromApi,
  ]);

  // Log activity
  const logActivity = useCallback((action, entity, details) => {
    const current = getEntityList('activities');
    const newAct = {
      id: `act-${Date.now()}`,
      user: 'Siddhartha Bannerjee',
      action,
      entity,
      timestamp: new Date().toLocaleString('en-GB'),
      details
    };
    const updated = [newAct, ...current];
    setEntityList('activities', updated);
    setActivities(updated);
  }, []);

  // -------------------------------------------------------------
  // TRASH & SOFT-DELETE OPERATIONS
  // -------------------------------------------------------------
  const restoreFromTrash = useCallback((trashId) => {
    const currentTrash = getEntityList('trash');
    const itemToRestore = currentTrash.find(t => t.trashId === trashId);
    if (!itemToRestore) return;

    const { originalEntity, data } = itemToRestore;
    const entityList = getEntityList(originalEntity);
    setEntityList(originalEntity, [data, ...entityList]);

    const updatedTrash = currentTrash.filter(t => t.trashId !== trashId);
    setEntityList('trash', updatedTrash);

    refreshAllState();
    logActivity('Restored from Trash', `${originalEntity}: ${itemToRestore.title}`, 'Item restored to original module');
    addToast({ type: 'success', title: 'Restored', message: `Item successfully restored to ${originalEntity}` });
  }, [refreshAllState, logActivity, addToast]);

  const permanentlyDeleteFromTrash = useCallback((trashId) => {
    const currentTrash = getEntityList('trash');
    const updatedTrash = currentTrash.filter(t => t.trashId !== trashId);
    setEntityList('trash', updatedTrash);
    setTrash(updatedTrash);
    logActivity('Permanent Delete', 'Trash Item', 'Record permanently purged from system');
    addToast({ type: 'info', title: 'Deleted', message: 'Record permanently deleted' });
  }, [logActivity, addToast]);

  // -------------------------------------------------------------
  // VENDORS
  // -------------------------------------------------------------
  const addVendor = async (data) => {
    try {
      const result = await vendorService.create(data);
      const created = result?.data ?? result; // unwrap API envelope if present
      if (USE_MOCK) {
        refreshAllState();
      } else {
        // In API mode, refresh vendors from server to get the true MongoDB document
        await loadVendorsFromApi();
      }
      logActivity('Vendor Added', created.name, `Company: ${created.companyName || 'Individual'}`);
      addToast({ type: 'success', title: 'Vendor Created', message: `${created.name} added successfully` });
      return created;
    } catch (err) {
      console.error('[CRM] addVendor failed:', err);
      addToast({ type: 'error', title: 'Add Failed', message: err?.response?.data?.message || 'Could not add vendor' });
      throw err;
    }
  };

  const updateVendor = async (id, data) => {
    try {
      const result = await vendorService.update(id, data);
      const updated = result?.data ?? result;
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadVendorsFromApi();
      }
      logActivity('Vendor Updated', updated.name, 'Updated vendor details');
      addToast({ type: 'success', title: 'Vendor Updated', message: `${updated.name} has been updated` });
      return updated;
    } catch (err) {
      console.error('[CRM] updateVendor failed:', err);
      addToast({ type: 'error', title: 'Update Failed', message: err?.response?.data?.message || 'Could not update vendor' });
      throw err;
    }
  };

  const deleteVendor = async (id) => {
    try {
      const vendor = vendors.find(v => v.id === id);
      await vendorService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        // Optimistic removal + server refresh
        setVendors(prev => prev.filter(v => v.id !== id));
        await loadVendorsFromApi();
      }
      logActivity('Vendor Removed', vendor?.name || id, USE_MOCK ? 'Moved to trash' : 'Soft-deleted from MongoDB');
      addToast({ type: 'warning', title: 'Vendor Removed', message: `${vendor?.name || 'Vendor'} has been removed` });
    } catch (err) {
      console.error('[CRM] deleteVendor failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || 'Could not delete vendor' });
      throw err;
    }
  };

  // -------------------------------------------------------------
  // BROKERS
  // -------------------------------------------------------------
  const addBroker = async (data) => {
    try {
      const result = await brokerService.create(data);
      const created = result?.data ?? result;
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadBrokersFromApi();
      }
      logActivity('Broker Added', created.name, `Firm: ${created.companyName || 'Independent'}`);
      addToast({ type: 'success', title: 'Broker Created', message: `${created.name} added successfully` });
      return created;
    } catch (err) {
      console.error('[CRM] addBroker failed:', err);
      addToast({ type: 'error', title: 'Add Failed', message: err?.response?.data?.message || 'Could not add broker' });
      throw err;
    }
  };

  const updateBroker = async (id, data) => {
    try {
      const result = await brokerService.update(id, data);
      const updated = result?.data ?? result;
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadBrokersFromApi();
      }
      logActivity('Broker Updated', updated.name, 'Updated broker profile');
      addToast({ type: 'success', title: 'Broker Updated', message: `${updated.name} has been updated` });
      return updated;
    } catch (err) {
      console.error('[CRM] updateBroker failed:', err);
      addToast({ type: 'error', title: 'Update Failed', message: err?.response?.data?.message || 'Could not update broker' });
      throw err;
    }
  };

  const deleteBroker = async (id) => {
    try {
      const broker = brokers.find(b => b.id === id);
      await brokerService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        setBrokers(prev => prev.filter(b => b.id !== id));
        await loadBrokersFromApi();
      }
      logActivity('Broker Removed', broker?.name || id, USE_MOCK ? 'Moved to trash' : 'Soft-deleted from MongoDB');
      addToast({ type: 'warning', title: 'Broker Removed', message: `${broker?.name || 'Broker'} has been removed` });
    } catch (err) {
      console.error('[CRM] deleteBroker failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || 'Could not delete broker' });
      throw err;
    }
  };

  // -------------------------------------------------------------
  // PROPERTIES
  // -------------------------------------------------------------
  const addProperty = async (data) => {
    try {
      const created = await propertyService.create(data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadPropertiesFromApi();
      }
      logActivity('Property Added', created.title, `Added property at ${created.area || created.locality || ''}, ${created.city}`);
      addToast({ type: 'success', title: 'Property Created', message: `${created.title} added successfully` });
      return created;
    } catch (err) {
      console.error('[CRM] addProperty failed:', err);
      addToast({ type: 'error', title: 'Failed to Add Property', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const updateProperty = async (id, data) => {
    try {
      const updated = await propertyService.update(id, data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadPropertiesFromApi();
      }
      logActivity('Property Updated', updated.title, `Updated property details`);
      addToast({ type: 'success', title: 'Property Updated', message: `${updated.title} has been updated` });
      return updated;
    } catch (err) {
      console.error('[CRM] updateProperty failed:', err);
      addToast({ type: 'error', title: 'Update Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      const prop = properties.find(p => p.id === id);
      await propertyService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        setProperties(prev => prev.filter(p => p.id !== id));
        await loadPropertiesFromApi();
      }
      logActivity('Property Moved to Trash', prop?.title || id, 'Soft deleted property');
      addToast({ type: 'warning', title: 'Moved to Trash', message: 'Property moved to trash' });
    } catch (err) {
      console.error('[CRM] deleteProperty failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const duplicateProperty = async (id) => {
    const duplicated = await propertyService.duplicate(id);
    if (USE_MOCK) {
      refreshAllState();
    } else {
      await loadPropertiesFromApi();
    }
    logActivity('Property Duplicated', duplicated.title, 'Created duplicate property listing');
    addToast({ type: 'success', title: 'Duplicated', message: `Created copy: ${duplicated.title}` });
    return duplicated;
  };

  // -------------------------------------------------------------
  // LEADS & LEAD CONVERSION
  // -------------------------------------------------------------
  const addLead = async (data) => {
    try {
      const created = await leadService.create(data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadLeadsFromApi();
        await loadClientsFromApi(); // In case client auto-created
      }
      logActivity('Lead Created', created.name, `Requirement: ${created.requirement}`);
      addToast({ type: 'success', title: 'Lead Added', message: `Lead for ${created.name} registered` });
      return created;
    } catch (err) {
      console.error('[CRM] addLead failed:', err);
      addToast({ type: 'error', title: 'Lead Creation Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const updateLead = async (id, data) => {
    try {
      const updated = await leadService.update(id, data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadLeadsFromApi();
      }
      logActivity('Lead Updated', updated.name, `Status: ${updated.status}`);
      addToast({ type: 'success', title: 'Lead Updated', message: `Lead ${updated.name} updated` });
      return updated;
    } catch (err) {
      console.error('[CRM] updateLead failed:', err);
      addToast({ type: 'error', title: 'Update Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      const lead = leads.find(l => l.id === id);
      await leadService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        setLeads(prev => prev.filter(l => l.id !== id));
        await loadLeadsFromApi();
      }
      logActivity('Lead Moved to Trash', lead?.name || id, 'Soft deleted lead');
      addToast({ type: 'warning', title: 'Moved to Trash', message: 'Lead moved to trash' });
    } catch (err) {
      console.error('[CRM] deleteLead failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const convertLeadToClient = async (leadId, customNotes) => {
    const newClient = await leadService.convertToClient(leadId, customNotes);
    if (USE_MOCK) {
      refreshAllState();
    } else {
      await loadLeadsFromApi();
      await loadClientsFromApi();
    }
    logActivity('Lead Converted', `${newClient.name} (Client ${newClient.id})`, 'Successfully converted lead into active client');
    addToast({ type: 'success', title: 'Lead Converted!', message: `${newClient.name} is now an active Client` });
    return newClient;
  };

  // -------------------------------------------------------------
  // CLIENTS
  // -------------------------------------------------------------
  const addClient = async (data) => {
    try {
      const created = await clientService.create(data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadClientsFromApi();
      }
      logActivity('Client Added', created.name, `Budget: ₹${created.budget}`);
      addToast({ type: 'success', title: 'Client Created', message: `Client ${created.name} registered` });
      return created;
    } catch (err) {
      console.error('[CRM] addClient failed:', err);
      addToast({ type: 'error', title: 'Client Add Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const updateClient = async (id, data) => {
    try {
      const updated = await clientService.update(id, data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadClientsFromApi();
      }
      logActivity('Client Updated', updated.name, 'Updated client profile');
      addToast({ type: 'success', title: 'Client Updated', message: `Client ${updated.name} updated` });
      return updated;
    } catch (err) {
      console.error('[CRM] updateClient failed:', err);
      addToast({ type: 'error', title: 'Update Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      const c = clients.find(cl => cl.id === id);
      await clientService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        setClients(prev => prev.filter(cl => cl.id !== id));
        await loadClientsFromApi();
      }
      logActivity('Client Moved to Trash', c?.name || id, 'Soft deleted client record');
      addToast({ type: 'warning', title: 'Moved to Trash', message: 'Client moved to trash' });
    } catch (err) {
      console.error('[CRM] deleteClient failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  // -------------------------------------------------------------
  // DEALS
  // -------------------------------------------------------------
  const addDeal = async (data) => {
    const created = await dealService.create(data);
    refreshAllState();
    logActivity('Deal Created', created.dealTitle, `Stage: ${created.stage}, Value: ₹${created.finalValue || created.expectedValue}`);
    addToast({ type: 'success', title: 'Deal Initiated', message: `Deal ${created.dealTitle} created` });
    return created;
  };

  const updateDeal = async (id, data) => {
    const updated = await dealService.update(id, data);
    refreshAllState();
    logActivity('Deal Updated', updated.dealTitle, `Stage: ${updated.stage}`);
    addToast({ type: 'success', title: 'Deal Updated', message: `Deal updated` });
    return updated;
  };

  const updateDealStage = async (id, newStage) => {
    const updated = await dealService.updateStage(id, newStage);
    refreshAllState();
    logActivity('Deal Stage Changed', updated.dealTitle, `Moved to ${newStage}`);
    addToast({ type: 'info', title: 'Stage Updated', message: `Deal moved to ${newStage}` });
    return updated;
  };

  const deleteDeal = async (id) => {
    const d = deals.find(dl => dl.id === id);
    await dealService.delete(id);
    refreshAllState();
    logActivity('Deal Moved to Trash', d?.dealTitle || id, 'Soft deleted deal');
    addToast({ type: 'warning', title: 'Moved to Trash', message: 'Deal moved to trash' });
  };

  // -------------------------------------------------------------
  // BOOKINGS & INVENTORY CASCADE
  // -------------------------------------------------------------
  const addBooking = async (data) => {
    try {
      const created = await bookingService.create(data);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadBookingsFromApi();
        await loadClientsFromApi();
      }
      logActivity('Booking Allotted', `${created.bookingNumber || 'New'} - ${created.clientName}`, `Unit: ${created.unitNumber || 'A-101'}, Value: ₹${created.totalAgreementValue || 0}`);
      addToast({ type: 'success', title: 'Booking Confirmed!', message: `${created.bookingNumber || 'Booking'} registered for ${created.clientName}` });
      return created;
    } catch (err) {
      console.error('[CRM] addBooking failed:', err);
      addToast({ type: 'error', title: 'Booking Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const cancelBooking = async (id) => {
    try {
      const booking = bookings.find(b => b.id === id);
      await bookingService.cancelBooking(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        await loadBookingsFromApi();
      }
      logActivity('Booking Cancelled', booking?.bookingNumber || id, 'Released unit back into available inventory');
      addToast({ type: 'warning', title: 'Booking Cancelled', message: 'Booking cancelled & unit released' });
    } catch (err) {
      console.error('[CRM] cancelBooking failed:', err);
      addToast({ type: 'error', title: 'Cancel Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  const deleteBooking = async (id) => {
    try {
      const booking = bookings.find(b => b.id === id);
      await bookingService.delete(id);
      if (USE_MOCK) {
        refreshAllState();
      } else {
        setBookings(prev => prev.filter(b => b.id !== id));
        await loadBookingsFromApi();
      }
      logActivity('Booking Moved to Trash', booking?.bookingNumber || id, 'Soft deleted booking record');
      addToast({ type: 'warning', title: 'Moved to Trash', message: 'Booking moved to trash' });
    } catch (err) {
      console.error('[CRM] deleteBooking failed:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: err?.response?.data?.message || err.message });
      throw err;
    }
  };

  // -------------------------------------------------------------
  // PAYMENTS & LEDGER
  // -------------------------------------------------------------
  const addPayment = async (data) => {
    const created = await paymentService.create(data);
    refreshAllState();
    logActivity('Payment Received', `${created.receiptNumber} - ₹${created.amount}`, `Client: ${created.clientName}`);
    addToast({ type: 'success', title: 'Payment Recorded', message: `Receipt ${created.receiptNumber} recorded` });
    return created;
  };

  const deletePayment = async (id) => {
    const pay = payments.find(p => p.id === id);
    await paymentService.delete(id);
    refreshAllState();
    logActivity('Payment Moved to Trash', pay?.receiptNumber || id, 'Soft deleted payment');
    addToast({ type: 'warning', title: 'Moved to Trash', message: 'Payment moved to trash' });
  };

  // -------------------------------------------------------------
  // COMMISSIONS
  // -------------------------------------------------------------
  const recordCommissionPayment = async (id, paidAmount) => {
    const updated = await commissionService.markPaid(id, paidAmount);
    refreshAllState();
    logActivity('Commission Paid', `${updated.brokerName} - ₹${paidAmount}`, `Pending: ₹${updated.pendingAmount}`);
    addToast({ type: 'success', title: 'Commission Disbursed', message: `₹${paidAmount} paid to ${updated.brokerName}` });
    return updated;
  };

  // -------------------------------------------------------------
  // FOLLOW-UPS
  // -------------------------------------------------------------
  const addFollowUp = async (data) => {
    const created = await followUpService.create(data);
    refreshAllState();
    logActivity('Follow-Up Scheduled', `${created.type} with ${created.leadName || created.clientName}`, `Due: ${created.dueDate}`);
    addToast({ type: 'success', title: 'Follow-Up Scheduled', message: `Scheduled for ${created.dueDate}` });
    return created;
  };

  const completeFollowUp = async (id) => {
    const updated = await followUpService.completeFollowUp(id);
    refreshAllState();
    logActivity('Follow-Up Completed', `${updated.type} with ${updated.leadName || updated.clientName}`, 'Marked completed');
    addToast({ type: 'success', title: 'Completed', message: 'Follow-up marked completed' });
  };

  const rescheduleFollowUp = async (id, date, time) => {
    const updated = await followUpService.reschedule(id, date, time);
    refreshAllState();
    logActivity('Follow-Up Rescheduled', `${updated.type}`, `Rescheduled to ${date} at ${time}`);
    addToast({ type: 'info', title: 'Rescheduled', message: `Follow-up moved to ${date}` });
  };

  const deleteFollowUp = async (id) => {
    await followUpService.delete(id);
    refreshAllState();
    addToast({ type: 'warning', title: 'Moved to Trash', message: 'Follow-up moved to trash' });
  };

  // -------------------------------------------------------------
  // SITE VISITS & APPOINTMENTS (AUTOMATIC SYNC)
  // -------------------------------------------------------------
  const addSiteVisit = async (data) => {
    const created = await siteVisitService.create(data);
    refreshAllState();
    logActivity('Site Visit Booked', `${created.propertyTitle} with ${created.clientName || created.leadName}`, `Scheduled on ${created.date} at ${created.time}`);
    addToast({ type: 'success', title: 'Site Visit Booked', message: `Visit scheduled and added to appointments` });
    return created;
  };

  const updateSiteVisit = async (id, data) => {
    const updated = await siteVisitService.update(id, data);
    refreshAllState();
    logActivity('Site Visit Updated', updated.propertyTitle, `Status: ${updated.status}`);
    addToast({ type: 'success', title: 'Site Visit Updated', message: `Visit status: ${updated.status}` });
    return updated;
  };

  const deleteSiteVisit = async (id) => {
    await siteVisitService.delete(id);
    refreshAllState();
    addToast({ type: 'warning', title: 'Moved to Trash', message: 'Site visit moved to trash' });
  };

  // -------------------------------------------------------------
  // TENANCIES & ARREARS
  // -------------------------------------------------------------
  const addTenancy = async (data) => {
    const created = await tenancyService.create(data);
    refreshAllState();
    logActivity('Tenancy Created', `${created.tenantName} - ${created.propertyName}`, `Rent: ₹${created.monthlyRent}/mo`);
    addToast({ type: 'success', title: 'Tenancy Added', message: `Lease created for ${created.tenantName}` });
    return created;
  };

  const recordRentPayment = async (id, amount) => {
    const updated = await tenancyService.recordRentPayment(id, amount);
    refreshAllState();
    logActivity('Rent Payment Recorded', `${updated.tenantName} - ₹${amount}`, `Arrears remaining: ₹${updated.arrearsAmount}`);
    addToast({ type: 'success', title: 'Rent Received', message: `₹${amount} recorded for ${updated.tenantName}` });
    return updated;
  };

  // -------------------------------------------------------------
  // INVENTORY & UNITS
  // -------------------------------------------------------------
  const updateUnitStatus = async (unitId, newStatus) => {
    const updated = await inventoryService.updateUnitStatus(unitId, newStatus);
    refreshAllState();
    logActivity('Unit Status Changed', `Unit ${updated.unitNumber}`, `Status changed to ${newStatus}`);
    addToast({ type: 'info', title: 'Unit Status Updated', message: `Unit ${updated.unitNumber} marked ${newStatus}` });
    return updated;
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  const markNotificationRead = (id) => {
    const list = getEntityList('notifications');
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    setEntityList('notifications', updated);
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const list = getEntityList('notifications');
    const updated = list.map(n => ({ ...n, read: true }));
    setEntityList('notifications', updated);
    setNotifications(updated);
    addToast({ type: 'info', title: 'Notifications', message: 'All marked as read' });
  };

  const resetAllData = () => {
    resetAllStorage();
    refreshAllState();
    addToast({ type: 'info', title: 'System Reset', message: 'Storage reset to fresh Sahara mock data' });
  };

  return (
    <CrmContext.Provider
      value={{
        properties,
        projects,
        buildings,
        floors,
        units,
        vendors,
        brokers,
        leads,
        clients,
        followUps,
        siteVisits,
        appointments,
        deals,
        bookings,
        payments,
        commissions,
        tenancies,
        agreements,
        locations,
        amenities,
        users,
        roles,
        notifications,
        activities,
        trash,
        vendorsLoading,
        // API loaders
        loadVendorsFromApi,
        loadBrokersFromApi,
        loadPropertiesFromApi,
        loadLeadsFromApi,
        loadClientsFromApi,
        loadBookingsFromApi,
        // Actions
        addVendor,
        updateVendor,
        deleteVendor,
        addBroker,
        updateBroker,
        deleteBroker,
        addProperty,
        updateProperty,
        deleteProperty,
        duplicateProperty,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToClient,
        addClient,
        updateClient,
        deleteClient,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addBooking,
        cancelBooking,
        deleteBooking,
        addPayment,
        deletePayment,
        recordCommissionPayment,
        addFollowUp,
        completeFollowUp,
        rescheduleFollowUp,
        deleteFollowUp,
        addSiteVisit,
        updateSiteVisit,
        deleteSiteVisit,
        addTenancy,
        recordRentPayment,
        updateUnitStatus,
        restoreFromTrash,
        permanentlyDeleteFromTrash,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
        logActivity
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export const useCrm = () => useContext(CrmContext);
