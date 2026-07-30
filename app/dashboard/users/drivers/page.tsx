"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, SlidersHorizontal } from "lucide-react"

import { useDrivers } from "@/hooks/driver/useDrivers"
import { DataTablePagination } from "@/components/tables/data-pagination"
import { DriversTable } from "@/components/tables/DriversTable"
import { useRouter } from "next/navigation"
import { DriverUser } from "@/types/driver"

/* -----------------------------
   TYPES
   NOTE: these string unions must match what the API controller
   reads off req.query — keep them in one place so a mismatch
   between frontend and backend shows up as a TS error, not a
   silent empty result set.
------------------------------ */
type DriverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED"
type RiskLevel = "low" | "medium" | "high"
type VehicleFilter = "single" | "multiple"

const DEFAULT_PAGE_SIZE = 10

const STATUS_LABELS: Record<DriverStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
}

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
}

const VEHICLE_LABELS: Record<VehicleFilter, string> = {
  single: "Single vehicle",
  multiple: "Multiple vehicles",
}

/* -----------------------------
   SMALL UTIL: debounce a value
   Keeps the network request tied to "stopped typing", not
   "every keystroke", without pulling in a dependency.
------------------------------ */
function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}

/* -----------------------------
   FILTER CHIP
   Renders one active filter as a removable pill. Keeping this
   as its own component means the "what's currently applied"
   state is always visible, not just implied by form values.
------------------------------ */
function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 py-1 pl-3 pr-1.5 text-xs font-medium text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

/* -----------------------------
   PAGE
------------------------------ */
export default function DriversManagementPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<DriverStatus | "all">("all")
  const [risk, setRisk] = useState<RiskLevel | "all">("all")
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter | "all">("all")

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const debouncedSearch = useDebouncedValue(search)

  const hasFilters =
    !!search || status !== "all" || risk !== "all" || vehicleFilter !== "all"

  // Any filter change should snap the user back to page 1 — otherwise
  // they can land on "page 4" of a filtered result set that only has 1 page.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, risk, vehicleFilter])

  const handleClearFilters = () => {
    setSearch("")
    setStatus("all")
    setRisk("all")
    setVehicleFilter("all")
  }

  /* -----------------------------
     API (REAL HOOK)
  ------------------------------ */
  const { data, isLoading } = useDrivers({
    page,
    limit: pageSize,
    search: debouncedSearch,
    status: status === "all" ? undefined : status,
    riskLevel: risk === "all" ? undefined : risk,
    vehicleFilter: vehicleFilter === "all" ? undefined : vehicleFilter,
  })

  const drivers = data?.data ?? []
  const total = data?.meta?.total ?? 0

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Driver Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time driver monitoring with server-side filtering
          </p>
        </div>
        {!isLoading && (
          <div className="shrink-0 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            {total.toLocaleString()} {total === 1 ? "driver" : "drivers"}
            {hasFilters ? " matched" : " total"}
          </div>
        )}
      </div>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search driver, phone, ID..."
              aria-label="Search drivers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

         <div className="w-full flex flex-row md:justify-end gap-2">
         <Select
            value={status}
            onValueChange={(v) => setStatus(v as DriverStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={risk} onValueChange={(v) => setRisk(v as RiskLevel | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={vehicleFilter}
            onValueChange={(v) => setVehicleFilter(v as VehicleFilter | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All vehicles</SelectItem>
              <SelectItem value="single">Single vehicle</SelectItem>
              <SelectItem value="multiple">Multiple vehicles</SelectItem>
            </SelectContent>
          </Select>


         </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
            {search && (
              <FilterChip label={`"${search}"`} onRemove={() => setSearch("")} />
            )}
            {status !== "all" && (
              <FilterChip
                label={STATUS_LABELS[status]}
                onRemove={() => setStatus("all")}
              />
            )}
            {risk !== "all" && (
              <FilterChip
                label={RISK_LABELS[risk]}
                onRemove={() => setRisk("all")}
              />
            )}
            {vehicleFilter !== "all" && (
              <FilterChip
                label={VEHICLE_LABELS[vehicleFilter]}
                onRemove={() => setVehicleFilter("all")}
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </Card>

      {/* TABLE */}
      <DriversTable
        data={drivers}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onView={(driver: DriverUser) => {
          router.push(`/dashboard/users/drivers/${driver.id}`)
        }}
      />

      {/* PAGINATION */}
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </div>
  )
}