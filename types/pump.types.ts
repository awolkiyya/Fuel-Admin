export type EquipmentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"

export interface FuelType  {

  id: string;

  name: string;

};



export interface Nozzle {

  id: string;

  number: number;


  fuelType: FuelType;


  status: EquipmentStatus;



  // Parent dispenser
  dispenser?: {

    id: string;

    number: number;

    status: EquipmentStatus;

  };

}


export interface Dispenser {

  id:string

  number:number

  status:EquipmentStatus

  nozzles:Nozzle[]

}