"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function FuelClaimModal({
  open,
  selected,
  onClose,
  onConfirm,
}: any) {
  if (!selected) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Fuel Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p><b>Driver:</b> {selected.driverName}</p>
          <p><b>Vehicle:</b> {selected.vehicleType} - {selected.plateNumber}</p>
          <p><b>Fuel:</b> {selected.fuelType}</p>
          <p><b>Requested:</b> {selected.requestedLiters}L</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={() =>
              onConfirm(selected.id, {
                claimedAt: new Date().toISOString(),
              })
            }
          >
            Confirm Claim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}