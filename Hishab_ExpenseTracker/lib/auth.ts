import api from "./axios";


export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    // Store token + user
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    const data = response.data;

    // Store token + user (same as login)
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },
};