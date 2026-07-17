import { createFileRoute } from '@tanstack/react-router'
import { DevicesRoute } from '@/components/DevicesRoute'

export const Route = createFileRoute('/_app/devices')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter: search.filter === 'problems' ? 'problems' : 'all',
    }
  },
  component: DevicesRoute,
})

