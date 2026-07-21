"use client"

import { cn } from "@/lib/utils"

import {
  Droplets,
  Hash,
  Calendar,
  User,
  Fuel,
  MapPin,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Ban,
} from "lucide-react"


/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

export function fmt(iso?: string | null) {
    if (!iso) return "—"
    return new Intl.DateTimeFormat("en-ET", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  }
  
  export  function initials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
  

/* ─────────────────────────────────────────────────────────────────────────────
   REQUEST TAB
───────────────────────────────────────────────────────────────────────────── */

import { FuelRequest, FuelRequestStatus } from "@/types/fuel-reques";

export function RequestTab({ request }: { request: FuelRequest }) {
    return (
      <div className="space-y-0">
        <LitersSummary request={request} />
  
        <InfoRow icon={<Hash className="w-3.5 h-3.5" />}        label="Request ID"   value={request.id}               mono />
        <InfoRow icon={<Calendar className="w-3.5 h-3.5" />}    label="Submitted"    value={fmt(request.createdAt)}        />
        <InfoRow icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Verified at"  value={fmt(request.verifiedAt)}       />
        <InfoRow icon={<CheckCircle className="w-3.5 h-3.5" />} label="Approved at"  value={fmt(request.approvedAt)}       />
        <InfoRow icon={<CheckCircle className="w-3.5 h-3.5" />} label="Completed at" value={fmt(request.completedAt)}      />
        <InfoRow icon={<MapPin className="w-3.5 h-3.5" />}      label="Station"      value={request.station.name}          />
  
        {request.assignedTo && (
          <InfoRow
            icon={<User className="w-3.5 h-3.5" />}
            label="Assigned to"
            value={request.assignedTo.full_name}
          />
        )}
  
        {request.nozzle && (
          <InfoRow
            icon={<Fuel className="w-3.5 h-3.5" />}
            label="Nozzle"
            value={request.nozzle.number ?? request.nozzle.id}
          />
        )}
  
        {(request.rejectionReason || request.rejectionNote) && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 space-y-1.5">
            <p className="text-xs font-medium text-red-700 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Rejection details
            </p>
            {request.rejectionReason && (
              <p className="text-xs text-red-600">{request.rejectionReason.label}</p>
            )}
            {request.rejectionNote && (
              <p className="text-xs text-red-500 italic">"{request.rejectionNote}"</p>
            )}
          </div>
        )}
      </div>
    )
  }

 
  export function StatusStepper({ status }: { status: FuelRequestStatus }) {
    if (status === "REJECTED" || status === "CANCELLED") {
      const isCancelled = status === "CANCELLED"
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
            isCancelled
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : "bg-red-50 border-red-200 text-red-700"
          )}
        >
          {isCancelled
            ? <Ban className="w-4 h-4 shrink-0" />
            : <XCircle className="w-4 h-4 shrink-0" />
          }
          <span className="font-medium">
            {isCancelled ? "Request cancelled" : "Request rejected"}
          </span>
        </div>
      )
    }
  
    const currentIdx = STEPS.indexOf(status)
  
    return (
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const done   = i < currentIdx
          const active = i === currentIdx
          const m      = STATUS_META[step]
          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                    done
                      ? "bg-teal-500 border-teal-500 text-white"
                      : active
                      ? cn("border-current", m.color, m.bg)
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {done ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-medium uppercase tracking-wide leading-none whitespace-nowrap",
                    done || active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {m.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 mb-3.5 rounded-full",
                    done ? "bg-teal-400" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
  
  /* ─────────────────────────────────────────────────────────────────────────────
     INFO ROW
  ───────────────────────────────────────────────────────────────────────────── */
  
  export  function InfoRow({
    icon,
    label,
    value,
    mono,
  }: {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
    mono?: boolean
  }) {
    return (
      <div className="flex items-start justify-between py-2.5 border-b border-border/60 last:border-0 gap-4">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <span className="w-3.5 h-3.5 shrink-0">{icon}</span>
          <span className="text-xs">{label}</span>
        </div>
        <span className={cn("text-xs text-right text-foreground", mono && "font-mono")}>
          {value ?? "—"}
        </span>
      </div>
    )
  }
  
  /* ─────────────────────────────────────────────────────────────────────────────
     LITERS SUMMARY CARD
  ───────────────────────────────────────────────────────────────────────────── */
  
  export  function LitersSummary({ request }: { request: FuelRequest }) {
    const price    = request.fuelType.price ?? 0
    const est      = (request.requested * price).toLocaleString()
    const approved = request.approved  ?? null
    const dispensed= request.dispensed ?? null
  
    return (
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                {request.fuelType.name}
              </p>
              <p className="text-xl font-semibold text-blue-800 tabular-nums leading-none">
                {request.requested}
                <span className="text-sm font-normal ml-1">L requested</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Est. cost</p>
            <p className="text-sm font-semibold text-blue-700">{est} ETB</p>
          </div>
        </div>
  
        {(approved !== null || dispensed !== null) && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-100">
            {approved !== null && (
              <div className="rounded-lg bg-white/70 px-3 py-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Approved</p>
                <p className="text-sm font-semibold text-teal-700 tabular-nums">{approved} L</p>
              </div>
            )}
            {dispensed !== null && (
              <div className="rounded-lg bg-white/70 px-3 py-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dispensed</p>
                <p className="text-sm font-semibold text-green-700 tabular-nums">{dispensed} L</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  
  /* ─────────────────────────────────────────────────────────────────────────────
   STATUS META
───────────────────────────────────────────────────────────────────────────── */
 
export const STATUS_META: Record<
FuelRequestStatus,
{ label: string; color: string; bg: string; border: string; dot: string }
> = {
PENDING:    { label: "Pending",    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500"  },
VERIFIED:   { label: "Verified",   color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500"   },
APPROVED:   { label: "Approved",   color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200",   dot: "bg-teal-500"   },
DISPENSING: { label: "Dispensing", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500"   },
COMPLETED:  { label: "Completed",  color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  dot: "bg-green-500"  },
REJECTED:   { label: "Rejected",   color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    dot: "bg-red-500"    },
CANCELLED:  { label: "Cancelled",  color: "text-gray-600",   bg: "bg-gray-100",  border: "border-gray-200",   dot: "bg-gray-400"   },
}

/* ─────────────────────────────────────────────────────────────────────────────
 STATUS BADGE
───────────────────────────────────────────────────────────────────────────── */

export function StatusBadge({ status }: { status: FuelRequestStatus }) {
const m = STATUS_META[status]
return (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
      m.color, m.bg, m.border
    )}
  >
    <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
    {m.label}
  </span>
)
}

/* ─────────────────────────────────────────────────────────────────────────────
 STATUS STEPPER
───────────────────────────────────────────────────────────────────────────── */

export const STEPS: FuelRequestStatus[] = [
"PENDING",
"VERIFIED",
"APPROVED",
"DISPENSING",
"COMPLETED",
]