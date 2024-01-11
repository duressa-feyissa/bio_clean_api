import { Router } from 'express'
import authServiceInterface from '../../application/service/auth'
import userDbRepository from '../../domain/repositories/user'
import userRepositoryMongoDB from '../../infrastructure/repositories/user'
import AuthController from '../controllers/auth'
import authService from '../services/auth'

export default function authRouter(router: Router) {
  const controller = AuthController(
    userDbRepository,
    userRepositoryMongoDB,
    authService,
    authServiceInterface,
  )

  router.post('/login', controller.loginUser)

  return router
}
