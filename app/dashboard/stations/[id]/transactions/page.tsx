"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Fuel, MapPin } from "lucide-react"
import { useSelector } from "react-redux"

import TransactionsTable, { PAGE_SIZE } from "@/components/transaction/Transactionstable"
import TransactionFilters, { Option } from "@/components/transaction/Transactionfilters"
import TransactionStyles from "@/styles/transactionstyles"
import StatCards from "@/components/cards/Statcards"
import DetailDrawer from "@/components/drawer/Detaildrawer"

import type {
  FuelTransactionType,
  StationTransactionQuery,
  StationTransactionResource,
} from "@/types/station-transaction"
import type { RootState } from "@/lib/store"
import { useFuelTypes, useStationTransactions, useStationTransactionSummary } from "@/hooks/station/useStations"
import { useStationStaff } from "@/hooks/station/useStaffs.hook"
import { useParams } from "next/navigation"

/* =========================================================================
   RESPONSE SHAPES
   -------------------------------------------------------------------------
   - useStationTransactions(stationId, query) → {
       success: boolean
       data: StationTransactionResource[]
       pagination: { page: number; limit: number; total: number; totalPages: number }
     }
   - useStationTransactionSummary(stationId) → { data: StationTransactionSummary }
   - useFuelTypes(page, search) → { data: { id: string; name: string }[] } (adjust if nested differently)
   - useStationStaff(stationId) → { data: { id: string; name: string }[] } (adjust if nested differently)
   Only the derivation lines below need to change if any of these differ —
   every child component just takes plain `Option[]` / `StationTransactionResource[]` props.
   ========================================================================= */

export default function StationFuelTransactions() {
  /* ============================
     STATION CONTEXT
  ============================ */

 const params = useParams()


  const stationId =
    params.id as string



  console.log("Station ID:", stationId)

  /* ============================
     FILTER STATE
  ============================ */
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ALL" | FuelTransactionType>("ALL")
  const [fuelFilter, setFuelFilter] = useState<string>("ALL")
  const [payFilter, setPayFilter] = useState<string>("ALL")
  const [attendantFilter, setAttendantFilter] = useState<string>("ALL")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<StationTransactionResource | null>(null)

  // debounce the free-text search before it hits the API
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const query: StationTransactionQuery = useMemo(() => {
    const q: StationTransactionQuery = { page, limit: PAGE_SIZE }
    if (debouncedSearch.trim()) q.search = debouncedSearch.trim()
    if (typeFilter !== "ALL") q.type = typeFilter
    if (fuelFilter !== "ALL") q.fuelTypeId = fuelFilter
    if (payFilter !== "ALL") q.paymentStatus = payFilter
    if (attendantFilter !== "ALL") q.attendantId = attendantFilter
    return q
  }, [page, debouncedSearch, typeFilter, fuelFilter, payFilter, attendantFilter])

  /* ============================
     DATA
  ============================ */
  const { data: fuelTypesData } = useFuelTypes(1, "")
  const { data: staffData } = useStationStaff(stationId)
  const { data: txData, isLoading: txLoading } = useStationTransactions(stationId, query)
  const { data: summaryData } = useStationTransactionSummary(stationId)

  const transactions: StationTransactionResource[] = txData?.data ?? []
  const total: number = txData?.meta?.total ?? 0
  const totalPages: number = txData?.meta?.totalPages ?? 1
  const summary = summaryData?.data

  const fuelOptions: Option[] = useMemo(
    () => (fuelTypesData?.data ?? []).map((f: { id: string; name: string }) => ({ id: f.id, name: f.name })),
    [fuelTypesData]
  )

  const attendantOptions: Option[] = useMemo(
    () => (staffData?.data ?? []).map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })),
    [staffData]
  )

  // local copy so "mark as paid" can update the row optimistically
  const [localTransactions, setLocalTransactions] = useState<StationTransactionResource[]>([])
  useEffect(() => setLocalTransactions(transactions), [transactions])

  function handleMarkPaid(id: string) {
    // optimistic local update — swap for a real mutation hook once one exists
    setLocalTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, payment: { status: "PAID" } } : t)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, payment: { status: "PAID" } } : prev))
  }

  return (
    <div className="page">
      <TransactionStyles />

      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <Fuel size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h1>Fuel Transaction Ledger</h1>
              <p>Dispensing &amp; payment activity for this station</p>
            </div>
          </div>
          {/* {station?.name && (
            <div className="station-chip">
              <MapPin size={14} />
              {station.name}
            </div>
          )} */}
        </div>
      </div>

      <div className="content">
        <StatCards summary={summary} />

        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeChange={(v) => {
            setTypeFilter(v)
            setPage(1)
          }}
          payFilter={payFilter}
          onPayChange={(v) => {
            setPayFilter(v)
            setPage(1)
          }}
          fuelFilter={fuelFilter}
          onFuelChange={(v) => {
            setFuelFilter(v)
            setPage(1)
          }}
          fuelOptions={fuelOptions}
          attendantFilter={attendantFilter}
          onAttendantChange={(v) => {
            setAttendantFilter(v)
            setPage(1)
          }}
          attendantOptions={attendantOptions}
        />

        <TransactionsTable
          transactions={localTransactions}
          loading={txLoading}
          page={page}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelect={setSelected}
        />
      </div>

      {selected && <DetailDrawer tx={selected} onClose={() => setSelected(null)} onMarkPaid={handleMarkPaid} />}
    </div>
  )
}