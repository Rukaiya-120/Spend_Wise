import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              Accept: 'application/json',
            },
          }
        );

        const newToken =
          refreshRes.data?.access_token || refreshRes.data?.token;

        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export default api;