/**
 * utils/ApiError.ts
 *
 * A custom error class that extends the native Error so that Express's global
 * error handler can distinguish between "expected" operational errors (wrong
 * credentials, not found, etc.) and unexpected programming errors.
 *
 * Static factory methods provide a fluent API and prevent magic status-code
 * numbers from scattering across the codebase.
 */

export class ApiError extends Error {
  /** HTTP status code to be sent to the client */
  public readonly statusCode: number

  /**
   * True for expected operational errors (e.g., 404, 401).
   * False for unexpected programming errors that should be investigated.
   */
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number,
    isOperational = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Restore the prototype chain so `instanceof ApiError` works correctly
    // after TypeScript transpilation.
    Object.setPrototypeOf(this, new.target.prototype)

    // Capture a clean stack trace that starts at the call site, not inside
    // this constructor.
    Error.captureStackTrace(this, this.constructor)
  }

  // ── Static Factory Methods ─────────────────────────────────────────────────

  /** 400 Bad Request — malformed input from the client */
  static badRequest(message = 'Bad request.'): ApiError {
    return new ApiError(message, 400)
  }

  /** 401 Unauthorized — authentication required or credentials invalid */
  static unauthorized(message = 'Unauthorized.'): ApiError {
    return new ApiError(message, 401)
  }

  /** 403 Forbidden — authenticated but not permitted */
  static forbidden(message = 'Forbidden.'): ApiError {
    return new ApiError(message, 403)
  }

  /** 404 Not Found — resource does not exist */
  static notFound(message = 'Resource not found.'): ApiError {
    return new ApiError(message, 404)
  }

  /** 409 Conflict — resource already exists or state conflict */
  static conflict(message = 'Conflict.'): ApiError {
    return new ApiError(message, 409)
  }

  /** 500 Internal Server Error — unexpected server-side failure */
  static internal(message = 'An unexpected error occurred.'): ApiError {
    return new ApiError(message, 500, false)
  }
}
