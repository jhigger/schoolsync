// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
}))

import * as mockData from '../../lib/mockData'
vi.spyOn(mockData, 'fetchDepartmentAnnouncements').mockResolvedValue([])

import { render, screen, fireEvent } from '@testing-library/react'
import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route } from '../_app.student-dashboard'
import { useStore } from '../../store'

const rootRoute = createRootRoute()
const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Route.options.component
})
const routeTree = rootRoute.addChildren([testRoute])
const router = createRouter({ routeTree })
let queryClient: QueryClient

describe('StudentDashboard', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    useStore.setState({ appointments: [] })
  })

  it('renders dashboard with no appointments', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
    expect(await screen.findByText('Student Dashboard')).toBeInTheDocument()
    expect(await screen.findByText('My Appointments')).toBeInTheDocument()
    expect(await screen.findByText('No appointments at this time.')).toBeInTheDocument()
  })

  it('renders dashboard with appointments and allows RSVP', async () => {
    useStore.setState({
      appointments: [{
        id: '1',
        studentId: 's1',
        studentName: 'Alice',
        title: 'Guidance',
        date: new Date().toISOString(),
        type: 'appointment',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }]
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )

    expect(await screen.findByText('Guidance')).toBeInTheDocument()
    const rsvpButton = await screen.findByText('RSVP')
    fireEvent.click(rsvpButton)

    // After click, the status should be updated in the store
    const updatedAppointments = useStore.getState().appointments
    expect(updatedAppointments[0].status).toBe("RSVP'd")
  })
})
