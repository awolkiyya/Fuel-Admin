"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"
import { pumpService } from "@/services/pump.service"
import { ListResponse } from "@/types/api"
import { Dispenser } from "@/types/pump.types"

/* ---------------------------
   KEYS (SCOPED BY STATION)
----------------------------*/
const pumpKeys = {
  all: ["pumps"] as const,
  byStation: (stationId: string) =>
    ["pumps", stationId] as const,
}

/* ---------------------------
   GET PUMPS (STATION SAFE)
----------------------------*/
export const usePumps = (stationId?: string) => {
  return useQuery<ListResponse<Dispenser>>({
    queryKey: stationId
      ? pumpKeys.byStation(stationId)
      : pumpKeys.all,

    queryFn: () => {
      if (!stationId) throw new Error("stationId required")
      return pumpService.getPumps(stationId)
    },

    enabled: !!stationId,
  })
}

/* ---------------------------
   CREATE PUMP
----------------------------*/
export const useCreatePump = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { number: number }) =>
      pumpService.createPump({
        ...payload,
        stationId: stationId!,
      }),

    onSuccess: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: pumpKeys.byStation(stationId),
      })

      toast.success("Pump created successfully")
    },
  })
}

/* ---------------------------
   TOGGLE PUMP STATUS (OPTIMISTIC)
----------------------------*/
/* ---------------------------
   TOGGLE PUMP STATUS (OPTIMISTIC)
----------------------------*/
export const useTogglePumpStatus = (stationId?: string) => {
    const qc = useQueryClient()
  
    return useMutation({
      mutationFn: (pumpId: string) =>
        pumpService.togglePumpStatus({
          stationId: stationId!,
          id:pumpId,
        }),
  
      onMutate: async (pumpId: string) => {
        if (!stationId) return
  
        await qc.cancelQueries({
          queryKey: pumpKeys.byStation(stationId),
        })
  
        const previous = qc.getQueryData<any>(
          pumpKeys.byStation(stationId)
        )
  
        qc.setQueryData(
          pumpKeys.byStation(stationId),
          (old: any) => {
            if (!old) return old
  
            return {
              ...old,
              data: old.data.map((p: Dispenser) =>
                p.id === pumpId
                  ? {
                      ...p,
                      status:
                        p.status === "ACTIVE"
                          ? "inactive"
                          : "active",
                    }
                  : p
              ),
            }
          }
        )
  
        return { previous }
      },
  
      onSuccess: () => {
        toast.success("Pump updated")
      },
  
      onSettled: () => {
        if (!stationId) return
  
        qc.invalidateQueries({
          queryKey: pumpKeys.byStation(stationId),
        })
      },
    })
  }

/* ---------------------------
   ADD NOZZLE
----------------------------*/
export const useAddNozzle = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: pumpService.addNozzle,

    onSuccess: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: pumpKeys.byStation(stationId),
      })

      toast.success("Nozzle added")
    },
  })
}

/* ---------------------------
   TOGGLE NOZZLE STATUS (OPTIMISTIC)
----------------------------*/
export const useToggleNozzle = (stationId?: string) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: pumpService.toggleNozzleStatus,

    onMutate: async ({ pumpId, nozzleId }) => {
      if (!stationId) return

      await qc.cancelQueries({
        queryKey: pumpKeys.byStation(stationId),
      })

      const previous = qc.getQueryData<Dispenser[]>(
        pumpKeys.byStation(stationId)
      )

      qc.setQueryData(
        pumpKeys.byStation(stationId),
        (old: any) => ({
          ...old,
          data: old.data.map((p: Dispenser) =>
            p.id === pumpId
              ? {
                  ...p,
                  nozzles: p.nozzles.map((n) =>
                    n.id === nozzleId
                      ? {
                          ...n,
                          status:
                            n.status === "ACTIVE"
                              ? "maintenance"
                              : "active",
                        }
                      : n
                  ),
                }
              : p
          ),
        })
      )

      return { previous }
    },

    onSuccess: () => {
      toast.success("Nozzle updated")
    },

    onSettled: () => {
      if (!stationId) return

      qc.invalidateQueries({
        queryKey: pumpKeys.byStation(stationId),
      })
    },
  })
}