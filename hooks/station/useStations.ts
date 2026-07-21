import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"

import { stationService } from "@/services/station.service"
import { FuelItem, StationQuery } from "@/types/station"

/* -----------------------------
   GET STATIONS
------------------------------ */
export const useStations = (params: StationQuery) => {
  return useQuery({
    queryKey: ["stations", params],
    queryFn: () => stationService.getStations(params),
  })
}

/* -----------------------------
   CREATE
------------------------------ */
export const useCreateStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) =>
      stationService.createStation(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Station created successfully 🚀")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to create station"
      )
    },
  })
}

/* -----------------------------
   UPDATE
------------------------------ */
export const useUpdateStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: FormData
    }) => stationService.updateStation(id, data),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stations"] })
      qc.invalidateQueries({
        queryKey: ["station", variables.id],
      })

      toast.success("Station updated successfully ✨")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to update station"
      )
    },
  })
}

/* -----------------------------
   DELETE / DEACTIVATE
------------------------------ */
export const useDeleteStation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: stationService.deleteStation,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Station deleted successfully 🗑️")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to delete station"
      )
    },
  })
}

/* -----------------------------
   ASSIGN MANAGER
------------------------------ */
export const useAssignManager = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      managerId,
    }: {
      id: string
      managerId: string
    }) => stationService.assignManager(id, managerId),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stations"] })

      toast.success("Manager assigned successfully 👤")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to assign manager"
      )
    },
  })
}

/* -----------------------------
   GET MANAGERS (WITH PAGINATION + SEARCH)
------------------------------ */
export const useManagers = ({
  page,
  search,
}: {
  page: number
  search: string
}) => {
  return useQuery({
    queryKey: ["managers", { page, search }],
    queryFn: () =>
      stationService.getManagers({ page, search }),
  })
}

/* -----------------------------
   GET FUEL TYPES (PAGINATED + SEARCH)
------------------------------ */
export const useFuelTypes = (page: number, search: string) => {
  return useQuery({
    queryKey: ["fuel-types", page, search],

    queryFn: () =>
    stationService.getFuelTypes({
        page,
        search,
      }),

  })
}

export const useUpdateStationFuel = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      stationId,
      fuel,
    }: {
      stationId: string
      fuel: FuelItem[]
    }) => stationService.updateStationFuel(stationId, fuel),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["stations"] })
      qc.invalidateQueries({
        queryKey: ["station", variables.stationId],
      })

      toast.success("Fuel configuration updated successfully ⛽")
    },

    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to update fuel configuration"
      )
    },
  })
}