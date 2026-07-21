export type TankAuditAction = "REFILL" | "ADJUSTMENT"


export type AdjustmentType =
  | "LOSS"
  | "LEAK"
  | "CALIBRATION"
  | "MANUAL_FIX"
  | "CORRECTION"

export interface AdjustTankPayload {
  stationId: string
  tankId: string
  newLevel: number
  reason: string
  adjustmentType: AdjustmentType
}

export interface AdjustTankMutationInput {
  stationId: string
  tankId: string
  newLevel: number
  reason?: string
  adjustmentType?: AdjustmentType
}

export interface TankAuditLog {
  id: string

  tankId: string
  tankName: string
  stationName: string

  action: TankAuditAction

  litersChange: number

  previousLevel: number
  newLevel: number

  reason?: string
  adjustmentType?: AdjustmentType

  performedBy: string
  performedRole: string

  createdAt: string
}