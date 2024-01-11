import { NextFunction, Request, Response } from 'express'
import createInput from '../../application/use_cases/input/create'
import removeInput from '../../application/use_cases/input/delete'
import findById from '../../application/use_cases/input/findById'
import updateInput from '../../application/use_cases/input/update'
import viewInput from '../../application/use_cases/input/views'
import { IInputRepository } from '../../domain/repositories/input'
import { IInputRepositoryImpl } from '../../infrastructure/repositories/input'

export default function inputController(
  inputRepository: IInputRepository,
  inputRepositoryImpl: IInputRepositoryImpl,
) {
  const dbRepository = inputRepository(inputRepositoryImpl())

  const fetchInputById = (req: Request, res: Response, next: NextFunction) => {
    findById(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const deleteInput = (req: Request, res: Response, next: NextFunction) => {
    removeInput(req.params.id, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const updateInputfetch = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    updateInput(req.params.id, req.body, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const createInputFetch = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    createInput(req.params.machineId, req.body, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  const fetchViewsInput = (req: Request, res: Response, next: NextFunction) => {
    viewInput(req.params.machineId, dbRepository)
      .then(user => res.json(user))
      .catch(error => next(error))
  }

  return {
    fetchInputById,
    deleteInput,
    updateInputfetch,
    createInputFetch,
    fetchViewsInput,
  }
}
