// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
}))
import { useStore } from '../index'
import { createMockAppointment } from '../../lib/test-utils'

describe('Store: Appointments', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({ appointments: [] })
  })

  it('adds an appointment and updates its status', () => {
    const appt = createMockAppointment()

    useStore.getState().addAppointment(appt)
    let appointments = useStore.getState().appointments
    expect(appointments).toHaveLength(1)
    expect(appointments[0].status).toBe('Pending')

    useStore.getState().updateAppointmentStatus('test-1', "RSVP'd")
    appointments = useStore.getState().appointments
    expect(appointments[0].status).toBe("RSVP'd")

    useStore.getState().updateAppointmentStatus('test-1', 'Reschedule Requested')
    appointments = useStore.getState().appointments
    expect(appointments[0].status).toBe('Reschedule Requested')
  })
})
