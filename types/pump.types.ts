export type FuelType = "Petrol" | "Diesel"

export type NozzleStatus = "active" | "maintenance" | "offline"
export type PumpStatus = "active" | "inactive" | "maintenance"

/* -----------------------------
   CORE API TYPES (aligned with DB)
------------------------------*/
export type Nozzle = {
  id: string
  number: number
  fuelType: FuelType
  status: NozzleStatus
}

export type Pump = {
  id: string
  number: number
  status: PumpStatus
  nozzles: Nozzle[]
}