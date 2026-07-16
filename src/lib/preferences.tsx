import React, { createContext, useContext } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'auto'
export type ViewMode = 'simple' | 'detailed'
export type TextSize = 'Small' | 'Medium' | 'Large'
export type Language = 'English' | 'Filipino' | 'Español'

export type PreferencesContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  viewMode: ViewMode
  setViewMode: (viewMode: ViewMode) => void
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  language: Language
  setLanguage: (lang: Language) => void
  emailSummary: boolean
  setEmailSummary: (enabled: boolean) => void
  playSound: boolean
  setPlaySound: (enabled: boolean) => void
  autoRefresh: boolean
  setAutoRefresh: (enabled: boolean) => void
}

const PreferencesContext = createContext<PreferencesContextType | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'auto')
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('viewMode', 'simple')
  const [textSize, setTextSize] = useLocalStorage<TextSize>('textSize', 'Medium')
  const [language, setLanguage] = useLocalStorage<Language>('language', 'English')
  const [emailSummary, setEmailSummary] = useLocalStorage<boolean>('emailSummary', true)
  const [playSound, setPlaySound] = useLocalStorage<boolean>('playSound', false)
  const [autoRefresh, setAutoRefresh] = useLocalStorage<boolean>('autoRefresh', true)

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
    <PreferencesContext.Provider value={{ 
      theme, setTheme, 
      viewMode, setViewMode,
      textSize, setTextSize,
      language, setLanguage,
      emailSummary, setEmailSummary,
      playSound, setPlaySound,
      autoRefresh, setAutoRefresh
    }}>
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
