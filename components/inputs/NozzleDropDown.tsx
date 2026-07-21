"use client";

import React, { useCallback } from "react";
import { fuelService } from "@/services/fuel.service";
import { FuelConfig } from "@/types/commen";
import { AsyncDropdown } from "../AsyncDropdown";
import { Nozzle } from "@/types/pump.types";
import { pumpService } from "@/services/pump.service";

interface NozzleDropdownProps {
  value: string | null;
  onChange: (value: string, item: Nozzle) => void;
  disabled?: boolean;
  fuelType?:string;

  /**
   * Example:
   * excludeNames={["YEARLY", "HALF_YEAR"]}
   */
  excludeNames?: string[];

  /**
   * Or allow-only mode (optional advanced control)
   */
  includeNames?: string[];
  stationId?: string; // ✅ REQUIRED

}

export const NozzleDropdown: React.FC<NozzleDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  excludeNames = [],
  includeNames,
  fuelType,
  stationId

}) => {
  const fetchData = useCallback(
    async ({
      search,
      page,
      pageSize,
    }: {
      search?: string;
      page: number;
      pageSize: number;
    }) => {
      const result = await pumpService.getNozzlesByFuelType({
        stationId:stationId,
        fuelType:fuelType,
        page,
        perPage:pageSize,
        search
       });

      let data: Nozzle[] = result.data || [];


      return {
        data,
        total: result.meta?.total ?? data.length,
      };
    },
    [excludeNames, includeNames]
  );

  return (
    <AsyncDropdown<Nozzle, string>
      value={value}
      onChange={onChange}
      fetchData={fetchData}
      displayField="number"
      valueField="id"
      placeholder="Select Nozzle ID"
      disabled={disabled}
    />
  );
};