import User, { IUser } from '../../domain/entities/user'
import userRepositoryMongoDB from '../../infrastructure/repositories/user'

export type IUserRepository = (
  repository: ReturnType<typeof userRepositoryMongoDB>,
) => {
  findById: (id: string) => Promise<IUser>

  deleteUser: (id: string) => Promise<IUser>

  findByPhone: (phone: string) => Promise<IUser>
  createUser: (user: ReturnType<typeof User>) => Promise<IUser>
}

export default function userDbRepository(
  repository: ReturnType<typeof userRepositoryMongoDB>,
) {
  const findById = (id: string) => repository.findById(id)

  const deleteUser = (id: string) => repository.deleteUser(id)
  const findByPhone = (phone: string) => repository.findByPhone(phone)
  const createUser = (user: ReturnType<typeof User>) =>
    repository.createUser(user)

  return {
    findById,

    deleteUser,

    findByPhone,
    createUser,
  }
}
