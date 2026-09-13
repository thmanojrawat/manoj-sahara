import { createCrudService } from './baseService.js';

const base = createCrudService('brokers', '/brokers');

export const brokerService = {
  ...base
};

export default brokerService;
