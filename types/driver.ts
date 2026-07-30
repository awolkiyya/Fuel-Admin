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
  vin: string
  fuelCapacity: number | null
  regionCode: string | null
  isVerified: boolean
  isActive: boolean

  vehicleType: {
    name: string
  }

  fuelType: {
    name: string
  }

  createdAt: string
}

/* -----------------------------
   DRIVER PROFILE
------------------------------ */
export interface DriverProfile {
  id: string
  age: number | null
  nationalId: string | null
  licenseNumber: string |null
  licenseExpiry: string | null
  isVerified: boolean
}

/* -----------------------------
   BUSINESS LICENSE
------------------------------ */
export interface DriverBusinessLicense {
  id: string
  licenseNumber: string
  documentUrl: string | null
  expiryDate: string | null

  status: "PENDING" | "ACTIVE" | "REJECTED" | "EXPIRED"
  requestType: "NEW" | "RENEWAL"

  rejectionReason: string | null
  issuedBy: string | null
  issuedAt: string | null

  createdAt: string
  updatedAt: string
}

/* -----------------------------
   RISK
------------------------------ */
export interface DriverRisk {
  id: string
  level: RiskLevel
  status: string
  reason: string | null
  detectedBy: string | null
  createdAt: string
}

export interface DriverRiskSummary {
  level: RiskLevel
  status: string | null
  reason: string | null
  highRiskCount: number
  activeRiskCount: number
}

/* -----------------------------
   MAIN DRIVER TYPE
------------------------------ */
export interface DriverUser {
  id: string

  /* BASIC INFO */
  full_name: string
  phone: string
  email: string | null
  profile_image: string | null
  role: string
  gender: string | null

  /* STATUS */
  status: DriverStatus

  /* PROFILE */
  driverProfile: DriverProfile | null

  /* VEHICLES */
  vehicles: DriverVehicle[]
  vehicleCount: number
  hasSingleVehicle: boolean
  hasMultipleVehicles: boolean

  /* BUSINESS LICENSE */
  businessLicense: DriverBusinessLicense | null

  /* RISKS */
  risks: DriverRisk[]
  riskSummary: DriverRiskSummary

  /* AUDIT */
  createdAt: string
  updatedAt: string
}