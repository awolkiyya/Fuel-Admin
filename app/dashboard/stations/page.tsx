"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { DataTablePagination } from "@/components/tables/data-pagination"
import { StationDialog } from "@/components/modals/RegisterStationDialog"

import { useStations, useDeleteStation } from "@/hooks/station/useStations"
import { StationsGrid } from "@/components/StationsGrid"

import { Search, Plus, Fuel } from "lucide-react"

export default function StationsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useStations({
    page,
    limit,
    search,
  })

  const deleteMutation = useDeleteStation()

  const stations = data?.data ?? []
  const total = data?.meta?.total ?? 0

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Stations Control Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage fuel stations, live monitoring, and operational status
        </p>
      </div>

      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* SEARCH */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stations by name, city, manager..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1) // reset page on search
            }}
            className="pl-9"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          <StationDialog
            mode="create"
            trigger={
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Station
              </Button>
            }
          />

        </div>

      </div>

      <Separator />

      {/* ================= GRID ================= */}
      <StationsGrid
        stations={stations}
        isLoading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* ================= PAGINATION ================= */}

        <DataTablePagination
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />


    </div>
  )
}