import { redirect } from '@tanstack/react-router'
import { getStoredAuthRole, type AuthRole } from '../store'

export function enforceRoleAccess(allowedRoles: AuthRole[]) {
  const role = getStoredAuthRole()
  if (!allowedRoles.includes(role)) {
    throw redirect({ to: '/' })
  }
}
