import { Response } from 'express'

export interface FieldError {
  field: string
  message: string
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): void => {
  const body: { success: boolean; message: string; data?: T } = {
    success: true,
    message,
  }

  if (data !== undefined) {
    body.data = data
  }

  res.status(statusCode).json(body)
}

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: FieldError[],
): void => {
  const body: {
    success: boolean
    message: string
    errors?: FieldError[]
  } = {
    success: false,
    message,
  }

  if (errors !== undefined && errors.length > 0) {
    body.errors = errors
  }

  res.status(statusCode).json(body)
}
