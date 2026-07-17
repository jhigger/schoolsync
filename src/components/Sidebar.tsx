import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Activity, MonitorSmartphone, Bell, Settings } from 'lucide-react'
import { useStore } from '../store'
import { useEffect } from 'react'
import { fetchAlertsData } from '../lib/mockData'
import { APP_TITLE } from '../lib/constants'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/activity', label: 'Activity Log', icon: Activity },
  { to: '/devices', label: 'Rooms & Devices', icon: MonitorSmartphone },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const ROLE_PROFILES: Record<string, { name: string, title: string, email: string, initial: string }> = {
  Admin: { name: 'Maria Reyes', title: 'Admin assistant', email: 'maria.reyes@school.edu', initial: 'M' },
  Staff: { name: 'David Smith', title: 'Teacher', email: 'david.smith@school.edu', initial: 'D' },
  Student: { name: 'Alex Johnson', title: 'Student', email: 'alex.johnson@school.edu', initial: 'A' },
}

export default function Sidebar() {
  const authRole = useStore((state) => state.authRole)
  const profile = authRole && ROLE_PROFILES[authRole] 
    ? ROLE_PROFILES[authRole] 
    : { name: 'User', title: 'Guest', email: '', initial: 'U' }

  const alertsCount = useStore((state) => state.alertsCount)
  const setAlertsCount = useStore((state) => state.setAlertsCount)

  useEffect(() => {
    if (alertsCount === null) {
      fetchAlertsData().then(data => setAlertsCount(data.length))
    }
  }, [alertsCount, setAlertsCount])

  return (
    <aside className="w-full h-auto border-t md:border-t-0 md:border-r border-border flex flex-row md:flex-col p-1 md:p-4 pb-[max(8px,env(safe-area-inset-bottom))] md:pb-4 justify-around md:justify-start order-2 md:order-1 z-40 bg-white dark:bg-card md:bg-background md:dark:bg-background md:w-[212px] shrink-0">
      <div className="hidden md:flex items-center gap-2 px-2 pb-4">
        <div className="w-[34px] h-[34px] rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <span className="font-bold text-base truncate">{APP_TITLE}</span>
      </div>

      <nav className="flex flex-row md:flex-col gap-1 w-full flex-1 md:flex-none justify-around md:justify-start">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col md:flex-row items-center gap-1 md:gap-3 py-2 md:py-2.5 px-0 md:px-3 rounded-lg text-[11px] md:text-[14.5px] font-semibold text-muted-foreground hover:bg-muted [&.active]:text-primary-foreground [&.active]:bg-primary flex-1 md:flex-none justify-center md:justify-start relative text-center leading-tight"
            >
              <Icon className="w-5 h-5 mx-auto md:mx-0 shrink-0" />
              <span>{item.label}</span>
              {item.to === '/alerts' && alertsCount !== null && alertsCount > 0 && (
                <span className="absolute top-1 md:top-auto md:relative right-[calc(50%-24px)] md:right-auto md:ml-auto flex items-center justify-center rounded-full bg-destructive/20 md:bg-destructive text-destructive md:text-white px-1.5 py-0.5 text-[10px] md:text-[11px] font-bold group-[.active]:bg-white group-[.active]:text-destructive">
                  {alertsCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="hidden md:flex mt-auto pt-4">
        <div className="flex items-center gap-3 p-2.5 border border-border rounded-[10px] w-full">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
            {profile.initial}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[13.5px] font-semibold truncate">{profile.name}</span>
            <span className="text-xs text-muted-foreground truncate">{profile.title}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
