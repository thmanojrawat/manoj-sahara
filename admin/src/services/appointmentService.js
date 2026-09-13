import { createCrudService } from './baseService.js';

const base = createCrudService('appointments', '/appointments');

export const appointmentService = {
  ...base
};

export default appointmentService;
