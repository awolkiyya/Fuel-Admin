import { api } from "@/lib/api"
import { SingleResponse, PaginatedResponse } from "@/types/api"
import { DriverUser } from "@/types/driver"

/* -----------------------------
   QUERY PARAMS
------------------------------ */
export interface GetDriversParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  riskLevel?: string
  vehicleFilter?: "single" | "multiple"
}

/* -----------------------------
   DRIVER SERVICE
------------------------------ */
export const driverService = {
  /* -----------------------------
     GET DRIVERS
  ------------------------------ */
  getDrivers: async (
    params: GetDriversParams = {}
  ): Promise<PaginatedResponse<DriverUser>> => {
    const res = await api.get<PaginatedResponse<DriverUser>>("/drivers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        status: params.status || undefined,
        riskLevel: params.riskLevel || undefined,
        vehicleFilter: params.vehicleFilter || undefined,
      },
    })

    return res.data
  },

  /* -----------------------------
     GET DRIVER BY ID
  ------------------------------ */
  getDriverById: async (
    id: string
  ): Promise<SingleResponse<DriverUser>> => {
    const res = await api.get<SingleResponse<DriverUser>>(`/drivers/${id}`)
    return res.data
  },
}