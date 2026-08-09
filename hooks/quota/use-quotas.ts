"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  quotaService,
} from "@/services/quota.service";

import type {
  ApproveQuotaPayload,
  CancelQuotaPayload,
  CreateQuotaPayload,
  GetActiveQuotaParams,
  QuotaFilters,
  UpdateQuotaPayload,
} from "@/types/quota.types";

// =====================================================
// TYPES
// =====================================================

export interface GetQuotasParams {
  page?: number;
  limit?: number;
  filters?: QuotaFilters;
}

// =====================================================
// QUERY KEYS
// =====================================================

export const quotaKeys = {
  all: ["quotas"] as const,

  lists: () =>
    [...quotaKeys.all, "list"] as const,

  list: (params?: GetQuotasParams) =>
    [...quotaKeys.lists(), params] as const,

  details: () =>
    [...quotaKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...quotaKeys.details(), id] as const,

  active: (
    organizationId: string,
    fuelTypeId: string,
    date?: string,
  ) =>
    [
      ...quotaKeys.all,
      "active",
      organizationId,
      fuelTypeId,
      date,
    ] as const,
};

// =====================================================
// GET QUOTAS
// =====================================================

export const useQuotas = (
  params?: GetQuotasParams,
) => {
  return useQuery({
    queryKey: quotaKeys.list(params),

    queryFn: () =>
      quotaService.getQuotas(params),

    staleTime: 1000 * 60 * 2,

    placeholderData: (
      previousData,
    ) => previousData,
  });
};

// =====================================================
// GET QUOTA BY ID
// =====================================================

export const useQuota = (
  id?: string,
) => {
  return useQuery({
    queryKey: quotaKeys.detail(
      id ?? "",
    ),

    queryFn: () => {
      if (!id) {
        throw new Error(
          "Quota ID is required",
        );
      }

      return quotaService.getQuota(id);
    },

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 2,
  });
};

// =====================================================
// GET ACTIVE QUOTA
// =====================================================

export const useActiveQuota = ({
  organizationId,
  fuelTypeId,
  date,
}: {
  organizationId?: string;
  fuelTypeId?: string;
  date?: string;
}) => {
  return useQuery({
    queryKey: quotaKeys.active(
      organizationId ?? "",
      fuelTypeId ?? "",
      date,
    ),

    queryFn: () => {
      if (
        !organizationId ||
        !fuelTypeId
      ) {
        throw new Error(
          "Organization and fuel type are required",
        );
      }

      const params: GetActiveQuotaParams =
        {
          organizationId,
          fuelTypeId,
          date,
        };

      return quotaService.getActiveQuota(
        params,
      );
    },

    enabled:
      Boolean(organizationId) &&
      Boolean(fuelTypeId),

    staleTime: 1000 * 30,
  });
};

// =====================================================
// CREATE QUOTA
// =====================================================

export const useCreateQuota = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateQuotaPayload,
    ) =>
      quotaService.createQuota(
        data,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.lists(),
      });

      toast.success(
        "Fuel quota created successfully",
      );
    },
  });
};

// =====================================================
// UPDATE QUOTA
// =====================================================

export const useUpdateQuota = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateQuotaPayload;
    }) =>
      quotaService.updateQuota(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.all,
      });

      toast.success(
        "Fuel quota updated successfully",
      );
    },
  });
};

// =====================================================
// APPROVE QUOTA
// =====================================================

export const useApproveQuota = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ApproveQuotaPayload;
    }) =>
      quotaService.approveQuota(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.all,
      });

      toast.success(
        "Fuel quota approved successfully",
      );
    },
  });
};

// =====================================================
// CANCEL QUOTA
// =====================================================

export const useCancelQuota = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CancelQuotaPayload;
    }) =>
      quotaService.cancelQuota(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          quotaKeys.all,
      });

      toast.success(
        "Fuel quota cancelled successfully",
      );
    },
  });
};

// =====================================================
// REFRESH QUOTA STATUS
// =====================================================

export const useRefreshQuotaStatus =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (id: string) =>
        quotaService.refreshQuotaStatus(
          id,
        ),

      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey:
            quotaKeys.lists(),
        });

        queryClient.invalidateQueries({
          queryKey:
            quotaKeys.detail(id),
        });

        queryClient.invalidateQueries({
          queryKey:
            quotaKeys.all,
        });

        toast.success(
          "Fuel quota status refreshed successfully",
        );
      },
    });
  };