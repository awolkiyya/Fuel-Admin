"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { PaginatedResponse } from "@/types/api";
import { FuelConfig, FuelQuery } from "@/types/commen";
import { fuelService, getFuelConfig, updateFuelConfig } from "@/services/fuel.service";
import { FuelConfigPayload } from "@/types/fuel";

/* ---------------------------------------
   GET FUELS
----------------------------------------*/
export const useFuels = (params: FuelQuery) => {
  return useQuery<PaginatedResponse<FuelConfig>>({
    queryKey: ["fuels", params],
    queryFn: () => fuelService.getFuels(params),
  });
};

/* ---------------------------------------
   CREATE
----------------------------------------*/
export const useCreateFuel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FuelConfig>) =>
      fuelService.createFuel(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fuels"] });
      toast.success("Fuel created successfully");
    },
  });
};

/* ---------------------------------------
   UPDATE
----------------------------------------*/
export const useUpdateFuel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FuelConfig>;
    }) => fuelService.updateFuel(id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fuels"] });
      toast.success("Fuel updated successfully");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update fuel"
      );
    },
  });
};

/* ---------------------------------------
   TOGGLE STATUS
----------------------------------------*/
export const useUpdateFuelStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => fuelService.toggleStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fuels"] });
      toast.success("Status updated successfully");
    },
  });
};
/* ---------------------------------------
   GET STATION FUEL CONFIG
----------------------------------------*/
export const useFuelConfig = (stationId: string) => {
  return useQuery<FuelConfigPayload>({
    queryKey: ["fuel-config", stationId],
    queryFn: () => getFuelConfig(stationId),
    enabled: !!stationId,
  });
};

/* ---------------------------------------
   UPDATE FULL CONFIG (SAVE ALL)
----------------------------------------*/
export const useUpdateFuelConfig = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      stationId,
      payload,
    }: {
      stationId: string;
      payload: FuelConfigPayload;
    }) => updateFuelConfig(stationId, payload),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["fuel-config", variables.stationId],
      });

      toast.success("Fuel configuration updated successfully");
    }
  });
};