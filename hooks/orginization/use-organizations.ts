"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"

import { organizationService } from "@/services/organization.service"

import type {
  CreateOrganizationPayload,
  OrganizationFilters,
  UpdateOrganizationFuelAccessPayload,
  UpdateOrganizationPayload,
  UpdateOrganizationStatusPayload,
} from "@/types/organization.types"
import { api } from "@/lib/api"


// =====================================================
// TYPES
// =====================================================

export interface GetOrganizationsParams {
  page?: number
  limit?: number
  filters?: OrganizationFilters
}


// =====================================================
// QUERY KEYS
// =====================================================

export const organizationKeys = {
  // ---------------------------------------------------
  // ALL ORGANIZATIONS
  // ---------------------------------------------------

  all: ["organizations"] as const,

  // ---------------------------------------------------
  // LIST QUERIES
  // ---------------------------------------------------

  lists: () =>
    [...organizationKeys.all, "list"] as const,

  list: (
    params?: GetOrganizationsParams,
  ) =>
    [
      ...organizationKeys.lists(),
      params,
    ] as const,

  // ---------------------------------------------------
  // DETAIL QUERIES
  // ---------------------------------------------------

  details: () =>
    [
      ...organizationKeys.all,
      "detail",
    ] as const,

  detail: (id: string) =>
    [
      ...organizationKeys.details(),
      id,
    ] as const,

  // ---------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------

  statistics: () =>
    [
      ...organizationKeys.all,
      "statistics",
    ] as const,
}


// =====================================================
// GET ORGANIZATIONS
// =====================================================

export const useOrganizations = (
  params?: GetOrganizationsParams,
) => {
  return useQuery({
    queryKey:
      organizationKeys.list(params),

    queryFn: () =>
      organizationService.getOrganizations(
        params,
      ),

    staleTime: 1000 * 60 * 5,

    placeholderData: (
      previousData,
    ) => previousData,
  })
}


// =====================================================
// GET ORGANIZATION BY ID
// =====================================================

export const useOrganization = (
  id?: string,
) => {
  return useQuery({
    queryKey:
      organizationKeys.detail(
        id ?? "",
      ),

    queryFn: () => {
      if (!id) {
        throw new Error(
          "Organization ID is required",
        )
      }

      return organizationService.getOrganization(
        id,
      )
    },

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5,
  })
}


// =====================================================
// GET ORGANIZATION STATISTICS
// =====================================================

export const useOrganizationStatistics =
  () => {
    return useQuery({
      queryKey:
        organizationKeys.statistics(),

      queryFn:
        organizationService.getStatistics,

      staleTime: 1000 * 60 * 5,
    })
  }


// =====================================================
// CREATE ORGANIZATION
// =====================================================

export const useCreateOrganization = () => {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      data: CreateOrganizationPayload,
    ) =>
      organizationService.createOrganization(
        data,
      ),

    onSuccess: () => {
      // -------------------------------------------------
      // INVALIDATE ORGANIZATION LISTS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      })

      // -------------------------------------------------
      // INVALIDATE STATISTICS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      })

      toast.success(
        "Organization created successfully",
      )
    },
  })
}


// =====================================================
// UPDATE ORGANIZATION
// =====================================================

export const useUpdateOrganization = () => {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateOrganizationPayload
    }) =>
      organizationService.updateOrganization(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      // -------------------------------------------------
      // INVALIDATE ALL LISTS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      })

      // -------------------------------------------------
      // INVALIDATE SPECIFIC ORGANIZATION
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.detail(
            variables.id,
          ),
      })

      // -------------------------------------------------
      // INVALIDATE STATISTICS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      })

      toast.success(
        "Organization updated successfully",
      )
    },
  })
}


// =====================================================
// UPDATE ORGANIZATION STATUS
// =====================================================

export const useUpdateOrganizationStatus =
  () => {
    const queryClient =
      useQueryClient()

    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: UpdateOrganizationStatusPayload
      }) =>
        organizationService.updateOrganizationStatus(
          id,
          data,
        ),

      onSuccess: (_, variables) => {
        // -----------------------------------------------
        // INVALIDATE LISTS
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.lists(),
        })

        // -----------------------------------------------
        // INVALIDATE DETAIL
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.detail(
              variables.id,
            ),
        })

        // -----------------------------------------------
        // INVALIDATE STATISTICS
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.statistics(),
        })

        toast.success(
          "Organization status updated successfully",
        )
      },
    })
  }


// =====================================================
// UPDATE ORGANIZATION FUEL ACCESS
// =====================================================

export const useUpdateOrganizationFuelAccess =
  () => {
    const queryClient =
      useQueryClient()

    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string
        data: UpdateOrganizationFuelAccessPayload
      }) =>
        organizationService.updateFuelAccess(
          id,
          data,
        ),

      onSuccess: (_, variables) => {
        // -----------------------------------------------
        // INVALIDATE LISTS
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.lists(),
        })

        // -----------------------------------------------
        // INVALIDATE DETAIL
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.detail(
              variables.id,
            ),
        })

        // -----------------------------------------------
        // INVALIDATE STATISTICS
        // -----------------------------------------------

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.statistics(),
        })

        toast.success(
          "Organization fuel access updated successfully",
        )
      },
    })
  }


// =====================================================
// DELETE ORGANIZATION
// =====================================================

export const useDeleteOrganization = () => {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      id: string,
    ) =>
      organizationService.deleteOrganization(
        id,
      ),

    onSuccess: (_, id) => {
      // -------------------------------------------------
      // INVALIDATE LISTS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      })

      // -------------------------------------------------
      // INVALIDATE DELETED ORGANIZATION DETAIL
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.detail(id),
      })

      // -------------------------------------------------
      // INVALIDATE STATISTICS
      // -------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      })

      toast.success(
        "Organization deleted successfully",
      )
    },
  })
}

// ============================================================================
// GENERATE ORGANIZATION API KEY
// ============================================================================

export function useGenerateOrganizationApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await api.post(
        `/organizations/${organizationId}/api-key`,
      )

      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      })

      toast.success("API key generated successfully.")
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to generate API key.",
      )
    },
  })
}