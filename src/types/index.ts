// Common types used across the application

export interface User {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  role: 'visitante' | 'afiliado' | 'admin' | 'admin_general';
  isActive: boolean;
  maxReferrals?: number;
  createdAt: string;
  lastLogin?: string;
  affiliate?: {
    id: number;
    phone: string;
    region: string;
    city: string;
    address?: string;
    reference?: string;
    status: string;
    points: number;
  };
}

export interface Product {
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
  updatedAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  updatedAt: string;
}

export interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  reference?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
    category: {
      name: string;
    };
  };
}

export interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
  reference?: string;
}

export interface Order {
  id: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  trackingCode?: string;
  shalomAgency?: string;
  shalomGuide?: string;
  createdAt: string;
  scheduledDate?: string;
  deliveredAt?: string;
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  payments: Payment[];
  userId?: number;
}

export interface Commission {
  id: number;
  type: 'direct' | 'referral';
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  approvedAt?: string;
  orderItem: {
    product: {
      id: number;
      name: string;
      imageUrl?: string;
    };
    quantity: number;
    unitPrice: number;
  };
}

export interface AffiliateNetworkMember {
  id: number;
  fullName: string;
  dni: string;
  phone: string;
  city: string;
  isActive: boolean;
  referredAt: string;
  stats: {
    totalOrders: number;
    monthlyOrders: number;
    totalSpent: number;
    monthlySpent: number;
    commissionsGenerated: number;
    monthlyCommissionsGenerated: number;
  };
}

export interface Reward {
  id: number;
  name: string;
  description?: string;
  pointsRequired: number;
  imageUrl?: string;
  isActive: boolean;
  stock: number;
}

export interface RewardClaim {
  id: number;
  pointsUsed: number;
  status: 'pending' | 'approved' | 'delivered';
  claimedAt: string;
  deliveredAt?: string;
  reward: {
    name: string;
    imageUrl?: string;
  };
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  readFlag: boolean;
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}