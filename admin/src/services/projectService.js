import { createCrudService } from './baseService.js';

const base = createCrudService('projects', '/projects');

export const projectService = {
  ...base
};

export default projectService;
