import { OrgStatus, OrgType, PaymentStatus, QuotaStatus } from "@/types/organization.types"
import { Briefcase, CheckCircle2, Clock, Eye, Gauge, HeartHandshake, KeyRound, Landmark, MoreVertical, PauseCircle, Pencil, Power, Shield, Tractor, Trash2, XCircle } from "lucide-react"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { QuotaPeriodType } from "@/types/quota.types"
import { fmtPct } from "@/lib/utils"

/*
============================================================================
ROW ACTIONS MENU
(view / edit / allocate quota / activate-deactivate / generate API key / delete)
============================================================================
*/

export function ActionsMenu({
  status,
  onView,
  onEdit,
  onAllocateQuota,
  onToggleActive,
  onGenerateApiKey,
  onDelete,
}: {
  status: OrgStatus
  onView: () => void
  onEdit: () => void
  onAllocateQuota: () => void
  onToggleActive: () => void
  onGenerateApiKey: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)

  const isActive = status === "ACTIVE"

  return (
    <div className="relative">

      {/* ================================================================
          ACTION BUTTON
          ================================================================ */}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
        aria-label="Row actions"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* ================================================================
          MENU
          ================================================================ */}

      {open && (
        <>
          {/* Backdrop */}

          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
          />

          {/* Dropdown */}

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-8 z-40 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
          >

            {/* ============================================================
                VIEW
                ============================================================ */}

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onView()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Eye className="h-3.5 w-3.5 text-stone-400" />

              <span>View details</span>
            </button>

            {/* ============================================================
                EDIT
                ============================================================ */}

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onEdit()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Pencil className="h-3.5 w-3.5 text-stone-400" />

              <span>Edit organization</span>
            </button>

            {/* ============================================================
                ALLOCATE QUOTA
                ============================================================ */}

            <button
              type="button"
              disabled={status === "BLOCKED"}
              onClick={() => {
                if (status === "BLOCKED") {
                  return
                }

                setOpen(false)
                onAllocateQuota()
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${
                status === "BLOCKED"
                  ? "cursor-not-allowed text-stone-300"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <Gauge className="h-3.5 w-3.5 text-stone-400" />

              <span>Allocate fuel quota</span>
            </button>

            {/* ============================================================
                ACTIVATE / DEACTIVATE
                ============================================================ */}

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onToggleActive()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Power className="h-3.5 w-3.5 text-stone-400" />

              <span>
                {isActive ? "Deactivate" : "Activate"}
              </span>
            </button>

            {/* ============================================================
                GENERATE API KEY
                ============================================================ */}

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onGenerateApiKey()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <KeyRound className="h-3.5 w-3.5 text-stone-400" />

              <span>Generate API key</span>
            </button>

            {/* ============================================================
                DIVIDER
                ============================================================ */}

            <div className="my-1 border-t border-stone-100" />

            {/* ============================================================
                DELETE
                ============================================================ */}

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />

              <span>Delete</span>
            </button>

          </div>
        </>
      )}
    </div>
  )
}


  export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
      <label className="mb-1 block text-xs font-medium text-stone-600">
        {children}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
    )
  }
  
  export  const fieldClass =
    "w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition-colors focus:border-stone-400 placeholder:text-stone-400"
  
export  function Toggle({
    checked,
    onChange,
    title,
    description,
  }: {
    checked: boolean
    onChange: (v: boolean) => void
    title: string
    description: string
  }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between gap-3 rounded-md border border-stone-200 px-3 py-2.5 text-left"
      >
        <div>
          <p className="text-sm font-medium text-stone-800">{title}</p>
          <p className="text-xs text-stone-400">{description}</p>
        </div>
        <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-stone-200"}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </span>
      </button>
    )
  }
  

  /* ============================================================================
   CONFIG MAPS
   ============================================================================ */ 
   export const ORG_TYPE_CONFIG: Record<OrgType, { label: string; icon: React.ElementType }> = {
    GOVERNMENT: { label: "Government", icon: Landmark },
    PRIVATE_COMPANY: { label: "Private company", icon: Briefcase },
    NGO: { label: "NGO", icon: HeartHandshake },
    PRIVATE: {
        label: "",
        icon: "symbol"
    },
    PUBLIC_ENTERPRISE: {
        label: "",
        icon: "symbol"
    },
    OTHER: {
        label: "",
        icon: "symbol"
    }
}
  
