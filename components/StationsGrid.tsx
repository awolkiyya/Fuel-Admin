"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import {
  MapPin,
  MoreHorizontal,
  Camera,
  Eye,
  Edit,
  UserCog,
  Trash2,
  Navigation,
  MapPinOff,
  Fuel,
  PlayCircle,
  ExternalLink,
  Copy,
  AlertTriangle,
  Info,
  CameraIcon,
  Cpu,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { StationDialog } from "@/components/modals/RegisterStationDialog"
import { useState } from "react"
import { FuelItem, Station } from "@/types/station"
import { BaseModal } from "./modals/BaseModal"
import { useAssignManager, useFuelTypes, useManagers, useUpdateStationFuel } from "@/hooks/station/useStations"
import { AssignManagerModal } from "./modals/AssignManagerModal"
import { FuelCapacityModal } from "./modals/FuelCapacityModal"
import { useRouter } from "next/navigation"

/* =========================
   STATUS BADGE
========================= */
function statusBadge(status: string) {
  switch (status) {
    case "active":
      return "default"
    case "congested":
      return "secondary"
    case "risk":
      return "destructive"
    case "inactive":
    case "deleted":
      return "outline"
    default:
      return "secondary"
  }
}

/* =========================
   TYPES
========================= */
type Props = {
  stations: Station[]
  isLoading: boolean
  onDelete: (id: string) => void
}

