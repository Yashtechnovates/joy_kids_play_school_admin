// import { request } from './api';

// export const reportService = {
//   getAll: async (filters = {}) => {
//     const queryParams = new URLSearchParams(filters).toString();
//     // CHANGE FROM /reports TO /dailyreports
//     const endpoint = `/dailyreports${queryParams ? `?${queryParams}` : ''}`;
//     return request(endpoint, 'GET');
//   },

//   getById: async (id) => {
//     // CHANGE FROM /reports TO /dailyreports
//     return request(`/dailyreports/${id}`, 'GET');
//   },

//   create: async (reportData) => {
//     // CHANGE FROM /reports TO /dailyreports
//     return request('/dailyreports', 'POST', reportData);
//   },

//   update: async (id, reportData) => {
//     // CHANGE FROM /reports TO /dailyreports
//     return request(`/dailyreports/${id}`, 'PUT', reportData);
//   },

//   delete: async (id) => {
//     // CHANGE FROM /reports TO /dailyreports
//     return request(`/dailyreports/${id}`, 'DELETE');
//   },
// };

import { request } from './api';

export const reportService = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/dailyreports${queryParams ? `?${queryParams}` : ''}`;
    const response = await request(endpoint, 'GET');
    console.log('Admin API Response:', response);
    return response;
  },

  getById: async (id) => {
    return request(`/dailyreports/${id}`, 'GET');
  },

  create: async (reportData) => {
    console.log('Creating report with data:', reportData);
    return request('/dailyreports', 'POST', reportData);
  },

  update: async (id, reportData) => {
    console.log('Updating report with data:', reportData);
    return request(`/dailyreports/${id}`, 'PUT', reportData);
  },

  delete: async (id) => {
    return request(`/dailyreports/${id}`, 'DELETE');
  },
};