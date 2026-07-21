"use client"

import React, { useState } from "react"
import {
  Fuel,
  Search,
  Filter,
  Truck,
  Wrench,
  ArrowUp,
  ArrowDown,
  Calendar,
  DropletIcon,
  ListFilter,
  RefreshCcw,
  Clock,
  User,
  Container,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useTankAuditLogs } from "@/hooks/tank/useTanks"
import { DataTablePagination } from "@/components/tables/data-pagination"
import { useParams } from "next/navigation"
import { EthiopianDatePicker } from "@/components/inputs/EthiopianDatePicker"
import { parseDate } from "@/utils/formatEth"

/* =========================
   TYPES
========================= */
type LogType = "ALL" | "REFILL" | "ADJUSTMENT"

/* =========================
   SUB-COMPONENTS
========================= */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/50 px-4 py-4">
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: iconBg }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-semibold leading-none tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function TypeFilterButton({
  value,
  active,
  onClick,
  icon: Icon,
  activeClass,
}: {
  value: string
  active: boolean
  onClick: () => void
  icon: React.ElementType
  activeClass: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all ${
        active
          ? activeClass
          : "border-border bg-transparent text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {value}
    </button>
  )
}

/* =========================
   MAIN COMPONENT
========================= */
function StationRefillInfos() {
  const params = useParams()
  const stationId =
    typeof params.id === "string" ? params.id : params.id?.[0]

  const [search, setSearch] = useState("")
  const [type, setType] = useState<LogType>("ALL")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /* =========================
     API CALL
  ========================= */
  const { data, isLoading } = useTankAuditLogs({
    stationId: stationId || "",
    search: search || undefined,
    type: type === "ALL" ? undefined : type,
    from: fromDate || undefined,
    to: toDate || undefined,
    page,
    limit: pageSize,
  })

  const logs = data?.data ?? []
  const meta = data?.meta
0

  /* =========================
     RESET FILTERS
  ========================= */
  const resetFilters = () => {
    setSearch("")
    setType("ALL")
    setFromDate("")
    setToDate("")
    setPage(1)
  }

  const hasActiveFilters =
    search !== "" || type !== "ALL" || fromDate !== "" || toDate !== ""

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto p-6 space-y-5">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
            <Fuel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none text-foreground">
              Fuel Audit Timeline
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Refill &amp; adjustment history
            </p>
          </div>
        </div>
      </div>

      {/* ================= FILTER CARD ================= */}
      <Card className="border border-border shadow-none">
        <CardContent className="p-4 space-y-3">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search by ID, reason, or operator…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          {/* TYPE FILTER + RESET */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <TypeFilterButton
                value="All"
                active={type === "ALL"}
                onClick={() => { setType("ALL"); setPage(1) }}
                icon={ListFilter}
                activeClass="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
              />
              <TypeFilterButton
                value="Refill"
                active={type === "REFILL"}
                onClick={() => { setType("REFILL"); setPage(1) }}
                icon={Truck}
                activeClass="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
              />
              <TypeFilterButton
                value="Adjustment"
                active={type === "ADJUSTMENT"}
                onClick={() => { setType("ADJUSTMENT"); setPage(1) }}
                icon={Wrench}
                activeClass="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground"
                onClick={resetFilters}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

    {/* DATE RANGE */}
<div className="flex flex-col sm:flex-row gap-2">
  {/* FROM */}
  <div className="flex-1 flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">
      From
    </label>

    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      <EthiopianDatePicker
        value={parseDate(fromDate)}
        onChange={(date) => {
          const formatted =
            date instanceof Date
              ? date.toISOString()
              : new Date(date).toISOString();

          setFromDate(formatted);
          setPage(1);
        }}
      />
    </div>
  </div>

  {/* TO */}
  <div className="flex-1 flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">
      To
    </label>

    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      <EthiopianDatePicker
        value={parseDate(toDate)}
        onChange={(date) => {
          const formatted =
            date instanceof Date
              ? date.toISOString()
              : new Date(date).toISOString();

          setToDate(formatted);
          setPage(1);
        }}
      />
    </div>
  </div>
</div>
        </CardContent>
      </Card>

      {/* ================= SECTION LABEL ================= */}
      {!isLoading && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">
            {meta?.total ?? logs.length} event{(meta?.total ?? logs.length) !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* ================= TIMELINE ================= */}
      <div className="space-y-2.5">
        {isLoading ? (
          /* SKELETON */
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-muted"
              style={{ opacity: 1 - i * 0.18 }}
            />
          ))
        ) : logs.length === 0 ? (
          <Card className="border border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Fuel className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No logs found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your filters or date range
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 h-8 text-xs"
                  onClick={resetFilters}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          logs.map((item) => {
            const isRefill = item.action === "REFILL"
            const isPositive = item.litersChange > 0

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-sm"
              >
                {/* LEFT ACCENT BAR */}
                <div
                  className={`absolute inset-y-0 left-0 w-[3px] ${
                    isRefill
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                />

                <div className="flex items-start justify-between gap-4 px-5 py-4 pl-6">

                  {/* LEFT CONTENT */}
                  <div className="flex items-start gap-3 min-w-0">

                    {/* ICON */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isRefill
                          ? "bg-green-50 dark:bg-green-950"
                          : "bg-orange-50 dark:bg-orange-950"
                      }`}
                    >
                      {isRefill ? (
                        <Truck
                          className="h-4 w-4 text-green-600 dark:text-green-400"
                        />
                      ) : (
                        <Wrench
                          className="h-4 w-4 text-orange-600 dark:text-orange-400"
                        />
                      )}
                    </div>

                    {/* TEXT */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={`h-5 rounded-full px-2 py-0 text-[10px] font-semibold tracking-wide ${
                            isRefill
                              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                              : "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400"
                          }`}
                        >
                          {item.action}
                        </Badge>
                      </div>

                      <p className="text-sm font-medium leading-snug text-foreground">
                        {item.reason}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <User className="h-3 w-3" />
                          {item.performedRole} ID :({item.performedBy})
                        </span>

                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div
                      className={`flex items-center gap-1 text-base font-semibold tabular-nums ${
                        isPositive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      {isPositive ? "+" : ""}
                      {item.litersChange.toLocaleString()} L
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      <Container className="h-3 w-3" />
                      {item.previousLevel.toLocaleString()} → {item.newLevel.toLocaleString()} L
                    </div>
                  </div>

                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {!isLoading && (meta?.total ?? 0) > 0 && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          total={meta?.total ?? 0}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      )}

    </div>
  )
}

export default StationRefillInfos