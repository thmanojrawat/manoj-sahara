import { createCrudService } from './baseService.js';

// Endpoint: /api/crm/vendors  (apiClient baseURL is already set to VITE_BACKEND_URL = http://localhost:4000/api)
const base = createCrudService('vendors', '/crm/vendors');

export const vendorService = {
  ...base,
};

export default vendorService;
