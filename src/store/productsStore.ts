import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  publicPrice: number;
  affiliatePrice: number;
  stock: number;
  minStock: number;
  discountPercentage?: number;
  sku?: string;
  isActive: boolean;
  imageUrl?: string;
  weight?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
  // Computed properties
  price: number;
  isAvailable: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ProductsState {
  // Products
  products: Product[];
  featuredProducts: Product[];
  discountedProducts: Product[];
  currentProduct: Product | null;
  
  // Categories
  categories: Category[];
  currentCategory: Category | null;
  
  // Pagination and filters
  pagination: Pagination | null;
  filters: ProductFilters;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchProductsByCategory: (categoryId: number) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchDiscountedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<Category | null>;
  setFilters: (filters: ProductFilters) => void;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  discountedProducts: [],
  currentProduct: null,
  categories: [],
  currentCategory: null,
  pagination: null,
  filters: {},
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
      } else {
        throw new Error(response.data.message || 'Error al cargar productos');
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
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        set({ 
          currentProduct: response.data.data, 
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.data.message || 'Producto no encontrado');
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
      } else {
        throw new Error(response.data.message || 'Error al cargar productos');
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

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/products/featured/list');
      if (response.data.success) {
        set({ 
          featuredProducts: response.data.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      set({ isLoading: false });
    }
  },

  fetchDiscountedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/products/discounts/list');
      if (response.data.success) {
        set({ 
          discountedProducts: response.data.data,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      console.error('Error fetching discounted products:', error);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        set({ categories: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  },

  fetchCategoryBySlug: async (slug: string) => {
    try {
      const response = await api.get(`/categories/slug/${slug}`);
      if (response.data.success) {
        set({ currentCategory: response.data.data });
        return response.data.data;
      }
    } catch (error: any) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  },

  setFilters: (filters: ProductFilters) => {
    set({ filters });
    get().fetchProducts(filters);
  },

  updateFilter: (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...get().filters, [key]: value };
    set({ filters: newFilters });
    get().fetchProducts(newFilters);
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchProducts({});
  },

  clearError: () => set({ error: null }),
}));