import { FuelType } from "./pump.types"


type Status =
  | "pending"
  | "claimed"
  | "verifying"
  | "approved"
  | "assigned"
  | "dispensing"
  | "completed"
  | "rejected"

/* ================= MAIN MODEL ================= */

type FuelRequest = {
  /* ================= CORE IDS ================= */
  id: string
  driverId: string
  vehicleId: string
  stationId: string

  /* ================= DRIVER INFO ================= */
  driverName: string
  driverNationalId: string
  driverLicense: string
  driverPhone: string
  driverPhotoUrl?: string

  driverStatus: "ACTIVE" | "SUSPENDED" | "BLACKLISTED"
  driverRiskScore: number // 0–100

  driverVerified: boolean // ✅ SINGLE DECISION

  /* ================= VEHICLE INFO ================= */
  plateNumber: string
  vehicleIdentityNumber: string // VIN / Chassis unified

  vehicleType: string
  fuelType: FuelType

  vehicleVerified: boolean // ✅ SINGLE DECISION
  vehicleOwnerVerified: boolean

  registrationStatus: "VALID" | "EXPIRED" | "SUSPENDED"

  /* ================= FUEL POLICY ================= */
  requestedLiters: number
  maxDailyLimit: number
  todayConsumed?: number

  fuelPricePerLiter: number
  estimatedCost: number

  /* ================= WORKFLOW ================= */
  status: Status

  assignedTo?: string | null
  assignedBy?: string | null
  assignedAt?: string | null

  /* ================= VERIFICATION META ================= */
  verificationMeta?: {
    verifiedBy: string | null
    verifiedAt: string | null
    method: "MANUAL" | "AUTOMATED" | "BIOMETRIC"
  }

  /* ================= NOZZLE / DISPENSING ================= */
  assignedNozzle?: {
    stationId: string
    pumpId: string
    nozzleId: string
  } | null

  dispensing?: {
    startedAt: string | null
    completedAt: string | null
    dispensedLiters: number
  }

  /* ================= RISK ================= */
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  fraudFlags: string[]
  overrideBySupervisor: boolean

  /* ================= TIMELINE ================= */
  createdAt: string
  claimedAt?: string | null
  verifiedAt?: string | null
  approvedAt?: string | null
  completedAt?: string | null

  /* ================= NOTES ================= */
  rejectionReason?: string | null
  attendantNotes: string
  systemNotes: string
}

export type RejectionPriority = "LOW" | "MEDIUM" | "HIGH";

export interface RejectionReason {
  id: string;
  code: string;
  label: string;
  priority: RejectionPriority;
}