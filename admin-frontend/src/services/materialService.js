import { request } from './api';

export const materialService = {
  getAll: async () => {
    return request('/playmaterial', 'GET');
  },

  getById: async (id) => {
    return request(`/playmaterial/${id}`, 'GET');
  },

  create: async (materialData) => {
    return request('/playmaterial', 'POST', materialData);
  },

  update: async (id, materialData) => {
    return request(`/playmaterial/${id}`, 'PUT', materialData);
  },

  delete: async (id) => {
    return request(`/playmaterial/${id}`, 'DELETE');
  },
};