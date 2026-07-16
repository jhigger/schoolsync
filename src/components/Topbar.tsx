import { useAuth } from '../lib/auth'
import { LogOut } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'

export default function Topbar() {
  const { signOut } = useAuth()
  const router = useRouterState()
  
  // A simple way to get title from current path
  const path = router.location.pathname
  const title = path === '/' ? 'Dashboard' 
    : path.split('/')[1]?.charAt(0).toUpperCase() + path.split('/')[1]?.slice(1) || 'App'

  return (
    <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
      <h1 className="text-lg md:text-xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Updated 2 min ago
        </div>
        
        <button 
          onClick={signOut}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
