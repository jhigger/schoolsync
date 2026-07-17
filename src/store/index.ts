import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRole = 'Admin' | 'Staff' | 'Student' | null;

interface AppState {
  authRole: AuthRole;
  theme: 'light' | 'dark' | 'system';
  viewMode: string;
  alertsCount: number | null;
  sessionActivity: {
    reviewedAlertIds: string[];
    dismissedAlertIds: string[];
    handledTasks: string[];
    notifiedDevices: string[];
  };
  setAuthRole: (role: AuthRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: string) => void;
  setAlertsCount: (count: number) => void;
  updateSessionActivity: (key: keyof AppState['sessionActivity'], updater: string[] | ((prev: string[]) => string[])) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      authRole: null,
      theme: 'system',
      viewMode: 'simple',
      alertsCount: null,
      sessionActivity: {
        reviewedAlertIds: [],
        dismissedAlertIds: [],
        handledTasks: [],
        notifiedDevices: [],
      },
      setAuthRole: (role) => set({ authRole: role }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setAlertsCount: (alertsCount) => set({ alertsCount }),
      updateSessionActivity: (key, updater) => set((state) => ({
        sessionActivity: {
          ...state.sessionActivity,
          [key]: typeof updater === 'function' ? updater(state.sessionActivity[key]) : updater
        }
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        authRole: state.authRole,
        theme: state.theme,
        viewMode: state.viewMode,
        alertsCount: state.alertsCount
      }),
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
