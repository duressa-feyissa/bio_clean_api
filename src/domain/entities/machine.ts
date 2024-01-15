export interface IMachine {
  _id?: string
  name: string
  serialNumber: string
  location: string
  userId?: string
  createdAt: Date
  updatedAt?: Date
}

export default function Machine({
  _id,
  name,
  serialNumber,
  location,
  userId,
  createdAt,
  updatedAt,
}: IMachine) {
  return Object.freeze({
    getId: () => _id,
    getName: () => name,
    getSerialNumber: () => serialNumber,
    getLocation: () => location,
    getUserId: () => userId,
    getCreatedAt: () => createdAt,
    getUpdatedAt: () => updatedAt,
  })
}
