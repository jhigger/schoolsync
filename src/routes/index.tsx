import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredAuthRole } from '../store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const role = getStoredAuthRole()
    if (role === 'Student') {
      throw redirect({ to: '/student-dashboard' })
    }
    throw redirect({ to: '/dashboard' })
  },
})
