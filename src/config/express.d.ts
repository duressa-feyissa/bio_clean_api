import { IUser } from '../infrastructure/entities/user'

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}
