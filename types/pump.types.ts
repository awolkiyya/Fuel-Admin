export type EquipmentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"


export interface Nozzle {

  id:string
  number:number

  fuelType:{
    id:string
    name:string
  }

  status:EquipmentStatus

}


export interface Dispenser {

  id:string

  number:number

  status:EquipmentStatus

  nozzles:Nozzle[]

}