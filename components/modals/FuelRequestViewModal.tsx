"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/* ================= TYPES ================= */
type Props = {
  open: boolean
  selected: any
  onClose: () => void
  update: (id: string, patch: any) => void
  remaining: (r: any) => number
}

/* ================= MODAL ================= */
export default function FuelRequestViewModal({
  open,
  selected,
  onClose,
  update,
  remaining,
}: Props) {
  if (!open || !selected) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* ================= HEADER ================= */}
        <DialogHeader>
          <DialogTitle>Fuel Request Inspection</DialogTitle>

          <div className="flex flex-wrap gap-2 pt-2">

            <Badge>{selected.status}</Badge>

            <Badge variant="outline">
              Risk {selected.driverRiskScore}/100
            </Badge>

            <Badge variant="secondary">
              {selected.fuelType}
            </Badge>

            {/* DRIVER STATUS */}
            <Badge
              variant={selected.driverVerified ? "default" : "destructive"}
            >
              {selected.driverVerified ? "Driver Verified" : "Driver Not Verified"}
            </Badge>

            {/* VEHICLE STATUS */}
            <Badge
              variant={selected.vehicleVerified ? "default" : "destructive"}
            >
              {selected.vehicleVerified ? "Vehicle Verified" : "Vehicle Not Verified"}
            </Badge>

          </div>
        </DialogHeader>

        <Separator />

        {/* ================= QUICK SCAN ================= */}
        <Card className="p-3 text-sm grid grid-cols-2 gap-2">
          <p><b>Driver:</b> {selected.driverName}</p>
          <p><b>Plate:</b> {selected.plateNumber}</p>
          <p><b>Fuel:</b> {selected.fuelType}</p>
          <p><b>Request:</b> {selected.requestedLiters}L</p>
        </Card>

        {/* ================= TABS ================= */}
        <Tabs defaultValue="driver" className="w-full">

          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="driver">Driver</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
          </TabsList>

          {/* ================= DRIVER ================= */}
          <TabsContent value="driver">
            <Card className="p-4 space-y-3">

              <h3 className="text-xs font-semibold text-muted-foreground">
                DRIVER VERIFICATION
              </h3>

              <div className="text-sm space-y-1">
                <p><b>Name:</b> {selected.driverName}</p>
                <p><b>ID:</b> {selected.driverNationalId}</p>
                <p><b>License:</b> {selected.driverLicense}</p>
                <p><b>Phone:</b> {selected.driverPhone}</p>

                <Badge>{selected.driverStatus}</Badge>
              </div>

              <Button
                className="w-full mt-3"
                onClick={() =>
                  update(selected.id, { driverVerified: true })
                }
                disabled={selected.driverVerified}
              >
                {selected.driverVerified
                  ? "Driver Verified"
                  : "Verify Driver"}
              </Button>

            </Card>
          </TabsContent>

          {/* ================= VEHICLE ================= */}
          <TabsContent value="vehicle">
            <Card className="p-4 space-y-3">

              <h3 className="text-xs font-semibold text-muted-foreground">
                VEHICLE VERIFICATION
              </h3>

              <div className="text-sm space-y-1">
                <p><b>Plate:</b> {selected.plateNumber}</p>
                <p><b>VIN:</b> {selected.vehicleIdentityNumber}</p>
                <p><b>Type:</b> {selected.vehicleType}</p>
                <p><b>Registration:</b> {selected.registrationStatus}</p>

                <Badge>
                  {selected.vehicleVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>

              <Button
                className="w-full mt-3"
                onClick={() =>
                  update(selected.id, { vehicleVerified: true })
                }
                disabled={selected.vehicleVerified}
              >
                {selected.vehicleVerified
                  ? "Vehicle Verified"
                  : "Verify Vehicle"}
              </Button>

            </Card>
          </TabsContent>

          {/* ================= FUEL ================= */}
          <TabsContent value="fuel">
            <Card className="p-4 text-sm space-y-2">

              <p><b>Requested:</b> {selected.requestedLiters} L</p>
              <p><b>Daily Limit:</b> {selected.maxDailyLimit} L</p>
              <p><b>Consumed:</b> {selected.todayConsumed ?? 0} L</p>

              <p className="font-semibold pt-2">
                Remaining: {remaining(selected)} L
              </p>

              <Separator className="my-2" />

              <p><b>Price/L:</b> {selected.fuelPricePerLiter}</p>
              <p className="font-semibold">
                Total: {selected.estimatedCost} Birr
              </p>

            </Card>
          </TabsContent>

        </Tabs>

      </DialogContent>
    </Dialog>
  )
}