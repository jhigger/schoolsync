import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActivityComponent } from '../components/ActivityRoute'
import * as mockData from '../lib/mockData'

// Mock the fetchActivityLogData function
vi.spyOn(mockData, 'fetchActivityLogData').mockResolvedValue(mockData.mockActivityLogData)

describe('ActivityRoute', () => {
  const queryClient = new QueryClient()

  it('renders the search input', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ActivityComponent />
      </QueryClientProvider>
    )
    const searchInput = await screen.findByPlaceholderText('Type to search… (example: Lab 1, printer, Maria)')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders the mocked activity log events', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ActivityComponent />
      </QueryClientProvider>
    )
    
    // Check if initial items are loaded
    await waitFor(() => {
      expect(screen.getByText('The Office printer stopped working.')).toBeInTheDocument()
      expect(screen.getByText('A computer in Lab 3 was slow to respond.')).toBeInTheDocument()
    })
  })
})
