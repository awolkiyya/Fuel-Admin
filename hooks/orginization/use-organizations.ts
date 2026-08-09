"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  organizationService,
} from "@/services/organization.service";

import type {
  CreateOrganizationPayload,
  OrganizationFilters,
  UpdateOrganizationFuelAccessPayload,
  UpdateOrganizationPayload,
  UpdateOrganizationStatusPayload,
} from "@/types/organization.types";

// =====================================================
// TYPES
// =====================================================

export interface GetOrganizationsParams {
  page?: number;
  limit?: number;
  filters?: OrganizationFilters;
}

// =====================================================
// QUERY KEYS
// =====================================================

export const organizationKeys = {
  all: ["organizations"] as const,

  lists: () =>
    [...organizationKeys.all, "list"] as const,

  list: (params?: GetOrganizationsParams) =>
    [...organizationKeys.lists(), params] as const,

  details: () =>
    [...organizationKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...organizationKeys.details(), id] as const,

  statistics: () =>
    [...organizationKeys.all, "statistics"] as const,
};

// =====================================================
// GET ORGANIZATIONS
// =====================================================

export const useOrganizations = (
  params?: GetOrganizationsParams,
) => {
  return useQuery({
    queryKey: organizationKeys.list(params),

    queryFn: () =>
      organizationService.getOrganizations(params),

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) =>
      previousData,
  });
};

// =====================================================
// GET ORGANIZATION BY ID
// =====================================================

export const useOrganization = (
  id?: string,
) => {
  return useQuery({
    queryKey: organizationKeys.detail(id ?? ""),

    queryFn: () => {
      if (!id) {
        throw new Error(
          "Organization ID is required",
        );
      }

      return organizationService.getOrganization(id);
    },

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5,
  });
};

// =====================================================
// GET ORGANIZATION STATISTICS
// =====================================================

export const useOrganizationStatistics = () => {
  return useQuery({
    queryKey:
      organizationKeys.statistics(),

    queryFn:
      organizationService.getStatistics,

    staleTime: 1000 * 60 * 5,
  });
};

// =====================================================
// CREATE ORGANIZATION
// =====================================================

export const useCreateOrganization = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateOrganizationPayload,
    ) =>
      organizationService.createOrganization(
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      });

      toast.success(
        "Organization created successfully",
      );
    },
  });
};

// =====================================================
// UPDATE ORGANIZATION
// =====================================================

export const useUpdateOrganization = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationPayload;
    }) =>
      organizationService.updateOrganization(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      });

      toast.success(
        "Organization updated successfully",
      );
    },
  });
};

// =====================================================
// UPDATE ORGANIZATION STATUS
// =====================================================

export const useUpdateOrganizationStatus =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateOrganizationStatusPayload;
      }) =>
        organizationService.updateOrganizationStatus(
          id,
          data,
        ),

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.lists(),
        });

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.detail(
              variables.id,
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.statistics(),
        });

        toast.success(
          "Organization status updated successfully",
        );
      },
    });
  };

// =====================================================
// UPDATE FUEL ACCESS
// =====================================================

export const useUpdateOrganizationFuelAccess =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateOrganizationFuelAccessPayload;
      }) =>
        organizationService.updateFuelAccess(
          id,
          data,
        ),

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.lists(),
        });

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.detail(
              variables.id,
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            organizationKeys.statistics(),
        });

        toast.success(
          "Organization fuel access updated successfully",
        );
      },
    });
  };

// =====================================================
// DELETE ORGANIZATION
// =====================================================

export const useDeleteOrganization = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      organizationService.deleteOrganization(
        id,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          organizationKeys.statistics(),
      });

      toast.success(
        "Organization deleted successfully",
      );
    },
  });
};