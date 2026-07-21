export type UserRole =
  | "admin"
  | "station_manager"
  | "station_staff"

  

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "BLOCKED"

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER"

  export interface AuthUser {
    id: string
  
    fullName: string
    phoneNumber: string
    email: string | null
    avatar: string | null

  
    role: UserRole
    status: UserStatus
    gender: Gender
  
    firebaseUid: string | null
  
    stationId: string | null
    station: StationRef | null
  
    permissions: string[]
  
    createdAt: string
  }

  export interface StationRef {
    id: string
    name: string
    lat: number
    lng: number
    status: string
  
    managerId: string | null
  }

  export interface LoginResponse {
    user: AuthUser
    accessToken: string
  }