import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { ShippingAddress } from '@/types';

interface AddressState {
  addresses: ShippingAddress[];
  defaultAddress: ShippingAddress | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAddresses: () => Promise<void>;
  fetchDefaultAddress: () => Promise<void>;
  createAddress: (data: Omit<ShippingAddress, 'id'>) => Promise<ShippingAddress>;
  updateAddress: (id: number, data: Partial<ShippingAddress>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  defaultAddress: null,
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/addresses');
      if (response.data.success) {
        set({ 
          addresses: response.data.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener direcciones';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching addresses:', error);
    }
  },

  fetchDefaultAddress: async () => {
    try {
      const response = await api.get('/addresses/default');
      if (response.data.success) {
        set({ defaultAddress: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching default address:', error);
    }
  },

  createAddress: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/addresses', data);
      if (response.data.success) {
        await get().fetchAddresses();
        if (data.isDefault) {
          await get().fetchDefaultAddress();
        }
        toast.success('Dirección agregada correctamente');
        set({ isLoading: false, error: null });
        return response.data.data;
      }
      throw new Error('Error creating address');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear dirección';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  updateAddress: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/addresses/${id}`, data);
      if (response.data.success) {
        await get().fetchAddresses();
        if (data.isDefault) {
          await get().fetchDefaultAddress();
        }
        toast.success('Dirección actualizada correctamente');
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar dirección';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/addresses/${id}`);
      if (response.data.success) {
        await get().fetchAddresses();
        await get().fetchDefaultAddress();
        toast.success('Dirección eliminada correctamente');
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar dirección';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
      throw error;
    }
  },

  setDefaultAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/addresses/${id}/set-default`);
      if (response.data.success) {
        await get().fetchAddresses();
        await get().fetchDefaultAddress();
        toast.success('Dirección principal actualizada');
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al establecer dirección principal';
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
