// types/vehicle.ts

export type VehicleStatus = "ACTIVE" | "INACTIVE"

export interface FuelType {
  id: string;
  name: string;
}


export interface VehicleType {
  id: string;
  name: string;

  // ================= RULE ENGINE =================
  maxLitersPerHour: number;
  minRefillIntervalMinutes: number;
  maxRefillsPerDay?: number;
  maxDailyLiters?: number; // optional policy rule
  code:number;
  requiresBusinessLicense?:boolean;

  // ================= RELATIONS =================
  fuelTypes: {
    id: string;
    name: string;
  }[];

  description?: string;
  status: VehicleStatus;

  createdAt: string;
  updatedAt: string;
}

export interface VehicleTypePayload {
  name: string;

  maxDailyLiters: number;

  fuelTypes: string[]; // ✅ IDs only (important)

  description?: string;
  status?: VehicleStatus;
}

export interface VehicleQuery {
  page?: number
  limit?: number
  search?: string
  status?: VehicleStatus
}