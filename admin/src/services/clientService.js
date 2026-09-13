import { createCrudService } from './baseService.js';

const base = createCrudService('clients', '/clients');

export const clientService = {
  ...base
};

export default clientService;
