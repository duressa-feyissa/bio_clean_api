import { Types } from 'mongoose'
import CustomError from '../../config/error'
import User, { IUser } from '../../domain/entities/user'
import UserModel from '../database/models/user'

export type IUserRepositoryImpl = () => {
  findById: (id: string) => Promise<IUser>

  deleteUser: (id: string) => Promise<IUser>

  findByPhone: (phone: string) => Promise<IUser>
  createUser: (user: ReturnType<typeof User>) => Promise<IUser>
}

const ROLES = ['ADMIN', 'USER']
export default function userRepositoryMongoDB() {
  const findById = (id: string): Promise<IUser> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid user id`, 400),
      )
    }

    return UserModel.findById(id)
      .select('-password')
      .then((user: any) => {
        if (!user) {
          return Promise.reject(
            new CustomError(`User with id ${id} not found`, 404),
          )
        }
        return user as IUser
      })
  }

  const deleteUser = (id: string): Promise<IUser> => {
    if (!Types.ObjectId.isValid(id)) {
      return Promise.reject(
        new CustomError(`${id} is not a valid user id`, 400),
      )
    }

    return UserModel.findByIdAndDelete(id)
      .select('-password')
      .then((user: any) => {
        if (!user) {
          return Promise.reject(
            new CustomError(`User with id ${id} not found`, 404),
          )
        }
        return user as IUser
      })
  }

  const findByPhone = (phone: string): Promise<IUser> => {
    return UserModel.findOne({ phone })
      .select('-__v')
      .select('-machines')
      .then((user: IUser | null) => {
        if (!user) {
          return Promise.reject(
            new CustomError(`User with phone ${phone} not found`, 404),
          )
        }
        return user
      })
  }

  const createUser = async (user: ReturnType<typeof User>): Promise<IUser> => {
    if (user.getPhone()) {
      const existingUserByPhone = await UserModel.findOne({
        phone: user.getPhone(),
      })
      if (existingUserByPhone)
        return Promise.reject(
          new CustomError(`Phone ${user.getPhone()} is already in use`, 400),
        )
    }

    return UserModel.create({
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      phone: user.getPhone(),

      password: user.getPassword(),
      role: user.getRole(),

      image: user.getImage(),

      createAt: user.getCreatedAt(),
    }).then((user: IUser) => user)
  }

  return {
    findById,
    deleteUser,
    findByPhone,
    createUser,
  }
}
