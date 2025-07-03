import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User related API calls
export const userAPI = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
  getCart: () => api.get('/user/cart'),
  addToCart: (productData) => api.post('/user/cart', productData),
};

// Admin related API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  createProduct: (productData) => api.post('/admin/product', productData),
  updateProduct: (id, productData) => api.put(`/admin/product/${id}`, productData),
  uploadNutrition: (nutritionData) => api.post('/admin/nutrition', nutritionData),
  createInventory: (inventoryData) => api.post('/admin/inventory', inventoryData),
  bulkAddInventory: (inventoryData) => api.post('/admin/inventory/bulk', inventoryData),
  updateInventory: (id, inventoryData) => api.put(`/admin/inventory/${id}`, inventoryData),
};

// AI related API calls
export const aiAPI = {
  getNutritionScore: (productData) => api.post('/ai/nutrition', productData),
  getPriceOptimization: (productData) => api.post('/ai/pricing', productData),
  getRecommendations: (userData) => api.post('/ai/recommend', userData),
};

export default api;