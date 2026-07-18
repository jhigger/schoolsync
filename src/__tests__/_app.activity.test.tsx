import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActivityComponent } from '../components/ActivityRoute'
import * as mockData from '../lib/mockData'

// Mock the fetchActivityLogData function
vi.spyOn(mockData, 'fetchActivityLogData').mockResolvedValue(mockData.mockActivityLogData)

describe('ActivityRoute', () => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('renders the search input', async () => {
    render(<ActivityComponent />, { wrapper })
    const searchInput = await screen.findByPlaceholderText('Type to search…')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders the mocked activity log events', async () => {
    render(<ActivityComponent />, { wrapper })
    
    // Check if initial items are loaded
    await waitFor(() => {
      expect(screen.getByText('The Office printer stopped working.')).toBeInTheDocument()
      expect(screen.getByText('A computer in Lab 3 was slow to respond.')).toBeInTheDocument()
    })
  })
})
