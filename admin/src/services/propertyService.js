import { createCrudService } from './baseService.js';

const base = createCrudService('properties', '/crm/properties');

export const propertyService = {
  ...base,

  async filterProperties({ type, category, status, locality, minPrice, maxPrice, bedrooms }) {
    const list = await base.getAll();
    return list.filter(item => {
      if (type && item.type !== type) return false;
      if (category && item.category !== category) return false;
      if (status && item.status !== status) return false;
      if (locality && item.area !== locality && item.locality !== locality) return false;
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;
      if (bedrooms && item.bedrooms !== Number(bedrooms)) return false;
      return true;
    });
  },

  async duplicate(id) {
    const original = await base.getById(id);
    if (!original) return null;
    const duplicated = {
      ...original,
      id: `prop-${Date.now()}`,
      title: `${original.title} (Copy)`,
      code: `${original.code}-COPY`,
      createdAt: new Date().toLocaleDateString('en-GB'),
      viewsCount: 0,
      inquiryCount: 0
    };
    return base.create(duplicated);
  }
};

export default propertyService;
