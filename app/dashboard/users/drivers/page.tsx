"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { useDrivers } from "@/hooks/driver/useDrivers"
import { DataTablePagination } from "@/components/tables/data-pagination"
import { DriversTable } from "@/components/tables/DriversTable"
import { useRouter } from "next/navigation"
import { DriverUser } from "@/types/driver"
/* -----------------------------
   TYPES
------------------------------ */
type DriverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED"
type RiskLevel = "low" | "medium" | "high"


/* -----------------------------
   PAGE
------------------------------ */
export default function DriversManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<DriverStatus | "all">("all")
  const [risk, setRisk] = useState<RiskLevel | "all">("all")
  const [vehicleFilter, setVehicleFilter] =
    useState<"all" | "1" | "2+">("all")

  /* -----------------------------
     API (REAL HOOK)
  ------------------------------ */
  const { data, isLoading } = useDrivers({
    page: 1,
    limit: 10,
    search,
    status: status === "all" ? undefined : status,
    risk: risk === "all" ? undefined : risk,
    vehicleFilter,
  })

  // IMPORTANT: normalize safely
  const drivers = data?.data ?? []

  return (
    <div className="space-y-4 max-w-4xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Driver Management</h1>
        <p className="text-sm text-muted-foreground">
          Real-time driver monitoring with server-side filtering
        </p>
      </div>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          <Input
            placeholder="Search driver, phone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="h-10 border rounded-md px-3 text-sm"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as DriverStatus | "all")
            }
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <select
            className="h-10 border rounded-md px-3 text-sm"
            value={risk}
            onChange={(e) =>
              setRisk(e.target.value as RiskLevel | "all")
            }
          >
            <option value="all">All Risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="h-10 border rounded-md px-3 text-sm"
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value as any)}
          >
            <option value="all">All Vehicles</option>
            <option value="1">Single Vehicle</option>
            <option value="2+">Multiple Vehicles</option>
          </select>
        </div>
      </Card>

      {/* TABLE */}
        <DriversTable
          data={drivers}
          isLoading={isLoading}
          hasFilters={
            !!search || status !== "all" || risk !== "all" || vehicleFilter !== "all"
          }
          onView={(driver:DriverUser) => {
             router.push(`/dashboard/users/drivers/${driver.id}`);
          }}
        />
       {/* PAGINATION */}
       <DataTablePagination
        page={1}
        pageSize={10}
        total={data?.meta?.total || 0}
        onPageChange={(p) => {}}
        onPageSizeChange={(size) => {
          // setPageSize(size)
          // setPage(1)
        }}
      />
    </div>
  )
}