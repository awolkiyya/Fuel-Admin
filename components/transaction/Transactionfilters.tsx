"use client"

import React, { useMemo } from "react"
import { ChevronDown, Search, X, SlidersHorizontal, Droplets, UserRound } from "lucide-react"
import type { FuelTransactionType } from "@/types/station-transaction"

export type Option = { id: string; name: string }

const typeTabs: { key: "ALL" | FuelTransactionType; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "NORMAL", label: "Normal" },
  { key: "ORGANIZATION", label: "Organization" },
]

const payTabs = [
  { key: "ALL", label: "All" },
  { key: "PAID", label: "Paid" },
  { key: "PARTIAL", label: "Partial" },
  { key: "UNPAID", label: "Unpaid" },
]

const typeLabel: Record<string, string> = { NORMAL: "Normal", ORGANIZATION: "Organization" }
const payLabel: Record<string, string> = { PAID: "Paid", PARTIAL: "Partial", UNPAID: "Unpaid" }

export default function TransactionFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  payFilter,
  onPayChange,
  fuelFilter,
  onFuelChange,
  fuelOptions,
  attendantFilter,
  onAttendantChange,
  attendantOptions,
}: {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: "ALL" | FuelTransactionType
  onTypeChange: (v: "ALL" | FuelTransactionType) => void
  payFilter: string
  onPayChange: (v: string) => void
  fuelFilter: string
  onFuelChange: (v: string) => void
  fuelOptions: Option[]
  attendantFilter: string
  onAttendantChange: (v: string) => void
  attendantOptions: Option[]
}) {
  const fuelName = useMemo(
    () => fuelOptions.find((f) => f.id === fuelFilter)?.name,
    [fuelOptions, fuelFilter]
  )
  const attendantName = useMemo(
    () => attendantOptions.find((a) => a.id === attendantFilter)?.name,
    [attendantOptions, attendantFilter]
  )

  const chips = useMemo(() => {
    const list: { key: string; label: string; onClear: () => void }[] = []
    if (typeFilter !== "ALL") list.push({ key: "type", label: typeLabel[typeFilter], onClear: () => onTypeChange("ALL") })
    if (payFilter !== "ALL") list.push({ key: "pay", label: payLabel[payFilter] ?? payFilter, onClear: () => onPayChange("ALL") })
    if (fuelFilter !== "ALL" && fuelName) list.push({ key: "fuel", label: fuelName, onClear: () => onFuelChange("ALL") })
    if (attendantFilter !== "ALL" && attendantName)
      list.push({ key: "attendant", label: attendantName, onClear: () => onAttendantChange("ALL") })
    if (search.trim()) list.push({ key: "search", label: `"${search.trim()}"`, onClear: () => onSearchChange("") })
    return list
  }, [typeFilter, payFilter, fuelFilter, fuelName, attendantFilter, attendantName, search])

  function clearAll() {
    onTypeChange("ALL")
    onPayChange("ALL")
    onFuelChange("ALL")
    onAttendantChange("ALL")
    onSearchChange("")
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="filters-head">
        <div className="filters-head-left">
          <SlidersHorizontal size={15} />
          <span className="filters-title">Filters</span>
          {chips.length > 0 && <span className="filters-count">{chips.length}</span>}
        </div>
        {chips.length > 0 && (
          <button className="filters-clear" onClick={clearAll}>
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="filters-groups">
        <div className="filter-group">
          <span className="filter-group-label">Type</span>
          <div className="seg-group">
            {typeTabs.map((t) => (
              <button
                key={t.key}
                className={`seg-btn ${typeFilter === t.key ? "active" : ""}`}
                onClick={() => onTypeChange(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Payment</span>
          <div className="seg-group">
            {payTabs.map((t) => (
              <button
                key={t.key}
                className={`seg-btn ${payFilter === t.key ? `active pay-${t.key}` : ""}`}
                onClick={() => onPayChange(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Fuel</span>
          <div className="select-wrap icon-select">
            <Droplets size={13} className="select-icon" />
            <select value={fuelFilter} onChange={(e) => onFuelChange(e.target.value)} aria-label="Filter by fuel type">
              <option value="ALL">All fuel types</option>
              {fuelOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="select-chevron" />
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Attendant</span>
          <div className="select-wrap icon-select">
            <UserRound size={13} className="select-icon" />
            <select
              value={attendantFilter}
              onChange={(e) => onAttendantChange(e.target.value)}
              aria-label="Filter by attendant"
            >
              <option value="ALL">All attendants</option>
              {attendantOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="select-chevron" />
          </div>
        </div>
      </div>

      <div className="filters-search">
        <div className="search-box">
          <Search size={15} />
          <input
            placeholder="Search transaction, request, plate, customer, station…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search transactions"
          />
          {search && (
            <button className="clear-btn" onClick={() => onSearchChange("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="active-chips">
          {chips.map((chip) => (
            <button key={chip.key} className="chip" onClick={chip.onClear}>
              {chip.label}
              <X size={11} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}