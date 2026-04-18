import api from './axios';

export const rateOwner = (data) => api.post('/ratings', data);
export const getOwnerRatings = (ownerId) => api.get(`/ratings/owner/${ownerId}`);
export const getMyRating = (ownerId) => api.get(`/ratings/my-rating/${ownerId}`);
