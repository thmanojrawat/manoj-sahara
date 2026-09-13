import { createCrudService } from './baseService.js';

const base = createCrudService('amenities', '/amenities');

export const amenityService = {
  ...base
};

export default amenityService;
