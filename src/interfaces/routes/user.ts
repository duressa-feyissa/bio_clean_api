import { Router } from 'express'
import authServiceInterface from '../../application/service/auth'
import userDbRepository from '../../domain/repositories/user'
import userRepositoryMongoDB from '../../infrastructure/repositories/user'
import UserController from '../controllers/user'
import authMiddleware from '../middlewares/authMiddleware'
import authService from '../services/auth'

export default function userRouter(router: Router) {
  const controller = UserController(
    userDbRepository,
    userRepositoryMongoDB,
    authService,
    authServiceInterface,
  )
  router.get('/me', authMiddleware, controller.currentUser)
  router.post('/', controller.createNewUser)
  router.get('/:id', authMiddleware, controller.fetchUserById)
  router.delete('/:id', authMiddleware, controller.deleteUser)
  router.get('/phone/:phone', authMiddleware, controller.fetchUserByPhone)
 

  return router
}
