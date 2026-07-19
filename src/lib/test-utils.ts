import type { Appointment } from '../store'

export function createMockAppointment(overrides?: Partial<Appointment>): Appointment {
  return {
    id: 'test-1',
    studentId: 's1',
    studentName: 'Alice',
    title: 'Meeting',
    date: new Date().toISOString(),
    type: 'appointment',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    ...overrides
  }
}
