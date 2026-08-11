"use client"

import React, { useMemo, useState } from "react"

import {
  Building2,
  Clock,
  ClipboardList,
  Fuel,
  Gauge,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  ActionsMenu,
  ORG_TYPE_CONFIG,
  StatCard,
  STATUS_CONFIG,
  StatusBadge,
} from "@/components/ActionsMenu"

import {
  fmtLiters,
  fmtPct,
} from "@/lib/utils"

import {
  Organization,
  OrgStatus,
  OrgType,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from "@/types/organization.types"

import {
  useCreateOrganization,
  useDeleteOrganization,
  useGenerateOrganizationApiKey,
  useOrganizations,
  useUpdateOrganization,
  useUpdateOrganizationFuelAccess,
  useUpdateOrganizationStatus,
} from "@/hooks/orginization/use-organizations"

import { OrgFormModal } from "@/components/modals/OrgFormModal"


import { toast } from "sonner"
import { OrgDetailPanel } from "@/components/drawer/OrgDetailPanel"
import { useCreateQuota } from "@/hooks/quota/use-quotas"
import { AllocateQuotaModal } from "@/components/modals/AllocateQuotaModal"
import { QuotaFormState } from "@/types/quota.types"


// ============================================================================
// PAGE
// ============================================================================

function OrginazationsControllingPage() {

  // ==========================================================================
  // UI STATE
  // ==========================================================================

  const [query, setQuery] = useState("")

  const [statusFilter, setStatusFilter] =
    useState<OrgStatus | "ALL">("ALL")

  const [typeFilter, setTypeFilter] =
    useState<OrgType | "ALL">("ALL")

  // ==========================================================================
  // QUOTA MODAL
  // ==========================================================================

  const [quotaModalOpen, setQuotaModalOpen] =
  useState(false)

  const [quotaOrganizationId, setQuotaOrganizationId] =
  useState<string | undefined>(undefined)

  /**
   * The selected organization controls the detail panel.
   *
   * null = no detail panel
   * string = organization ID currently being viewed
   */
  const [selectedId, setSelectedId] =
    useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] =
    useState<Organization | null>(null)


  // ==========================================================================
  // ORGANIZATION FORM MODAL
  // ==========================================================================

  const [formModalOpen, setFormModalOpen] =
    useState(false)

  const [formMode, setFormMode] =
    useState<"create" | "edit">("create")

  const [formOrganization, setFormOrganization] =
    useState<Organization | null>(null)


  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  const [page, setPage] = useState(1)

  const limit = 20


  // ==========================================================================
  // ORGANIZATION QUERY
  // ==========================================================================

  const organizationFilters = useMemo(() => {
    return {
      search:
        query.trim() !== ""
          ? query.trim()
          : undefined,

      status:
        statusFilter !== "ALL"
          ? statusFilter
          : undefined,

      type:
        typeFilter !== "ALL"
          ? typeFilter
          : undefined,
    }
  }, [
    query,
    statusFilter,
    typeFilter,
  ])


  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useOrganizations({
    page,
    limit,
    filters: organizationFilters,
  })


  // ==========================================================================
  // MUTATIONS
  // ==========================================================================

  const createOrganizationMutation =
    useCreateOrganization()

  const updateOrganizationMutation =
    useUpdateOrganization()

  const updateStatusMutation =
    useUpdateOrganizationStatus()

  const updateFuelAccessMutation =
    useUpdateOrganizationFuelAccess()

  const deleteOrganizationMutation =
    useDeleteOrganization()

  const generateOrganizationApiKeyMutation =
  useGenerateOrganizationApiKey()


  const createQuotaMutation =
  useCreateQuota()


  // ==========================================================================
  // ORGANIZATION DATA
  // ==========================================================================

  const organizations =
    (data?.data ?? []) as Organization[]

  const meta =
    (data as any)?.meta ?? null


  // ==========================================================================
  // SELECTED ORGANIZATION
  // ==========================================================================

  /**
   * Resolve the selected organization from the current query result.
   *
   * This keeps the detail panel synchronized with mutations/refetches.
   */
  const selectedOrganization = useMemo(() => {
    if (!selectedId) {
      return null
    }

    return (
      organizations.find(
        (organization) =>
          organization.id === selectedId,
      ) ?? null
    )
  }, [
    organizations,
    selectedId,
  ])


  // ==========================================================================
// GENERATE ORGANIZATION API KEY
// ==========================================================================

const handleGenerateApiKey = (
  organization: Organization,
) => {
  if (!organization.id) {
    toast.error(
      "Organization ID is missing.",
    )

    return
  }

  generateOrganizationApiKeyMutation.mutate(
    organization.id,
  )
}

  // ==========================================================================
  // VIEW ORGANIZATION
  // ==========================================================================

  const handleViewOrganization = (
    organization: Organization,
  ) => {
    if (!organization.id) {
      toast.error(
        "Organization ID is missing.",
      )

      return
    }

    setSelectedId(organization.id)
  }


  // ==========================================================================
  // CLOSE ORGANIZATION DETAIL
  // ==========================================================================

  const handleCloseOrganizationDetail = () => {
    setSelectedId(null)
  }

  // ==========================================================================
  // OPEN QUOTA MODAL
  // ==========================================================================

  const handleOpenQuotaModal = (
    organizationId?: string,
  ) => {
    setQuotaOrganizationId(
      organizationId,
    )

    setQuotaModalOpen(true)
  }


  // ==========================================================================
  // CLOSE QUOTA MODAL
  // ==========================================================================

  const handleCloseQuotaModal = () => {
    setQuotaModalOpen(false)
    setQuotaOrganizationId(undefined)
  }


  // ==========================================================================
  // FILTERING
  // ==========================================================================

  const filtered = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase()

    return organizations.filter((org) => {
      const matchesQuery =
        normalizedQuery === "" ||
        org.name
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        org.registrationNumber
          ?.toLowerCase()
          .includes(normalizedQuery)

      const matchesStatus =
        statusFilter === "ALL" ||
        org.status === statusFilter

      const matchesType =
        typeFilter === "ALL" ||
        org.type === typeFilter

      return (
        matchesQuery &&
        matchesStatus &&
        matchesType
      )
    })
  }, [
    organizations,
    query,
    statusFilter,
    typeFilter,
  ])


  // ==========================================================================
  // STATISTICS
  // ==========================================================================

  const stats = useMemo(() => {

    const totalAllocated =
      organizations.reduce(
        (organizationTotal, org) => {

          const quotas =
            Array.isArray(org.fuelQuotas)
              ? org.fuelQuotas
              : []

          return (
            organizationTotal +
            quotas.reduce(
              (
                quotaTotal,
                quota,
              ) =>
                quotaTotal +
                Number(
                  quota.allocatedLiters ?? 0,
                ),
              0,
            )
          )
        },
        0,
      )


    const totalConsumed =
      organizations.reduce(
        (organizationTotal, org) => {

          const quotas =
            Array.isArray(org.fuelQuotas)
              ? org.fuelQuotas
              : []

          return (
            organizationTotal +
            quotas.reduce(
              (
                quotaTotal,
                quota,
              ) =>
                quotaTotal +
                Number(
                  quota.consumedLiters ?? 0,
                ),
              0,
            )
          )
        },
        0,
      )


    const activeAccess =
      organizations.filter(
        (org) =>
          org.allowFuelAccess === true,
      ).length


    const needsReview =
      organizations.filter(
        (org) =>
          org.status === "PENDING" ||
          org.status === "SUSPENDED",
      ).length


    return {
      totalAllocated,
      totalConsumed,
      activeAccess,
      needsReview,
    }

  }, [
    organizations,
  ])


  // ==========================================================================
  // STATUS FILTERS
  // ==========================================================================

  const statusFilters: (
    | OrgStatus
    | "ALL"
  )[] = [
    "ALL",
    "ACTIVE",
    "SUSPENDED",
    "PENDING",
    "BLOCKED",
  ]


  // ==========================================================================
  // CREATE MODAL
  // ==========================================================================

  const handleOpenCreateModal = () => {
    setFormMode("create")
    setFormOrganization(null)
    setFormModalOpen(true)
  }


  // ==========================================================================
  // EDIT MODAL
  // ==========================================================================

  const handleOpenEditModal = (
    organization: Organization,
  ) => {

    setFormMode("edit")

    setFormOrganization(
      organization,
    )

    setFormModalOpen(true)
  }


  // ==========================================================================
  // CLOSE FORM MODAL
  // ==========================================================================

  const handleCloseFormModal = () => {

    if (
      createOrganizationMutation.isPending ||
      updateOrganizationMutation.isPending
    ) {
      return
    }

    setFormModalOpen(false)

    setFormOrganization(null)
  }


  // ==========================================================================
  // SUBMIT ORGANIZATION FORM
  // ==========================================================================

  const handleOrganizationSubmit = (
    formData:
      | CreateOrganizationPayload
      | UpdateOrganizationPayload,
  ) => {

    if (formMode === "create") {

      createOrganizationMutation.mutate(
        formData as CreateOrganizationPayload,
        {
          onSuccess: () => {
            handleCloseFormModal()
          },
        },
      )

      return
    }


    if (!formOrganization?.id) {

      toast.error(
        "Organization ID is missing.",
      )

      return
    }


    updateOrganizationMutation.mutate(
      {
        id: formOrganization.id,
        data:
          formData as UpdateOrganizationPayload,
      },
      {
        onSuccess: () => {
          handleCloseFormModal()
        },
      },
    )
  }


  const handleQuotaSubmit = (
    formData: QuotaFormState,
  ) => {
    createQuotaMutation.mutate(
      {
        organizationId:
          formData.organizationId,
  
        fuelTypeId:
          formData.fuelTypeId,
  
        periodType:
          formData.periodType,
  
        startDate:
          formData.startDate,
  
        endDate:
          formData.endDate,
  
        allocatedLiters:
          Number(
            formData.allocatedLiters,
          ),
  
        remarks:
          formData.remarks.trim() ||
          undefined,
      },
      {
        onSuccess: () => {
          handleCloseQuotaModal()
  
          toast.success(
            "Fuel quota allocated successfully.",
          )
  
          refetch()
        },
      },
    )
  }


  // ==========================================================================
  // STATUS
  // ==========================================================================

  const handleStatusChange = (
    orgId: string,
    status: OrgStatus,
  ) => {

    updateStatusMutation.mutate({
      id: orgId,
      data: {
        status,
      },
    })
  }


  // ==========================================================================
  // TOGGLE ACTIVE
  // ==========================================================================

  const handleToggleActive = (
    org: Organization,
  ) => {

    const willActivate =
      org.status !== "ACTIVE"

    handleStatusChange(
      org.id,
      willActivate
        ? "ACTIVE"
        : "SUSPENDED",
    )
  }


  // ==========================================================================
  // FUEL ACCESS
  // ==========================================================================

  const handleFuelAccessChange = (
    orgId: string,
    allowFuelAccess: boolean,
  ) => {

    updateFuelAccessMutation.mutate({
      id: orgId,
      data: {
        allowFuelAccess,
      },
    })
  }


  // ==========================================================================
  // DELETE
  // ==========================================================================

  const handleDeleteConfirm = () => {

    if (!deleteTarget) {
      return
    }


    deleteOrganizationMutation.mutate(
      deleteTarget.id,
      {
        onSuccess: () => {

          if (
            selectedId ===
            deleteTarget.id
          ) {
            setSelectedId(null)
          }

          setDeleteTarget(null)
        },
      },
    )
  }


  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  const currentPage =
    Number(
      meta?.current_page ??
        meta?.currentPage ??
        page,
    )


  const lastPage =
    Number(
      meta?.last_page ??
        meta?.lastPage ??
        1,
    )


  const total =
    Number(
      meta?.total ??
        organizations.length,
    )


  const canGoPrevious =
    currentPage > 1 &&
    !isFetching


  const canGoNext =
    currentPage < lastPage &&
    !isFetching


  const handlePreviousPage = () => {

    if (!canGoPrevious) {
      return
    }

    setPage(
      (previousPage) =>
        Math.max(
          previousPage - 1,
          1,
        ),
    )
  }


  const handleNextPage = () => {

    if (!canGoNext) {
      return
    }

    setPage(
      (previousPage) =>
        previousPage + 1,
    )
  }


  // ==========================================================================
  // FILTER HANDLERS
  // ==========================================================================

  const handleSearchChange = (
    value: string,
  ) => {

    setQuery(value)

    setPage(1)
  }


  const handleStatusFilterChange = (
    status: OrgStatus | "ALL",
  ) => {

    setStatusFilter(status)

    setPage(1)
  }


  const handleTypeFilterChange = (
    type: OrgType | "ALL",
  ) => {

    setTypeFilter(type)

    setPage(1)
  }


  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading) {

    return (
      <div className="min-h-screen bg-stone-50/60 p-6">

        <div className="mx-auto max-w-5xl space-y-6">

          <div className="space-y-2">

            <div className="h-7 w-48 animate-pulse rounded bg-stone-200" />

            <div className="h-4 w-96 animate-pulse rounded bg-stone-200" />

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({
              length: 4,
            }).map((_, index) => (

              <Card
                key={index}
                className="h-28 animate-pulse border-stone-200 bg-stone-100"
              />

            ))}

          </div>


          <Card className="h-16 animate-pulse border-stone-200 bg-stone-100" />

          <Card className="h-96 animate-pulse border-stone-200 bg-stone-100" />

        </div>

      </div>
    )
  }


  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  if (isError) {

    return (
      <div className="min-h-screen bg-stone-50/60 p-6">

        <div className="mx-auto max-w-5xl">

          <Card className="border-rose-200 bg-white p-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">

              <Building2 className="h-6 w-6" />

            </div>


            <h2 className="mt-4 text-lg font-semibold text-stone-900">
              Unable to load organizations
            </h2>


            <p className="mt-1 text-sm text-stone-500">

              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading organizations."}

            </p>


            <Button
              variant="outline"
              className="mt-5"
              onClick={() =>
                refetch()
              }
            >
              Try again
            </Button>

          </Card>

        </div>

      </div>
    )
  }


  // ==========================================================================
  // PAGE
  // ==========================================================================

  return (
    <div className="min-h-screen bg-stone-50/60 p-6">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* ================================================================
            HEADER
            ================================================================ */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Organizations
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage fuel access, quota allocation,
              and consumption for every registered
              organization.
            </p>

          </div>


          <div className="flex items-center gap-2">

          <Button
              variant="outline"
              disabled={
                organizations.length === 0
              }
              onClick={() =>
                handleOpenQuotaModal()
              }
            >
              <ClipboardList className="mr-1.5 h-4 w-4" />

              Allocate quota
          </Button>


            <Button
              className="bg-stone-900 hover:bg-stone-800"
              onClick={
                handleOpenCreateModal
              }
            >
              <Plus className="mr-1.5 h-4 w-4" />

              Register organization
            </Button>

          </div>

        </div>


        {/* ================================================================
            STATS
            ================================================================ */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={Building2}
            label="Organizations"
            value={String(total)}
            hint={`${stats.activeAccess} with active fuel access`}
          />


          <StatCard
            icon={Gauge}
            label="Allocated this cycle"
            value={fmtLiters(
              stats.totalAllocated,
            )}
            hint="Across available quotas"
          />


          <StatCard
            icon={Fuel}
            label="Consumed this cycle"
            value={fmtLiters(
              stats.totalConsumed,
            )}
            hint={
              stats.totalAllocated > 0
                ? `${fmtPct(
                    (stats.totalConsumed /
                      stats.totalAllocated) *
                      100,
                  )} of total allocation`
                : "No quotas allocated yet"
            }
          />


          <StatCard
            icon={Clock}
            label="Needs review"
            value={String(
              stats.needsReview,
            )}
            hint="Suspended or pending organizations"
          />

        </div>


        {/* ================================================================
            FILTERS
            ================================================================ */}

        <Card className="border-stone-200 p-3">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full md:max-w-xs">

              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />

              <Input
                value={query}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value,
                  )
                }
                placeholder="Search by name or registration No."
                className="pl-8"
              />

            </div>


            <div className="flex flex-wrap items-center gap-2">

              <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-stone-400" />


              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilterChange(
                    event.target.value as
                      | OrgStatus
                      | "ALL",
                  )
                }
                aria-label="Filter by status"
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200"
              >

                <option value="ALL">
                  All statuses
                </option>


                {statusFilters
                  .filter(
                    (
                      status,
                    ): status is OrgStatus =>
                      status !== "ALL",
                  )
                  .map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {
                        STATUS_CONFIG[
                          status
                        ].label
                      }
                    </option>

                  ))}

              </select>


              <select
                value={typeFilter}
                onChange={(event) =>
                  handleTypeFilterChange(
                    event.target.value as
                      | OrgType
                      | "ALL",
                  )
                }
                aria-label="Filter by organization type"
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200"
              >

                <option value="ALL">
                  All types
                </option>


                {(
                  Object.keys(
                    ORG_TYPE_CONFIG,
                  ) as OrgType[]
                ).map((type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {
                      ORG_TYPE_CONFIG[
                        type
                      ].label
                    }
                  </option>

                ))}

              </select>

            </div>

          </div>

        </Card>


        {/* ================================================================
            FETCHING INDICATOR
            ================================================================ */}

        {isFetching && (

          <div className="flex items-center justify-end">

            <span className="text-xs text-stone-400">
              Updating organizations...
            </span>

          </div>

        )}


        {/* ================================================================
            TABLE
            ================================================================ */}

        <Card className="overflow-visible border-stone-200 p-0">

          <div className="grid grid-cols-13 gap-3 border-b border-stone-200 bg-stone-50/80 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500">

            <div className="col-span-1 text-center">
              No.
            </div>

            <div className="col-span-3">
              Organization
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-2">
              Fuel access
            </div>

            <div className="col-span-2">
              Quota consumption
            </div>

            <div className="col-span-2 text-right">
              Max / transaction
            </div>

            <div className="col-span-1 text-right">
              Actions
            </div>

          </div>


          {/* ==============================================================
              EMPTY STATE
              ============================================================== */}

          {filtered.length === 0 ? (

            <div className="p-10 text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">

                <Building2 className="h-5 w-5 text-stone-400" />

              </div>


              <p className="mt-3 text-sm font-medium text-stone-600">
                No organizations match
                these filters.
              </p>


              <p className="mt-1 text-xs text-stone-400">
                Try a different search
                term or clear a filter.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-stone-100">

              {filtered.map(
                (org, index) => {

                  // ========================================================
                  // QUOTAS
                  // ========================================================

                  const quotas =
                    Array.isArray(
                      org.fuelQuotas,
                    )
                      ? org.fuelQuotas
                      : []


                  // ========================================================
                  // TOTAL ALLOCATED
                  // ========================================================

                  const totalAllocated =
                    quotas.reduce(
                      (
                        sum,
                        quota,
                      ) =>
                        sum +
                        Number(
                          quota.allocatedLiters ??
                            0,
                        ),
                      0,
                    )


                  // ========================================================
                  // TOTAL CONSUMED
                  // ========================================================

                  const totalConsumed =
                    quotas.reduce(
                      (
                        sum,
                        quota,
                      ) =>
                        sum +
                        Number(
                          quota.consumedLiters ??
                            0,
                        ),
                      0,
                    )


                  // ========================================================
                  // CONSUMPTION PERCENTAGE
                  // ========================================================

                  const pct =
                    totalAllocated > 0
                      ? (totalConsumed /
                          totalAllocated) *
                        100
                      : null


                  // ========================================================
                  // MUTATION STATE
                  // ========================================================

                  const isFuelAccessUpdating =
                    updateFuelAccessMutation.isPending &&
                    updateFuelAccessMutation
                      .variables
                      ?.id === org.id


                  // ========================================================
                  // PAGINATED ROW NUMBER
                  // ========================================================

                  const rowNumber =
                    (currentPage - 1) *
                      limit +
                    index +
                    1


                  // ========================================================
                  // ROW
                  // ========================================================

                  return (
                    <div
                      key={org.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        handleViewOrganization(
                          org,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {

                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            " "
                        ) {

                          event.preventDefault()

                          handleViewOrganization(
                            org,
                          )
                        }

                      }}
                      className={`grid w-full grid-cols-13 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${
                        selectedId ===
                        org.id
                          ? "bg-stone-50"
                          : ""
                      }`}
                    >

                      {/* NUMBER */}

                      <div className="col-span-1 flex justify-center">

                        <span className="font-mono text-xs font-medium tabular-nums text-stone-400">
                          {rowNumber}
                        </span>

                      </div>


                      {/* ORGANIZATION */}

                      <div className="col-span-3 flex min-w-0 items-center gap-3">

                        <div className="rounded-lg bg-stone-100 p-2 text-stone-500">

                          <Building2 className="h-4 w-4" />

                        </div>


                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-stone-900">
                            {org.name}
                          </p>

                          <p className="font-mono text-[11px] text-stone-400">
                            {
                              org.registrationNumber
                            }
                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div className="col-span-2">

                        <StatusBadge
                          status={
                            org.status
                          }
                        />

                      </div>


                      {/* FUEL ACCESS */}

                      <div className="col-span-2">

                        <button
                          type="button"
                          disabled={
                            isFuelAccessUpdating ||
                            org.status ===
                              "BLOCKED"
                          }
                          onClick={(
                            event,
                          ) => {

                            event.stopPropagation()

                            handleFuelAccessChange(
                              org.id,
                              !Boolean(
                                org.allowFuelAccess,
                              ),
                            )
                          }}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity ${
                            org.allowFuelAccess
                              ? "text-emerald-600"
                              : "text-rose-500"
                          } ${
                            isFuelAccessUpdating
                              ? "cursor-not-allowed opacity-50"
                              : "hover:opacity-70"
                          }`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              org.allowFuelAccess
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />


                          {isFuelAccessUpdating
                            ? "Updating..."
                            : org.allowFuelAccess
                              ? "Allowed"
                              : "Blocked"}

                        </button>

                      </div>


                      {/* QUOTA */}

                      <div className="col-span-2">

                        {pct === null ? (

                          <button
                            type="button"
                            onClick={(
                              event,
                            ) => {

                              event.stopPropagation()

                              // Connect quota modal here.

                            }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
                          >

                            <Plus className="h-3 w-3" />

                            Allocate

                          </button>

                        ) : (

                          <div className="flex items-center gap-2">

                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-100">

                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      pct,
                                      0,
                                    ),
                                    100,
                                  )}%`,
                                  backgroundColor:
                                    pct >=
                                    95
                                      ? "#E11D48"
                                      : pct >=
                                          80
                                        ? "#D97706"
                                        : "#059669",
                                }}
                              />

                            </div>


                            <span className="font-mono text-xs text-stone-500">
                              {fmtPct(
                                pct,
                              )}
                            </span>

                          </div>

                        )}

                      </div>


                      {/* MAX TRANSACTION */}

                      <div className="col-span-2 text-right">

                        <span className="font-mono text-xs text-stone-600">
                          {fmtLiters(
                            Number(
                              org.maxTransactionLiters ??
                                0,
                            ),
                          )}
                        </span>

                      </div>


                      {/* ACTIONS */}

                      <div
                        className="col-span-1 flex justify-end"
                        onClick={(
                          event,
                        ) =>
                          event.stopPropagation()
                        }
                      >

                      <ActionsMenu
                        status={org.status}

                        onView={() =>
                          handleViewOrganization(org)
                        }

                        onEdit={() =>
                          handleOpenEditModal(org)
                        }

                        onAllocateQuota={() =>
                          handleOpenQuotaModal(org.id)
                        }

                        onGenerateApiKey={() =>
                          handleGenerateApiKey(org)
                        }

                        onToggleActive={() =>
                          handleToggleActive(org)
                        }

                        onDelete={() =>
                          setDeleteTarget(org)
                        }
                      />

                      </div>

                    </div>
                  )
                },
              )}

            </div>

          )}


          {/* ==============================================================
              PAGINATION
              ============================================================== */}

          {lastPage > 1 && (

            <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">

              <p className="text-xs text-stone-500">

                Showing{" "}

                <span className="font-medium text-stone-700">
                  {filtered.length}
                </span>{" "}

                of{" "}

                <span className="font-medium text-stone-700">
                  {total}
                </span>{" "}

                organizations

              </p>


              <div className="flex items-center gap-3">

                <span className="text-xs text-stone-500">

                  Page{" "}

                  <span className="font-medium text-stone-700">
                    {currentPage}
                  </span>{" "}

                  of{" "}

                  <span className="font-medium text-stone-700">
                    {lastPage}
                  </span>

                </span>


                <div className="flex items-center gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !canGoPrevious
                    }
                    onClick={
                      handlePreviousPage
                    }
                  >
                    Previous
                  </Button>


                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !canGoNext
                    }
                    onClick={
                      handleNextPage
                    }
                  >
                    Next
                  </Button>

                </div>

              </div>

            </div>

          )}

        </Card>


        {/* ================================================================
            FOOTER NOTE
            ================================================================ */}

        <Card className="border-stone-200 bg-stone-50 p-4 text-center">

          <p className="text-sm text-stone-500">

            This module controls{" "}

            <b className="text-stone-700">
              government fleets,
              factories, and bulk fuel
              systems.
            </b>

            <br />

            Every feature here is built for
            enterprise-grade fuel governance.

          </p>

        </Card>

      </div>

      {selectedOrganization && (
          <OrgDetailPanel
            org={selectedOrganization}
            onClose={handleCloseOrganizationDetail}
            onAssignQuota={(orgId) => {
              // Connect AllocateQuotaModal here
              console.log("Assign quota:", orgId)
            }}
            onEdit={(organization) => {
              handleOpenEditModal(organization)
            }}
            onToggleActive={(organization) => {
              handleToggleActive(organization)
            }}
            onDelete={(organization) => {
              setDeleteTarget(organization)
            }}
          />
        )}


      {/* ================================================================
          ORGANIZATION FORM MODAL
          ================================================================ */}

      {formModalOpen && (

        <OrgFormModal
          mode={formMode}
          initial={
            formOrganization ??
            undefined
          }
          onClose={
            handleCloseFormModal
          }
          onSubmit={
            handleOrganizationSubmit
          }
        />

      )}

      {/* QUOTA MODAL */}

      {quotaModalOpen && (
        <AllocateQuotaModal
          organizations={organizations}
          lockedOrganizationId={
            quotaOrganizationId
          }
          onClose={
            handleCloseQuotaModal
          }
          onSubmit={
            handleQuotaSubmit
          }
        />
      )}


      {/* ================================================================
          DELETE CONFIRMATION
          ================================================================ */}

      {deleteTarget && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <Card className="w-full max-w-md border-stone-200 bg-white p-6 shadow-xl">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">

                <Building2 className="h-5 w-5" />

              </div>


              <div className="min-w-0">

                <h2 className="text-base font-semibold text-stone-900">
                  Delete organization
                </h2>


                <p className="mt-1 text-sm leading-5 text-stone-500">

                  This will permanently remove{" "}

                  <span className="font-medium text-stone-700">
                    {deleteTarget.name}
                  </span>

                  . This action cannot be undone.

                </p>

              </div>

            </div>


            <div className="mt-6 flex justify-end gap-2">

              <Button
                variant="outline"
                disabled={
                  deleteOrganizationMutation.isPending
                }
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </Button>


              <Button
                variant="destructive"
                disabled={
                  deleteOrganizationMutation.isPending
                }
                onClick={
                  handleDeleteConfirm
                }
              >
                {deleteOrganizationMutation.isPending
                  ? "Deleting..."
                  : "Delete organization"}
              </Button>

            </div>

          </Card>

        </div>

      )}

    </div>
  )
}


export default OrginazationsControllingPage