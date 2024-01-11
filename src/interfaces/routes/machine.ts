import { Router } from 'express'
import machineDBRepository from '../../domain/repositories/machine'
import machineRepositoryMongoDB from '../../infrastructure/repositories/machine'
import machineController from '../controllers/machine'
import authMiddleware from '../middlewares/authMiddleware'

export default function machineRouter(router: Router) {
  const controller = machineController(
    machineDBRepository,
    machineRepositoryMongoDB,
  )

  router.post('/:userId', authMiddleware, controller.createMachineFetch)
  router.get('/:id', authMiddleware, controller.fetchMachineById)
  router.delete('/:id', authMiddleware, controller.deleteMachine)
  router.get('/:userId/views', authMiddleware, controller.fetchViewsMachine)
  router.put('/:id', authMiddleware, controller.updateMachinefetch)

  return router
}
