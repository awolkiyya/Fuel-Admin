"use client";

import React, { useCallback } from "react";
import { AsyncDropdown } from "../AsyncDropdown";
import { stationOperatorService } from "@/services/operation.service";
import { RejectionReason } from "@/types/fuel-reques";

interface RejectionReasonDropDownProps {
  value: string | null;
  onChange: (value: string, item: RejectionReason) => void;
  disabled?: boolean;

  /**
   * Optional filtering controls (frontend-level only)
   */
  excludeCodes?: string[];
  includeCodes?: string[];
}

export const RejectionReasonDropDown: React.FC<
  RejectionReasonDropDownProps
> = ({
  value,
  onChange,
  disabled = false,
  excludeCodes = [],
  includeCodes,
}) => {
  const fetchData = useCallback(
    async ({ search, page, pageSize }: { search?: string; page: number; pageSize: number }) => {
      const result = await stationOperatorService.getRejectionReasons({
        page,
        limit: pageSize,
        search: search || "",
      });
  
      const rawData: RejectionReason[] = result.data || [];
      const rawTotal = result.meta?.total ?? rawData.length;
  
      let data = rawData;
      if (includeCodes?.length) {
        const allowed = new Set(includeCodes.map((c) => c.toLowerCase()));
        data = data.filter((r) => allowed.has(r.code.toLowerCase()));
      } else if (excludeCodes.length) {
        const blocked = new Set(excludeCodes.map((c) => c.toLowerCase()));
        data = data.filter((r) => !blocked.has(r.code.toLowerCase()));
      }
  
      // If the server has no more raw pages, there's nothing left to fetch,
      // regardless of how many survived the frontend filter.
      const hasMoreServerPages = page * pageSize < rawTotal;
  
      return {
        data,
        // Cap "total" so AsyncDropdown's `options.length < total` check
        // can never stay true past the last real server page.
        total: hasMoreServerPages ? rawTotal : Infinity === Infinity ? undefined : rawTotal,
      };
    },
    [excludeCodes, includeCodes]
  );

  return (
    <AsyncDropdown<RejectionReason, string>
      value={value}
      onChange={onChange}
      fetchData={fetchData}
      displayField="label"
      valueField="id"
      placeholder="Select rejection reason"
      disabled={disabled}
      pageSize={20}
    />
  );
};