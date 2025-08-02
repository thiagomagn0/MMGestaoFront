import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

  export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

const login = async (email, senha) => {
  try {
    const res = await api.post('/auth/login', { email, senha });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  } catch (err) {
    console.error('Erro no login:', err);
    throw err; // deixa o componente de login lidar com a exibição do erro
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};