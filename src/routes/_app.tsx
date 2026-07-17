import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import HelpBar from '../components/HelpBar'
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
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden order-1 md:order-2">
        <Topbar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <HelpBar />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
