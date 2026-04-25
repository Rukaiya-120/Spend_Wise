import api from './axios';

export const contextApi = {
  getContexts: async () => {
    const res = await api.get('/contexts');
    const data = res.data;
    // Normalize: backend may return { data: [...] } or plain array
    return Array.isArray(data)
      ? data
      : data?.data ?? data?.contexts ?? [];
  },

  getContext: async (contextId: string) => {
    const res = await api.get(`/contexts/${contextId}`);
    return res.data;
  },

  createGroup: async (data: { name: string; description?: string }) => {
    const res = await api.post('/contexts/groups', data);
    return res.data;
  },

  joinGroup: async (inviteCode: string) => {
    const res = await api.post('/contexts/join', { invite_code: inviteCode });
    return res.data;
  },

  approveMember: async (contextId: string, userId: string) => {
    const res = await api.post(`/contexts/${contextId}/approve/${userId}`);
    return res.data;
  },

  removeMember: async (contextId: string, userId: string) => {
    const res = await api.delete(`/contexts/${contextId}/members/${userId}`);
    return res.data;
  },

  revokeInviteCode: async (contextId: string) => {
    const res = await api.post(`/contexts/${contextId}/revoke-invite`);
    return res.data;
  },

  transferAdmin: async (contextId: string, userId: string) => {
    const res = await api.post(`/contexts/${contextId}/transfer-admin`, {
      user_id: userId,
    });
    return res.data;
  },
};