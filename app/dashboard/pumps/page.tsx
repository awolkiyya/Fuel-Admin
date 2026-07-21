"use client"

import { useMemo, useState } from "react"
import { useSelector } from "react-redux"

import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/EmptyState"

import {
  useAddNozzle,
  usePumps,
  useToggleNozzle,
  useTogglePumpStatus,
  useCreatePump,
} from "@/hooks/dispenser/usePumps"

import { PumpCard } from "@/components/cards/PumpCard"
import { NozzleList } from "@/components/NozzleList"
import { NozzleModal } from "@/components/modals/NozzleModal"
import { PumpModal } from "@/components/modals/PumpModal"

import { RootState } from "@/lib/store"
import { useStationFuelTypes } from "@/hooks/tank/useTanks"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, Fuel, FuelIcon, Plus, Search } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PumpsPage() {
  /* -----------------------------
     STATION CONTEXT
  ------------------------------*/
  const rawStationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  )

  const stationId = rawStationId ?? undefined

  /* -----------------------------
     API HOOKS
  ------------------------------*/
  const { data: fuelTypes, isLoading: isFuelTypeLoading } =
    useStationFuelTypes(stationId || "")

  const { data, isLoading, isError } = usePumps(stationId)

  const togglePump = useTogglePumpStatus(stationId)
  const toggleNozzle = useToggleNozzle(stationId)
  const addNozzle = useAddNozzle(stationId)
  const createPump = useCreatePump(stationId)

  /* -----------------------------
     UI STATE
  ------------------------------*/
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const [pumpModal, setPumpModal] = useState({ open: false })

  const [modal, setModal] = useState<{
    open: boolean
    pumpId: string | null
    pumpName: string | null
  }>({
    open: false,
    pumpId: null,
    pumpName: null,
  })

  const dispensers = data?.data ?? []

  /* -----------------------------
     FILTER
  ------------------------------*/
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return dispensers

    return dispensers.filter((d) =>
      `dispenser ${d.number}`.toLowerCase().includes(query)
    )
  }, [dispensers, search])

  const hasDispensers = dispensers.length > 0
  const hasFiltered = filtered.length > 0
  const isSearching = search.trim().length > 0

  /* -----------------------------
   HEADER (DESIGN SYSTEM)
  ------------------------------*/
  const Header = () => (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dispenser Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage dispensers and nozzles in your station
          </p>
        </div>

        <Button onClick={() => setPumpModal({open:true})} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Dispenser
        </Button>
      </div>
    </Card>
  )

  /* -----------------------------
     UI RESOLVER
  ------------------------------*/
  const renderContent = () => {
    if (!stationId) {
      return (
        <EmptyState
          onAction={() => console.log("No station selected")}
          icon={Fuel}
          title="No Station Selected"
        />
      )
    }

    if (isError) {
      return (
        <EmptyState
          onAction={() => window.location.reload()}
          icon={AlertTriangle}
          title="Failed to Load Dispensers"
        />
      )
    }

    if (isLoading) {
      return (
        <div className="space-y-3">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-24 bg-muted animate-pulse rounded" />
          <div className="h-24 bg-muted animate-pulse rounded" />
        </div>
      )
    }

    if (!hasDispensers) {
      return (
        <EmptyState
          onAction={() => setPumpModal({ open: true })}
          icon={FuelIcon}
          title="No Dispensers Found"
        />
      )
    }

    if (isSearching && !hasFiltered) {
      return (
        <>
          <Input
            placeholder="Search dispensers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <EmptyState
            icon={Search}
            title="No Matching Dispensers"
          />
        </>
      )
    }

    return (
      <>
        <Input
          placeholder="Search dispensers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filtered.map((dispenser) => (
            <div key={dispenser.id}>
              <PumpCard
                pump={dispenser}
                isExpanded={expanded === dispenser.id}
                onExpand={(id) =>
                  setExpanded((prev) => (prev === id ? null : id))
                }
                onToggle={(id) => {
                  if (!stationId) return
                  // togglePump.mutate({ stationId, pumpId: id })
                }}
                onAddNozzle={(d) =>
                  setModal({
                    open: true,
                    pumpId: d.id,
                    pumpName: `Dispenser #${d.number}`,
                  })
                }
              />

              {expanded === dispenser.id && (
                <NozzleList
                  pump={dispenser}
                  onToggleNozzle={(pumpId, nozzleId) => {
                    if (!stationId) return
                    // toggleNozzle.mutate({ stationId, pumpId, nozzleId })
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* HEADER */}
      <Header/>

      {renderContent()}

      {/* CREATE DISPENSER */}
      <PumpModal
        open={pumpModal.open}
        onClose={() => setPumpModal({ open: false })}
        onSave={(data) => {
          if (!stationId) return

          createPump.mutate({
            number: data.number,
          })
        }}
      />

      {/* ADD NOZZLE */}
      <NozzleModal
        open={modal.open}
        pumpName={modal.pumpName}
        fuelTypes={fuelTypes?.data ?? []}
        fuelTypesLoading={isFuelTypeLoading}
        onClose={() =>
          setModal({
            open: false,
            pumpId: null,
            pumpName: null,
          })
        }
        onSave={(data) => {
          if (!stationId || !modal.pumpId) return

          addNozzle.mutate({
            stationId,
            pumpId: modal.pumpId,
            number: data.number,
            fuelType: data.fuelType,
          })
        }}
      />
    </div>
  )
}