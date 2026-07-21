"use client";

import React, { useCallback } from "react";
import { AsyncDropdown } from "../AsyncDropdown";
import { vehicleService } from "@/services/vehicle.service";
import { VehicleType } from "@/types/vehicle";

interface VehicleTypeDropdownProps {
  value: string | null;
  onChange: (value: string, item: VehicleType) => void;
  disabled?: boolean;

  /**
   * Example:
   * excludeNames={["YEARLY", "HALF_YEAR"]}
   */
  excludeNames?: string[];

  /**
   * Or allow-only mode (optional advanced control)
   */
  includeNames?: string[];
}

export const VehicleTypeDropdown: React.FC<VehicleTypeDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  excludeNames = [],
  includeNames,
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
      const result = await vehicleService.getVehicles({
        search: search || "",
        page,
      });

      let data: VehicleType[] = result.data || [];

      /**
       * =====================================================
       * FILTERING LOGIC (BY NAME)
       * =====================================================
       * Priority:
       * 1. includeNames (strict allow list)
       * 2. excludeNames (filter out unwanted)
       */
      if (includeNames && includeNames.length > 0) {
        const allowed = new Set(includeNames.map((n) => n.toLowerCase()));
        data = data.filter((f) =>
          allowed.has((f.name || "").toLowerCase())
        );
      } else if (excludeNames.length > 0) {
        const blocked = new Set(excludeNames.map((n) => n.toLowerCase()));
        data = data.filter(
          (f) => !blocked.has((f.name || "").toLowerCase())
        );
      }

      return {
        data,
        total: result.meta?.total ?? data.length,
      };
    },
    [excludeNames, includeNames]
  );

  return (
    <AsyncDropdown<VehicleType, string>
      value={value}
      onChange={onChange}
      fetchData={fetchData}
      displayField="name"
      valueField="id"
      placeholder="Select Vehicle Type"
      disabled={disabled}
    />
  );
};