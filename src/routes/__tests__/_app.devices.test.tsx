import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DevicesRoute } from '../../components/DevicesRoute'

describe('DevicesRoute', () => {
  it('renders the devices dashboard', () => {
    render(<DevicesRoute />)
    
    // Check for the main heading
    expect(screen.getByRole('heading', { name: /Rooms & Devices/i })).toBeInTheDocument()
    
    // Check for specific rooms
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    
    // Check for specific devices
    expect(screen.getByText('Smart TV')).toBeInTheDocument()
    expect(screen.getByText('Refrigerator')).toBeInTheDocument()
  })
})
