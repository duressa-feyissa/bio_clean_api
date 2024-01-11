import authServiceInterface from '../../application/service/auth'
import CustomError from '../../config/error'
import authServiceImpl from '../../interfaces/services/auth'

import { NextFunction, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function authMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('Authorization')
  const authService = authServiceInterface(authServiceImpl())
  if (!token) {
    throw new CustomError('Access denied. No token provided', 401)
  }
  if (token.split(' ')[0] !== 'Bearer') {
    throw new CustomError('Invalid token', 401)
  }
  try {
    const decoded = authService.verify(token.split(' ')[1])

    req.user = decoded
    next()
  } catch (err) {
    throw new CustomError('Invalid token', 401)
  }
}
