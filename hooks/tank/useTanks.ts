"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"
import { tankService } from "@/services/tank.service"
import {
  CreateTankDTO,
  RefillTankDTO,
  StationFuelType,
} from "@/types/tanks.types"
import { PaginatedResponse, SingleResponse } from "@/types/api"
import { AdjustTankMutationInput, AdjustTankPayload, TankAuditLog } from "@/types/tank"

/* ---------------------------------------
   KEYS
----------------------------------------*/
export const tankKeys = {
  all: ["station-fuel-types"] as const,
  byStation: (id: string) =>
    ["station-fuel-types", id] as const,
}

/* ---------------------------------------
   QUERY KEYS
----------------------------------------*/
export const tankLogKeys = {
  all: ["tank-audit-logs"] as const,
  list: (params?: any) => ["tank-audit-logs", params] as const,
}

/* ---------------------------------------
   GET FUEL TYPES
----------------------------------------*/
export const useStationFuelTypes = (stationId?: string) => {
  return useQuery<SingleResponse<StationFuelType[]>>({
    queryKey: stationId
      ? tankKeys.byStation(stationId)
      : tankKeys.all,

    queryFn: () => {
      if (!stationId) throw new Error("stationId required")
      return tankService.getStationFuelTypes(stationId)
    },

    enabled: !!stationId,
  })
}

/* ---------------------------------------
   CREATE TANK
----------------------------------------*/
export const useCreateTank = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<CreateTankDTO, "stationId">) =>
      tankService.createTank({
        ...payload,
        stationId: stationId!,
      }),

    onSuccess: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: tankKeys.byStation(stationId),
      })

      toast.success("Tank created successfully")
    },
  })
}

/* ---------------------------------------
   REFILL TANK (SAFE OPTIMISTIC UPDATE)
----------------------------------------*/
export const useRefillTank = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: tankService.refillTank,

    onMutate: async (payload: RefillTankDTO) => {
      if (!stationId) return

      await qc.cancelQueries({
        queryKey: tankKeys.byStation(stationId),
      })

      const previous = qc.getQueryData<any>(
        tankKeys.byStation(stationId)
      )

      if (previous) {
        qc.setQueryData(
          tankKeys.byStation(stationId),
          (old: any) =>
            ({
              ...old,
              data: old.data.map((fuel: any) => ({
                ...fuel,
                tanks: fuel.tanks.map((t: any) =>
                  t.id === payload.tankId
                    ? {
                        ...t,
                        currentLevel:
                          (t.currentLevel ?? 0) +
                          payload.amount,
                      }
                    : t
                ),
              })),
            })
        )
      }

      return { previous }
    },

    onSuccess: () => {
      toast.success("Tank refilled successfully")
    },
    onSettled: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: tankKeys.byStation(stationId),
      })
    },
  })
}

/* ---------------------------------------
   DELETE
----------------------------------------*/
export const useDeleteTank = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: tankService.deleteTank,

    onSuccess: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: tankKeys.byStation(stationId),
      })

      toast.success("Tank deleted")
    },
  })
}

/* ---------------------------------------
   HOOK
----------------------------------------*/

export const useAdjustTank = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    /* -------------------------
       API CALL
    --------------------------*/
    mutationFn: (payload: AdjustTankMutationInput) => {
      if (!payload.reason || !payload.adjustmentType) {
        throw new Error("Reason and adjustment type are required")
      }

      return tankService.adjustTankLevel(payload as AdjustTankPayload)
    },

    /* -------------------------
       OPTIMISTIC UPDATE
    --------------------------*/
    onMutate: async (payload: AdjustTankMutationInput) => {
      if (!stationId) return

      await qc.cancelQueries({
        queryKey: tankKeys.byStation(stationId),
      })

      const previous = qc.getQueryData<any>(
        tankKeys.byStation(stationId)
      )

      if (previous) {
        qc.setQueryData(tankKeys.byStation(stationId), (old: any) => {
          if (!old?.data) return old

          return {
            ...old,
            data: old.data.map((fuel: any) => ({
              ...fuel,
              tanks: fuel.tanks.map((t: any) => {
                if (t.id !== payload.tankId) return t

                const previousLevel = t.currentLevel
                const newLevel = payload.newLevel

                return {
                  ...t,
                  currentLevel: newLevel,

                  _optimistic: true,

                  _auditPreview: {
                    previousLevel,
                    newLevel,
                    litersChange: newLevel - previousLevel,
                    reason: payload.reason ?? null,
                    adjustmentType: payload.adjustmentType ?? null,
                  },
                }
              }),
            })),
          }
        })
      }

      return { previous }
    },

    /* -------------------------
       SUCCESS
    --------------------------*/
    onSuccess: () => {
      toast.success("Tank level adjusted successfully")
    },

    /* -------------------------
       ERROR ROLLBACK
    --------------------------*/
    onError: (_err, _payload, context: any) => {
      toast.error("Failed to adjust tank level")

      if (context?.previous && stationId) {
        qc.setQueryData(
          tankKeys.byStation(stationId),
          context.previous
        )
      }
    },

    /* -------------------------
       FINAL SYNC
    --------------------------*/
    onSettled: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: tankKeys.byStation(stationId),
      })
    },
  })
}

/* ---------------------------------------
   GET AUDIT LOGS (PAGINATED)
----------------------------------------*/
export const useTankAuditLogs = (
  params: {
    stationId: string
    tankId?: string
    type?: "REFILL" | "ADJUSTMENT"
    from?: string
    to?: string
    search?: string
    page?: number
    limit?: number
  }
) => {
  return useQuery<PaginatedResponse<TankAuditLog>>({

    queryKey: tankLogKeys.list(params),

    queryFn: () => tankService.getLogs(params),

    enabled: !!params.stationId,


    staleTime: 1000 * 30,
  })
}