"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { CheckCircle2, Fuel } from "lucide-react"

/* ================= TYPES ================= */
type Props = {
  open: boolean
  selected: any
  onClose: () => void
  onComplete: (id: string, payload: any) => void
}

/* ================= MODAL ================= */
export default function CompleteDispenseModal({
  open,
  selected,
  onClose,
  onComplete,
}: Props) {
  const [dispensedLiters, setDispensedLiters] = useState<number>(
    selected?.requestedLiters || 0
  )
  const [note, setNote] = useState("")

  if (!open || !selected) return null

  const handleComplete = () => {
    onComplete(selected.id, {
      status: "completed",
      dispensing: {
        completedAt: new Date().toISOString(),
        dispensedLiters,
      },
      attendantNotes: note,
    })

    setNote("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="p-5 space-y-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Complete Fuel Dispensing
            </DialogTitle>

            <DialogDescription>
              Final confirmation for transaction completion
            </DialogDescription>
          </DialogHeader>

          {/* CONTEXT */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {selected.fuelType}
            </Badge>

            <Badge variant="outline">
              {selected.plateNumber}
            </Badge>

            <Badge>
              Request: {selected.requestedLiters} L
            </Badge>
          </div>
        </div>

        <Separator />

        {/* ================= BODY ================= */}
        <div className="p-5 space-y-5">

          {/* ================= SYSTEM SUMMARY ================= */}
          <div className="rounded-lg border p-3 text-sm space-y-1 bg-muted/30">
            <p><b>Assigned Nozzle:</b> {selected.assignedNozzle || "N/A"}</p>
            <p><b>Requested:</b> {selected.requestedLiters} L</p>
          </div>

          {/* ================= ACTUAL DISPENSE ================= */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">
              ACTUAL DISPENSED LITERS
            </h3>

            <Input
              type="number"
              value={dispensedLiters}
              onChange={(e) =>
                setDispensedLiters(Number(e.target.value))
              }
            />
          </div>

          {/* ================= NOTE ================= */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">
              ATTENDANT NOTE (OPTIONAL)
            </h3>

            <Textarea
              placeholder="Any issue during dispensing..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px]"
            />
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
              className="w-full sm:flex-1 font-semibold bg-green-600 hover:bg-green-700"
              onClick={handleComplete}
            >
              Complete Transaction
            </Button>

          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            This action will finalize the fuel request
          </p>

        </div>

      </DialogContent>
    </Dialog>
  )
}