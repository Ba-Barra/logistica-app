import axios from 'axios';

// Creamos una instancia de conexión con la dirección de tu backend
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export default api;