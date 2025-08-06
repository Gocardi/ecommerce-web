import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Reward, RewardClaim, Pagination } from '@/types';

interface RewardsState {
  rewards: Reward[];
  myClaims: RewardClaim[];
  availablePoints: number;
  pagination: Pagination | null;
  claimsPagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRewards: (filters?: any) => Promise<void>;
  fetchMyClaims: (filters?: any) => Promise<void>;
  fetchAvailablePoints: () => Promise<void>;
  claimReward: (rewardId: number) => Promise<void>;
  clearError: () => void;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  rewards: [],
  myClaims: [],
  availablePoints: 0,
  pagination: null,
  claimsPagination: null,
  isLoading: false,
  error: null,

  fetchRewards: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/rewards?${params.toString()}`);
      if (response.data.success) {
        set({
          rewards: response.data.data.rewards,
          pagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener premios';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching rewards:', error);
    }
  },

  fetchMyClaims: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/reward-claims/my-claims?${params.toString()}`);
      if (response.data.success) {
        set({
          myClaims: response.data.data.claims,
          claimsPagination: response.data.data.pagination,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener mis canjes';
      set({ 
        error: message, 
        isLoading: false 
      });
      console.error('Error fetching my claims:', error);
    }
  },

  fetchAvailablePoints: async () => {
    try {
      const response = await api.get('/affiliates/my-points');
      if (response.data.success) {
        set({ availablePoints: response.data.data.points });
      }
    } catch (error: any) {
      console.error('Error fetching available points:', error);
    }
  },

  claimReward: async (rewardId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/reward-claims', { rewardId });
      if (response.data.success) {
        toast.success('Premio canjeado exitosamente');
        await get().fetchAvailablePoints(); // Update points
        await get().fetchMyClaims(); // Update claims
        set({ isLoading: false, error: null });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al canjear premio';
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
