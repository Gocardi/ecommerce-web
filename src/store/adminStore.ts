import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { User, Order, Commission, Pagination } from '@/types';

interface AdminDashboard {
  kpis: {
    totalSales: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    activeAffiliates: number;
    totalUsers: number;
    pendingCommissions: number;
  };
  recentOrders: Order[];
  lowStockProducts: any[];
  pendingCommissionsCount: number;
  salesChart: any[];
  topProducts: any[];
}

interface AdminState {
  // Dashboard
  dashboard: AdminDashboard | null;
  
  // Users Management
  users: User[];
  usersPagination: Pagination | null;
  
  // Orders Management
  orders: Order[];
  ordersPagination: Pagination | null;
  currentOrder: Order | null;
  
  // Commissions Management
  commissions: Commission[];
  commissionsPagination: Pagination | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboard: () => Promise<void>;
  fetchUsers: (filters?: any) => Promise<void>;
  fetchOrders: (filters?: any) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  updateOrderStatus: (id: number, status: string, data?: any) => Promise<void>;
  fetchCommissions: (filters?: any) => Promise<void>;
  approveCommissions: (ids: number[]) => Promise<void>;
  toggleUserStatus: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  dashboard: null,
  users: [],
  usersPagination: null,
  orders: [],
  ordersPagination: null,
  currentOrder: null,
  commissions: [],
  commissionsPagination: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        set({
          dashboard: response.data.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener dashboard';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching admin dashboard:', error);
    }
  },

  fetchUsers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/users?${params.toString()}`);
      if (response.data.success) {
        set({
          users: response.data.data.users,
          usersPagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener usuarios';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching users:', error);
    }
  },

  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/orders?${params.toString()}`);
      if (response.data.success) {
        set({
          orders: response.data.data.orders,
          ordersPagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pedidos';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching orders:', error);
    }
  },

  fetchOrderById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/admin/orders/${id}`);
      if (response.data.success) {
        set({
          currentOrder: response.data.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pedido';
      set({ 
        error: message, 
        isLoading: false,
        currentOrder: null
      });
      console.error('Error fetching order:', error);
    }
  },

  updateOrderStatus: async (id: number, status: string, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/admin/orders/${id}`, {
        status,
        ...data
      });
      
      if (response.data.success) {
        toast.success('Estado del pedido actualizado');
        await get().fetchOrderById(id); // Refresh current order
        await get().fetchOrders(); // Refresh orders list
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar pedido';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  fetchCommissions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/admin/commissions?${params.toString()}`);
      if (response.data.success) {
        set({
          commissions: response.data.data.commissions,
          commissionsPagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener comisiones';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching commissions:', error);
    }
  },

  approveCommissions: async (ids: number[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/admin/commissions/approve', { ids });
      if (response.data.success) {
        toast.success(`${ids.length} comisiones aprobadas`);
        await get().fetchCommissions(); // Refresh commissions
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al aprobar comisiones';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  toggleUserStatus: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-status`);
      if (response.data.success) {
        toast.success('Estado del usuario actualizado');
        await get().fetchUsers(); // Refresh users list
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar usuario';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
