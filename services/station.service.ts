import { api } from "@/lib/api"
import { PaginatedResponse } from "@/types/api"
import { FuelItem, Manager, Station, StationQuery } from "@/types/station"
import { formatApiError } from "@/utils/apiError"


export type FuelType = {
  id: string
  name: string
}

export type FuelTypeQuery = {
  page?: number
  limit?: number
  search?: string
}


/* -----------------------------
   SERVICE
------------------------------ */
export const stationService = {
  /* GET */
  async getStations(params: StationQuery) {
    try {
      const { data } = await api.get<PaginatedResponse<Station>>(
        "/stations",
        { params }
      )
      console.log(data);
      
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* CREATE */
  async createStation(payload: FormData) {
    try {
      const { data } = await api.post("/stations", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* UPDATE */
  async updateStation(id: string, payload: FormData) {
    try {
      const { data } = await api.put(`/stations/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* DELETE / DEACTIVATE */
  async deleteStation(id: string) {
    try {
      const { data } = await api.delete(`/stations/${id}`)
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ASSIGN MANAGER */
  async assignManager(id: string, managerId: string) {
    try {
      const { data } = await api.patch(
        `/stations/${id}/assign-manager`,
        { managerId }
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* GET MANAGERS */
  async getManagers(params: { page?: number; search?: string }) {
    try {
      const { data } = await api.get<PaginatedResponse<Manager>>(
        "/stations/managers",
        { params }
      )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  

   /* -----------------------------
     GET FUEL TYPES (PAGINATED)
  ------------------------------ */
  async getFuelTypes(params: FuelTypeQuery) {
    try {
      const { data } = await api.get<PaginatedResponse<FuelType>>(
        "/commens/fuelTypes",
        { params }
      )

      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  async updateStationFuel(
    stationId: string,
    fuelTypes: FuelItem[]
  ) {
    try {
      const { data } = await api.patch(
        `/stations/${stationId}/fuel`,
        { fuelTypes }
      )
  
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  }
}


