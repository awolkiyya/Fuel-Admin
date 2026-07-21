/* ---------------------------------------
   TYPES
----------------------------------------*/
export type Tank = {
    id: string
    name: string
    capacity: number
    currentLevel: number
    createdAt?: string
}
  
export type StationFuelType = {
    id: string
  
    fuelType: {
      id: string
      name: string
    }
  
    maxCapacity: number
    tanks: Tank[]
  
    isActive?: boolean
  
    // optional computed (if backend sends)
    allocatedCapacity?: number
    remaining?: number
    utilization?: number
}
  
  /* ---------------------------------------
     DTOs
  ----------------------------------------*/
  export type CreateTankDTO = {
    stationId: string
    stationFuelTypeId: string
    name: string
    capacity: number // allocation size in liters
  }
  
export type RefillTankDTO = {
    stationId: string
    tankId: string
    amount: number
}