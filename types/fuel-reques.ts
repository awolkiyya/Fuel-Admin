/* ---------------------------------
   COMMON TYPES
---------------------------------- */

import { Nozzle } from "./pump.types"
import { VehicleType } from "./vehicle";

/* ---------------------------------
   STATUS
---------------------------------- */

export  type FuelRequestStatus =
  | "PENDING"      // in queue, not touched
  | "VERIFIED"     // operator clicked Start Now — validated + locked
  | "APPROVED"     // liters confirmed
  | "DISPENSING"   // fuel flow
  | "COMPLETED"    // finished
  | "REJECTED"
  | "CANCELLED";


  export type RejectionPriority = "LOW" | "MEDIUM" | "HIGH";

  export interface RejectionReason {
    id: string;
    code: string;
    label: string;
    priority: RejectionPriority;
  }

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "BLOCKED";

export interface User {
  id: string;

  full_name: string;
  phone: string;
  email?: string;

  profile_image?: string;

  gender: "MALE" | "FEMALE" | "OTHER";

  role: string; // UserRole (keep enum from backend)

  status: UserStatus;

  stationId?: string;

  createdAt: string;
  updatedAt: string;
}
export interface DriverProfile {
   id: string;
 
   userId: string;
 
   age: number;
 
   nationalId: string;
   licenseNumber: string;
 
   licenseExpiry?: string;
 
   isVerified: boolean;
 
   createdAt: string;
   updatedAt: string;
 }

 export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface UserRisk {
  id: string;
  userId: string;

  level: RiskLevel;

  reason?: string;

  createdAt: string;
}

export interface DriverUserView {
   // identity
   id: string;
   full_name: string;
   phone: string;
   email?: string;
   profile_image?: string;
   gender: "MALE" | "FEMALE" | "OTHER";
 
   // system
   role: string;
   status: UserStatus;
 
   // driver profile
   driverProfile: DriverProfile | null;
 
   // computed
   riskLevel: RiskLevel;
 }

/* ---------------------------------
   FUEL TYPE
---------------------------------- */

export interface FuelType {
  id: string
  name: string
  price: number
}

/* ---------------------------------
   STATION
---------------------------------- */

export interface Station {
  id: string
  name: string
  city?: string
  region?: string
  status?: string
}

interface TimelineEvent {
  status: FuelRequestStatus;
  label: string;
  actor: string;
  timestamp: string;
  note?: string;
}

/* ---------------------------------
   VEHICLE
---------------------------------- */

export interface Vehicle {
  id: string
  plateNumber: string
  vin: string
  regionCode?: string
  fuelCapacity: number
  fuelType: FuelType
  vehicleType:VehicleType

  isVerified: boolean
  isActive: boolean
}

/* ---------------------------------
   OPERATOR (assignedTo)
---------------------------------- */

export interface AssignedOperator {
  id: string
  full_name: string
  phone?: string
  role?: string
}

/* ---------------------------------
   FUEL REQUEST (MAIN MODEL)
---------------------------------- */

export interface FuelRequest {
  // ================= CORE =================
  id: string
  requestCode: string

  // ================= LITERS =================
  requested: number
  approved?: number | null
  dispensed?: number | null

  // ================= STATUS =================
  status: FuelRequestStatus

  // ================= TIMELINE =================
  verifiedAt?: string | null
  approvedAt?: string | null
  completedAt?: string | null
  cancelledAt?: string | null

  // ================= OPERATOR =================
  assignedTo?: AssignedOperator | null

  // ================= REJECTION =================
  rejectionReason?: RejectionReason | null
  rejectionNote?: string | null

  // ================= RELATIONS =================
  user?: DriverUserView
  vehicle: Vehicle
  fuelType: FuelType
  station: Station
  nozzle?: Nozzle | null

  // ================= META =================
  createdAt: string
  updatedAt: string
  timeline: TimelineEvent[];

}

/* ---------------------------------
   PROCESS PAYLOAD
---------------------------------- */

export interface ProcessFuelRequestPayload {
  approvedLiters: number
  note?: string
}

export interface FuelRequestSummary {
   pendingCount: number
   totalRequestedLiters: number
 }


 //   timeline: [
//     {
//       status: "VERIFIED",
//       label: "Verified and locked by operator",
//       actor: "Tigist Haile",
//       timestamp: "2025-06-10 09:16",
//     },
//     {
//       status: "PENDING",
//       label: "Request submitted",
//       actor: "Abebe Kebede",
//       timestamp: "2025-06-10 09:14",
//     },
//   ],