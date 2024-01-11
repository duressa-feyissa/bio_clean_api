import { NextFunction, Request, Response } from 'express'
import CustomError from '../../config/error'

export default function errorHandlingMiddleware(
  err: CustomError | Error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err instanceof CustomError ? err.statusCode : 500
  const message = err.message

  res.status(statusCode).json({ status: statusCode, message: message })
}
