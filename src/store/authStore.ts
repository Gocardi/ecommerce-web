import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest, RegisterRequest } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (data: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  
  // Helpers
  isAdmin: () => boolean;
  isAffiliate: () => boolean;
  getDisplayName: () => string;
  getRoleLabel: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', data);
          
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

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', {
            ...data,
            role: 'afiliado', // Por defecto los registros son afiliados
          });
          
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
        
        // Opcional: notificar al backend
        api.post('/auth/logout').catch(() => {});
        
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

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await api.patch('/auth/profile', data);
          if (response.data.success) {
            set({ user: response.data.data });
            toast.success('Perfil actualizado correctamente');
            return true;
          }
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al actualizar perfil';
          toast.error(message);
          return false;
        }
      },

      // Helper functions
      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin' || user?.role === 'admin_general';
      },

      isAffiliate: () => {
        const user = get().user;
        return user?.role === 'afiliado';
      },

      getDisplayName: () => {
        const user = get().user;
        if (!user) return 'Invitado';
        return user.fullName || user.email;
      },

      getRoleLabel: () => {
        const user = get().user;
        if (!user) return 'Visitante';
        
        const roleLabels = {
          visitante: 'Visitante',
          afiliado: 'Afiliado',
          admin: 'Administrador',
          admin_general: 'Admin General',
          repartidor: 'Repartidor',
        };
        
        return roleLabels[user.role] || 'Usuario';
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