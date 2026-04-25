import api from './axios';

export const authApi = {
  // Authentication
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    const accessToken = data?.access_token || data?.token;
    const user = data?.user;

    if (!accessToken) {
      throw new Error('Login failed: No access token received');
    }

    return { access_token: accessToken, user };
  },

  register: async (name: string, email: string, password: string, password_confirmation: string) => {
    const res = await api.post('/auth/register', { name, email, password, password_confirmation });
    const data = res.data;
    const accessToken = data?.access_token || data?.token;
    const user = data?.user;

    if (!accessToken) {
      throw new Error('Register failed: No access token received');
    }

    return { access_token: accessToken, user };
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  refresh: async () => {
    const res = await api.post('/auth/refresh');
    const token = res.data?.access_token || res.data?.token;

    if (!token) {
      throw new Error('Refresh failed: No token received');
    }

    return token;
  },

  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Profile
  updateProfile: async (data: any) => {
    const res = await api.patch('/auth/profile', data);
    return res.data;
  },

  // Password Reset
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { email: string; token: string; password: string; password_confirmation: string }) => {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },

  // Google OAuth
  googleRedirect: async () => {
    const res = await api.get('/auth/google/redirect');
    return res.data.redirect_url;
  },

  googleCallback: async (code: string) => {
    const res = await api.get('/auth/google/callback', { params: { code } });
    return res.data;
  },
};