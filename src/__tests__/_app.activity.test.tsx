import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ActivityComponent } from '../components/ActivityRoute'

describe('ActivityRoute', () => {
  it('renders the activity log header', () => {
    render(<ActivityComponent />)
    expect(screen.getByText('Activity Log')).toBeInTheDocument()
  })

  it('filters the log based on search input', () => {
    render(<ActivityComponent />)
    const searchInput = screen.getByPlaceholderText('Search events...')
    
    // Check if initial items are present
    expect(screen.getByText('System rebooted')).toBeInTheDocument()
    expect(screen.getByText('User logged in')).toBeInTheDocument()
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'reboot' } })
    
    // Check filtered results
    expect(screen.getByText('System rebooted')).toBeInTheDocument()
    expect(screen.queryByText('User logged in')).not.toBeInTheDocument()
  })
})
