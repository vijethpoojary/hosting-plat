import api from './axios';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = (page) => api.get('/admin/users', { params: { page } });
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminProducts = (page) => api.get('/admin/products', { params: { page } });
export const getContactLogs = (page) => api.get('/admin/contacts', { params: { page } });
