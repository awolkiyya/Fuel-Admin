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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

/* ================= TYPES ================= */
type Props = {
  open: boolean
  selected: any
  onClose: () => void
  onReject: (id: string, payload: any) => void
}

/* ================= REASONS ================= */
const REASONS = [
  "Driver identity mismatch",
  "Invalid driving license",
  "Vehicle not registered",
  "Suspicious fuel request",
  "Exceeded daily fuel limit",
  "Blacklisted driver",
  "Fraud risk detected",
]

export default function FuelRejectModal({
  open,
  selected,
  onClose,
  onReject,
}: Props) {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [openDropdown, setOpenDropdown] = useState(false)

  if (!selected) return null

  const handleReject = () => {
    if (!reason) return

    onReject(selected.id, {
      status: "rejected",
      rejectionReason: reason,
      attendantNotes: note,
      rejectedAt: new Date().toISOString(),
    })

    setReason("")
    setNote("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-xl">

        {/* ================= HEADER ================= */}
        <div className="p-4 sm:p-5 space-y-3">

          <DialogHeader>
            <DialogTitle className="text-red-600 text-base sm:text-lg">
              Reject Fuel Request
            </DialogTitle>

            <DialogDescription className="text-sm">
              Reject request for{" "}
              <span className="font-semibold">
                {selected.driverName}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* ================= CONTEXT STRIP =================
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{selected.plateNumber}</Badge>
            <Badge variant="secondary">{selected.fuelType}</Badge>
            <Badge variant="outline">
              Risk {selected.driverRiskScore}/100
            </Badge>
          </div> */}

        </div>

        <Separator />

        {/* ================= BODY ================= */}
        <div className="p-4 sm:p-5 space-y-6 max-h-[65vh] overflow-y-auto">

          {/* ================= REASON ================= */}
          <div className="space-y-3">

            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground">
                REJECTION REASON
              </h3>

              {reason && (
                <Badge className="bg-red-500 text-white text-xs">
                  Selected
                </Badge>
              )}
            </div>

            {/* DROPDOWN */}
            <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm h-10"
                >
                  {reason || "Select rejection reason"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search reason..." />

                  <CommandEmpty>No match found</CommandEmpty>

                  <CommandGroup>
                    {REASONS.map((r) => (
                      <CommandItem
                        key={r}
                        value={r}
                        onSelect={() => {
                          setReason(r)
                          setOpenDropdown(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            reason === r ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {r}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* ================= NOTE ================= */}
          <div className="space-y-3">

            <h3 className="text-xs font-semibold text-muted-foreground">
              ATTENDANT NOTE (OPTIONAL)
            </h3>

            <Textarea
              placeholder="Add internal audit note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[90px] resize-none"
            />

          </div>

        </div>

        <Separator />

        {/* ================= ACTION BAR ================= */}
        <div className="p-4 bg-muted/30">

          <div className="flex flex-col sm:flex-row gap-2">

            {/* CANCEL */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-1/3"
            >
              Cancel
            </Button>

            {/* REJECT */}
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!reason}
              className="w-full sm:flex-1 font-semibold h-10"
            >
              Reject Request
            </Button>

          </div>

          {/* UX HINT */}
          {!reason && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Select a reason to enable rejection
            </p>
          )}

        </div>

      </DialogContent>
    </Dialog>
  )
}