import api from './axios';

export const budgetApi = {
  getBudgets: async (params?: any) => {
    try {
      const res = await api.get('/auth/budgets', { params });
      return res.data;
    } catch (error: any) {
      console.error('Budget GET failed:', error.response?.data || error);

      return [];
    }
  },

  createBudget: async (data: any) => {
    const res = await api.post('/auth/budgets', data);
    return res.data;
  },

  updateBudget: async (id: string, data: any) => {
    const res = await api.put(`/auth/budgets/${id}`, data);
    return res.data;
  },

  deleteBudget: async (id: string) => {
    const res = await api.delete(`/auth/budgets/${id}`);
    return res.data;
  },
};