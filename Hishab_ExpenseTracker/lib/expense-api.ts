import api from './axios';

export const expenseApi = {
  // Expenses CRUD
  getExpenses: async (params?: any) => {
    const res = await api.get('/auth/expenses', { params });
    return res.data;
  },

  createExpense: async (data: {
    amount: number;
    category: string;
    note?: string;
    date?: string;
    context_id?: string;
  }) => {
    const res = await api.post('/auth/expenses', data);
    return res.data;
  },

  getExpense: async (id: string) => {
    const res = await api.get(`/auth/expenses/${id}`);
    return res.data;
  },

  updateExpense: async (id: string, data: any) => {
    const res = await api.put(`/auth/expenses/${id}`, data);
    return res.data;
  },

  deleteExpense: async (id: string) => {
    const res = await api.delete(`/auth/expenses/${id}`);
    return res.data;
  },

  settleExpense: async (id: string, data?: any) => {
    const res = await api.patch(`/auth/expenses/${id}/settle`, data);
    return res.data;
  },

  // Categories
  getCategories: async (params?: any) => {
    const res = await api.get('/auth/categories', { params });
    return res.data;
  },

  createCategory: async (data: { name: string; context_id?: string }) => {
    const res = await api.post('/auth/categories', data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/auth/categories/${id}`);
    return res.data;
  },
};