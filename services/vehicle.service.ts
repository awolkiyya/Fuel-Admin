// services/vehicle.service.ts

import { VehicleTypeForm } from "@/components/modals/VehicleTypeModal"
import { api } from "@/lib/api"
import { PaginatedResponse, SingleResponse } from "@/types/api"
import { VehicleType, VehicleQuery } from "@/types/vehicle"

export const vehicleService = {
  /* -----------------------------
     GET VEHICLES
  ------------------------------ */
  getVehicles: async (params?: VehicleQuery) => {
    const res = await api.get<PaginatedResponse<VehicleType>>(
      "/commens/vehicleTypes",
      { params }
    )

    return res.data
  },

  /* -----------------------------
     CREATE
  ------------------------------ */
  createVehicle: async (data: Partial<VehicleTypeForm>) => {
    const res = await api.post<SingleResponse<VehicleType>>(
      "/commens/vehicleTypes",
      data
    )

    return res.data
  },

  /* -----------------------------
     UPDATE
  ------------------------------ */
  updateVehicle: async (
    id: string,
    data: Partial<VehicleTypeForm>
  ) => {
    const res = await api.patch<SingleResponse<VehicleType>>(
      `/commens/vehicleTypes/${id}`,
      data
    )

    return res.data
  },

  /* -----------------------------
     TOGGLE STATUS
  ------------------------------ */
  toggleStatus: async (id: string,status: "ACTIVE" | "INACTIVE") => {
    const res = await api.patch<SingleResponse<VehicleType>>(
      `/commens/vehicleTypes/${id}/toggle-status`,{
        status
      }
    )

    return res.data
  },
}