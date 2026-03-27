import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Setup Verification', () => {
  it('should render a simple component and confirm testing library is working', () => {
    render(<div>Test Works</div>)
    expect(screen.getByText('Test Works')).toBeInTheDocument()
  })
})
