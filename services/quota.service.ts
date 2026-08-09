import { api } from "@/lib/api";
import { ApproveQuotaPayload, CancelQuotaPayload, CreateQuotaPayload, FuelQuota, GetActiveQuotaParams, QuotaFilters, QuotaListResponse, UpdateQuotaPayload } from "@/types/quota.types";
import { formatApiError } from "@/utils/apiError";


// =====================================================
// QUOTA SERVICE
// =====================================================

export const quotaService = {
  // ===================================================
  // GET QUOTAS
  // ===================================================

  async getQuotas(params?: {
    page?: number;
    limit?: number;
    filters?: QuotaFilters;
  }): Promise<QuotaListResponse> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
      } = params ?? {};

      const searchParams =
        new URLSearchParams();

      searchParams.append(
        "page",
        String(page),
      );

      searchParams.append(
        "limit",
        String(limit),
      );

      // -------------------------------------------------
      // ORGANIZATION
      // -------------------------------------------------

      if (filters.organizationId) {
        searchParams.append(
          "organizationId",
          filters.organizationId,
        );
      }

      // -------------------------------------------------
      // FUEL TYPE
      // -------------------------------------------------

      if (filters.fuelTypeId) {
        searchParams.append(
          "fuelTypeId",
          filters.fuelTypeId,
        );
      }

      // -------------------------------------------------
      // PERIOD
      // -------------------------------------------------

      if (filters.periodType) {
        searchParams.append(
          "periodType",
          filters.periodType,
        );
      }

      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      if (filters.status) {
        searchParams.append(
          "status",
          filters.status,
        );
      }

      // -------------------------------------------------
      // DATE RANGE
      // -------------------------------------------------

      if (filters.startDate) {
        searchParams.append(
          "startDate",
          filters.startDate,
        );
      }

      if (filters.endDate) {
        searchParams.append(
          "endDate",
          filters.endDate,
        );
      }

      const { data } = await api.get(
        `/organizations/quotas?${searchParams.toString()}`,
      );

      return data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // GET QUOTA BY ID
  // ===================================================

  async getQuota(
    id: string,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.get(
        `/organizations/quotas/${id}`,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // CREATE QUOTA
  // ===================================================

  async createQuota(
    payload: CreateQuotaPayload,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.post(
        "/organizations/quotas",
        payload,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // UPDATE QUOTA
  // ===================================================

  async updateQuota(
    id: string,
    payload: UpdateQuotaPayload,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.patch(
        `/organizations/quotas/${id}`,
        payload,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // APPROVE QUOTA
  // ===================================================

  async approveQuota(
    id: string,
    payload: ApproveQuotaPayload,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.post(
        `/organizations/quotas/${id}/approve`,
        payload,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // CANCEL QUOTA
  // ===================================================

  async cancelQuota(
    id: string,
    payload: CancelQuotaPayload,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.post(
        `/organizations/quotas/${id}/cancel`,
        payload,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // GET ACTIVE QUOTA
  // ===================================================

  async getActiveQuota(
    params: GetActiveQuotaParams,
  ): Promise<FuelQuota> {
    try {
      const searchParams =
        new URLSearchParams();

      searchParams.append(
        "organizationId",
        params.organizationId,
      );

      searchParams.append(
        "fuelTypeId",
        params.fuelTypeId,
      );

      if (params.date) {
        searchParams.append(
          "date",
          params.date,
        );
      }

      const { data } = await api.get(
        `/organizations/quotas/active?${searchParams.toString()}`,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  // ===================================================
  // REFRESH QUOTA STATUS
  // ===================================================

  async refreshQuotaStatus(
    id: string,
  ): Promise<FuelQuota> {
    try {
      const { data } = await api.post(
        `/organizations/quotas/${id}/refresh-status`,
      );

      return data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },
};