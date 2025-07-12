export interface User {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  role: 'visitante' | 'afiliado' | 'admin' | 'admin_general' | 'repartidor';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  region?: string;
  city?: string;
  address?: string;
  reference?: string;
}

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface RegisterRequest {
  dni: string;
  fullName: string;
  email: string;
  password: string;
  role?: 'afiliado';
  phone?: string;
  region?: string;
  city?: string;
  address?: string;
  reference?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productsCount?: number;
  createdAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  description?: string;
  price: number; // Precio según el rol del usuario
  originalPrice: number; // Precio público
  affiliatePrice: number; // Precio para afiliados
  stock: number;
  discountPercentage?: number;
  sku?: string;
  isActive: boolean;
  isAvailable: boolean;
  imageUrl?: string;
  weight?: number;
  createdAt: string;
  finalPrice?: number; // Precio con descuento aplicado
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      search?: string;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
      priceField: string;
    };
  };
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}