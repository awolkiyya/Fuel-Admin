"use client"

import { useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  Fuel,
  Gauge,
  Check,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* ================= TYPES ================= */
type Nozzle = {
  id: string
  label: string
  fuelType: "PETROL" | "DIESEL" | "KEROSENE"
  status: "AVAILABLE" | "BUSY" | "OFFLINE"
}

type Props = {
  open: boolean
  selected: any
  nozzles: Nozzle[]
  onClose: () => void
  onAssign: (requestId: string, nozzleId: string) => void
}

/* ================= MODAL ================= */
export default function AssignNozzleModal({
  open,
  selected,
  nozzles,
  onClose,
  onAssign,
}: Props) {
  const [selectedNozzle, setSelectedNozzle] = useState<string | null>(null)

  if (!open || !selected) return null

  /* ================= ONLY ACTIVE + MATCHING FUEL ================= */
  const activeNozzles = useMemo(() => {
    return nozzles.filter(
      (n) =>
        n.status === "AVAILABLE" &&
        n.fuelType === selected.fuelType
    )
  }, [nozzles, selected])

  const handleAssign = () => {
    if (!selectedNozzle) return

    onAssign(selected.id, selectedNozzle)

    setSelectedNozzle(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="p-5 space-y-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Assign Active Nozzle
            </DialogTitle>

            <DialogDescription>
              Only available nozzles are shown
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {selected.fuelType}
            </Badge>

            <Badge variant="outline">
              {selected.plateNumber}
            </Badge>

            <Badge>
              {selected.requestedLiters} L
            </Badge>
          </div>
        </div>

        <Separator />

        {/* ================= BODY ================= */}
        <div className="p-5 space-y-3 max-h-[55vh] overflow-y-auto">

          {/* EMPTY STATE */}
          {activeNozzles.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10">
              No active nozzles available for{" "}
              <b>{selected.fuelType}</b>
            </div>
          )}

          {/* LIST */}
          <div className="grid gap-3">
            {activeNozzles.map((n) => {
              const active = selectedNozzle === n.id

              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedNozzle(n.id)}
                  className={cn(
                    "text-left border rounded-lg p-4 transition",
                    "hover:bg-muted",
                    active && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">

                    {/* LEFT INFO */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {n.label}
                        </span>

                        {active && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {n.fuelType}
                        </span>
                      </div>
                    </div>

                    {/* STATUS (always AVAILABLE here) */}
                    <Badge className="bg-green-600">
                      ACTIVE
                    </Badge>

                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* ================= ACTIONS ================= */}
        <div className="p-4 bg-muted/30">

          <div className="flex flex-col sm:flex-row gap-2">

            <Button
              variant="outline"
              className="w-full sm:w-1/3"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              className="w-full sm:flex-1 font-semibold"
              disabled={!selectedNozzle}
              onClick={handleAssign}
            >
              Assign Nozzle
            </Button>

          </div>

          {!selectedNozzle && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Select an active nozzle to continue
            </p>
          )}

        </div>

      </DialogContent>
    </Dialog>
  )
}