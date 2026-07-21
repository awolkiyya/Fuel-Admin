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
  risk?: string
  vehicleFilter?: "1" | "2+" | "all"
}

/* -----------------------------
   DRIVER SERVICE (REAL API)
------------------------------ */
export const driverService = {
  /* -----------------------------
     GET DRIVERS
  ------------------------------ */
  getDrivers: async (params: GetDriversParams):Promise< PaginatedResponse<DriverUser>> => {
    const res = await api.get<
      PaginatedResponse<DriverUser>
    >("/drivers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        status: params.status || undefined,
        risk: params.risk || undefined,
        vehicleFilter: params.vehicleFilter || undefined,
      },
    })

    return res.data
  },
}