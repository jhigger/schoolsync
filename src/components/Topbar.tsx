import { useStore } from '../store'
import { LogOut, Sun, Moon, CircleHelp } from 'lucide-react'
import { useRouterState, useNavigate } from '@tanstack/react-router'
import { SidebarTrigger } from './ui/sidebar'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useThemeSync } from '../hooks/use-theme-sync'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/activity': 'Activity Log',
  '/devices': 'Rooms & Devices',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
}

export default function Topbar() {
  const setAuthRole = useStore((state) => state.setAuthRole)
  const theme = useStore((state) => state.theme)
  const setTheme = useStore((state) => state.setTheme)
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)
  const helpOpen = useStore((state) => state.helpOpen)
  const setHelpOpen = useStore((state) => state.setHelpOpen)
  const navigate = useNavigate()
  const router = useRouterState()

  const signOut = () => {
    setAuthRole(null)
    navigate({ to: '/signin' })
  }

  const toggleTheme = () => {
    let currentTheme = theme
    if (currentTheme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }

  useThemeSync()

  const path = router.location.pathname
  const title = ROUTE_TITLES[path] || 'App'

  return (
    <header className="h-14 md:h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-full mr-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Updated 2 min ago
        </div>

        <div className="flex items-center gap-2">
          <Switch 
            id="view-mode" 
            checked={viewMode === 'detailed'}
            onCheckedChange={(checked) => setViewMode(checked ? 'detailed' : 'simple')}
          />
          <Label htmlFor="view-mode" className="text-sm font-medium cursor-pointer">
            {viewMode === 'detailed' ? 'Detailed' : 'Simple'}
          </Label>
        </div>

        <Button 
          variant={helpOpen ? 'default' : 'outline'} 
          size="sm" 
          className="hidden md:flex gap-2"
          onClick={() => setHelpOpen(!helpOpen)}
          aria-label="Help"
        >
          <CircleHelp className="w-4 h-4" />
          Help
        </Button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
          aria-label="Toggle theme"
        >
          <Moon className="w-5 h-5 hidden dark:block" />
          <Sun className="w-5 h-5 dark:hidden" />
        </button>
        
        <button 
          onClick={signOut}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
