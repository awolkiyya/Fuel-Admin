//
// =====================================================
// ORGANIZATION TYPES
// =====================================================

// =====================================================
// ORGANIZATION TYPE
// =====================================================

export type OrgType =
  | "GOVERNMENT"
  | "PRIVATE"
  | "NGO"
  | "PUBLIC_ENTERPRISE"
  | "PRIVATE_COMPANY"
  | "OTHER";

// =====================================================
// ORGANIZATION STATUS
// =====================================================

export type OrgStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "BLOCKED"
  | "SUSPENDED";

export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL"


export type QuotaStatus = "ACTIVE" | "EXPIRED" | "EXHAUSTED" | "SUSPENDED"



// =====================================================
// ORGANIZATION
// =====================================================

export interface Organization {
  id: string;

  // -------------------------------------------------
  // BASIC IDENTITY
  // -------------------------------------------------

  name: string;

  type: OrgType;

  registrationNumber?: string | null;

  // -------------------------------------------------
  // CONTACT
  // -------------------------------------------------

  contactPerson?: string | null;

  phone?: string | null;

  email?: string | null;

  address?: string | null;

  // -------------------------------------------------
  // STATUS
  // -------------------------------------------------

  status: OrgStatus;

  // -------------------------------------------------
  // FUEL ACCESS CONTROL
  // -------------------------------------------------

  allowFuelAccess: boolean;

  requiresQuota: boolean;

  maxTransactionLiters: number;

  // -------------------------------------------------
  // API / INTEGRATION
  // -------------------------------------------------

  apiKey?: string | null;

  // -------------------------------------------------
  // AUDIT
  // -------------------------------------------------

  createdAt: string;

  updatedAt: string;

  // -------------------------------------------------
  // OPTIONAL RELATIONS
  // -------------------------------------------------

  fuelQuotas?: OrganizationQuotaSummary[];

  fuelTransactions?: OrganizationTransactionSummary[];
}

// =====================================================
// ORGANIZATION SUMMARY
// =====================================================
//
// Used when Organization is embedded inside another
// resource such as FuelQuota.
//

export interface OrganizationSummary {
  id: string;

  name: string;

  type: OrgType;

  status: OrgStatus;

  allowFuelAccess: boolean;

  quotaEnabled: boolean;

  maxTransactionLiters?: number;
}

// =====================================================
// ORGANIZATION QUOTA SUMMARY
// =====================================================

export interface OrganizationQuotaSummary {
  id: string;

  fuelTypeId: string;
  fuelType: {
    id: string;
    name: string;
  };

  periodType: string;

  startDate: string;

  endDate: string;

  allocatedLiters: number;

  consumedLiters: number;

  status: string;
}

// =====================================================
// ORGANIZATION TRANSACTION SUMMARY
// =====================================================
//
// Keep this lightweight. Do not duplicate the entire
// Transaction model here.
//

export interface OrganizationTransactionSummary {
  id: string;

  liters: number;

  createdAt: string;

  status?: string;
}

// =====================================================
// CREATE ORGANIZATION
// =====================================================

export interface CreateOrganizationPayload {
  name: string;

  type: OrgType;

  registrationNumber?: string | null;

  contactPerson?: string | null;

  phone?: string | null;

  email?: string | null;

  address?: string | null;

  allowFuelAccess?: boolean;

  requiresQuota?: boolean;

  maxTransactionLiters?: number;
}

// =====================================================
// UPDATE ORGANIZATION
// =====================================================

export interface UpdateOrganizationPayload {
  name?: string;

  type?: OrgType;

  registrationNumber?: string | null;

  contactPerson?: string | null;

  phone?: string | null;

  email?: string | null;

  address?: string | null;

  allowFuelAccess?: boolean;

  requiresQuota?: boolean;

  maxTransactionLiters?: number;
}

// =====================================================
// ORGANIZATION STATUS UPDATE
// =====================================================

export interface UpdateOrganizationStatusPayload {
  status: OrgStatus;
}

// =====================================================
// ORGANIZATION FUEL ACCESS UPDATE
// =====================================================

export interface UpdateOrganizationFuelAccessPayload {
  allowFuelAccess: boolean;

  quotaEnabled?: boolean;

  maxTransactionLiters?: number;
}

// =====================================================
// ORGANIZATION FILTERS
// =====================================================

export interface OrganizationFilters {
  search?: string;

  type?: OrgType;

  status?: OrgStatus;

  allowFuelAccess?: boolean;

  requiresQuota?: boolean;
}



// =====================================================
// ORGANIZATION STATISTICS
// =====================================================

export interface OrganizationStatistics {
  total: number;

  active: number;

  inactive: number;

  suspended: number;

  fuelAccessEnabled: number;

  quotaEnabled: number;

  quotaDisabled: number;
}

// =====================================================
// ORGANIZATION FORM VALUES
// =====================================================

export interface OrganizationFormValues {
  name: string;

  type: OrgType;

  registrationNumber: string;

  contactPerson: string;

  phone: string;

  email: string;

  address: string;

  allowFuelAccess: boolean;

  requiresQuota: boolean;

  maxTransactionLiters: number;
}

// =====================================================
// ORGANIZATION STATUS CONFIG
// =====================================================

export interface OrganizationStatusConfig {
  label: string;

  description: string;

  className?: string;
}

// =====================================================
// ORGANIZATION TYPE CONFIG
// =====================================================

export interface OrganizationTypeConfig {
  label: string;

  description: string;
}
