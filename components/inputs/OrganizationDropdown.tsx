"use client"

import React, { useCallback } from "react"

import { organizationService } from "@/services/organization.service"

import type { Organization } from "@/types/organization.types"

import { AsyncDropdown } from "../AsyncDropdown"

// ============================================================================
// PROPS
// ============================================================================

interface OrganizationDropdownProps {
  value: string | null

  onChange: (
    value: string,
    item: Organization,
  ) => void

  disabled?: boolean

  /**
   * Optional organization IDs that should not
   * appear in the dropdown.
   */
  excludeIds?: string[]
}

// ============================================================================
// COMPONENT
// ============================================================================

export const OrganizationDropdown: React.FC<
  OrganizationDropdownProps
> = ({
  value,
  onChange,
  disabled = false,
  excludeIds = [],
}) => {
  // ==========================================================================
  // FETCH ORGANIZATIONS
  // ==========================================================================

  const fetchData = useCallback(
    async ({
      search,
      page,
      pageSize,
    }: {
      search?: string
      page: number
      pageSize: number
    }) => {
      const result =
        await organizationService.getOrganizations({
          page,
          limit: 10,

          filters: {
            search: search?.trim() || "",
            status: "ACTIVE",
          },
        })

      let data: Organization[] =
        result.data || []

      // =========================================================================
      // OPTIONAL CLIENT-SIDE EXCLUSION
      // =========================================================================

      if (excludeIds.length > 0) {
        const excluded = new Set(
          excludeIds,
        )

        data = data.filter(
          (organization) =>
            !excluded.has(
              organization.id,
            ),
        )
      }

      return {
        data,

        total:
          result.meta?.total ??
          data.length,
      }
    },
    [excludeIds],
  )

  // ==========================================================================
  // RENDER
  // ==========================================================================

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
  )
}