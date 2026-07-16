import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    if (typeof localStorage !== 'undefined') {
      const storage = localStorage.getItem('app-storage');
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          if (parsed?.state?.authRole) return;
        } catch (e) {}
      }
      throw redirect({ to: '/signin' })
    }
  },
  component: AppLayout,
})

function AppLayout() {

  return (
    <div className="flex h-screen w-full bg-background flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
