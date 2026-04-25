import api from './axios';

export const budgetApi = {
  getBudgets: async (params?: { context_id?: string; month?: number; year?: number }) => {
    try {
      const res = await api.get('/budgets', { params });
      const data = res.data;
      return Array.isArray(data)
        ? data
        : data?.data ?? data?.budgets ?? [];
    } catch (error: any) {
      console.error('Budget GET failed:', error.response?.data || error);
      return [];
    }
  },

  createBudget: async (data: {
    context_id: string;
    amount: number;
    month: number;
    year: number;
  }) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  updateBudget: async (id: string, data: {
    context_id?: string;
    amount?: number;
    month?: number;
    year?: number;
  }) => {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
  },

  deleteBudget: async (id: string) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
};