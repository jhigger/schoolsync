import { createFileRoute } from '@tanstack/react-router'
import { DevicesRoute } from '@/components/DevicesRoute'

export const Route = createFileRoute('/_app/devices')({
  component: DevicesRoute,
})

