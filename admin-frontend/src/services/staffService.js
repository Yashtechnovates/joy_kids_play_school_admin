import { request } from './api';

export const staffService = {
  // Get all staff
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/staff${queryParams ? `?${queryParams}` : ''}`;
    return request(endpoint, 'GET');
  },

  // Get single staff by ID
  getById: async (id) => {
    return request(`/staff/${id}`, 'GET');
  },

  // Create new staff
  create: async (staffData) => {
    return request('/staff', 'POST', staffData);
  },

  // Update staff
  update: async (id, staffData) => {
    return request(`/staff/${id}`, 'PUT', staffData);
  },

  // Delete staff
  delete: async (id) => {
    return request(`/staff/${id}`, 'DELETE');
  },
};