import { Router } from 'express'
import inputDBRepository from '../../domain/repositories/input'
import inputRepositoryMongoDB from '../../infrastructure/repositories/input'
import inputController from '../controllers/input'
import authMiddleware from '../middlewares/authMiddleware'

export default function inputRouter(router: Router) {
  const controller = inputController(inputDBRepository, inputRepositoryMongoDB)

  router.post('/:serialNumber/progress', controller.updateProduction)
  router.post('/:machineId', authMiddleware, controller.createInputFetch)
  router.get('/:id', authMiddleware, controller.fetchInputById)
  router.delete('/:id', authMiddleware, controller.deleteInput)
  router.get('/:machineId/views', authMiddleware, controller.fetchViewsInput)
  router.put('/:id', authMiddleware, controller.updateInputfetch)

  return router
}
