import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // If we are not already on onboarding, redirect
      if (window.location.pathname !== '/onboarding') {
        window.location.href = '/onboarding';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (idToken) => api.post('/auth/google-login', { idToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const routingService = {
  calculateRoute: (routeData) => api.post('/routing/calculate', routeData),
  getHistory: (limit) => api.get(`/routing/history?limit=${limit || 10}`),
};

export const discoveryService = {
  searchVendors: (params) => api.get('/discovery/search', { params }),
  getVendorDetails: (vendorId) => api.get(`/discovery/vendor/${vendorId}`),
  getRecommendations: () => api.get('/discovery/recommendations'),
  checkIn: (vendorId) => api.post('/discovery/checkin', { vendorId }),
};

export const crowdService = {
  predictCrowd: (data) => api.post('/crowd/predict', data),
  getLiveCrowd: () => api.get('/crowd/live'),
  optimizeItinerary: (desiredPOIs) => api.post('/crowd/optimize-itinerary', { desiredPOIs }),
};

export const gamificationService = {
  getDashboard: () => api.get('/gamification/dashboard'),
  getLeaderboard: (limit) => api.get(`/gamification/leaderboard?limit=${limit || 50}`),
  earnPoints: (data) => api.post('/gamification/earn-points', data),
  redeemPoints: (data) => api.post('/gamification/redeem', data),
};

export default api;
