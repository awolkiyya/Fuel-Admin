import { useQuery } from "@tanstack/react-query"
import { driverService } from "@/services/driver.service"
import { PaginatedResponse, SingleResponse } from "@/types/api"
import { DriverUser } from "@/types/driver"

/* -----------------------------
   GET DRIVERS
------------------------------ */
export const useDrivers = (params?: any) => {
  return useQuery<PaginatedResponse<DriverUser>>({
    queryKey: ["drivers", params],
    queryFn: () => driverService.getDrivers(params),
  })
}

/* -----------------------------
   GET DRIVER BY ID
------------------------------ */
export const useDriver = (id?: string) => {
  return useQuery<SingleResponse<DriverUser>>({
    queryKey: ["driver", id],
    queryFn: () => driverService.getDriverById(id!),
    enabled: !!id,
  })
}