import { Express, Router } from 'express'
import authRouter from './auth'
import inputRouter from './inputs'
import machineRouter from './machine'
import userRouter from './user'

export default function routes(app: Express) {
  app.use('/api/v1/auth/', authRouter(Router()))
  app.use('/api/v1/users/', userRouter(Router()))
  app.use('/api/v1/machines/', machineRouter(Router()))
  app.use('/api/v1/inputs/', inputRouter(Router()))
}
