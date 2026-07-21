"use client";

import React, { useCallback } from "react";
import { fuelService } from "@/services/fuel.service";
import { FuelConfig } from "@/types/commen";
import { AsyncDropdown } from "../AsyncDropdown";

interface FuelTypeDropdownProps {
  value: string | null;
  onChange: (value: string, item: FuelConfig) => void;
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

export const FuelTypeDropdown: React.FC<FuelTypeDropdownProps> = ({
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
      const result = await fuelService.getFuels({
        search: search || "",
        page,
      });

      let data: FuelConfig[] = result.data || [];

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
    <AsyncDropdown<FuelConfig, string>
      value={value}
      onChange={onChange}
      fetchData={fetchData}
      displayField="name"
      valueField="id"
      placeholder="Select FuelType"
      disabled={disabled}
    />
  );
};