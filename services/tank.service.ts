// services/tank.service.ts

import { api } from "@/lib/api"
import { PaginatedResponse, SingleResponse } from "@/types/api"
import { AdjustTankPayload, TankAuditLog } from "@/types/tank"
import {
  CreateTankDTO,
  RefillTankDTO,
  StationFuelType,
  Tank,
} from "@/types/tanks.types"
import { formatApiError } from "@/utils/apiError"

export const tankService = {
  /* ---------------------------------------
     GET STATION FUEL TYPES
  ----------------------------------------*/
  async getStationFuelTypes(
    stationId: string
  ): Promise<SingleResponse<StationFuelType[]>> {
    try {
      const response = await api.get(
        `/stations/${stationId}/fuel-types`
      )
      return response.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     CREATE TANK
  ----------------------------------------*/
  async createTank(payload: CreateTankDTO): Promise<Tank> {
    try {
      const { data } = await api.post(`/stations/${payload.stationId}/tanks`, payload)
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     REFILL TANK
  ----------------------------------------*/
  async refillTank(payload: RefillTankDTO): Promise<Tank> {
    try {
      const { data } = await api.post(
        `/stations/${payload.stationId}/tanks/${payload.tankId}/refill`,
        { amount: payload.amount }
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     DELETE TANK
  ----------------------------------------*/
  async deleteTank(id: string): Promise<void> {
    try {
      await api.delete(`/tanks/${id}`)
    } catch (error) {
      throw formatApiError(error)
    }
  },

    adjustTankLevel: async (payload: AdjustTankPayload) => {
      const { data } = await api.post(
        `/stations/${payload.stationId}/tanks/${payload.tankId}/adjust`,
        {
          newLevel: payload.newLevel,
          reason: payload.reason,
          adjustmentType: payload.adjustmentType,
        }
      )
  
      return data
    },

   /* ---------------------------------------
     AUDIT LOGS
  ----------------------------------------*/
  async getLogs(params?: {
    stationId?: string
    tankId?: string
    type?: "REFILL" | "ADJUSTMENT"
    from?: string
    to?: string
    search?: string
  }): Promise<PaginatedResponse<TankAuditLog>> {
    try {
      const  response = await api.get(`/stations/${params?.stationId}/audit-logs`, {
        params,
      })

      return response.data;
    } catch (error) {
      throw formatApiError(error)
    }
  },
  }