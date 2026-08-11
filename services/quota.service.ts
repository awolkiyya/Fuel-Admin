import { api } from "@/lib/api"
import { formatApiError } from "@/utils/apiError"

import {
  PaginatedResponse,
  SingleResponse,
} from "@/types/api"

import {
  ApproveQuotaPayload,
  CancelQuotaPayload,
  CreateQuotaPayload,
  FuelQuota,
  GetActiveQuotaParams,
  QuotaFilters,
  UpdateQuotaPayload,
} from "@/types/quota.types"


// =====================================================
// QUOTA SERVICE
// =====================================================


export const quotaService = {
  // ===================================================
  // GET QUOTAS
  // ===================================================


  async getQuotas(params?: {
    page?: number
    limit?: number
    filters?: QuotaFilters
  }): Promise<
    PaginatedResponse<FuelQuota>
  > {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
      } = params ?? {}


      const searchParams =
        new URLSearchParams()


      // -------------------------------------------------
      // PAGINATION
      // -------------------------------------------------


      searchParams.set(
        "page",
        String(page),
      )


      searchParams.set(
        "limit",
        String(limit),
      )


      // -------------------------------------------------
      // ORGANIZATION
      // -------------------------------------------------


      if (filters.organizationId) {
        searchParams.set(
          "organizationId",
          filters.organizationId,
        )
      }


      // -------------------------------------------------
      // FUEL TYPE
      // -------------------------------------------------


      if (filters.fuelTypeId) {
        searchParams.set(
          "fuelTypeId",
          filters.fuelTypeId,
        )
      }


      // -------------------------------------------------
      // PERIOD TYPE
      // -------------------------------------------------


      if (filters.periodType) {
        searchParams.set(
          "periodType",
          filters.periodType,
        )
      }


      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------


      if (filters.status) {
        searchParams.set(
          "status",
          filters.status,
        )
      }


      // -------------------------------------------------
      // START DATE
      // -------------------------------------------------


      if (filters.startDate) {
        searchParams.set(
          "startDate",
          filters.startDate,
        )
      }


      // -------------------------------------------------
      // END DATE
      // -------------------------------------------------


      if (filters.endDate) {
        searchParams.set(
          "endDate",
          filters.endDate,
        )
      }


      // -------------------------------------------------
      // REQUEST
      // -------------------------------------------------


      const { data } =
        await api.get<
          PaginatedResponse<FuelQuota>
        >(
          `/organizations/quotas?${searchParams.toString()}`,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // GET QUOTA BY ID
  // ===================================================


  async getQuota(
    id: string,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.get<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/${id}`,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // CREATE QUOTA
  // ===================================================


  async createQuota(
    payload: CreateQuotaPayload,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.post<
          SingleResponse<FuelQuota>
        >(
          "/organizations/quotas",
          payload,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // UPDATE QUOTA
  // ===================================================


  async updateQuota(
    id: string,
    payload: UpdateQuotaPayload,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.patch<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/${id}`,
          payload,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // APPROVE QUOTA
  // ===================================================


  async approveQuota(
    id: string,
    payload: ApproveQuotaPayload,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.post<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/${id}/approve`,
          payload,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // CANCEL QUOTA
  // ===================================================


  async cancelQuota(
    id: string,
    payload: CancelQuotaPayload,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.post<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/${id}/cancel`,
          payload,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // GET ACTIVE QUOTA
  // ===================================================


  async getActiveQuota(
    params: GetActiveQuotaParams,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const searchParams =
        new URLSearchParams()


      // -------------------------------------------------
      // ORGANIZATION
      // -------------------------------------------------


      searchParams.set(
        "organizationId",
        params.organizationId,
      )


      // -------------------------------------------------
      // FUEL TYPE
      // -------------------------------------------------


      searchParams.set(
        "fuelTypeId",
        params.fuelTypeId,
      )


      // -------------------------------------------------
      // DATE
      // -------------------------------------------------


      if (params.date) {
        searchParams.set(
          "date",
          params.date,
        )
      }


      // -------------------------------------------------
      // REQUEST
      // -------------------------------------------------


      const { data } =
        await api.get<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/active?${searchParams.toString()}`,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },


  // ===================================================
  // REFRESH QUOTA STATUS
  // ===================================================


  async refreshQuotaStatus(
    id: string,
  ): Promise<
    SingleResponse<FuelQuota>
  > {
    try {
      const { data } =
        await api.post<
          SingleResponse<FuelQuota>
        >(
          `/organizations/quotas/${id}/refresh-status`,
        )


      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },
}
