import api from './axios';

export const rateOwner = (data) => api.post('/ratings', data);
export const getOwnerRatings = (ownerId) => api.get(`/ratings/owner/${ownerId}`);
export const getMyRating = (ownerId) => api.get(`/ratings/my-rating/${ownerId}`);
export const checkContactGate = (productId) => api.get(`/ratings/can-review/${productId}`);
