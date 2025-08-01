import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';



let logoutFn = null;

export const setLogoutHandler = (fn) => {
  logoutFn = fn;
};


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (logoutFn) logoutFn(); // dispara o logout do contexto
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);


export default api;