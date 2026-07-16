import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRole = 'Admin' | 'Staff' | 'Student' | null;

interface AppState {
  authRole: AuthRole;
  theme: 'light' | 'dark' | 'system';
  viewMode: string;
  setAuthRole: (role: AuthRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      authRole: null,
      theme: 'system',
      viewMode: 'default',
      setAuthRole: (role) => set({ authRole: role }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export function getStoredAuthRole(): AuthRole {
  if (typeof localStorage === 'undefined') return null;
  const storage = localStorage.getItem('app-storage');
  if (!storage) return null;
  try {
    const parsed = JSON.parse(storage);
    return parsed?.state?.authRole || null;
  } catch (e) {
    return null;
  }
}
