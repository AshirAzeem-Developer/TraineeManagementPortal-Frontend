import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService, { User } from '@/lib/api/auth.service';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password, password_confirmation) => {
        set({ isLoading: true });
        try {
          const response = await authService.register({ 
            name, 
            email, 
            password, 
            password_confirmation 
          });
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        if (!authService.isAuthenticated()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);