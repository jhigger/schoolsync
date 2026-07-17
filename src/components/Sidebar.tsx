import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Activity, MonitorSmartphone, Bell, Settings } from 'lucide-react'
import { useStore } from '../store'
import { useEffect, useState } from 'react'
import { fetchAlertsData } from '../lib/mockData'
import { Badge } from './ui/badge'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/activity', label: 'Activity Log', icon: Activity },
  { to: '/devices', label: 'Rooms & Devices', icon: MonitorSmartphone },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const ROLE_PROFILES: Record<string, { name: string, title: string, initial: string }> = {
  Admin: { name: 'Maria Reyes', title: 'Admin assistant', initial: 'M' },
  Staff: { name: 'David Smith', title: 'Teacher', initial: 'D' },
  Student: { name: 'Alex Johnson', title: 'Student', initial: 'A' },
}

export default function Sidebar() {
  const authRole = useStore((state) => state.authRole)
  const profile = authRole && ROLE_PROFILES[authRole] 
    ? ROLE_PROFILES[authRole] 
    : { name: 'User', title: 'Guest', initial: 'U' }

  const [alertsCount, setAlertsCount] = useState<number | null>(null)

  useEffect(() => {
    fetchAlertsData().then(data => setAlertsCount(data.length))
  }, [])

  return (
    <ShadcnSidebar>
      <SidebarHeader className="border-b border-border px-4 py-3 h-14 md:h-16 flex items-center justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <span className="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">SchoolSync</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton 
                  tooltip={item.label}
                  render={
                    <Link
                      to={item.to}
                      className="[&.active]:bg-primary [&.active]:text-primary-foreground flex justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <Icon />
                        <span>{item.label}</span>
                      </div>
                      {item.to === '/alerts' && alertsCount !== null && alertsCount > 0 && (
                        <Badge variant="destructive" className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]">
                          {alertsCount}
                        </Badge>
                      )}
                    </Link>
                  }
                />
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0">
            {profile.initial}
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">{profile.name}</span>
            <span className="text-xs text-muted-foreground truncate">{profile.title}</span>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
