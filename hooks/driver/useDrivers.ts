import { useQuery } from "@tanstack/react-query"
import { driverService } from "@/services/driver.service"
import { PaginatedResponse } from "@/types/api"
import { DriverUser } from "@/types/driver"

export const useDrivers = (params?: any) => {
  return useQuery<PaginatedResponse<DriverUser>>({
    queryKey: ["drivers", params],
    queryFn: async () => {
      const res = await driverService.getDrivers(params)

      // IMPORTANT: return full response (data + meta)
      return res
    },
  })
}