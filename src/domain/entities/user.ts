export interface IUser {
  _id?: string
  firstName?: string
  lastName?: string
  phone?: string
  password?: string
  role: string
  image?: string
  createdAt: Date
  machines?: string[]
}

export default function User({
  _id,
  password,
  firstName,
  lastName,
  phone,
  role,
  image,
  createdAt,
  machines,
}: IUser) {
  return Object.freeze({
    getId: () => _id,
    getPassword: () => password,
    getFirstName: () => firstName,
    getLastName: () => lastName,
    getPhone: () => phone,
    getRole: () => role,
    getImage: () => image,
    getCreatedAt: () => createdAt,
    getMachines: () => machines,
  })
}
