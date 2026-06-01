import { request } from './api';

export const syllabusService = {
  // Get all syllabus (public - for User Panel)
  getAll: async () => {
    return request('/syllabus', 'GET');
  },

  // Get syllabus by grade (public)
  getByGrade: async (grade) => {
    return request(`/syllabus/grade/${grade}`, 'GET');
  },

  // Create new syllabus (Admin)
  create: async (syllabusData) => {
    return request('/syllabus', 'POST', syllabusData);
  },

  // Update syllabus (Admin)
  update: async (id, syllabusData) => {
    return request(`/syllabus/${id}`, 'PUT', syllabusData);
  },

  // Delete syllabus (Admin)
  delete: async (id) => {
    return request(`/syllabus/${id}`, 'DELETE');
  },
};