import { apiClient, USE_MOCK } from './api.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

export function createCrudService(entityKey, endpoint) {
  return {
    async getAll() {
      if (!USE_MOCK) {
        const response = await apiClient.get(endpoint);
        return response.data;
      }
      return getEntityList(entityKey);
    },

    async getById(id) {
      if (!USE_MOCK) {
        const response = await apiClient.get(`${endpoint}/${id}`);
        return response.data;
      }
      const list = getEntityList(entityKey);
      return list.find(item => item.id === id) || null;
    },

    async create(data) {
      if (!USE_MOCK) {
        const response = await apiClient.post(endpoint, data);
        return response.data;
      }
      const list = getEntityList(entityKey);
      const newItem = {
        id: data.id || `${entityKey.slice(0, 3)}-${Date.now()}`,
        ...data,
        createdAt: data.createdAt || new Date().toISOString().slice(0, 10)
      };
      const updated = [newItem, ...list];
      setEntityList(entityKey, updated);
      return newItem;
    },

    async update(id, data) {
      if (!USE_MOCK) {
        const response = await apiClient.put(`${endpoint}/${id}`, data);
        return response.data;
      }
      const list = getEntityList(entityKey);
      let updatedItem = null;
      const updated = list.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, ...data, updatedAt: new Date().toISOString() };
          return updatedItem;
        }
        return item;
      });
      setEntityList(entityKey, updated);
      return updatedItem;
    },

    async delete(id) {
      if (!USE_MOCK) {
        const response = await apiClient.delete(`${endpoint}/${id}`);
        return response.data;
      }
      const list = getEntityList(entityKey);
      const target = list.find(item => item.id === id);
      if (!target) return false;

      // Filter out of current entity list
      const remaining = list.filter(item => item.id !== id);
      setEntityList(entityKey, remaining);

      // Move to Trash
      const trash = getEntityList('trash');
      const trashItem = {
        trashId: `tr-${Date.now()}`,
        originalEntity: entityKey,
        originalId: id,
        title: target.title || target.name || target.unitNumber || target.bookingNumber || target.receiptNumber || id,
        data: target,
        deletedAt: new Date().toISOString()
      };
      setEntityList('trash', [trashItem, ...trash]);

      return true;
    }
  };
}
