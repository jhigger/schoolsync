import { useEffect } from 'react'
import { useStore } from '../store'

export function useThemeSync() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    // Sync with the script that runs before React loads
    localStorage.setItem('theme', theme)
  }, [theme])
}
