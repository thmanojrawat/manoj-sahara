import { createCrudService } from './baseService.js';

const base = createCrudService('followUps', '/follow-ups');

export const followUpService = {
  ...base,

  async completeFollowUp(id) {
    return base.update(id, {
      status: 'Completed',
      category: 'Completed',
      completedAt: new Date().toISOString()
    });
  },

  async reschedule(id, newDate, newTime) {
    return base.update(id, {
      dueDate: newDate,
      dueTime: newTime,
      category: 'Upcoming',
      status: 'Pending'
    });
  }
};

export default followUpService;
