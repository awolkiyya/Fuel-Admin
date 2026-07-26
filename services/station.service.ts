import { api } from "@/lib/api"
import { PaginatedResponse } from "@/types/api"
import { FuelItem, Manager, Station, StationQuery } from "@/types/station"
import { StationTransactionQuery, StationTransactionResource, StationTransactionSummaryResponse } from "@/types/station-transaction"
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

  async getStationById(id: string): Promise<Station> {
    try {
      const { data } = await api.get<{
        success: boolean
        data: Station
      }>(
        `/stations/${id}`
      )
  
      return data.data
  
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
  },

    /* -----------------------------
     STATION SETTINGS
  ------------------------------ */

  async getStationSettings(stationId: string) {
    try {

      const { data } = await api.get(
        `/stations/${stationId}/settings`
      )

      return data

    } catch (error) {
      throw formatApiError(error)
    }
  },



  async updateQueueSettings(
    stationId:string,
    payload:{
      thresholdLow:number
      thresholdMedium:number
      thresholdHigh:number
      thresholdCritical:number
      maxQueueCapacity:number
      queueZone?:any
      minFuelRequestLiters?:number
    }
  ){

    try {

      const {data} =
      await api.patch(
        `/stations/${stationId}/settings/queue`,
        payload
      )

      return data

    } catch(error){

      throw formatApiError(error)

    }

  },





  /* -----------------------------
     STATION TRAFFIC
  ------------------------------ */


  async getStationTraffic(
    stationId:string
  ){

    try{

      const {data} =
      await api.get(
        `/stations/${stationId}/traffic`
      )

      return data

    }catch(error){

      throw formatApiError(error)

    }

  },




  async updateManualTraffic(
    stationId:string,
    payload:{
      queueCount:number
      congestionLevel:
      "low" |
      "medium" |
      "high" |
      "critical"
    }
  ){

    try{

      const {data} =
      await api.patch(
        `/stations/${stationId}/traffic/manual`,
        payload
      )

      return data

    }catch(error){

      throw formatApiError(error)

    }

  },


    /* -----------------------------
     STATION TRANSACTIONS
  ------------------------------ */


  async getStationTransactions(
    stationId: string,
    params?: StationTransactionQuery
  ) {

    try {

      const { data } =
        await api.get<
          PaginatedResponse<StationTransactionResource>
        >(
          `/stations/${stationId}/fuel-transactions`,
          {
            params
          }
        )


      return data


    } catch(error) {

      throw formatApiError(error)

    }

  },




  /* -----------------------------
     GET SINGLE TRANSACTION
  ------------------------------ */


  async getStationTransactionById(
    stationId:string,
    transactionId:string
  ){

    try {

      const {data} =
        await api.get<{
          success:boolean
          data:StationTransactionResource
        }>(
          `/stations/${stationId}/fuel-transactions/${transactionId}`
        )


      return data


    } catch(error){

      throw formatApiError(error)

    }

  },


  async getTransactionSummary(
    stationId:string
  ){
  
    try {
  
      const {data} =
        await api.get<StationTransactionSummaryResponse>(
          `/stations/${stationId}/fuel-transactions/summary`
        )
  
      return data
  
    } catch(error){
  
      throw formatApiError(error)
  
    }
  
  }

}


