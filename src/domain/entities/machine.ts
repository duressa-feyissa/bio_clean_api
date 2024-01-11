export interface IMachine {
  _id?: string
  name: string
  serialNumber: string
  location: string
  createdAt: Date
  updatedAt?: Date
  inputs: string[]
}

export default function Machine({
  _id,
  name,
  serialNumber,
  location,
  createdAt,
  updatedAt,
}: IMachine) {
  return Object.freeze({
    getId: () => _id,
    getName: () => name,
    getSerialNumber: () => serialNumber,
    getLocation: () => location,
    getCreatedAt: () => createdAt,
    getUpdatedAt: () => updatedAt,
  })
}
