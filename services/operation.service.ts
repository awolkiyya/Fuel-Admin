import { api } from "@/lib/api"
import { PaginatedResponse, SingleResponse } from "@/types/api"
import { FuelRequest, FuelRequestSummary, RejectionReason } from "@/types/fuel-reques"

/* ---------------------------------
   QUERY TYPES
---------------------------------- */

export interface GetFuelRequestsParams {
  page?: number
  limit?: number
  search?: string
  vehicleType?: string
  fuelType?: string
  status?: string
}

/* ---------------------------------
   PROCESS PAYLOAD
---------------------------------- */

export interface ApproveFuelRequestPayload {
  approvedLiters: number;
  nozzleId: string;
}

/* ---------------------------------
   REJECT PAYLOAD
---------------------------------- */

export interface RejectFuelRequestPayload {
  rejectionReasonId: string
  rejectionNote?: string
}


/* ---------------------------------
   COMPLETE DISPENSING PAYLOAD
---------------------------------- */

export interface CompleteDispensingFuelRequestPayload {
  dispensedLiters: number;
}


/* ---------------------------------
   STATION OPERATOR SERVICE
---------------------------------- */

export const stationOperatorService = {
  /* ---------------------------------
     GET FUEL REQUESTS
  ---------------------------------- */
  getFuelRequests: async (
    params: GetFuelRequestsParams
  ): Promise<PaginatedResponse<FuelRequest, FuelRequestSummary>> => {
    const res = await api.get<
      PaginatedResponse<FuelRequest, FuelRequestSummary>
    >("/stations/station-operator/fuel-requests", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        vehicleType: params.vehicleType || undefined,
        fuelType: params.fuelType || undefined,
        status: params.status || undefined,
      },
    })

    return res.data
  },

  /* ---------------------------------
     GET SINGLE REQUEST
  ---------------------------------- */
  getFuelRequest: async (
    id: string
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.get<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}`
    )

    return res.data
  },

  /* ---------------------------------
   GET CURRENT ACTIVE FUEL REQUEST
  ---------------------------------- */
  getCurrentFuelRequest: async (): Promise<
  SingleResponse<FuelRequest | null>
  > => {
  const res = await api.get<SingleResponse<FuelRequest | null>>(
    "/stations/station-operator/fuel-request/current"
  );

  return res.data;
  },

    /* VERIFY (NEW) */


  verifyFuelRequest: async (
  id: string
): Promise<SingleResponse<FuelRequest>> => {
  const res = await api.patch<SingleResponse<FuelRequest>>(
    `/stations/station-operator/fuel-requests/${id}/verify`
  );

  return res.data;
},



  getRejectionReasons: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<RejectionReason>> => {
    const res = await api.get<PaginatedResponse<RejectionReason>>(
      "/stations/station-operator/rejection-reasons",
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          search: params?.search || undefined,
        },
      }
    );
  
    return res.data;
  },

  /* ---------------------------------
     REJECT FUEL REQUEST
  ---------------------------------- */
  rejectFuelRequest: async (
    id: string,
    data: RejectFuelRequestPayload
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.patch<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}/reject`,
      data
    )

    return res.data
  },


  /* ---------------------------------
   APPROVE FUEL REQUEST
---------------------------------- */
  approveFuelRequest: async (
    id: string,
    data: ApproveFuelRequestPayload
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.patch<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}/approve`,
      data
    );

    return res.data;
  },

  /* ---------------------------------
    CANCEL FUEL REQUEST
  ---------------------------------- */
  cancelFuelRequest: async (
    id: string
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.patch<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}/cancel`
    );

    return res.data;
  },

  /* ---------------------------------
   START DISPENSING FUEL REQUEST
  ---------------------------------- */
  startDispensingFuelRequest: async (
    id: string
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.patch<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}/start-dispensing`
    );

    return res.data;
  },

  /* ---------------------------------
   COMPLETE DISPENSING FUEL REQUEST
  ---------------------------------- */
  completeDispensingFuelRequest: async (
    id: string,
    data: CompleteDispensingFuelRequestPayload
  ): Promise<SingleResponse<FuelRequest>> => {
    const res = await api.patch<SingleResponse<FuelRequest>>(
      `/stations/station-operator/fuel-requests/${id}/complete`,
      data
    );

    return res.data;
  },
}