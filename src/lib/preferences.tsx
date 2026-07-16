import React, { createContext, useContext } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'auto'
export type ViewMode = 'simple' | 'detailed'

export type PreferencesContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  viewMode: ViewMode
  setViewMode: (viewMode: ViewMode) => void
}

const PreferencesContext = createContext<PreferencesContextType | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'auto')
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('viewMode', 'simple')

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Update document class for Tailwind dark mode
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = newTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : newTheme
    
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    
    if (newTheme === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', newTheme)
    }
    root.style.colorScheme = resolved
  }

  return (
    <PreferencesContext.Provider value={{ theme, setTheme, viewMode, setViewMode }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
