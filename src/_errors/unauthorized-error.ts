/**
 * class for raising unauthorized error
 *
 * @export
 * @class UnauthorizedError
 * @typedef {UnauthorizedError}
 * @extends {Error}
 */
export class UnauthorizedError extends Error {
  /**
   * Creates an instance of UnauthorizedError.
   *
   * @constructor
   * @param {?string} [message]
   */
  constructor(message?: string) {
    super(message ?? 'Unauthorized')
  }
}
