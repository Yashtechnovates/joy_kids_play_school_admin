import { request } from './api';

export const studentService = {
  getAll: (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return request(`/students${queryParams ? `?${queryParams}` : ''}`, 'GET');
  },
  getById: (id) => request(`/students/${id}`, 'GET'),
  create: (data) => request('/students', 'POST', data),
  update: (id, data) => request(`/students/${id}`, 'PUT', data),
  delete: (id) => request(`/students/${id}`, 'DELETE'),
};