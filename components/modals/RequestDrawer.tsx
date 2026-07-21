"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Droplets,
  User,
  Car,
  Fuel,
  CheckCircle,
} from "lucide-react"
import { FuelRequest, ProcessFuelRequestPayload, RejectionReason } from "@/types/fuel-reques"
import { DrawerFooter } from "../drawer/DrawerFooter"
import { RequestTab, StatusBadge } from "../drawer/tabs/RequestTab"
import { DriverTab } from "../drawer/tabs/driverTap"
import { VehicleTab } from "../drawer/tabs/vehicleTab"
import { VerificationModal } from "./VerificationModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"




/* ─────────────────────────────────────────────────────────────────────────────
   APPROVE DIALOG
───────────────────────────────────────────────────────────────────────────── */

function ApproveDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  request: FuelRequest | null
  onConfirm: (payload: ProcessFuelRequestPayload) => void
}) {
  const [liters, setLiters] = useState(String(request?.requested ?? ""))
  const [note, setNote]     = useState("")

  if (!request) return null

  const handleConfirm = () => {
    const approvedLiters = parseFloat(liters)
    if (!approvedLiters || approvedLiters <= 0) return
    onConfirm({ approvedLiters, note: note || undefined })
    setLiters("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-teal-700">
            <CheckCircle className="w-4 h-4" />
            Approve request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="rounded-lg bg-muted/40 border px-3 py-2.5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Requested</span>
            <span className="text-sm font-semibold tabular-nums">
              {request.requested} L — {request.fuelType.name}
            </span>
          </div>

          <div className="space-y-1.5">
            <Label>Approved liters</Label>
            <Input
              type="number"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder={String(request.requested)}
              min={1}
              max={request.vehicle.fuelCapacity}
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              Tank capacity: {request.vehicle.fuelCapacity} L
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>
              Note <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any instructions for the attendant…"
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleConfirm}
              disabled={!liters || parseFloat(liters) <= 0}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DRAWER TABS
───────────────────────────────────────────────────────────────────────────── */

type Tab = "request" | "driver" | "vehicle"

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "driver",  label: "Driver",        icon: User     },
  { key: "vehicle", label: "Vehicle",        icon: Car      },
  { key: "request", label: "Fuel request", icon: Droplets },
]


/* ─────────────────────────────────────────────────────────────────────────────
   REQUEST DRAWER  (main export)
───────────────────────────────────────────────────────────────────────────── */

export interface RequestDrawerProps {
  request:          FuelRequest
  onClose:          () => void
  onVerify:        () => void
  onReject:         () => void
  rejectionReasons?: RejectionReason[]
}

export function RequestDrawer({
  request,
  onClose,
  onVerify,
  onReject,
}: RequestDrawerProps) {

  // navigator
  const router = useRouter();
  const [tab,         setTab        ] = useState<Tab>("driver")
  const [approveOpen, setApproveOpen] = useState(false)
  const isVerified =
  request!.vehicle?.isVerified &&
  request!.user?.driverProfile?.isVerified;

  const handleClose = () => {
    onClose()
    setTab("request")
  }

  return (
    <>
      <Sheet open={!!request} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col gap-0 overflow-hidden">

          {/* ── HEADER ── */}
          {request && (
            <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              </div>
            </SheetHeader>
          )}

          {/* ── TABS ── */}
          <div className="flex border-b px-5 shrink-0">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                  tab === key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* ── TAB BODY ── */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {request && tab === "driver"  && <DriverTab  request={request} />}
            {request && tab === "vehicle" && <VehicleTab request={request} />}
            {request && tab === "request" && <RequestTab request={request} />}

          </div>

          {/* ── FOOTER ── */}
          {request && (
            <DrawerFooter
              status={request.status}
              isVerified={isVerified!}
              onVerifyClick={() => {setApproveOpen(true)}}
              onStartClick={() =>{
                onVerify();
                setApproveOpen(false);
              }
              }
              onRejectClick={onReject}
            />
          )}

        </SheetContent>
      </Sheet>


      <VerificationModal
         open={approveOpen}
         onClose={()=>{
          setApproveOpen(false);
         } }
         onConfirm={()=>{
          onVerify();
          setApproveOpen(false);

        
        }}
         request={{
          vehiclePlate: "",
          driverName: "",
          fuelType: "",
          requestedLiters: 0
        }}
        verification={{
            driverVerified:false,
            vehicleVerified:false
        }}
     />

      {/* ── APPROVE DIALOG ── */}
      {/* <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        request={request}
        onConfirm={(payload) => {
          if (request) onApprove(request.id, payload)
          handleClose()
        }}
      /> */}
    </>
  )
}