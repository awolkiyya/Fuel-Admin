import { api } from "@/lib/api"

import {
  CreateOrganizationPayload,
  Organization,
  OrganizationFilters,
  OrganizationListResponse,
  OrganizationStatistics,
  UpdateOrganizationFuelAccessPayload,
  UpdateOrganizationPayload,
  UpdateOrganizationStatusPayload,
  ApiResponse,
} from "@/types/organization.types"

import { formatApiError } from "@/utils/apiError"

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
  }): Promise<OrganizationListResponse> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
      } = params ?? {}

      const searchParams =
        new URLSearchParams()

      searchParams.set(
        "page",
        String(page)
      )

      searchParams.set(
        "limit",
        String(limit)
      )

      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      if (filters.search?.trim()) {
        searchParams.set(
          "search",
          filters.search.trim()
        )
      }

      // -------------------------------------------------
      // TYPE
      // -------------------------------------------------

      if (filters.type) {
        searchParams.set(
          "type",
          filters.type
        )
      }

      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      if (filters.status) {
        searchParams.set(
          "status",
          filters.status
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
            filters.allowFuelAccess
          )
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
            filters.quotaEnabled
          )
        )
      }

      const response =
        await api.get<
          OrganizationListResponse
        >(
          `/organizations?${searchParams.toString()}`
        )

      return response.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // GET ORGANIZATION BY ID
  // ===================================================

  async getOrganization(
    id: string
  ): Promise<Organization> {
    try {
      const response =
        await api.get<
          ApiResponse<Organization>
        >(
          `/organizations/${id}`
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // CREATE ORGANIZATION
  // ===================================================

  async createOrganization(
    payload: CreateOrganizationPayload
  ): Promise<Organization> {
    try {
      const response =
        await api.post<
          ApiResponse<Organization>
        >(
          "/organizations",
          payload
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE ORGANIZATION
  // ===================================================

  async updateOrganization(
    id: string,
    payload: UpdateOrganizationPayload
  ): Promise<Organization> {
    try {
      const response =
        await api.patch<
          ApiResponse<Organization>
        >(
          `/organizations/${id}`,
          payload
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE ORGANIZATION STATUS
  // ===================================================

  async updateOrganizationStatus(
    id: string,
    payload: UpdateOrganizationStatusPayload
  ): Promise<Organization> {
    try {
      const response =
        await api.patch<
          ApiResponse<Organization>
        >(
          `/organizations/${id}/status`,
          payload
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // UPDATE FUEL ACCESS
  // ===================================================

  async updateFuelAccess(
    id: string,
    payload: UpdateOrganizationFuelAccessPayload
  ): Promise<Organization> {
    try {
      const response =
        await api.patch<
          ApiResponse<Organization>
        >(
          `/organizations/${id}/fuel-access`,
          payload
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // GET STATISTICS
  // ===================================================

  async getStatistics(): Promise<OrganizationStatistics> {
    try {
      const response =
        await api.get<
          ApiResponse<OrganizationStatistics>
        >(
          "/organizations/statistics"
        )

      return response.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  // ===================================================
  // DELETE ORGANIZATION
  // ===================================================

  async deleteOrganization(
    id: string
  ): Promise<void> {
    try {
      await api.delete(
        `/organizations/${id}`
      )
    } catch (error) {
      throw formatApiError(error)
    }
  },
}