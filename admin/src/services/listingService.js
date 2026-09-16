import { createCrudService } from './baseService.js';

const base = createCrudService('listings', '/crm/listings');

export const listingService = {
  ...base,
};

export default listingService;
