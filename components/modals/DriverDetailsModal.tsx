"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { DriverUser } from "@/types/driver"

/* -----------------------------
   HELPERS
------------------------------ */
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

const riskColor = (risk: string) => {
  switch (risk) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    default:
      return "default"
  }
}

/* -----------------------------
   COMPONENT
------------------------------ */
export function DriverDetailsModal({
  open,
  onOpenChange,
  driver,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  driver: DriverUser | null
}) {
//   const updateStatus = useUpdateDriverStatus()

  if (!driver) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg">
            Driver Profile
          </DialogTitle>
        </DialogHeader>

        {/* =========================
            PROFILE HEADER
        ========================== */}
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={driver.avatar || ""} />
              <AvatarFallback>
                {getInitials(driver.fullName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg font-semibold">
                {driver.fullName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {driver.phone}
              </p>
              <p className="text-xs text-muted-foreground">
                Joined {new Date(driver.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge>{driver.status}</Badge>
            <Badge variant={riskColor(driver.riskLevel)}>
              {driver.riskLevel} risk
            </Badge>
          </div>

        </div>

        <Separator className="my-4" />

        {/* =========================
            STATS GRID
        ========================== */}
        <div className="grid grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-muted-foreground">Email</p>
            <p>{driver.email || "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Vehicles</p>
            <p>{driver.vehicleCount}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Risk Reason</p>
            <p>{driver.riskReason || "—"}</p>
          </div>

        </div>

        <Separator className="my-4" />

        {/* =========================
            DRIVER PROFILE (KYC)
        ========================== */}
        {driver.driverProfile && (
          <>
            <h3 className="font-medium mb-3">Driver Verification</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-muted-foreground">National ID</p>
                <p className="font-medium">
                  {driver.driverProfile.nationalId || "—"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">License Number</p>
                <p>{driver.driverProfile.licenseNumber || "—"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Verified</p>
                <p>
                  {driver.driverProfile.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">License Expiry</p>
                <p>
                  {driver.driverProfile.licenseExpiry
                    ? new Date(driver.driverProfile.licenseExpiry).toLocaleDateString()
                    : "—"}
                </p>
              </div>

            </div>

            <Separator className="my-4" />
          </>
        )}


        {/* =========================
            ADMIN CONTROL CENTER
        ========================== */}
        <div>
          <h3 className="font-semibold mb-3">
            Admin Controls
          </h3>

          <div className="flex flex-wrap gap-2">

            {driver.status !== "ACTIVE" && (
              <Button
                onClick={() =>{}
                //   updateStatus.mutate({
                //     id: driver.id,
                //     status: "ACTIVE",
                //   })
                }
              >
                Activate
              </Button>
            )}

            {driver.status === "ACTIVE" && (
              <Button
                variant="secondary"
                onClick={() =>{}
                //   updateStatus.mutate({
                //     id: driver.id,
                //     status: "SUSPENDED",
                //   })
                }
              >
                Suspend
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={() =>{}
                // updateStatus.mutate({
                //   id: driver.id,
                //   status: "BLOCKED",
                // })
              }
            >
              Block Driver
            </Button>

          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Changes are logged and require admin authorization.
          </p>
        </div>

      </DialogContent>
    </Dialog>
  )
}