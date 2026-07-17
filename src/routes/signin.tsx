import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useStore, getStoredAuthRole, type AuthRole } from '../store'
import { APP_TITLE } from '@/lib/constants'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export const Route = createFileRoute('/signin')({
  beforeLoad: () => {
    if (getStoredAuthRole()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignInComponent,
})

function SignInComponent() {
  const setAuthRole = useStore((state) => state.setAuthRole)
  const navigate = useNavigate()

  const handleSignIn = (role: AuthRole) => {
    setAuthRole(role)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{APP_TITLE}</h1>
          <p className="text-sm text-muted-foreground mt-1">School Activity Logbook &middot; sign in to continue</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="assistant@school.edu" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" defaultValue="••••••••" readOnly />
          </div>
          
          <div className="pt-2 flex flex-col gap-2">
            <Button size="lg" className="w-full text-base" onClick={() => handleSignIn('Admin')}>
              Sign in as Admin
            </Button>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Button variant="outline" onClick={() => handleSignIn('Staff')}>Staff</Button>
              <Button variant="outline" onClick={() => handleSignIn('Student')}>Student</Button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help signing in? Ask your IT office.
        </p>
      </Card>
    </div>
  )
}
