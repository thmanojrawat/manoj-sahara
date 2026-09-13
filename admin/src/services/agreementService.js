import { createCrudService } from './baseService.js';

const base = createCrudService('agreements', '/agreements');

export const agreementService = {
  ...base
};

export default agreementService;
