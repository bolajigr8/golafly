export class ApiError extends Error {
  public readonly statusCode: number

  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)
  }

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
