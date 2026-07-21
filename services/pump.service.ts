import { api } from "@/lib/api"
import { formatApiError } from "@/utils/apiError"

/* ---------------------------------------
   TYPES (optional import if you have them)
----------------------------------------*/
import { Pump } from "@/types/pump.types"
import { ListResponse, SingleResponse } from "@/types/api"

export type AddNozzleDTO = {
    stationId: string
    pumpId: string
    number: number
    fuelType: string
  }

/* ---------------------------------------
   PUMP SERVICE
----------------------------------------*/
export const pumpService = {
  /* ---------------------------------------
     GET PUMPS (BY STATION)
  ----------------------------------------*/
  async getPumps(stationId: string): Promise<ListResponse<Pump>> {
    try {
      const { data } = await api.get(
        `/stations/${stationId}/pumps`
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     CREATE PUMP
  ----------------------------------------*/
  async createPump(payload: {
    stationId: string
    number: number
  }): Promise<Pump> {
    try {
      const { data } = await api.post(
        `/stations/${payload.stationId}/pumps`,
        {
          number: payload.number,
        }
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     TOGGLE PUMP STATUS
  ----------------------------------------*/
  async togglePumpStatus({id,stationId}:{id: string,stationId:string}
    ): Promise<Pump> {
    try {
      const { data } = await api.patch(
        `/stations/${stationId}/pumps/${id}/toggle`
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     ADD NOZZLE
  ----------------------------------------*/
  async addNozzle(data: AddNozzleDTO) {
    try {
        const { stationId, pumpId, ...body } = data

        const { data: res } = await api.post(
          `/stations/${stationId}/pumps/${pumpId}/nozzles`,
          body
        )
      
        return res.data
    } catch (error) {
      throw formatApiError(error)
    }
  },

  /* ---------------------------------------
     TOGGLE NOZZLE STATUS
  ----------------------------------------*/
  async toggleNozzleStatus(payload: {
    pumpId: string
    nozzleId: string
  }) {
    try {
      const { data } = await api.patch(
        `/pumps/${payload.pumpId}/nozzles/${payload.nozzleId}/toggle`
      )
      return data
    } catch (error) {
      throw formatApiError(error)
    }
  },

/* ---------------------------------------
   GET NOZZLES (FILTER + PAGINATION)
----------------------------------------*/
async getNozzlesByFuelType(payload: {
  fuelType?: string;
  page?: number;
  perPage?: number;
  search?: string;
  stationId?: string
}) {
  try {
    const { fuelType, page = 1, perPage = 10, search = "" } = payload;

    const params = new URLSearchParams();

    if (fuelType) params.append("fuelType", fuelType);
    if (search) params.append("search", search);

    params.append("page", String(page));
    params.append("perPage", String(perPage));

    const { data } = await api.get(`/stations/${payload.stationId}/nozzles?${params.toString()}`);

    return data;
  } catch (error) {
    throw formatApiError(error);
  }
}
}