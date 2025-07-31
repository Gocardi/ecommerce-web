import { create } from 'zustand';
import { Product, Category, ProductFilters, Pagination } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface ProductsState {
  // State
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  discountedProducts: Product[];
  currentProduct: Product | null;
  pagination: Pagination | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions - Products
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchProductsByCategory: (categoryId: number) => Promise<void>;
  searchProducts: (term: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchDiscountedProducts: () => Promise<void>;
  
  // Actions - Categories
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<Category | null>;
  
  // Actions - Filters
  setFilters: (filters: ProductFilters) => void;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  clearFilters: () => void;
  
  // Actions - Utils
  checkProductAvailability: (productIds: number[]) => Promise<any>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultFilters: ProductFilters = {
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  featuredProducts: [],
  discountedProducts: [],
  currentProduct: null,
  pagination: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  // Products actions
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success) {
        set({ 
          products: response.data.data.products,
          pagination: response.data.data.pagination,
          filters: currentFilters,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cargar productos';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        set({ 
          currentProduct: response.data.data, 
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Producto no encontrado';
      set({ 
        error: message, 
        isLoading: false,
        currentProduct: null
      });
      toast.error(message);
    }
  },

  fetchProductsByCategory: async (categoryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      if (response.data.success) {
        set({ 
          products: response.data.data.products,
          pagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cargar productos de la categoría';
      set({ 
        error: message, 
        isLoading: false 
      });
      toast.error(message);
    }
  },

  searchProducts: async (term: string) => {
    const filters = { ...get().filters, search: term, page: 1 };
    await get().fetchProducts(filters);
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured/list');
      if (response.data.success) {
        set({ featuredProducts: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
    }
  },

  fetchDiscountedProducts: async () => {
    try {
      const response = await api.get('/products/discounts/list');
      if (response.data.success) {
        set({ discountedProducts: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching discounted products:', error);
    }
  },

  // Categories actions
  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        set({ categories: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar categorías');
    }
  },

  fetchCategoryBySlug: async (slug: string) => {
    try {
      const response = await api.get(`/categories/slug/${slug}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  },

  // Filters actions
  setFilters: (newFilters: ProductFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters });
    get().fetchProducts(filters);
  },

  updateFilter: (key: keyof ProductFilters, value: any) => {
    const filters = { ...get().filters, [key]: value };
    if (key !== 'page') {
      filters.page = 1; // Reset page when changing other filters
    }
    set({ filters });
    get().fetchProducts(filters);
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
    get().fetchProducts(defaultFilters);
  },

  // Utils actions
  checkProductAvailability: async (productIds: number[]) => {
    try {
      const response = await api.post('/products/check-availability', {
        ids: productIds
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error checking product availability:', error);
      return [];
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));