// =====================================================
// TRANSACTION TYPES
// =====================================================

export type FuelTransactionType =
  | "NORMAL"
  | "ORGANIZATION"
  | "VEHICLE";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "PARTIAL"
  | "CANCELLED";


// =====================================================
// CREATE ORGANIZATION TRANSACTION
// =====================================================

export interface CreateOrganizationTransactionPayload {
    type: "ORGANIZATION";
  
    organizationId: string;
  
    stationId: string;
  
    fuelTypeId: string;
  
    attendantId?: string;
  
    nozzleId?: string;
  
    litersGiven: number;
  
    paymentStatus?: PaymentStatus;
  }


// =====================================================
// TRANSACTION
// =====================================================

export interface Transaction {
  id: string;

  type: FuelTransactionType;

  fuelRequestId?: string | null;

  userId?: string | null;

  organizationId?: string | null;

  vehicleId?: string | null;

  stationId: string;

  attendantId?: string | null;

  nozzleId?: string | null;

  fuelTypeId: string;

  litersGiven: number;

  pricePerLiter: number;

  totalCost: number;

  paymentStatus: PaymentStatus;

  createdAt: string;

  updatedAt: string;
}