import { createCrudService } from './baseService.js';

const base = createCrudService('brokers', '/crm/brokers');

export const brokerService = {
  ...base
};

export default brokerService;
