import { api } from "@/lib/api"
import { formatApiError } from "@/utils/apiError"

import {
  PaginatedResponse,
  SingleResponse,
} from "@/types/api"

import {
  CreateOrganizationPayload,
  Organization,
  OrganizationFilters,
  OrganizationStatistics,
  UpdateOrganizationFuelAccessPayload,
  UpdateOrganizationPayload,
  UpdateOrganizationStatusPayload,
} from "@/types/organization.types"

// =====================================================
// ORGANIZATION SERVICE
// =====================================================

export const organizationService = {
  // ===================================================
  // GET ORGANIZATIONS
  // ===================================================

  async getOrganizations(params?: {
    page?: number
    limit?: number
    filters?: OrganizationFilters
  }): Promise<
    PaginatedResponse<Organization>
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
      // SEARCH
      // -------------------------------------------------

      if (filters.search?.trim()) {
        searchParams.set(
          "search",
          filters.search.trim(),
        )
      }

      // -------------------------------------------------
      // TYPE
      // -------------------------------------------------

      if (filters.type) {
        searchParams.set(
          "type",
          filters.type,
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
      // FUEL ACCESS
      // -------------------------------------------------

      if (
        filters.allowFuelAccess !==
        undefined
      ) {
        searchParams.set(
          "allowFuelAccess",
          String(
            filters.allowFuelAccess,
          ),
        )
      }

      // -------------------------------------------------
      // QUOTA
      // -------------------------------------------------

      if (
        filters.quotaEnabled !==
        undefined
      ) {
        searchParams.set(
          "quotaEnabled",
          String(
            filters.quotaEnabled,
          ),
        )
      }

      // -------------------------------------------------
      // REQUEST
      // -------------------------------------------------

      const { data } =
        await api.get<
          PaginatedResponse<Organization>
        >(
          `/organizations?${searchParams.toString()}`,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // GET ORGANIZATION BY ID
  // ===================================================

  async getOrganization(
    id: string,
  ): Promise<
    SingleResponse<Organization>
  > {
    try {
      const { data } =
        await api.get<
          SingleResponse<Organization>
        >(
          `/organizations/${id}`,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // CREATE ORGANIZATION
  // ===================================================

  async createOrganization(
    payload: CreateOrganizationPayload,
  ): Promise<
    SingleResponse<Organization>
  > {
    try {
      const { data } =
        await api.post<
          SingleResponse<Organization>
        >(
          "/organizations",
          payload,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE ORGANIZATION
  // ===================================================

  async updateOrganization(
    id: string,
    payload: UpdateOrganizationPayload,
  ): Promise<
    SingleResponse<Organization>
  > {
    try {
      const { data } =
        await api.patch<
          SingleResponse<Organization>
        >(
          `/organizations/${id}`,
          payload,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE ORGANIZATION STATUS
  // ===================================================

  async updateOrganizationStatus(
    id: string,
    payload: UpdateOrganizationStatusPayload,
  ): Promise<
    SingleResponse<Organization>
  > {
    try {
      const { data } =
        await api.patch<
          SingleResponse<Organization>
        >(
          `/organizations/${id}/status`,
          payload,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE FUEL ACCESS
  // ===================================================

  async updateFuelAccess(
    id: string,
    payload: UpdateOrganizationFuelAccessPayload,
  ): Promise<
    SingleResponse<Organization>
  > {
    try {
      const { data } =
        await api.patch<
          SingleResponse<Organization>
        >(
          `/organizations/${id}/fuel-access`,
          payload,
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // GET STATISTICS
  // ===================================================

  async getStatistics(): Promise<
    SingleResponse<OrganizationStatistics>
  > {
    try {
      const { data } =
        await api.get<
          SingleResponse<OrganizationStatistics>
        >(
          "/organizations/statistics",
        )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // DELETE ORGANIZATION
  // ===================================================

  async deleteOrganization(
    id: string,
  ): Promise<void> {
    try {
      await api.delete(
        `/organizations/${id}`,
      )
    } catch (error) {
      throw formatApiError(error)
    }
  },
}