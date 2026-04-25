import api from './axios';

export const balanceApi = {
  getSummary: async (params?: any) => {
    try {
      const res = await api.get('/balances/summary', { params });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        return { total_balance: 0, you_owe: 0, you_are_owed: 0, balances: [] };
      }
      throw error;
    }
  },

  recordSettlement: async (data: {
    amount: number;
    description?: string;
    context_id?: string;
  }) => {
    const res = await api.post('/balances/settlements', data);
    return res.data;
  },

  getSettlementHistory: async (params?: any) => {
    const res = await api.get('/balances/settlements', { params });
    return res.data;
  },
};