import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRole = 'Admin' | 'Staff' | 'Student' | null;

export interface LogbookField {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
  isPreset?: boolean;
}

export interface LogbookConfig {
  id: string;
  title: string;
  description?: string;
  fields: LogbookField[];
  kioskPin: string;
  createdAt: string;
}

interface AppState {
  authRole: AuthRole;
  theme: 'light' | 'dark' | 'system';
  viewMode: string;
  alertsCount: number | null;
  logbooks: LogbookConfig[];
  sessionActivity: {
    reviewedAlertIds: string[];
    dismissedAlertIds: string[];
    handledTasks: string[];
    notifiedDevices: string[];
  };
  isHelpOpen: boolean;
  setAuthRole: (role: AuthRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: string) => void;
  setAlertsCount: (count: number | null) => void;
  addLogbook: (logbook: LogbookConfig) => void;
  validateKioskPin: (id: string, pin: string) => boolean;
  updateSessionActivity: (key: keyof AppState['sessionActivity'], updater: string[] | ((prev: string[]) => string[])) => void;
  toggleHelp: () => void;
  setHelpOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      authRole: null,
      theme: 'system',
      viewMode: 'simple',
      alertsCount: null,
      logbooks: [],
      sessionActivity: {
        reviewedAlertIds: [],
        dismissedAlertIds: [],
        handledTasks: [],
        notifiedDevices: [],
      },
      isHelpOpen: false,
      setAuthRole: (role) => set({ authRole: role }),
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setAlertsCount: (alertsCount) => set({ alertsCount }),
      addLogbook: (logbook) => set((state) => ({ logbooks: [...state.logbooks, logbook] })),
      validateKioskPin: (id, pin) => {
        const logbook = get().logbooks.find(l => l.id === id);
        return logbook?.kioskPin === pin;
      },
      updateSessionActivity: (key, updater) => set((state) => ({
        sessionActivity: {
          ...state.sessionActivity,
          [key]: typeof updater === 'function' ? updater(state.sessionActivity[key]) : updater
        }
      })),
      toggleHelp: () => set((state) => ({ isHelpOpen: !state.isHelpOpen })),
      setHelpOpen: (isOpen) => set({ isHelpOpen: isOpen }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        authRole: state.authRole,
        theme: state.theme,
        viewMode: state.viewMode,
        isHelpOpen: state.isHelpOpen,
        logbooks: state.logbooks
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
