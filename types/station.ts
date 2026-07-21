import { UserRole } from "./user"

export type StationStatus =
  | "active"
  | "congested"
  | "risk"
  | "inactive"
  | "deleted"

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "NONE"

export interface FuelInventory {
  fuelTypeId: string
  type: string

  maxCapacity: number
  level: number

  isActive: boolean // ✅ REQUIRED (from StationFuelType)
}

/* =========================
   CAMERA TYPE (NEW)
========================= */
export interface StationCamera {
  id: string
  name: string
  streamUrl: string
  type: "rtsp" | "http" | "webrtc" | "mobile_mock"
  location?: string | null
  status: "online" | "offline" | "testing"
}

/* =========================
   MAIN STATION TYPE
========================= */
export interface Station {
  id: string

  // ================= CORE =================
  name: string
  status: StationStatus

  isActive: boolean
  isDeleted?: boolean

  // ================= OPERATION =================
  queue?: number
  staff?: number
  risk?: RiskLevel

  // ================= LOCATION =================
  city: string
  region: string
  address?: string

  lat: number
  lng: number

  imageUrl?: string | null

  // ================= RELATIONS =================
  managerId?: string | null
  manager?: {
    id: string
    name: string
    phone?: string
  } | null

  fuelInventory?: FuelInventory[]

  cameras?: StationCamera[]   // 🔥 NEW IMPORTANT ADDITION

  // ================= TIMESTAMPS =================
  createdAt?: Date
  updatedAt?: Date
}

  export interface StationQuery {
    page?: number
    limit?: number
    search?: string
    status?: StationStatus
  }


  export type Manager = {
    id: string
    full_name: string
    phone?: string
  }
  
  
  export type ManagerProps = {
    station: Station
    managers: Manager[]
    trigger: React.ReactNode
      page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
  
    search?: string
    onSearchChange?: (value: string) => void
  
    loadingManagers?: boolean
  
    onAssign?: (stationId: string, managerId: string) => Promise<void> | void
  }

 export type FuelItem = {
  fuelTypeId: string
  type: string
  maxCapacity: number
  isActive: boolean
}

export type QueueZone = {
  x: number
  y: number
  width: number
  height: number
}

export type StaffStatus =
  | "ACTIVE"
  | "OFF"
  | "SUSPENDED"
  | "INACTIVE"

export type StationStaff = {
  id: string
  full_name: string
  phone: string
  gender:"MALE" | "FEMALE"
  email?: string
  status: StaffStatus
  role: "station_staff"
  stationId: string
  createdAt: string
  updatedAt: string
}