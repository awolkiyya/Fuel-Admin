export type BusinessLicenseStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "EXPIRED";


export type BusinessLicenseRequestType =
  | "NEW"
  | "RENEWAL";


export interface BusinessLicenseUser {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  profile_image?: string | null;
}


export interface BusinessLicense {

  id: string;

  userId: string;

  licenseNumber: string;

  documentUrl?: string | null;

  expiryDate?: string | null;


  requestType:
    BusinessLicenseRequestType;


  status:
    BusinessLicenseStatus;


  issuedBy?: string | null;

  issuedAt?: string | null;


  createdAt: string;

  updatedAt: string;
  rejectionReason?:string;


  user?: BusinessLicenseUser;

}



export interface BusinessLicenseMeta {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNext: boolean;

  hasPrev: boolean;

}



export interface BusinessLicenseListResponse {

  success: boolean;

  message: string;


  data: BusinessLicense[];


  meta: BusinessLicenseMeta;

}



export interface BusinessLicenseSummary {


  total: number;

  pending: number;

  active: number;

  rejected: number;

  expired: number;


  newRequests: number;

  renewRequests: number;

}