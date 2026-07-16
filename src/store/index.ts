import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRole = 'Admin' | 'Staff' | 'Student' | null;

interface AppState {
  authRole: AuthRole;
  theme: 'light' | 'dark' | 'system';
  viewMode: string;
  helpOpen: boolean;
  setAuthRole: (role: AuthRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: string) => void;
  setHelpOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      authRole: null,
      theme: 'system',
      viewMode: 'simple',
      helpOpen: false,
      setAuthRole: (role) => set({ authRole: role }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setHelpOpen: (open) => set({ helpOpen: open }),
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