export  const STATUS_CONFIG: Record<OrgStatus, { label: string; icon: React.ElementType; className: string }> = {
      ACTIVE: { label: "Active", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      SUSPENDED: { label: "Suspended", icon: PauseCircle, className: "bg-amber-50 text-amber-700 border-amber-200" },
      BLOCKED: { label: "Blocked", icon: XCircle, className: "bg-rose-50 text-rose-700 border-rose-200" },
      PENDING: { label: "Pending review", icon: Clock, className: "bg-slate-100 text-slate-600 border-slate-200" },
      INACTIVE: {
          label: "",
          icon: "symbol",
          className: ""
      }
  }
  
  export  const QUOTA_STATUS_CONFIG: Record<QuotaStatus, { label: string; className: string }> = {
    ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    EXPIRED: { label: "Expired", className: "bg-slate-100 text-slate-600 border-slate-200" },
    EXHAUSTED: { label: "Exhausted", className: "bg-rose-50 text-rose-700 border-rose-200" },
    SUSPENDED: { label: "Suspended", className: "bg-amber-50 text-amber-700 border-amber-200" },
  }
  
  export  const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
    PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    UNPAID: { label: "Unpaid", className: "bg-rose-50 text-rose-700 border-rose-200" },
    PARTIAL: { label: "Partial", className: "bg-amber-50 text-amber-700 border-amber-200" },
  }



function addPeriod(startISO: string, period: QuotaPeriodType): string {
    const d = new Date(startISO)
    if (Number.isNaN(d.getTime())) return startISO
    switch (period) {
      case "DAILY": d.setDate(d.getDate() + 1); break
      case "WEEKLY": d.setDate(d.getDate() + 7); break
      case "MONTHLY": d.setMonth(d.getMonth() + 1); break
      case "QUARTERLY": d.setMonth(d.getMonth() + 3); break
      case "ANNUAL": d.setFullYear(d.getFullYear() + 1); break
    }
    d.setDate(d.getDate() - 1)
    return d.toISOString().slice(0, 10)
  }
  
  function slugTag(name: string) {
    const letters = name.replace(/[^A-Za-z]/g, "").toUpperCase()
    return (letters.slice(0, 3) || "ORG").padEnd(3, "X")
  }
  
  function genApiKey(name: string) {
    const tag = slugTag(name).toLowerCase()
    const rand = Math.random().toString(16).slice(2, 18).padEnd(16, "0")
    return `${tag}_live_${rand}`
  }
  
  
  /* ============================================================================
     SIGNATURE ELEMENT — literal E→F fuel gauge, used for quota consumption
     ============================================================================ */
export  function FuelGaugeArc({ percent, size = 96, label }: { percent: number; size?: number; label?: string }) {
    const clamped = Math.min(Math.max(percent, 0), 100)
    const cx = 60
    const cy = 60
    const r = 48
    const arcLength = Math.PI * r
    const dashOffset = arcLength * (1 - clamped / 100)
    const color = clamped >= 95 ? "#E11D48" : clamped >= 80 ? "#D97706" : "#059669"
  
    const angleForPct = (p: number) => 180 - (p / 100) * 180
    const pointAt = (p: number, radius: number) => {
      const rad = (angleForPct(p) * Math.PI) / 180
      return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) }
    }
    const needle = pointAt(clamped, 40)
    const ticks = [0, 25, 50, 75, 100]
  
    return (
      <div className="flex flex-col items-center" style={{ width: size }}>
        <svg viewBox="0 0 120 72" width={size} height={size * 0.6}>
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#E7E5E4" strokeWidth={9} strokeLinecap="round" />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${arcLength}`}
            strokeDashoffset={dashOffset}
          />
          {ticks.map((t) => {
            const outer = pointAt(t, 48)
            const inner = pointAt(t, 41)
            return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#A8A29E" strokeWidth={1.5} />
          })}
          <text x={cx - r - 2} y={cy + 12} fontSize="8" fill="#78716C" fontFamily="ui-monospace, monospace">E</text>
          <text x={cx + r - 4} y={cy + 12} fontSize="8" fill="#78716C" fontFamily="ui-monospace, monospace">F</text>
          <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#1C1917" strokeWidth={2} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={4} fill="#1C1917" />
        </svg>
        <div className="-mt-1 text-center">
          <div className="font-mono text-sm font-semibold text-stone-900">{fmtPct(clamped)}</div>
          {label && <div className="text-[11px] leading-tight text-stone-500">{label}</div>}
        </div>
      </div>
    )
  }
  
  /* ============================================================================
     SMALL PRESENTATIONAL PIECES
     ============================================================================ */
     export  function StatusBadge({ status }: { status: OrgStatus }) {
    const cfg = STATUS_CONFIG[status]
    const Icon = cfg.icon
    return (
      <Badge variant="outline" className={`gap-1.5 font-medium ${cfg.className}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
      </Badge>
    )
  }
  
  export  function OrgTypeBadge({ type }: { type: OrgType }) {
    const cfg = ORG_TYPE_CONFIG[type]
    const Icon = cfg.icon
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </span>
    )
  }
  
  export  function StatCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint?: string }) {
    return (
      <Card className="p-4 border-stone-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-stone-900">{value}</p>
            {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
          </div>
          <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </Card>
    )
  }