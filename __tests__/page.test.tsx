import { render, screen, fireEvent } from '@testing-library/react'
import ScannerDashboard from '@/app/scan/page'

describe('ScannerDashboard Component', () => {
  it('renders the scanner page header', () => {
    render(<ScannerDashboard />)
    const heading = screen.getByText('Inspect an Offer')
    expect(heading).toBeInTheDocument()
  })

  it('renders three scan mode tabs', () => {
    render(<ScannerDashboard />)
    expect(screen.getByText('Text Snippet')).toBeInTheDocument()
    expect(screen.getByText('Link / URL')).toBeInTheDocument()
    expect(screen.getByText('PDF / Image')).toBeInTheDocument()
  })

  it('switches input mode to URL when clicked', () => {
    render(<ScannerDashboard />)
    const urlTab = screen.getByText('Link / URL')
    fireEvent.click(urlTab)
    expect(screen.getByText('Suspicious Link or URL')).toBeInTheDocument()
  })
})
