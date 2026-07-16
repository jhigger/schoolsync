import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '../components/ui/sidebar'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { getStoredAuthRole } from '../store'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    if (!getStoredAuthRole()) {
      throw redirect({ to: '/signin' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
