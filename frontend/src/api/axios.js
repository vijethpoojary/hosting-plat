import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
