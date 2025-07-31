import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import api from '@/services/api';
import { User, LoginRequest, RegisterRequest, RegisterAffiliateRequest, RegisterAdminRequest } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  registerUser: (data: RegisterRequest) => Promise<boolean>;
  registerAffiliate: (data: RegisterAffiliateRequest) => Promise<boolean>;
  registerAdmin: (data: RegisterAdminRequest) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updateMaxReferrals: (affiliateId: number, maxReferrals: number) => Promise<boolean>;
  
  // Helper functions
  isAdmin: () => boolean;
  isAffiliate: () => boolean;
  canRegisterAffiliates: () => boolean;
  canRegisterAdmins: () => boolean;
  getDisplayName: () => string;
  getRoleLabel: () => string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          console.log('🔐 Intentando login con:', credentials.dni);
          const response = await api.post('/auth/login', credentials);
          
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
          console.error('❌ Error en login:', error.response?.data || error.message);
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      registerUser: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          console.log('📝 Intentando registrar usuario:', data.dni);
          const response = await api.post('/auth/register/user', data);
          
          if (response.data.success) {
            toast.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
            set({ isLoading: false });
            return true;
          }
          
          toast.error(response.data.message || 'Error en el registro');
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          console.error('❌ Error en registro:', error.response?.data || error.message);
          const message = error.response?.data?.message || 'Error en el registro';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      registerAffiliate: async (data: RegisterAffiliateRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register/affiliate', data);
          
          if (response.data.success) {
            toast.success('¡Afiliado registrado exitosamente!');
            set({ isLoading: false });
            return true;
          }
          
          toast.error(response.data.message || 'Error al registrar afiliado');
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al registrar afiliado';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      registerAdmin: async (data: RegisterAdminRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register/admin', data);
          
          if (response.data.success) {
            toast.success('¡Administrador registrado exitosamente!');
            set({ isLoading: false });
            return true;
          }
          
          toast.error(response.data.message || 'Error al registrar administrador');
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al registrar administrador';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      updateMaxReferrals: async (affiliateId: number, maxReferrals: number) => {
        try {
          const response = await api.put(`/auth/affiliates/${affiliateId}/max-referrals`, {
            maxReferrals
          });
          
          if (response.data.success) {
            toast.success('Límite de referidos actualizado');
            return true;
          }
          
          toast.error(response.data.message || 'Error al actualizar límite');
          return false;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al actualizar límite';
          toast.error(message);
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

      canRegisterAffiliates: () => {
        const user = get().user;
        return user?.role === 'afiliado' || user?.role === 'admin' || user?.role === 'admin_general';
      },

      canRegisterAdmins: () => {
        const user = get().user;
        return user?.role === 'admin_general';
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