"use client";

import React, { useCallback } from "react";

import { organizationService } from "@/services/organization.service";

import type { Organization } from "@/types/organization.types";

import { AsyncDropdown } from "../AsyncDropdown";

interface OrganizationDropdownProps {
  value: string | null;

  onChange: (
    value: string,
    item: Organization,
  ) => void;

  disabled?: boolean;

  excludeIds?: string[];
}

export const OrganizationDropdown: React.FC<
  OrganizationDropdownProps
> = ({
  value,
  onChange,
  disabled = false,
  excludeIds = [],
}) => {
  const fetchData = useCallback(
    async ({
      search,
      page,
    }: {
      search?: string;
      page: number;
    }) => {
      const result =
        await organizationService.getOrganizations({
          page,
          filters: {
            search: search?.trim() || "",
            status: "ACTIVE",
          },
        });

      let data: Organization[] =
        result.data || [];

      if (excludeIds.length > 0) {
        const excluded = new Set(excludeIds);

        data = data.filter(
          (organization) =>
            !excluded.has(organization.id),
        );
      }

      return {
        data,
        total:
          result.meta?.total ??
          data.length,
      };
    },
    [excludeIds],
  );

  return (
    <AsyncDropdown<
      Organization,
      string
    >
      value={value}
      onChange={onChange}
      fetchData={fetchData}
      displayField="name"
      valueField="id"
      placeholder="Search organization..."
      disabled={disabled}
    />
  );
};