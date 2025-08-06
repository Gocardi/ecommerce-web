import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    price: number;
    publicPrice: number;
    affiliatePrice: number;
    imageUrl: string;
    stock: number;
    category: {
      id: number;
      name: string;
    };
    isAvailable: boolean;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  updatedAt: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartSummary: () => Promise<any>;
  checkCartAvailability: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/cart');
          if (response.data.success) {
            set({ 
              cart: response.data.data,
              isLoading: false,
              error: null
            });
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al obtener el carrito';
          set({ 
            error: message, 
            isLoading: false 
          });
          console.error('Error fetching cart:', error);
        }
      },

      addToCart: async (productId: number, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/cart/items', {
            productId,
            quantity
          });
          
          if (response.data.success) {
            // Refetch cart to get updated data
            await get().fetchCart();
            toast.success('Producto agregado al carrito');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al agregar al carrito';
          set({ 
            error: message, 
            isLoading: false 
          });
          toast.error(message);
          throw error;
        }
      },

      updateCartItem: async (itemId: number, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(`/cart/items/${itemId}`, {
            quantity
          });
          
          if (response.data.success) {
            await get().fetchCart();
            toast.success('Cantidad actualizada');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al actualizar cantidad';
          set({ 
            error: message, 
            isLoading: false 
          });
          toast.error(message);
        }
      },

      removeCartItem: async (itemId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.delete(`/cart/items/${itemId}`);
          
          if (response.data.success) {
            await get().fetchCart();
            toast.success('Producto eliminado del carrito');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al eliminar producto';
          set({ 
            error: message, 
            isLoading: false 
          });
          toast.error(message);
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.delete('/cart');
          
          if (response.data.success) {
            set({ 
              cart: null,
              isLoading: false,
              error: null
            });
            toast.success('Carrito vaciado');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al vaciar carrito';
          set({ 
            error: message, 
            isLoading: false 
          });
          toast.error(message);
        }
      },

      getCartSummary: async () => {
        try {
          const response = await api.get('/cart/summary');
          if (response.data.success) {
            return response.data.data;
          }
          return null;
        } catch (error: any) {
          console.error('Error getting cart summary:', error);
          return null;
        }
      },

      checkCartAvailability: async () => {
        const { cart } = get();
        if (!cart || cart.isEmpty) return;

        try {
          const productIds = cart.items.map(item => item.product.id);
          const response = await api.post('/products/check-availability', {
            ids: productIds
          });
          
          if (response.data.success) {
            const unavailableProducts = response.data.data.filter((p: any) => !p.available);
            if (unavailableProducts.length > 0) {
              toast.error(`Algunos productos ya no están disponibles`);
              await get().fetchCart(); // Refresh cart to update availability
            }
          }
        } catch (error: any) {
          console.error('Error checking availability:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);