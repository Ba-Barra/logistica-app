import axios from 'axios';

// Lógica inteligente:
// 1. Busca si existe una variable de entorno definida por Vercel (VITE_API_URL).
// 2. Si no existe (estamos en local), usa localhost:3000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Agrega el token de seguridad a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;