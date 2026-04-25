import api from './axios';

export const balanceApi = {
  getSummary: async (params?: any) => {
    try {
      const res = await api.get('/auth/balances/summary', { params });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.warn('Balance summary validation failed:', error.response.data);

        return {
          total_balance: 0,
          you_owe: 0,
          you_are_owed: 0,
          balances: [],
        };
      }

      throw error;
    }
  },

  recordSettlement: async (data: {
    amount: number;
    description?: string;
    context_id?: string;
  }) => {
    const res = await api.post('/auth/balances/settlements', data);
    return res.data;
  },

  getSettlementHistory: async (params?: any) => {
    const res = await api.get('/auth/balances/settlements', { params });
    return res.data;
  },
};