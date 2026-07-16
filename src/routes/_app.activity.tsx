import { createFileRoute } from '@tanstack/react-router'
import { ActivityComponent } from '@/components/ActivityRoute'

export const Route = createFileRoute('/_app/activity')({
  component: ActivityComponent,
})
