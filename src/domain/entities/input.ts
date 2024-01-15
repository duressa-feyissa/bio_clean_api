export interface IInput {
  _id?: string
  type: string
  water: number
  methanol: number
  waste: number
  createdAt?: Date
  updatedAt?: Date
  waterProduction?: number
  bioGasProduction?: number
  currentBioGasProduction?: number
  currentWaterProduction?: number
  machineId?: string
}

export default function Input({
  _id,
  type,
  water,
  methanol,
  waste,
  waterProduction,
  bioGasProduction,
  currentBioGasProduction,
  currentWaterProduction,
  machineId,
  createdAt,
  updatedAt,
}: IInput) {
  return Object.freeze({
    getId: () => _id,
    getType: () => type,
    getWater: () => water,
    getMethanol: () => methanol,
    getWaste: () => waste,
    getWaterProduction: () => waterProduction,
    getBioGasProduction: () => bioGasProduction,
    getCurrentBioGasProduction: () => currentBioGasProduction,
    getCurrentWaterProduction: () => currentWaterProduction,
    getMachineId: () => machineId,
    getCreatedAt: () => createdAt,
    getUpdatedAt: () => updatedAt,
  })
}