/* =========================
   COMPONENT
========================= */
export function StationsGrid({
  stations,
  isLoading,
  onDelete,
}: Props) {

  const router = useRouter();

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data:fuelTypesData, isLoading:isFuelTypesLoading } = useFuelTypes(
    page,
    search
  )

  const updateFuelMutation = useUpdateStationFuel()


  const updateFuel = async (
    stationId: string,
    fuel: FuelItem[]
  ) => {
    await updateFuelMutation.mutateAsync({
      stationId,
      fuel,
    })
  }
  const { data:managers, isLoading:isManagerLoading } = useManagers({
    page,
    search,
  })

  const { mutateAsync: assignManager } = useAssignManager()

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-44 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
              <Separator />
              <div className="h-16 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  /* ================= EMPTY ================= */
  if (!stations || stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
        <MapPinOff className="w-10 h-10 text-muted-foreground opacity-70" />

        <p className="text-sm text-muted-foreground">
          No stations found
        </p>

        <p className="text-xs text-muted-foreground max-w-xs">
          Try adjusting your search or create a new station
        </p>
      </div>
    )
  }

  /* ================= GRID ================= */
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {stations.map((station) => {
        const cameraCount = station.cameras?.length ?? 0

        return (
          <Card key={station.id} className="overflow-hidden">

            {/* ================= IMAGE ================= */}
            <div className="relative h-44 w-full bg-muted">

              {station.imageUrl ? (
                <img
                  src={`http://192.168.3.1:5000${station.imageUrl}`}
                  alt={station.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                  <MapPinOff className="w-5 h-5 opacity-60" />
                  No station image
                </div>
              )}

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* STATUS */}
              <div className="absolute top-2 right-2">
                <Badge variant={statusBadge(station.status)}>
                  {station.status}
                </Badge>
              </div>

              {/* CAMERA INDICATOR */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white/90">
                <Camera className="w-3.5 h-3.5" />
                {cameraCount} camera{cameraCount !== 1 ? "s" : ""}
              </div>

            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-4 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between gap-3">

                <div className="space-y-1">

                  <div className="font-semibold text-base">
                    {station.name}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {station.city}, {station.region}
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    GPS: {station.lat?.toFixed(3)}, {station.lng?.toFixed(3)}
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    Manager:{" "}
                    <span className="font-medium">
                      {station.manager?.name || "Unassigned"}
                    </span>
                  </div>

                </div>

                {/* ACTIONS */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">

                    {/* VIEW */}
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>

                    {/* EDIT (your existing dialog) */}
                    <StationDialog
                      mode="edit"
                      defaultValues={station}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      }
                    />

                    {/* =========================
                        👤 ASSIGN MANAGER MODAL
                    ========================= */}
                    <AssignManagerModal
                        station={station}

                        managers={managers?.data || []}

                        page={page}
                        totalPages={managers?.meta?.totalPages || 1}
                        onPageChange={setPage}

                        search={search}
                        onSearchChange={setSearch}

                        loadingManagers={isLoading}

                        onAssign={(stationId, managerId) =>
                          assignManager({ id: stationId, managerId })
                        }

                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <UserCog className="w-4 h-4 mr-2" />
                            Assign Manager
                          </DropdownMenuItem>
                        }
                      />

                    {/* =========================
                        ⛽ FUEL & CAPACITY MODAL
                    ========================= */}
                   <FuelCapacityModal
                      station={station}

                      // 🔥 SERVER PAGINATED REFERENCE DATA
                      fuelTypes={fuelTypesData?.data ?? []}
                      fuelTypesLoading={isFuelTypesLoading}
                      fuelTypesPagination={fuelTypesData?.meta}

                      // 🔥 STATION STATE
                      fuel={station.fuelInventory ?? []}

                      // 🔥 PAGINATION CONTROL
                      fuelTypesPage={page}
                      onFuelTypesPageChange={(p) => setPage(p)}

                      // 🔥 SEARCH CONTROL
                      fuelTypesSearch={search}
                      onFuelTypesSearchChange={(v) => setSearch(v)}

                      // 🔥 ACTION
                      onUpdateFuel={updateFuel}

                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Fuel className="w-4 h-4 mr-2" />
                          Fuel & Capacity Management
                        </DropdownMenuItem>
                      }
                    />
                     {/* Fuel Refill per station */}
                     <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/stations/${station.id}/refill-infos`)}
                        >
                      <Info className="w-4 h-4 mr-2" />
                      Fuel Refill Informations
                    </DropdownMenuItem>


                     {/* Fuel Transaction per station */}
                     <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/stations/${station.id}/transactions`)}
                      >
                        <Fuel className="w-4 h-4 mr-2" />
                        Fuel Transactions
                     </DropdownMenuItem>

                    {/* =========================
                        🎥 CAMERA PAGE
                    ========================= */}

                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/stations/${station.id}/cameras`)
                      }
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Cameras
                    </DropdownMenuItem>

                    {/* MAP */}
                    <StationMapModal
                  station={station}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Navigation className="w-4 h-4 mr-2" />
                      Map Location
                    </DropdownMenuItem>
                  }
                />
                   
                    {/* DELETE */}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(station.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deactivate
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

            {/* FUEL */}
<div className="space-y-3">
  <div className="text-xs font-medium text-muted-foreground">
    Fuel Inventory
  </div>

  {(station.fuelInventory ?? []).map((fuel: any) => {
    const percentage =
      fuel.maxCapacity > 0
        ? (fuel.level / fuel.maxCapacity) * 100
        : 0

    return (
      <div
        key={fuel.fuelTypeId}
        className="space-y-2 p-2 rounded-md border"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center text-xs">

          <div className="flex items-center gap-2">

            <span className="capitalize font-medium">
              {fuel.type}
            </span>

            {/* ✅ FUEL STATUS (NOT STATION STATUS) */}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                fuel.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {fuel.isActive ? "ACTIVE" : "DISABLED"}
            </span>

          </div>

        </div>

        {/* VALUES */}
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>
            {fuel.level} / {fuel.maxCapacity} L
          </span>
          <span>{percentage.toFixed(0)}%</span>
        </div>

        {/* PROGRESS */}
        <div className="h-2 w-full bg-muted rounded">
          <div
            className="h-2 bg-primary rounded transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

      </div>
    )
  })}
</div>


              <Separator />

              {/* METRICS */}
              <div className="grid grid-cols-3 text-sm">

                <div>
                  <div className="text-xs text-muted-foreground">Queue</div>
                  <div>{station.queue ?? 0}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Staff</div>
                  <div>{station.staff ?? 0}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="capitalize">{station.risk ?? "none"}</div>
                </div>

              </div>

            </div>

          </Card>
        )
      })}

    </div>
  )
}





type MapProps = {
  station: Station
  trigger: React.ReactNode
}

export function StationMapModal({ station, trigger }: MapProps) {
  const [open, setOpen] = useState(false)

  const lat = station?.lat
  const lng = station?.lng

  const hasLocation = typeof lat === "number" && typeof lng === "number"

  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : "#"

  const directionsUrl = hasLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : "#"

  const handleCopy = async () => {
    if (!hasLocation) return
    await navigator.clipboard.writeText(`${lat}, ${lng}`)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">

          {/* ================= HEADER ================= */}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Station Location
            </DialogTitle>
          </DialogHeader>

          {/* ================= MAP PREVIEW ================= */}
          <Card className="relative overflow-hidden h-72 bg-muted border">

            {hasLocation ? (
              <div className="h-full w-full flex items-center justify-center flex-col text-center space-y-2">

                {/* You can replace later with Leaflet/Google Maps */}
                <div className="p-4 rounded-full bg-background shadow">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {station?.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Latitude: {lat?.toFixed(6)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Longitude: {lng?.toFixed(6)}
                  </p>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <AlertTriangle className="w-6 h-6" />
                <p className="text-sm">Location not available</p>
              </div>
            )}

          </Card>

          {/* ================= QUICK INFO ================= */}
          <div className="text-xs text-muted-foreground px-1">
            Tip: Use Google Maps for accurate navigation or copy coordinates for external tools.
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="grid grid-cols-3 gap-2 pt-2">

            <Button
              variant="outline"
              disabled={!hasLocation}
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>

            <Button
              variant="outline"
              disabled={!hasLocation}
              onClick={() => window.open(googleMapsUrl, "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>

            <Button
              disabled={!hasLocation}
              onClick={() => window.open(directionsUrl, "_blank")}
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}