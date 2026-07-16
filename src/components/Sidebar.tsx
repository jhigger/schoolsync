import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Activity, MonitorSmartphone, Bell, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/activity', label: 'Activity Log', icon: Activity },
  { to: '/devices', label: 'Rooms & Devices', icon: MonitorSmartphone },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="bg-white border-t md:border-t-0 md:border-r border-gray-200 flex-shrink-0
      fixed md:static bottom-0 left-0 right-0 z-40
      md:w-64 flex md:flex-col p-2 md:p-4 justify-around md:justify-start"
    >
      <div className="hidden md:flex items-center gap-2 px-2 py-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          S
        </div>
        <span className="font-bold text-lg">SchoolSync</span>
      </div>

      <nav className="flex md:flex-col w-full gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 md:flex-none flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors [&.active]:bg-primary [&.active]:text-primary-foreground"
            >
              <Icon className="w-5 h-5 md:w-4 md:h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="hidden md:flex mt-auto p-4 border-t border-gray-200 items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
          U
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">User</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
      </div>
    </aside>
  )
}
