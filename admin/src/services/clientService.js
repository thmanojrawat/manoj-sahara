import { createCrudService } from './baseService.js';

const base = createCrudService('clients', '/crm/clients');

export const clientService = {
  ...base
};

export default clientService;
