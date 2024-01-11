import { NextFunction, Request, Response } from 'express'
import { IAuthServiceInterface } from '../../application/service/auth'
import createUser from '../../application/use_cases/user/create'
import removeUser from '../../application/use_cases/user/delete'
import findById from '../../application/use_cases/user/findById'
import findByPhone from '../../application/use_cases/user/findByPhone'

import CustomError from '../../config/error'
import { IUserRepository } from '../../domain/repositories/user'
import { IAuthService } from '../services/auth'
import { IUserRepositoryImpl } from './../../infrastructure/repositories/user'

export default function UserController(
  userRepository: IUserRepository,
  userDbRepositoryImpl: IUserRepositoryImpl,
  authService: IAuthService,
  authServiceInterface: IAuthServiceInterface,
) {
  const dbRepository = userRepository(userDbRepositoryImpl())

  const auth = authServiceInterface(authService())
  const fetchUserById = (req: Request, res: Response, next: NextFunction) => {
    findById(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    removeUser(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const fetchUserByPhone = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    findByPhone(req.params.phone, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const createNewUser = (req: Request, res: Response, next: NextFunction) => {
    createUser(req.body, dbRepository, auth)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const currentUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (token.split(' ')[0] !== 'Bearer') {
      throw new CustomError('Invalid token', 401)
    }
    try {
      const decoded = auth.verify(token.split(' ')[1])
      return res.json(decoded)
    } catch (err) {
      throw new CustomError('Invalid token', 401)
    }
  }

  return {
    fetchUserById,
    deleteUser,
    fetchUserByPhone,
    createNewUser,
    currentUser,
  }
}
