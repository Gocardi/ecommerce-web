export interface User {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  role: 'visitante' | 'afiliado' | 'admin' | 'admin_general' | 'repartidor';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Affiliate extends User {
  phone: string;
  region?: string;
  city?: string;
  address?: string;
  reference?: string;
  status: 'active' | 'pending' | 'suspended';
  points: number;
  sponsor?: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  description?: string;
  price: number;
  affiliatePrice: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  imageUrl?: string;
  weight?: number;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId?: number;
  sessionId?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  user: User;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  trackingCode?: string;
  scheduledDate?: string;
  deliveredAt?: string;
  shalomAgency?: string;
  shalomGuide?: string;
  createdAt: string;
  orderItems: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Payment {
  id: number;
  orderId: number;
  paidAt: string;
  method: 'BCP_code' | 'cash' | 'credit_card';
  amount: number;
  status: 'valid' | 'failed' | 'pending';
  bcpCode?: string;
  reference?: string;
}

export interface Commission {
  id: number;
  affiliateId: number;
  affiliate: User;
  orderItemId: number;
  orderItem: OrderItem;
  type: 'direct' | 'referral';
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  approvedAt?: string;
}