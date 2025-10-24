import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const CLIENT_ID = process.env.CLIENT_ID || 'Aptt8Gz77Jc-R4x6wEMgF6z2VindtgAONBp4UsTDvOc';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'my885L3cwCVms_d1oWg3h8NPb6wftuBUF9lIga5QuA8';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables');
}

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('CLIENT_ID and CLIENT_SECRET must be defined in the environment variables');
}

// Create axios instances for API and authentication

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication endpoints
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', { user: userData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await authApi.post('/oauth/token/issue', {
        
        ...credentials,
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await authApi.post('/oauth/token/refresh', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: 'Aptt8Gz77Jc-R4x6wEMgF6z2VindtgAONBp4UsTDvOc',
        client_secret: 'my885L3cwCVms_d1oWg3h8NPb6wftuBUF9lIga5QuA8'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  revokeToken: async (token) => {
    try {
      const response = await authApi.post('/oauth/revoke', {
        token: token,
        client_id: 'Aptt8Gz77Jc-R4x6wEMgF6z2VindtgAONBp4UsTDvOc',
        client_secret: 'my885L3cwCVms_d1oWg3h8NPb6wftuBUF9lIga5QuA8'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Categories endpoints
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchCategories: async (query, params = {}) => {
    try {
      const searchParams = { ...params, q: { name_cont: query } };
      const response = await api.get('/categories', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Products endpoints
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', { product: productData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, { product: productData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportProducts: async (params = {}) => {
    try {
      const response = await api.get('/products/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async (endpoint, params = {}) => {
    try {
      const response = await api.get(endpoint, { params });
      const {data} = response.data;

      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw error;
    }
  },

  getById: async (endpoint, id) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (endpoint, data) => {
    try {
      let payload = data;

      if (endpoint.includes('/books')) {
        payload = { book: data };
      } else if (endpoint.includes('/borrowers')) {
        payload = { borrower: data };
      } else if (endpoint.includes('/loans')) {
        payload = { loan: data };
      } else if (endpoint.includes('/products')) {
        payload = { product: data };
      }

      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (endpoint, id, data) => {
    try {
      let payload = data;

      if (endpoint.includes('/books')) {
        payload = { book: data };
      } else if (endpoint.includes('/borrowers')) {
        payload = { borrower: data };
      } else if (endpoint.includes('/loans')) {
        payload = { loan: data };
      } else if (endpoint.includes('/products')) {
        payload = { product: data };
      }

      const response = await api.put(`${endpoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (endpoint, id) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  patch: async (endpoint, data = {}) => {
    try {
      const response = await api.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default api;
