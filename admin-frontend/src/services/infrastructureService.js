import { request } from './api';

export const infrastructureService = {
  getAll: async () => {
    return request('/infrastructure', 'GET');
  },

  getById: async (id) => {
    return request(`/infrastructure/${id}`, 'GET');
  },

  create: async (facilityData) => {
    return request('/infrastructure', 'POST', facilityData);
  },

  update: async (id, facilityData) => {
    return request(`/infrastructure/${id}`, 'PUT', facilityData);
  },

  delete: async (id) => {
    return request(`/infrastructure/${id}`, 'DELETE');
  },
};