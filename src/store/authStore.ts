import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  maxReferrals?: number;
  createdAt: string;
  lastLogin?: string;
  affiliate?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (dni: string, password: string) => Promise<{ success: boolean }>;
  register: (userData: any) => Promise<void>;
  registerAffiliate: (affiliateData: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  clearError: () => void;
  getRoleLabel: () => string;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (dni: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { dni, password });
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Set auth header immediately
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Update state
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              isInitialized: true
            });
            
            // Set cookie for middleware (12 hours = 12 * 60 * 60 seconds)
            if (typeof window !== 'undefined') {
              const maxAge = 12 * 60 * 60; // 12 horas
              document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
            }
            
            // Toast message
            const roleMessages = {
              'admin_general': '🔧 Bienvenido Administrador General',
              'admin': '⚙️ Bienvenido Administrador',
              'afiliado': '⭐ Bienvenido Afiliado',
              'visitante': '👋 Bienvenido'
            };
            
            toast.success(`${roleMessages[user.role as keyof typeof roleMessages]} ${user.fullName}!`);
            
            return { success: true };
          } else {
            throw new Error(response.data.message || 'Error al iniciar sesión');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
            isInitialized: true
          });
          
          delete api.defaults.headers.common['Authorization'];
          // Clear cookie
          if (typeof window !== 'undefined') {
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
          toast.error(message);
          throw error;
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register/user', userData);
          
          if (response.data.success) {
            toast.success('✅ Registro exitoso. Ya puedes iniciar sesión.');
            set({ isLoading: false, error: null });
          } else {
            throw new Error(response.data.message || 'Error al registrarse');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al registrarse';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      registerAffiliate: async (affiliateData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register/affiliate', affiliateData);
          
          if (response.data.success) {
            const result = response.data.data;
            toast.success(`✅ Afiliado registrado. Contraseña temporal: ${result.user.tempPassword || 'Ver respuesta'}`, {
              duration: 8000
            });
            set({ isLoading: false, error: null });
            return result;
          } else {
            throw new Error(response.data.message || 'Error al registrar afiliado');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al registrar afiliado';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        
        // Clear cookie
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isInitialized: true
        });
        
        toast.success('👋 Sesión cerrada correctamente');
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) {
          set({ isInitialized: true });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            set({
              user: response.data.data,
              error: null,
              isAuthenticated: true,
              isInitialized: true
            });
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            get().logout();
          } else {
            set({ isInitialized: true });
          }
        }
      },

      updateProfile: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch('/auth/profile', data);
          
          if (response.data.success) {
            await get().refreshUser();
            toast.success('✅ Perfil actualizado correctamente');
            set({ isLoading: false, error: null });
            return true;
          } else {
            throw new Error(response.data.message || 'Error al actualizar perfil');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al actualizar perfil';
          set({ error: message, isLoading: false });
          toast.error(message);
          return false;
        }
      },

      clearError: () => set({ error: null }),

      getRoleLabel: () => {
        const { user } = get();
        if (!user) return 'Visitante';
        
        switch (user.role) {
          case 'afiliado': return 'Afiliado';
          case 'admin': return 'Administrador';
          case 'admin_general': return 'Administrador General';
          case 'visitante': 
          default: return 'Usuario';
        }
      },

      initializeAuth: () => {
        const { token, isInitialized } = get();
        
        if (isInitialized) return;
        
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Set cookie for middleware (12 hours)
          if (typeof window !== 'undefined') {
            const maxAge = 12 * 60 * 60; // 12 horas
            document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
          }
          get().refreshUser();
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          // Set cookie for middleware (12 hours)
          if (typeof window !== 'undefined') {
            const maxAge = 12 * 60 * 60; // 12 horas
            document.cookie = `auth-token=${state.token}; path=/; max-age=${maxAge}; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
          }
        }
      },
    }
  )
);

// Initialize auth when store is ready
if (typeof window !== 'undefined') {
  useAuthStore.persist.onFinishHydration(() => {
    const state = useAuthStore.getState();
    if (!state.isInitialized) {
      state.initializeAuth();
    }
  });
}