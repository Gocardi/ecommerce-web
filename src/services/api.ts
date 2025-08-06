import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor para logging y manejo de tokens
api.interceptors.request.use(
  (config) => {
    // Log de requests en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    // Agregar token de autorización si existe
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        if (parsedData.state?.token) {
          config.headers.Authorization = `Bearer ${parsedData.state.token}`;
        }
      } catch (error) {
        console.warn('Error parsing auth data from localStorage:', error);
      }
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejo de errores y logging
api.interceptors.response.use(
  (response) => {
    // Log de responses exitosas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log de errores
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Manejo específico de errores
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth-storage');
      
      // Solo redirigir si no estamos ya en login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Si es un error de red, mostrar mensaje más amigable
    if (error.code === 'ECONNABORTED') {
      error.message = 'La solicitud tardó demasiado tiempo. Verifica tu conexión.';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Error de conexión. Verifica que el servidor esté funcionando.';
    }

    return Promise.reject(error);
  }
);

// Re-export from lib/api for backwards compatibility
export { api as default } from '@/lib/api';