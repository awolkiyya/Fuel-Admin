import { api } from "@/lib/api";

import {
  ApiResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/types/api";

import { formatApiError } from "@/utils/apiError";

import {
  BusinessLicense,
  BusinessLicenseSummary,
  BusinessLicenseStatus,
  BusinessLicenseRequestType,
} from "@/types/business-license";



/* ---------------------------------------
   BUSINESS LICENSE SERVICE
----------------------------------------*/
export const businessLicenseService = {


  /**
   * =====================================
   * GET ALL BUSINESS LICENSES (ADMIN)
   * =====================================
   */
  async getBusinessLicenses(params?: {

    page?: number;

    limit?: number;

    search?: string;

    status?: BusinessLicenseStatus;

    requestType?: BusinessLicenseRequestType;

  }) {


    try {


      const res =
        await api.get<
          PaginatedResponse<
            BusinessLicense,
            BusinessLicenseSummary
          >
        >(
          "/license/admin",
          {
            params,
          }
        );


      return res.data;


    } catch(error) {

      throw formatApiError(error);

    }

  },



  /**
   * =====================================
   * GET SUMMARY
   * =====================================
   */
  async getSummary() {


    try {


      const res =
        await api.get<
          SingleResponse<BusinessLicenseSummary>
        >(
          "/license/admin/summary"
        );


      return res.data.data;


    } catch(error) {


      throw formatApiError(error);


    }

  },



  /**
   * =====================================
   * GET LICENSE DETAILS
   * =====================================
   */
  async getBusinessLicenseById(
    id:string
  ) {


    try {


      const res =
        await api.get<
          SingleResponse<BusinessLicense>
        >(
          `/license/admin/${id}`
        );


      return res.data.data;


    } catch(error) {


      throw formatApiError(error);


    }

  },



  /**
   * =====================================
   * APPROVE LICENSE
   * =====================================
   */
  async approveLicense(
    id:string,
    data?:{
      licenseNumber?:string;
      expiryDate?:string;
    }
  ) {


    try {


      const res =
        await api.patch<
          ApiResponse<BusinessLicense>
        >(
          `/license/admin/${id}/approve`,
          data
        );


      return res.data.data;


    } catch(error) {


      throw formatApiError(error);


    }

  },



  /**
   * =====================================
   * REJECT LICENSE
   * =====================================
   */
  async rejectLicense(
    id:string,
    reason:string
  ) {


    try {


      const res =
        await api.patch<
          ApiResponse<BusinessLicense>
        >(
          `/license/admin/${id}/reject`,
          {
            reason,
          }
        );


      return res.data.data;


    } catch(error) {


      throw formatApiError(error);


    }

  },


};