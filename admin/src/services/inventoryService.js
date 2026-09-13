import { createCrudService } from './baseService.js';
import { getEntityList, setEntityList } from '../utils/storage.js';

const unitBase = createCrudService('units', '/inventory/units');
const buildingBase = createCrudService('buildings', '/inventory/buildings');
const floorBase = createCrudService('floors', '/inventory/floors');

export const inventoryService = {
  // Units
  getAllUnits: unitBase.getAll,
  getUnitById: unitBase.getById,
  createUnit: unitBase.create,
  updateUnit: unitBase.update,
  deleteUnit: unitBase.delete,

  // Status updates
  async updateUnitStatus(unitId, newStatus, clientId = null, bookingId = null) {
    return unitBase.update(unitId, { status: newStatus, clientId, bookingId });
  },

  // Buildings & Floors
  getAllBuildings: buildingBase.getAll,
  createBuilding: buildingBase.create,
  getAllFloors: floorBase.getAll,
  createFloor: floorBase.create
};

export default inventoryService;
