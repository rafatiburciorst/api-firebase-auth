import { describe, it, expect } from 'vitest';
import { BadRequestError } from './bad-request-error.js';

describe('BadRequestError', () => {
  it('should be an instance of Error', () => {
    const error = new BadRequestError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should set the error message correctly', () => {
    const errorMessage = 'Invalid request parameters';
    const error = new BadRequestError(errorMessage);
    expect(error.message).toBe(errorMessage);
  });
});
