import { createCrudService } from './baseService.js';

const base = createCrudService('locations', '/locations');

export const locationService = {
  ...base
};

export default locationService;
