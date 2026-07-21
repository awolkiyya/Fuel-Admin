export type DriverStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "BLOCKED"

export type RiskLevel = "low" | "medium" | "high"

/* -----------------------------
   VEHICLE
------------------------------ */
export interface DriverVehicle {
  id: string
  plateNumber: string
}

/* -----------------------------
   DRIVER PROFILE (NEW)
------------------------------ */
export interface DriverProfile {
  age: number | null
  nationalId: string | null
  licenseNumber: string | null
  licenseExpiry: string | null
  isVerified: boolean
}

/* -----------------------------
   MAIN DRIVER TYPE
------------------------------ */
export interface DriverUser {
  id: string

  /* BASIC INFO */
  fullName: string
  phone: string
  email: string | null
  avatar: string | null

  /* STATUS */
  status: DriverStatus

  /* PROFILE */
  driverProfile: DriverProfile | null

  /* RISK */
  riskLevel: RiskLevel
  riskStatus: string | null
  riskReason: string | null

  /* VEHICLES */
  vehicleCount: number
  hasSingleVehicle: boolean
  hasMultipleVehicles: boolean
  vehicles: DriverVehicle[]

  /* AUDIT */
  createdAt: string
}