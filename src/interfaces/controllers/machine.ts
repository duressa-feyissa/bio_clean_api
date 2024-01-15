import { NextFunction, Request, Response } from 'express'
import createMachine from '../../application/use_cases/machine/create'
import removeMachine from '../../application/use_cases/machine/delete'
import findById from '../../application/use_cases/machine/findById'
import updateMachine from '../../application/use_cases/machine/update'
import viewsMachine from '../../application/use_cases/machine/view'
import { IMachineRepository } from '../../domain/repositories/machine'
import { IMachineRepositoryImpl } from '../../infrastructure/repositories/machine'

export default function machineController(
  machineRepository: IMachineRepository,
  machineRepositoryImpl: IMachineRepositoryImpl,
) {
  const dbRepository = machineRepository(machineRepositoryImpl())

  const fetchMachineById = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    findById(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const deleteMachine = (req: Request, res: Response, next: NextFunction) => {
    removeMachine(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const updateMachinefetch = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    updateMachine(req.params.id, req.body, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const createMachineFetch = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    createMachine(req.params.userId, req.body, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const fetchViewsMachine = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const serialNumbers = (req.query.serialNumbers as string[]) || []
    viewsMachine(req.params.userId, serialNumbers, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  return {
    fetchMachineById,
    deleteMachine,
    updateMachinefetch,
    createMachineFetch,
    fetchViewsMachine,
  }
}
