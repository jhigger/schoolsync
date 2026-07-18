import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DevicesRoute } from '../../components/DevicesRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual as any,
    getRouteApi: () => ({
      useSearch: () => ({ filter: 'all' })
    })
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('DevicesRoute', () => {
  it('renders the devices dashboard', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DevicesRoute />
        </QueryClientProvider>
      )
    })
    
    // Check that it eventually loads the content (e.g. Lab 1)
    await waitFor(() => {
      expect(screen.getByText('Lab 1')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Check for another room
    expect(screen.getAllByText('Office')[0]).toBeInTheDocument()
    
    // Check for some devices from the default selected room (Office)
    expect(screen.getByText('Front printer')).toBeInTheDocument()
    expect(screen.getByText('Front-desk scanner')).toBeInTheDocument()
  })
})
