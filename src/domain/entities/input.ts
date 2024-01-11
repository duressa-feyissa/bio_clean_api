export interface IInput {
  _id?: string
  type: string
  water: number
  methanol: number
  waste: number
  createdAt?: Date
  updatedAt?: Date
}

export default function Input({
  _id,
  type,
  water,
  methanol,
  waste,
  createdAt,
  updatedAt,
}: IInput) {
  return Object.freeze({
    getId: () => _id,
    getType: () => type,
    getWater: () => water,
    getMethanol: () => methanol,
    getWaste: () => waste,
    getCreatedAt: () => createdAt,
    getUpdatedAt: () => updatedAt,
  })
}
