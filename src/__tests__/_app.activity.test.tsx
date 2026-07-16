import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActivityComponent } from '../components/ActivityRoute'
import * as mockData from '../lib/mockData'

// Mock the fetchActivityLogData function
vi.spyOn(mockData, 'fetchActivityLogData').mockResolvedValue(mockData.mockActivityLogData)

describe('ActivityRoute', () => {
  it('renders the search input', async () => {
    render(<ActivityComponent />)
    const searchInput = screen.getByPlaceholderText('Type to search… (example: Lab 1, printer, Maria)')
    expect(searchInput).toBeInTheDocument()
  })

  it('filters the log based on search input', async () => {
    render(<ActivityComponent />)
    const searchInput = screen.getByPlaceholderText('Type to search… (example: Lab 1, printer, Maria)')
    
    // Check if initial items are loaded
    await waitFor(() => {
      expect(screen.getByText('The Office printer stopped working.')).toBeInTheDocument()
      expect(screen.getByText('A computer in Lab 3 was slow to respond.')).toBeInTheDocument()
    })
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'printer' } })
    
    // Check filtered results
    await waitFor(() => {
      expect(screen.getByText('The Office printer stopped working.')).toBeInTheDocument()
      expect(screen.queryByText('A computer in Lab 3 was slow to respond.')).not.toBeInTheDocument()
    })
  })
})
