export interface User {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  role: 'visitante' | 'afiliado' | 'admin' | 'admin_general';
  isActive: boolean;
  maxReferrals?: number;
  createdBy?: number;
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
  phone?: string;
  region?: string;
  city?: string;
  address?: string;
  reference?: string;
}

export interface RegisterAffiliateRequest {
  dni: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  reference?: string;
  maxReferrals?: number;
}

export interface RegisterAdminRequest {
  dni: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  region: string;
  city: string;
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
  avgPublicPrice?: number;
  avgAffiliatePrice?: number;
  createdAt: string;
  updatedAt?: string;
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
  updatedAt?: string;
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

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
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
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}

// Tipos para componentes
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Enums útiles
export enum UserRole {
  VISITANTE = 'visitante',
  AFILIADO = 'afiliado',
  ADMIN = 'admin',
  ADMIN_GENERAL = 'admin_general',
  REPARTIDOR = 'repartidor',
}

export enum SortOptions {
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  NEWEST = 'createdAt-desc',
  OLDEST = 'createdAt-asc',
}