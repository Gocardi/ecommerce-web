import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';

// Interfaces
interface AffiliateNetworkMember {
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

interface Commission {
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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface AffiliateStats {
  salesMetrics: {
    totalSales: number;
    monthlyGrowth: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  networkMetrics: {
    totalReferrals: number;
    activeReferrals: number;
    networkGrowthRate: number;
  };
  commissionMetrics: {
    totalEarned: number;
    monthlyEarnings: number;
    pendingCommissions: number;
  };
  monthlyBuyStatus: {
    currentMonth: boolean;
    streak: number;
    complianceRate: number;
  };
}

interface CommissionSummary {
  currentMonth: {
    total: number;
    direct: number;
    referral: number;
    pending: number;
    approved: number;
    paid: number;
  };
  allTime: {
    total: number;
    direct: number;
    referral: number;
    pending: number;
    approved: number;
    paid: number;
  };
}

interface NetworkSummary {
  totalAffiliates: number;
  activeAffiliates: number;
  totalCommissionsGenerated: number;
  monthlyCommissionsGenerated: number;
}

interface AffiliateState {
  // Network
  network: AffiliateNetworkMember[];
  networkSummary: NetworkSummary | null;
  networkPagination: Pagination | null;
  
  // Commissions
  commissions: Commission[];
  commissionSummary: CommissionSummary | null;
  commissionPagination: Pagination | null;
  
  // Stats
  affiliateStats: AffiliateStats | null;
  
  // Monthly tracking
  monthlyHistory: any[];
  currentMonthStatus: any;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNetwork: (filters?: any) => Promise<void>;
  fetchCommissions: (filters?: any) => Promise<void>;
  fetchAffiliateStats: () => Promise<void>;
  fetchMonthlyHistory: (months?: number) => Promise<void>;
  fetchCurrentMonthStatus: () => Promise<void>;
  registerReferral: (data: any) => Promise<any>;
  clearError: () => void;
}

export const useAffiliateStore = create<AffiliateState>((set, get) => ({
  // Initial state
  network: [],
  networkSummary: null,
  networkPagination: null,
  commissions: [],
  commissionSummary: null,
  commissionPagination: null,
  affiliateStats: null,
  monthlyHistory: [],
  currentMonthStatus: null,
  isLoading: false,
  error: null,

  fetchNetwork: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/affiliates/my-network?${params.toString()}`);
      if (response.data.success) {
        set({
          network: response.data.data.affiliates || [],
          networkSummary: response.data.data.summary || null,
          networkPagination: response.data.data.pagination || null,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.data.message || 'Error al obtener red de afiliados');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener red de afiliados';
      set({ 
        error: message, 
        isLoading: false,
        network: [],
        networkSummary: null,
        networkPagination: null
      });
      console.error('Error fetching network:', error);
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

      const response = await api.get(`/commissions/my-commissions?${params.toString()}`);
      if (response.data.success) {
        set({
          commissions: response.data.data.commissions || [],
          commissionSummary: response.data.data.summary || null,
          commissionPagination: response.data.data.pagination || null,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.data.message || 'Error al obtener comisiones');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener comisiones';
      set({ 
        error: message, 
        isLoading: false,
        commissions: [],
        commissionSummary: null,
        commissionPagination: null
      });
      console.error('Error fetching commissions:', error);
    }
  },

  fetchAffiliateStats: async () => {
    try {
      const response = await api.get('/stats/affiliate-performance');
      if (response.data.success) {
        set({ affiliateStats: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching affiliate stats:', error);
      // Set default stats to prevent UI crashes
      set({
        affiliateStats: {
          salesMetrics: {
            totalSales: 0,
            monthlyGrowth: 0,
            averageOrderValue: 0,
            conversionRate: 0
          },
          networkMetrics: {
            totalReferrals: 0,
            activeReferrals: 0,
            networkGrowthRate: 0
          },
          commissionMetrics: {
            totalEarned: 0,
            monthlyEarnings: 0,
            pendingCommissions: 0
          },
          monthlyBuyStatus: {
            currentMonth: false,
            streak: 0,
            complianceRate: 0
          }
        }
      });
    }
  },

  fetchMonthlyHistory: async (months = 12) => {
    try {
      const response = await api.get(`/monthly-tracking/my-history?months=${months}`);
      if (response.data.success) {
        set({ monthlyHistory: response.data.data || [] });
      }
    } catch (error: any) {
      console.error('Error fetching monthly history:', error);
      set({ monthlyHistory: [] });
    }
  },

  fetchCurrentMonthStatus: async () => {
    try {
      const response = await api.get('/monthly-tracking/current-status');
      if (response.data.success) {
        set({ currentMonthStatus: response.data.data });
      }
    } catch (error: any) {
      console.error('Error fetching current month status:', error);
      // Set default status to prevent UI crashes
      set({
        currentMonthStatus: {
          currentMonth: new Date().toISOString(),
          quantity: 0,
          required: 1,
          achieved: false,
          daysRemaining: 30,
          streak: 0
        }
      });
    }
  },

  registerReferral: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register/affiliate', data);
      if (response.data.success) {
        const result = response.data.data;
        toast.success(`Afiliado registrado exitosamente. Contraseña temporal: ${result.user?.tempPassword || 'Ver datos'}`);
        await get().fetchNetwork(); // Refresh network
        set({ isLoading: false, error: null });
        return result;
      } else {
        throw new Error(response.data.message || 'Error al registrar afiliado');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar afiliado';
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
