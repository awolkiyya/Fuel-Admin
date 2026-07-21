// hooks/vehicle/useVehicles.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { vehicleService } from "@/services/vehicle.service"
import { VehicleQuery } from "@/types/vehicle"

/* -----------------------------
   GET VEHICLES
------------------------------ */
export const useVehicles = (params: VehicleQuery) => {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => vehicleService.getVehicles(params),
  })
}

/* -----------------------------
   CREATE
------------------------------ */
export const useCreateVehicle = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: vehicleService.createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] })
    },
  })
}

/* -----------------------------
   UPDATE
------------------------------ */
export const useUpdateVehicle = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: any
    }) => vehicleService.updateVehicle(id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] })
    },
  })
}

/* -----------------------------
   TOGGLE STATUS
------------------------------ */
export const useToggleVehicleStatus = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    })=> vehicleService.toggleStatus(id,status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] })
    },
  })
}