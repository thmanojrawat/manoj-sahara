import * as initialData from '../data/index.js';

const STORAGE_PREFIX = 'sahara_crm_';

/**
 * Entity keys mapped to their initial mock data arrays
 */
const ENTITY_DEFAULTS = {
  properties: initialData.mockProperties || [],
  projects: initialData.mockProjects || [],
  buildings: initialData.mockBuildings || [],
  floors: initialData.mockFloors || [],
  units: initialData.mockUnits || [],
  vendors: initialData.mockVendors || [],
  brokers: initialData.mockBrokers || [],
  leads: initialData.mockLeads || [],
  clients: initialData.mockClients || [],
  followUps: initialData.mockFollowUps || [],
  siteVisits: initialData.mockSiteVisits || [],
  appointments: initialData.mockAppointments || [],
  deals: initialData.mockDeals || [],
  bookings: initialData.mockBookings || [],
  payments: initialData.mockPayments || [],
  commissions: initialData.mockCommissions || [],
  tenancies: initialData.mockTenancies || [],
  agreements: initialData.mockAgreements || [],
  locations: initialData.mockLocations || [],
  amenities: initialData.mockAmenities || [],
  users: initialData.mockUsers || [],
  roles: initialData.mockRoles || [],
  notifications: initialData.mockNotifications || [],
  activities: initialData.mockActivities || [],
  trash: [] // Deleted items with metadata { id, originalEntity, data, deletedAt }
};

export function getEntityList(entityKey) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + entityKey);
    if (!raw) {
      const defaults = ENTITY_DEFAULTS[entityKey] || [];
      localStorage.setItem(STORAGE_PREFIX + entityKey, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${entityKey} from localStorage:`, err);
    return ENTITY_DEFAULTS[entityKey] || [];
  }
}

export function setEntityList(entityKey, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + entityKey, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${entityKey} to localStorage:`, err);
  }
}

export function resetAllStorage() {
  Object.keys(ENTITY_DEFAULTS).forEach(key => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(ENTITY_DEFAULTS[key]));
  });
}
