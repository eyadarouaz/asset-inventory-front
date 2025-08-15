import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe, login as loginApi, LoginDto } from '@/services/auth';

type User = {
  id: number;
  username: string;
  token: string;
  role: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  setUser: (user: User) => void;
  setHydrated: (value: boolean) => void;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setUser: (user) => set({ user }),

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const res = await loginApi(credentials);
          const accessToken = res.data.access_token;

          // Fetch current authenticated user
          const meRes = await getMe(accessToken);
          const userProfile = meRes.data.user;

          const user: User = {
            id: userProfile.id,
            username: credentials.username,
            token: accessToken,
            role: userProfile.role,
            firstName: userProfile.first_name,
            lastName: userProfile.last_name,
            email: userProfile.email,
            status: userProfile.status,
          };
          set({ user, loading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Login failed. Please check your credentials.',
            loading: false,
          });
        }
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);  // Set hydrated true after rehydration
        }
      },
    }
  )
);
