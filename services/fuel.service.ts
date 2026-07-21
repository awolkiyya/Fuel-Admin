import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { FuelConfig, FuelQuery } from "@/types/commen";
import {  FuelConfigApiResponse, FuelConfigPayload } from "@/types/fuel";
import { formatApiError } from "@/utils/apiError";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* ---------------------------------------
   SERVICE
----------------------------------------*/
export const fuelService = {
  /* GET ALL */
  async getFuels(params?: FuelQuery){
    try {
      const res = await api.get<PaginatedResponse<FuelConfig>>(
        "/commens/fuelTypes",
        { params }
      );

      return res.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* CREATE */
  async createFuel(data: Partial<FuelConfig>){
    try {
      const res = await api.post<ApiResponse<FuelConfig>>(
        "/commens/fuelTypes",
        data
      );

      return res.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* UPDATE */
  async updateFuel(
    id: string,
    data: Partial<FuelConfig>
  ): Promise<FuelConfig> {
    try {
      const res = await api.patch<ApiResponse<FuelConfig>>(
        `/commens/fuelTypes/${id}`,
        data
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* TOGGLE STATUS */
  async toggleStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<FuelConfig> {
    try {
      const res = await api.patch<ApiResponse<FuelConfig>>(
        `/commens/fuelTypes/${id}/toggle-status`,{
          status
        }
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },
};

/* =========================
   GET CONFIG
========================= */
export const getFuelConfig = async (
  stationId: string
): Promise<FuelConfigPayload> => {
  const res = await api.get<FuelConfigApiResponse>(
    `/stations/${stationId}/fuel-config`
  );

  return res.data.data;
};
/* =========================
   UPDATE CONFIG (FULL SAVE)
========================= */
export const updateFuelConfig = async (
  stationId: string,
  payload: FuelConfigPayload
): Promise<void> => {
  await api.patch(`/stations/${stationId}/fuel`, payload);
};
