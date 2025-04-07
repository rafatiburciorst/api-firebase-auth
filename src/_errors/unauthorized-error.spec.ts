import { describe, it, expect } from 'vitest'
import { UnauthorizedError } from './unauthorized-error.js'

describe('UnauthorizedError', () => {
  it('should create error with default message when no message is provided', () => {
    const error = new UnauthorizedError()
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Unauthorized')
  })

  it('should create error with custom message when provided', () => {
    const customMessage = 'Custom unauthorized message'
    const error = new UnauthorizedError(customMessage)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe(customMessage)
  })
})
