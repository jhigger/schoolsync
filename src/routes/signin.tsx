import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'

export const Route = createFileRoute('/signin')({
  beforeLoad: () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('auth') === 'true') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignInComponent,
})

function SignInComponent() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = () => {
    signIn()
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-md border">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
