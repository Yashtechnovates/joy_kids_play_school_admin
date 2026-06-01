import { request } from './api';

export const eventService = {
  // Get all events
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/events${queryParams ? `?${queryParams}` : ''}`;
    const response = await request(endpoint, 'GET');
    console.log('eventService.getAll response:', response);
    return response;
  },

  // Get single event by ID
  getById: async (id) => {
    return request(`/events/${id}`, 'GET');
  },

  // Create new event
  create: async (eventData) => {
    return request('/events', 'POST', eventData);
  },

  // Update event
  update: async (id, eventData) => {
    return request(`/events/${id}`, 'PUT', eventData);
  },

  // Delete event
  delete: async (id) => {
    return request(`/events/${id}`, 'DELETE');
  },
};