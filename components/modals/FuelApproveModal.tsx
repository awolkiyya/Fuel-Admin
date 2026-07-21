"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function FuelApproveModal({
  open,
  selected,
  onClose,
  onApprove,
}: any) {
  if (!selected) return null

  const quotaLeft = selected.maxDailyLimit - selected.todayConsumed

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Fuel Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">

          <p><b>Driver:</b> {selected.driverName}</p>
          <p><b>Risk Level:</b> {selected.riskLevel || "NORMAL"}</p>

          <p>
            <b>Quota Left:</b>{" "}
            <span className={quotaLeft <= 0 ? "text-red-500" : "text-green-600"}>
              {quotaLeft}L
            </span>
          </p>

          <p><b>Requested:</b> {selected.requestedLiters}L</p>

          <Badge>
            {quotaLeft < selected.requestedLiters
              ? "LOW QUOTA WARNING"
              : "SAFE TO APPROVE"}
          </Badge>

        </div>

        <div className="flex justify-end gap-2 mt-4">

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={() =>
              onApprove(selected.id, {
                verifiedAt: new Date().toISOString(),
              })
            }
          >
            Approve Request
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}