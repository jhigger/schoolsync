import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [theme, setThemeState] = useState<Theme>('auto')
  const [viewMode, setViewModeState] = useState<ViewMode>('simple')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme) {
      setThemeState(storedTheme)
    }

    const storedViewMode = localStorage.getItem('viewMode') as ViewMode | null
    if (storedViewMode) {
      setViewModeState(storedViewMode)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
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

  const setViewMode = (newViewMode: ViewMode) => {
    localStorage.setItem('viewMode', newViewMode)
    setViewModeState(newViewMode)
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
