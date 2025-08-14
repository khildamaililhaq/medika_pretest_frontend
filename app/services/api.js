import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
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
    return Promise.reject(error);
  }
);

export const apiService = {
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

  returnBook: async (loanId) => {
    return apiService.patch(`/loans/${loanId}/return_book`);
  },

  markOverdue: async (loanId) => {
    return apiService.patch(`/loans/${loanId}/mark_overdue`);
  },

  getAvailableBooks: async (params = {}) => {
    return apiService.getAll('/books/available', params);
  },

  getOutOfStockBooks: async (params = {}) => {
    return apiService.getAll('/books/out_of_stock', params);
  },

  getBorrowersWithActiveLoans: async (params = {}) => {
    return apiService.getAll('/borrowers/with_active_loans', params);
  },

  getBorrowersWithoutActiveLoans: async (params = {}) => {
    return apiService.getAll('/borrowers/without_active_loans', params);
  },

  getActiveLoans: async (params = {}) => {
    return apiService.getAll('/loans/active', params);
  },

  getReturnedLoans: async (params = {}) => {
    return apiService.getAll('/loans/returned', params);
  },

  getOverdueLoans: async (params = {}) => {
    return apiService.getAll('/loans/overdue', params);
  },

  getLoansDueSoon: async (params = {}) => {
    return apiService.getAll('/loans/due_soon', params);
  },

  getLoansByBorrower: async (borrowerId, params = {}) => {
    return apiService.getAll(`/loans/by_borrower/${borrowerId}`, params);
  },

  getLoansByBook: async (bookId, params = {}) => {
    return apiService.getAll(`/loans/by_book/${bookId}`, params);
  },

  getBorrowerOverdueLoans: async (borrowerId) => {
    try {
      const response = await api.get(`/borrowers/${borrowerId}/overdue_loans`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminOverview: async (params = {}) => {
    try {
      const response = await api.get('/loans/admin_overview', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
