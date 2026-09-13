import { createCrudService } from './baseService.js';

const base = createCrudService('vendors', '/vendors');

export const vendorService = {
  ...base
};

export default vendorService;
