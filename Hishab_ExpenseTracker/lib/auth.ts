import api from './axios';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

  
    const data = res.data;

    const accessToken = data?.access_token || data?.token;
    const user = data?.user;

    if (!accessToken) {
      throw new Error('Login failed: No access token received');
    }

    return {
      access_token: accessToken,
      user,
    };
  },

  register: async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    const data = res.data;

    const accessToken = data?.access_token || data?.token;
    const user = data?.user;

    if (!accessToken) {
      throw new Error('Register failed: No access token received');
    }

    return {
      access_token: accessToken,
      user,
    };
  },

  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
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
};