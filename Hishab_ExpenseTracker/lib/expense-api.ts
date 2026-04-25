import api from './axios';

export const expenseApi = {
  getExpenses: async (params?: {
    type?: 'personal' | 'group';
    context_id?: string;
  }) => {
    const res = await api.get('/expenses', { params });
    const data = res.data;
    return Array.isArray(data)
      ? data
      : data?.data ?? data?.expenses ?? [];
  },

  createExpense: async (data: {
    amount: number;
    category_id?: string;
    category?: string;
    note?: string;
    date?: string;
    context_id?: string;
  }) => {
    const res = await api.post('/expenses', data);
    return res.data;
  },

  getExpense: async (id: string) => {
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },

  updateExpense: async (id: string, data: any) => {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data;
  },

  deleteExpense: async (id: string) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  settleExpense: async (id: string, data?: any) => {
    const res = await api.patch(`/expenses/${id}/settle`, data);
    return res.data;
  },

  getCategories: async (params?: any) => {
    const res = await api.get('/categories', { params });
    const data = res.data;
    return Array.isArray(data) ? data : data?.data ?? data?.categories ?? [];
  },

  createCategory: async (data: { name: string; context_id?: string }) => {
    const res = await api.post('/categories', data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};