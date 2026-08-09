// =====================================================
// QUOTA ENUMS
// =====================================================

export type QuotaPeriodType =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "CUSTOM";

export type QuotaStatus =
  | "ACTIVE"
  | "EXHAUSTED"
  | "EXPIRED"
  | "CANCELLED";

// =====================================================
// ORGANIZATION SUMMARY
// =====================================================

export interface QuotaOrganizationSummary {
  id: string;
  name: string;
  type: string;
  status: string;

  allowFuelAccess: boolean;
  quotaEnabled: boolean;

  maxTransactionLiters?: number;
}

// =====================================================
// FUEL TYPE SUMMARY
// =====================================================

export interface QuotaFuelTypeSummary {
  id: string;
  name: string;
}

// =====================================================
// QUOTA
// =====================================================

export interface FuelQuota {
  id: string;

  organizationId: string;
  fuelTypeId: string;

  periodType: QuotaPeriodType;

  startDate: string;
  endDate: string;

  allocatedLiters: number;
  consumedLiters: number;

  remainingLiters: number;
  utilizationPercentage: number;

  assignedByUserId?: string | null;

  approvedAt?: string | null;

  referenceNumber?: string | null;

  remarks?: string | null;

  status: QuotaStatus;

  createdAt: string;
  updatedAt: string;

  organization?: QuotaOrganizationSummary;

  fuelType?: QuotaFuelTypeSummary;
}

// =====================================================
// CREATE QUOTA
// =====================================================

export interface CreateQuotaPayload {
  organizationId: string;

  fuelTypeId: string;

  periodType: QuotaPeriodType;

  startDate: string;

  endDate: string;

  allocatedLiters: number;

  assignedByUserId?: string | null;

  referenceNumber?: string | null;

  remarks?: string | null;
}

// =====================================================
// UPDATE QUOTA
// =====================================================

export interface UpdateQuotaPayload {
  fuelTypeId?: string;

  periodType?: QuotaPeriodType;

  startDate?: string;

  endDate?: string;

  allocatedLiters?: number;

  referenceNumber?: string | null;

  remarks?: string | null;
}

// =====================================================
// APPROVE QUOTA
// =====================================================

export interface ApproveQuotaPayload {
  approvedByUserId: string;

  remarks?: string | null;
}

// =====================================================
// CANCEL QUOTA
// =====================================================

export interface CancelQuotaPayload {
  reason: string;
}

// =====================================================
// QUOTA FILTERS
// =====================================================

export interface QuotaFilters {
  organizationId?: string;

  fuelTypeId?: string;

  periodType?: QuotaPeriodType;

  status?: QuotaStatus;

  startDate?: string;

  endDate?: string;
}

// =====================================================
// PAGINATION
// =====================================================

export interface PaginationMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

// =====================================================
// QUOTA LIST RESPONSE
// =====================================================

export interface QuotaListResponse {
  data: FuelQuota[];

  meta: PaginationMeta;
}

// =====================================================
// ACTIVE QUOTA QUERY
// =====================================================

export interface GetActiveQuotaParams {
  organizationId: string;

  fuelTypeId: string;

  date?: string;
}

// =====================================================
// API RESPONSE
// =====================================================

export interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;

  meta?: PaginationMeta;
}

// =====================================================
// QUOTA STATISTICS
// =====================================================

export interface QuotaStatistics {
  allocatedLiters: number;

  consumedLiters: number;

  remainingLiters: number;

  utilizationPercentage: number;
}

// =====================================================
// QUOTA FORM VALUES
// =====================================================

export interface QuotaFormValues {
  organizationId: string;

  fuelTypeId: string;

  periodType: QuotaPeriodType;

  startDate: string;

  endDate: string;

  allocatedLiters: number;

  assignedByUserId?: string;

  referenceNumber?: string;

  remarks?: string;
}

// =====================================================
// QUOTA STATUS CONFIG
// =====================================================

export interface QuotaStatusConfig {
  label: string;

  description: string;

  className?: string;
}