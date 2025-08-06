import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Order, Pagination, ShippingAddress } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: (filters?: any) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (data: any) => Promise<Order>;
  confirmPayment: (orderId: number, paymentData: any) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/orders/my-orders?${params.toString()}`);
      if (response.data.success) {
        set({ 
          orders: response.data.data.orders,
          pagination: response.data.data.pagination,
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

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/orders/${id}`);
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

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/orders', data);
      if (response.data.success) {
        toast.success('Pedido creado correctamente');
        set({ isLoading: false, error: null });
        return response.data.data;
      }
      throw new Error('Error creating order');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear pedido';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  confirmPayment: async (orderId, paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/payments/confirm', {
        orderId,
        ...paymentData
      });
      
      if (response.data.success) {
        toast.success('Pago confirmado correctamente');
        await get().fetchOrderById(orderId);
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al confirmar pago';
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
