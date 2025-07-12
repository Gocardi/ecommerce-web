import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dni: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (dni: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { dni, password });
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success(`¡Bienvenido ${user.fullName}!`);
            return true;
          }
          
          toast.error(response.data.message || 'Error al iniciar sesión');
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', data);
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success('¡Registro exitoso! Bienvenido a Boost');
            return true;
          }
          
          toast.error(response.data.message || 'Error en el registro');
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error en el registro';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        toast.success('Sesión cerrada correctamente');
      },

      getProfile: async () => {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            set({ user: response.data.data });
          }
        } catch (error) {
          console.error('Error getting profile:', error);
          // Si hay error, probablemente el token expiró
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);