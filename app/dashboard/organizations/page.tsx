"use client"

import React, { useMemo, useState } from "react"
import {
  Building2,
  Landmark,
  HeartHandshake,
  Briefcase,
  Tractor,
  Shield,
  Fuel,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  Key,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Clock,
  Receipt,
  Calendar,
  ArrowUpRight,
  Plus,
  SlidersHorizontal,
  Gauge,
  ClipboardList,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* ============================================================================
   DESIGN TOKENS (reference only — encoded directly in the Tailwind classes)
   ------------------------------------------------------------------------
   Ink        #101828   headers, primary text
   Canvas     #FAFAF9   page background (warm, ledger-paper feel)
   Brass      #B45309   primary accent — fuel / quota / signature gauge
   Emerald    #059669   active / paid / healthy
   Amber      #D97706   pending / near-limit
   Rose       #E11D48   blocked / exhausted / overdue / destructive
   Slate      #64748B   neutral / suspended / expired
   Type: headings — tight tracking sans. Data (liters, IDs, currency,
   dates, reference numbers) — tabular mono, to read like a fuel ledger.
   Signature element: a literal E→F fuel-gauge arc for quota consumption,
   used everywhere a quota percentage appears (row + detail).
   ============================================================================ */

/* ============================================================================
   TYPES — mirrors the Prisma schema
   ============================================================================ */
type OrgType = "GOVERNMENT" | "PRIVATE_COMPANY" | "NGO" | "MILITARY" | "COOPERATIVE"
type OrgStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "PENDING"
type QuotaStatus = "ACTIVE" | "EXPIRED" | "EXHAUSTED" | "SUSPENDED"
type QuotaPeriodType = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUAL"
type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL"
type FuelName = "Diesel" | "Petrol" | "Kerosene"

interface FuelQuotaMock {
  id: string
  fuelType: FuelName
  periodType: QuotaPeriodType
  startDate: string
  endDate: string
  allocatedLiters: number
  consumedLiters: number
  status: QuotaStatus
  referenceNumber: string
  remarks?: string
}

interface TransactionMock {
  id: string
  station: string
  fuelType: FuelName
  litersGiven: number
  pricePerLiter: number
  totalCost: number
  paymentStatus: PaymentStatus
  createdAt: string
  vehiclePlate?: string
}

interface OrganizationMock {
  id: string
  name: string
  type: OrgType
  registrationNumber: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: OrgStatus
  allowFuelAccess: boolean
  quotaEnabled: boolean
  maxTransactionLiters: number
  apiKey: string
  createdAt: string
  quotas: FuelQuotaMock[]
  transactions: TransactionMock[]
}

/* ============================================================================
   MOCK DATA
   ============================================================================ */
const INITIAL_ORGANIZATIONS: OrganizationMock[] = [
  {
    id: "org_001",
    name: "Ethiopian Roads Authority",
    type: "GOVERNMENT",
    registrationNumber: "GOV-ERA-0142",
    contactPerson: "Ato Getachew Bekele",
    phone: "+251 91 234 5678",
    email: "fleet@era.gov.et",
    address: "Bole Road, Addis Ababa",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 8000,
    apiKey: "era_live_8f2c9a41d6e0b7c3",
    createdAt: "2023-02-11",
    quotas: [
      {
        id: "q1",
        fuelType: "Diesel",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 60000,
        consumedLiters: 41250,
        status: "ACTIVE",
        referenceNumber: "REF-ERA-0826",
      },
      {
        id: "q2",
        fuelType: "Petrol",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 8000,
        consumedLiters: 7690,
        status: "ACTIVE",
        referenceNumber: "REF-ERA-0827",
      },
    ],
    transactions: [
      { id: "t1", station: "Kaliti Fuel Depot", fuelType: "Diesel", litersGiven: 1200, pricePerLiter: 92.4, totalCost: 110880, paymentStatus: "PAID", createdAt: "2026-08-06 14:22", vehiclePlate: "3-A-14522" },
      { id: "t2", station: "Adama Bulk Terminal", fuelType: "Diesel", litersGiven: 3000, pricePerLiter: 92.4, totalCost: 277200, paymentStatus: "PAID", createdAt: "2026-08-05 09:10", vehiclePlate: "3-A-08871" },
      { id: "t3", station: "Kaliti Fuel Depot", fuelType: "Petrol", litersGiven: 400, pricePerLiter: 98.1, totalCost: 39240, paymentStatus: "UNPAID", createdAt: "2026-08-04 16:40", vehiclePlate: "3-A-14522" },
    ],
  },
  {
    id: "org_002",
    name: "Oromia Police Commission",
    type: "GOVERNMENT",
    registrationNumber: "GOV-OPC-0087",
    contactPerson: "Commander Dawit Alemu",
    phone: "+251 92 118 4420",
    email: "logistics@oromiapolice.gov.et",
    address: "Adama, Oromia",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 5000,
    apiKey: "opc_live_2b7e14ffa930cd11",
    createdAt: "2022-11-03",
    quotas: [
      {
        id: "q3",
        fuelType: "Diesel",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 25000,
        consumedLiters: 23980,
        status: "ACTIVE",
        referenceNumber: "REF-OPC-0826",
      },
    ],
    transactions: [
      { id: "t4", station: "Adama Bulk Terminal", fuelType: "Diesel", litersGiven: 2000, pricePerLiter: 92.4, totalCost: 184800, paymentStatus: "PAID", createdAt: "2026-08-06 08:05", vehiclePlate: "OR-3-771" },
      { id: "t5", station: "Nazret Station 2", fuelType: "Diesel", litersGiven: 850, pricePerLiter: 92.4, totalCost: 78540, paymentStatus: "PAID", createdAt: "2026-08-03 11:12", vehiclePlate: "OR-3-455" },
    ],
  },
  {
    id: "org_003",
    name: "Selam Bus Line S.C.",
    type: "PRIVATE_COMPANY",
    registrationNumber: "PVT-SBL-2210",
    contactPerson: "W/ro Meron Tadesse",
    phone: "+251 93 445 2201",
    email: "ops@selambus.com",
    address: "Meskel Square, Addis Ababa",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 3000,
    apiKey: "sbl_live_a10f883e2c47b901",
    createdAt: "2024-01-19",
    quotas: [
      {
        id: "q4",
        fuelType: "Diesel",
        periodType: "WEEKLY",
        startDate: "2026-08-03",
        endDate: "2026-08-09",
        allocatedLiters: 12000,
        consumedLiters: 6420,
        status: "ACTIVE",
        referenceNumber: "REF-SBL-3208",
      },
    ],
    transactions: [
      { id: "t6", station: "Nazret Station 2", fuelType: "Diesel", litersGiven: 1600, pricePerLiter: 92.4, totalCost: 147840, paymentStatus: "PAID", createdAt: "2026-08-06 07:30", vehiclePlate: "AA-2-90112" },
    ],
  },
  {
    id: "org_004",
    name: "Dashen Beverages S.C.",
    type: "PRIVATE_COMPANY",
    registrationNumber: "PVT-DSH-1187",
    contactPerson: "Ato Yonas Hailu",
    phone: "+251 94 220 8813",
    email: "fleet@dashenbeverages.com",
    address: "Gelan Industrial Zone",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: false,
    maxTransactionLiters: 4000,
    apiKey: "dsh_live_0c5db2f8e6a1734d",
    createdAt: "2023-07-22",
    quotas: [],
    transactions: [
      { id: "t7", station: "Kaliti Fuel Depot", fuelType: "Diesel", litersGiven: 2400, pricePerLiter: 92.4, totalCost: 221760, paymentStatus: "PARTIAL", createdAt: "2026-08-05 13:50", vehiclePlate: "AA-4-33810" },
    ],
  },
  {
    id: "org_005",
    name: "Ethiopian Red Cross Society",
    type: "NGO",
    registrationNumber: "NGO-ERC-0043",
    contactPerson: "Sr. Hanna Girma",
    phone: "+251 95 667 1290",
    email: "relief-logistics@ercs.org",
    address: "Ras Desta Damtew Ave, Addis Ababa",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 2000,
    apiKey: "erc_live_77bb9f402e18ac6f",
    createdAt: "2024-05-02",
    quotas: [
      {
        id: "q5",
        fuelType: "Diesel",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 6000,
        consumedLiters: 1180,
        status: "ACTIVE",
        referenceNumber: "REF-ERC-0826",
      },
      {
        id: "q6",
        fuelType: "Kerosene",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 1500,
        consumedLiters: 1500,
        status: "EXHAUSTED",
        referenceNumber: "REF-ERC-0827",
      },
    ],
    transactions: [
      { id: "t8", station: "Nazret Station 2", fuelType: "Diesel", litersGiven: 300, pricePerLiter: 92.4, totalCost: 27720, paymentStatus: "PAID", createdAt: "2026-08-02 10:05", vehiclePlate: "AA-1-77304" },
    ],
  },
  {
    id: "org_006",
    name: "Ethiopian National Defense Force",
    type: "MILITARY",
    registrationNumber: "MIL-ENDF-0011",
    contactPerson: "Col. Tesfaye Wolde",
    phone: "+251 96 002 8841",
    email: "supply@endf.mil.et",
    address: "Bishoftu Command Base",
    status: "SUSPENDED",
    allowFuelAccess: false,
    quotaEnabled: true,
    maxTransactionLiters: 10000,
    apiKey: "endf_live_5e4a8b1c9df02361",
    createdAt: "2021-09-14",
    quotas: [
      {
        id: "q7",
        fuelType: "Diesel",
        periodType: "QUARTERLY",
        startDate: "2026-07-01",
        endDate: "2026-09-30",
        allocatedLiters: 150000,
        consumedLiters: 98200,
        status: "SUSPENDED",
        referenceNumber: "REF-ENDF-Q326",
        remarks: "Access suspended pending settlement review.",
      },
    ],
    transactions: [
      { id: "t9", station: "Bishoftu Depot", fuelType: "Diesel", litersGiven: 5000, pricePerLiter: 92.4, totalCost: 462000, paymentStatus: "UNPAID", createdAt: "2026-07-28 18:00", vehiclePlate: "ENDF-2201" },
    ],
  },
  {
    id: "org_007",
    name: "Meki Farmers Cooperative Union",
    type: "COOPERATIVE",
    registrationNumber: "COOP-MFC-0509",
    contactPerson: "Ato Bekele Chala",
    phone: "+251 97 331 7765",
    email: "office@mekicoop.et",
    address: "Meki Town, East Shewa",
    status: "PENDING",
    allowFuelAccess: false,
    quotaEnabled: false,
    maxTransactionLiters: 1000,
    apiKey: "mfc_live_9a2d0e7fc51b6832",
    createdAt: "2026-07-30",
    quotas: [],
    transactions: [],
  },
  {
    id: "org_008",
    name: "Addis Ababa City Administration",
    type: "GOVERNMENT",
    registrationNumber: "GOV-AACA-0290",
    contactPerson: "Ato Solomon Tesfaye",
    phone: "+251 98 774 0092",
    email: "transport@addisababa.gov.et",
    address: "City Hall, Addis Ababa",
    status: "BLOCKED",
    allowFuelAccess: false,
    quotaEnabled: true,
    maxTransactionLiters: 6000,
    apiKey: "aaca_live_3f61c8092ab4d7e5",
    createdAt: "2022-03-30",
    quotas: [
      {
        id: "q8",
        fuelType: "Diesel",
        periodType: "MONTHLY",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        allocatedLiters: 30000,
        consumedLiters: 30000,
        status: "EXHAUSTED",
        referenceNumber: "REF-AACA-0826",
        remarks: "Blocked — outstanding balance exceeds threshold.",
      },
    ],
    transactions: [
      { id: "t10", station: "Kaliti Fuel Depot", fuelType: "Diesel", litersGiven: 1800, pricePerLiter: 92.4, totalCost: 166320, paymentStatus: "UNPAID", createdAt: "2026-07-31 12:15", vehiclePlate: "AA-9-10021" },
    ],
  },
]

/* ============================================================================
   CONFIG MAPS
   ============================================================================ */
const ORG_TYPE_CONFIG: Record<OrgType, { label: string; icon: React.ElementType }> = {
  GOVERNMENT: { label: "Government", icon: Landmark },
  PRIVATE_COMPANY: { label: "Private company", icon: Briefcase },
  NGO: { label: "NGO", icon: HeartHandshake },
  MILITARY: { label: "Military", icon: Shield },
  COOPERATIVE: { label: "Cooperative", icon: Tractor },
}

const STATUS_CONFIG: Record<OrgStatus, { label: string; icon: React.ElementType; className: string }> = {
  ACTIVE: { label: "Active", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  SUSPENDED: { label: "Suspended", icon: PauseCircle, className: "bg-amber-50 text-amber-700 border-amber-200" },
  BLOCKED: { label: "Blocked", icon: XCircle, className: "bg-rose-50 text-rose-700 border-rose-200" },
  PENDING: { label: "Pending review", icon: Clock, className: "bg-slate-100 text-slate-600 border-slate-200" },
}

const QUOTA_STATUS_CONFIG: Record<QuotaStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EXPIRED: { label: "Expired", className: "bg-slate-100 text-slate-600 border-slate-200" },
  EXHAUSTED: { label: "Exhausted", className: "bg-rose-50 text-rose-700 border-rose-200" },
  SUSPENDED: { label: "Suspended", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  UNPAID: { label: "Unpaid", className: "bg-rose-50 text-rose-700 border-rose-200" },
  PARTIAL: { label: "Partial", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

const FUEL_TYPES: FuelName[] = ["Diesel", "Petrol", "Kerosene"]
const PERIOD_TYPES: QuotaPeriodType[] = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUAL"]
const PERIOD_LABEL: Record<QuotaPeriodType, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
}

/* ============================================================================
   FORMAT / GENERATION HELPERS
   ============================================================================ */
const fmtLiters = (n: number) => `${n.toLocaleString("en-US")} L`
const fmtBirr = (n: number) => `ETB ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
const fmtPct = (n: number) => `${Math.round(n)}%`
const todayISO = () => new Date().toISOString().slice(0, 10)

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

function genRegistrationNumber(type: OrgType, name: string) {
  const prefix = { GOVERNMENT: "GOV", PRIVATE_COMPANY: "PVT", NGO: "NGO", MILITARY: "MIL", COOPERATIVE: "COOP" }[type]
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${slugTag(name)}-${rand}`
}

function genQuotaReference(org: OrganizationMock) {
  const rand = Math.floor(100 + Math.random() * 900)
  return `REF-${slugTag(org.name)}-${rand}`
}

/* ============================================================================
   SIGNATURE ELEMENT — literal E→F fuel gauge, used for quota consumption
   ============================================================================ */
function FuelGaugeArc({ percent, size = 96, label }: { percent: number; size?: number; label?: string }) {
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
function StatusBadge({ status }: { status: OrgStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${cfg.className}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  )
}

function OrgTypeBadge({ type }: { type: OrgType }) {
  const cfg = ORG_TYPE_CONFIG[type]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint?: string }) {
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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-xs font-medium text-stone-600">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  )
}

const fieldClass =
  "w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition-colors focus:border-stone-400 placeholder:text-stone-400"

function Toggle({
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
   ROW ACTIONS MENU (view / edit / activate-deactivate / delete)
   ============================================================================ */
function ActionsMenu({
  status,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  status: OrgStatus
  onView: () => void
  onEdit: () => void
  onToggleActive: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const isActive = status === "ACTIVE"

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        aria-label="Row actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-8 z-40 w-48 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
          >
            <button
              onClick={() => { setOpen(false); onView() }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Eye className="h-3.5 w-3.5 text-stone-400" />
              View details
            </button>
            <button
              onClick={() => { setOpen(false); onEdit() }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Pencil className="h-3.5 w-3.5 text-stone-400" />
              Edit organization
            </button>
            <button
              onClick={() => { setOpen(false); onToggleActive() }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
            >
              <Power className="h-3.5 w-3.5 text-stone-400" />
              {isActive ? "Deactivate" : "Activate"}
            </button>
            <div className="my-1 border-t border-stone-100" />
            <button
              onClick={() => { setOpen(false); onDelete() }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ============================================================================
   MODAL WRAPPER
   ============================================================================ */
function Modal({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  icon: React.ElementType
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-stone-900 p-2 text-amber-400">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">{title}</h2>
              {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-3.5">{footer}</div>
      </div>
    </div>
  )
}

/* ============================================================================
   CONFIRM DIALOG (used for destructive actions like delete)
   ============================================================================ */
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
            <p className="mt-1 text-sm text-stone-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   ORGANIZATION FORM MODAL — shared by "Register" (create) and "Edit"
   ============================================================================ */
interface OrgFormState {
  name: string
  type: OrgType
  registrationNumber: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: OrgStatus
  allowFuelAccess: boolean
  quotaEnabled: boolean
  maxTransactionLiters: string
}

function OrgFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit"
  initial?: OrganizationMock
  onClose: () => void
  onSubmit: (data: OrgFormState) => void
}) {
  const [form, setForm] = useState<OrgFormState>(
    initial
      ? {
          name: initial.name,
          type: initial.type,
          registrationNumber: initial.registrationNumber,
          contactPerson: initial.contactPerson,
          phone: initial.phone,
          email: initial.email,
          address: initial.address,
          status: initial.status,
          allowFuelAccess: initial.allowFuelAccess,
          quotaEnabled: initial.quotaEnabled,
          maxTransactionLiters: String(initial.maxTransactionLiters),
        }
      : {
          name: "",
          type: "GOVERNMENT",
          registrationNumber: "",
          contactPerson: "",
          phone: "",
          email: "",
          address: "",
          status: "PENDING",
          allowFuelAccess: true,
          quotaEnabled: true,
          maxTransactionLiters: "5000",
        }
  )
  const [touched, setTouched] = useState(false)

  const isValid = form.name.trim() !== "" && form.contactPerson.trim() !== "" && form.phone.trim() !== ""

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onSubmit(form)
  }

  return (
    <Modal
      title={mode === "create" ? "Register organization" : "Edit organization"}
      subtitle={mode === "create" ? "New organizations start in Pending review until approved" : `Updating ${initial?.name}`}
      icon={mode === "create" ? Building2 : Pencil}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-stone-900 hover:bg-stone-800" onClick={handleSubmit}>
            {mode === "create" ? "Submit for review" : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <FieldLabel required>Organization name</FieldLabel>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Adama Water Supply Authority"
            className={fieldClass}
          />
          {touched && form.name.trim() === "" && <p className="mt-1 text-xs text-rose-500">Organization name is required.</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Organization type</FieldLabel>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as OrgType })}
              className={fieldClass}
            >
              {(Object.keys(ORG_TYPE_CONFIG) as OrgType[]).map((t) => (
                <option key={t} value={t}>{ORG_TYPE_CONFIG[t].label}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Registration No.</FieldLabel>
            <Input
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              placeholder="Auto-generated if blank"
              className={`${fieldClass} font-mono`}
            />
          </div>
        </div>

        {mode === "edit" && (
          <div>
            <FieldLabel>Status</FieldLabel>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as OrgStatus })}
              className={fieldClass}
            >
              {(Object.keys(STATUS_CONFIG) as OrgStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Contact person</FieldLabel>
            <Input
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              placeholder="Full name"
              className={fieldClass}
            />
          </div>
          <div>
            <FieldLabel required>Phone</FieldLabel>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+251 9xx xxx xxx"
              className={`${fieldClass} font-mono`}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="contact@organization.et"
            className={`${fieldClass} font-mono`}
          />
        </div>

        <div>
          <FieldLabel>Address</FieldLabel>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Street, city"
            rows={2}
            className={fieldClass}
          />
        </div>

        <div>
          <FieldLabel>Max liters per transaction</FieldLabel>
          <Input
            type="number"
            value={form.maxTransactionLiters}
            onChange={(e) => setForm({ ...form, maxTransactionLiters: e.target.value })}
            className={`${fieldClass} font-mono`}
          />
        </div>

        <div className="space-y-2">
          <Toggle
            checked={form.allowFuelAccess}
            onChange={(v) => setForm({ ...form, allowFuelAccess: v })}
            title="Allow fuel access"
            description={mode === "create" ? "Organization can fuel once approved" : "Organization can fuel right now"}
          />
          <Toggle
            checked={form.quotaEnabled}
            onChange={(v) => setForm({ ...form, quotaEnabled: v })}
            title="Enforce quota"
            description="Fueling is capped by allocated quota"
          />
        </div>
      </div>
    </Modal>
  )
}

/* ============================================================================
   ALLOCATE QUOTA MODAL
   ============================================================================ */
interface QuotaFormState {
  organizationId: string
  fuelType: FuelName
  periodType: QuotaPeriodType
  startDate: string
  endDate: string
  allocatedLiters: string
  referenceNumber: string
  remarks: string
}

function AllocateQuotaModal({
  orgs,
  lockedOrgId,
  onClose,
  onSubmit,
}: {
  orgs: OrganizationMock[]
  lockedOrgId?: string
  onClose: () => void
  onSubmit: (data: QuotaFormState) => void
}) {
  const defaultOrgId = lockedOrgId ?? orgs[0]?.id ?? ""
  const [form, setForm] = useState<QuotaFormState>({
    organizationId: defaultOrgId,
    fuelType: "Diesel",
    periodType: "MONTHLY",
    startDate: todayISO(),
    endDate: addPeriod(todayISO(), "MONTHLY"),
    allocatedLiters: "10000",
    referenceNumber: "",
    remarks: "",
  })
  const [touched, setTouched] = useState(false)

  const org = orgs.find((o) => o.id === form.organizationId)
  const allocated = Number(form.allocatedLiters)
  const isValid = form.organizationId !== "" && allocated > 0 && form.startDate !== "" && form.endDate !== ""

  const handlePeriodChange = (periodType: QuotaPeriodType) => {
    setForm((f) => ({ ...f, periodType, endDate: addPeriod(f.startDate, periodType) }))
  }

  const handleStartChange = (startDate: string) => {
    setForm((f) => ({ ...f, startDate, endDate: addPeriod(startDate, f.periodType) }))
  }

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onSubmit(form)
  }

  return (
    <Modal
      title="Allocate fuel quota"
      subtitle={org ? `For ${org.name}` : "Select an organization"}
      icon={Gauge}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-stone-900 hover:bg-stone-800" onClick={handleSubmit}>
            Allocate quota
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {!lockedOrgId && (
          <div>
            <FieldLabel required>Organization</FieldLabel>
            <select
              value={form.organizationId}
              onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
              className={fieldClass}
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        )}

        {org && !org.quotaEnabled && (
          <Card className="border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs text-amber-800">
              Quota enforcement is off for this organization. Allocating one here will not cap consumption until it&apos;s enabled.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Fuel type</FieldLabel>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelName })}
              className={fieldClass}
            >
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Period</FieldLabel>
            <select
              value={form.periodType}
              onChange={(e) => handlePeriodChange(e.target.value as QuotaPeriodType)}
              className={fieldClass}
            >
              {PERIOD_TYPES.map((p) => (
                <option key={p} value={p}>{PERIOD_LABEL[p]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Start date</FieldLabel>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => handleStartChange(e.target.value)}
              className={`${fieldClass} font-mono`}
            />
          </div>
          <div>
            <FieldLabel required>End date</FieldLabel>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={`${fieldClass} font-mono`}
            />
          </div>
        </div>

        <div>
          <FieldLabel required>Allocated liters</FieldLabel>
          <Input
            type="number"
            value={form.allocatedLiters}
            onChange={(e) => setForm({ ...form, allocatedLiters: e.target.value })}
            className={`${fieldClass} font-mono`}
          />
          {touched && allocated <= 0 && <p className="mt-1 text-xs text-rose-500">Enter a liters amount greater than zero.</p>}
        </div>

        <div>
          <FieldLabel>Reference number</FieldLabel>
          <Input
            value={form.referenceNumber}
            onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
            placeholder="Auto-generated if blank"
            className={`${fieldClass} font-mono`}
          />
        </div>

        <div>
          <FieldLabel>Remarks</FieldLabel>
          <textarea
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            placeholder="Optional note for this allocation"
            rows={2}
            className={fieldClass}
          />
        </div>

        {allocated > 0 && (
          <div className="flex items-center gap-3 rounded-md bg-stone-50 p-3">
            <FuelGaugeArc percent={0} size={64} />
            <p className="text-xs text-stone-500">
              Preview — this quota opens at <span className="font-mono font-semibold text-stone-700">0%</span> consumed of{" "}
              <span className="font-mono font-semibold text-stone-700">{fmtLiters(allocated)}</span>.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

/* ============================================================================
   DETAIL SLIDE-OVER
   ============================================================================ */
function OrgDetailPanel({
  org,
  onClose,
  onAssignQuota,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  org: OrganizationMock
  onClose: () => void
  onAssignQuota: (orgId: string) => void
  onEdit: (orgId: string) => void
  onToggleActive: (orgId: string) => void
  onDelete: (org: OrganizationMock) => void
}) {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const TypeIcon = ORG_TYPE_CONFIG[org.type].icon
  const isActive = org.status === "ACTIVE"

  const totalAllocated = org.quotas.reduce((s, q) => s + q.allocatedLiters, 0)
  const totalConsumed = org.quotas.reduce((s, q) => s + q.consumedLiters, 0)

  const handleCopy = () => {
    navigator.clipboard?.writeText(org.apiKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-stone-900 p-2.5 text-amber-400">
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900">{org.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <OrgTypeBadge type={org.type} />
                <span className="text-stone-300">·</span>
                <span className="font-mono text-xs text-stone-400">{org.registrationNumber}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={org.status} />
            <Badge variant="outline" className={org.allowFuelAccess ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}>
              <Fuel className="mr-1 h-3 w-3" />
              {org.allowFuelAccess ? "Fuel access allowed" : "Fuel access blocked"}
            </Badge>
            <Badge variant="outline" className={org.quotaEnabled ? "bg-stone-100 text-stone-700 border-stone-200" : "bg-stone-50 text-stone-400 border-stone-200"}>
              <Gauge className="mr-1 h-3 w-3" />
              {org.quotaEnabled ? "Quota enforced" : "Quota disabled"}
            </Badge>
          </div>

          {org.quotas.some((q) => q.remarks) && (
            <Card className="border-amber-200 bg-amber-50/60 p-3">
              <p className="text-xs text-amber-800">{org.quotas.find((q) => q.remarks)?.remarks}</p>
            </Card>
          )}

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Contact</h3>
            <div className="grid grid-cols-1 gap-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-stone-700">
                <UserIcon className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                {org.contactPerson}
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Phone className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                <span className="font-mono text-[13px]">{org.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                <span className="font-mono text-[13px]">{org.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                {org.address}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Fuel access control</h3>
            <Card className="grid grid-cols-2 divide-x divide-stone-200 border-stone-200 p-0">
              <div className="p-3.5">
                <p className="text-xs text-stone-500">Max per transaction</p>
                <p className="font-mono text-base font-semibold text-stone-900">{fmtLiters(org.maxTransactionLiters)}</p>
              </div>
              <div className="p-3.5">
                <p className="text-xs text-stone-500">Member since</p>
                <p className="font-mono text-base font-semibold text-stone-900">{org.createdAt}</p>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">API integration</h3>
            <Card className="flex items-center justify-between gap-2 border-stone-200 p-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Key className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                <span className="truncate font-mono text-xs text-stone-700">{showKey ? org.apiKey : "•".repeat(20)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => setShowKey((v) => !v)} className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button onClick={handleCopy} className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {copied && <span className="text-[11px] text-emerald-600">Copied</span>}
              </div>
            </Card>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Fuel quotas</h3>
              {org.quotas.length > 0 && (
                <span className="font-mono text-[11px] text-stone-400">
                  {fmtLiters(totalConsumed)} / {fmtLiters(totalAllocated)} this cycle
                </span>
              )}
            </div>
            {org.quotas.length === 0 ? (
              <Card className="border-dashed border-stone-300 p-5 text-center">
                <p className="text-sm text-stone-500">No quota has been assigned to this organization.</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => onAssignQuota(org.id)}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Assign a quota
                </Button>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {org.quotas.map((q) => {
                  const pct = q.allocatedLiters > 0 ? (q.consumedLiters / q.allocatedLiters) * 100 : 0
                  return (
                    <Card key={q.id} className="flex items-center gap-4 border-stone-200 p-3.5">
                      <FuelGaugeArc percent={pct} size={80} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-stone-900">{q.fuelType}</p>
                          <Badge variant="outline" className={`text-[11px] ${QUOTA_STATUS_CONFIG[q.status].className}`}>
                            {QUOTA_STATUS_CONFIG[q.status].label}
                          </Badge>
                        </div>
                        <p className="mt-1 font-mono text-xs text-stone-500">
                          {fmtLiters(q.consumedLiters)} used of {fmtLiters(q.allocatedLiters)}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-stone-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {q.startDate} → {q.endDate}
                          </span>
                          <span className="font-mono">{q.referenceNumber}</span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Recent transactions</h3>
            {org.transactions.length === 0 ? (
              <Card className="border-dashed border-stone-300 p-5 text-center">
                <p className="text-sm text-stone-500">No fueling activity recorded yet.</p>
              </Card>
            ) : (
              <Card className="divide-y divide-stone-100 border-stone-200 p-0">
                {org.transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-stone-100 p-2 text-stone-500">
                        <Receipt className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-800">{t.station}</p>
                        <p className="font-mono text-[11px] text-stone-400">
                          {t.fuelType} · {fmtLiters(t.litersGiven)} {t.vehiclePlate ? `· ${t.vehiclePlate}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-stone-900">{fmtBirr(t.totalCost)}</p>
                      <div className="mt-0.5 flex items-center justify-end gap-1.5">
                        <span className="text-[10px] text-stone-400">{t.createdAt}</span>
                        <Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${PAYMENT_CONFIG[t.paymentStatus].className}`}>
                          {PAYMENT_CONFIG[t.paymentStatus].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-stone-200 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={() => onDelete(org)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onToggleActive(org.id)}>
              <Power className="mr-1.5 h-3.5 w-3.5" />
              {isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(org.id)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" className="bg-stone-900 hover:bg-stone-800" onClick={() => onAssignQuota(org.id)}>
              Allocate quota
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   MAIN PAGE
   ============================================================================ */
function OrginazationsControllingPage() {
  const [orgs, setOrgs] = useState<OrganizationMock[]>(INITIAL_ORGANIZATIONS)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrgStatus | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<OrgType | "ALL">("ALL")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [formModal, setFormModal] = useState<{ mode: "create" } | { mode: "edit"; orgId: string } | null>(null)
  const [quotaModalOrgId, setQuotaModalOrgId] = useState<string | "NEW" | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<OrganizationMock | null>(null)

  const filtered = useMemo(() => {
    return orgs.filter((o) => {
      const matchesQuery =
        query.trim() === "" ||
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.registrationNumber.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter
      const matchesType = typeFilter === "ALL" || o.type === typeFilter
      return matchesQuery && matchesStatus && matchesType
    })
  }, [orgs, query, statusFilter, typeFilter])

  const stats = useMemo(() => {
    const totalAllocated = orgs.flatMap((o) => o.quotas).reduce((s, q) => s + q.allocatedLiters, 0)
    const totalConsumed = orgs.flatMap((o) => o.quotas).reduce((s, q) => s + q.consumedLiters, 0)
    const activeAccess = orgs.filter((o) => o.allowFuelAccess).length
    const needsReview = orgs.filter((o) => o.status === "PENDING" || o.status === "SUSPENDED").length
    return { totalAllocated, totalConsumed, activeAccess, needsReview }
  }, [orgs])

  const selectedOrg = orgs.find((o) => o.id === selectedId) ?? null
  const editingOrg = formModal?.mode === "edit" ? orgs.find((o) => o.id === formModal.orgId) ?? null : null
  const statusFilters: (OrgStatus | "ALL")[] = ["ALL", "ACTIVE", "SUSPENDED", "PENDING", "BLOCKED"]

  const handleFormSubmit = (data: OrgFormState) => {
    if (formModal?.mode === "create") {
      const newOrg: OrganizationMock = {
        id: `org_${Date.now()}`,
        name: data.name.trim(),
        type: data.type,
        registrationNumber: data.registrationNumber.trim() || genRegistrationNumber(data.type, data.name),
        contactPerson: data.contactPerson.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        status: "PENDING",
        allowFuelAccess: data.allowFuelAccess,
        quotaEnabled: data.quotaEnabled,
        maxTransactionLiters: Number(data.maxTransactionLiters) || 5000,
        apiKey: genApiKey(data.name),
        createdAt: todayISO(),
        quotas: [],
        transactions: [],
      }
      setOrgs((prev) => [newOrg, ...prev])
      setSelectedId(newOrg.id)
    } else if (formModal?.mode === "edit") {
      const orgId = formModal.orgId
      setOrgs((prev) =>
        prev.map((o) =>
          o.id === orgId
            ? {
                ...o,
                name: data.name.trim(),
                type: data.type,
                registrationNumber: data.registrationNumber.trim() || o.registrationNumber,
                contactPerson: data.contactPerson.trim(),
                phone: data.phone.trim(),
                email: data.email.trim(),
                address: data.address.trim(),
                status: data.status,
                allowFuelAccess: data.allowFuelAccess,
                quotaEnabled: data.quotaEnabled,
                maxTransactionLiters: Number(data.maxTransactionLiters) || o.maxTransactionLiters,
              }
            : o
        )
      )
    }
    setFormModal(null)
  }

  const handleQuotaSubmit = (data: QuotaFormState) => {
    setOrgs((prev) =>
      prev.map((o) => {
        if (o.id !== data.organizationId) return o
        const newQuota: FuelQuotaMock = {
          id: `q_${Date.now()}`,
          fuelType: data.fuelType,
          periodType: data.periodType,
          startDate: data.startDate,
          endDate: data.endDate,
          allocatedLiters: Number(data.allocatedLiters) || 0,
          consumedLiters: 0,
          status: "ACTIVE",
          referenceNumber: data.referenceNumber.trim() || genQuotaReference(o),
          remarks: data.remarks.trim() || undefined,
        }
        return { ...o, quotas: [...o.quotas, newQuota] }
      })
    )
    setQuotaModalOrgId(null)
  }

  const handleToggleActive = (orgId: string) => {
    setOrgs((prev) =>
      prev.map((o) => {
        if (o.id !== orgId) return o
        const willActivate = o.status !== "ACTIVE"
        return { ...o, status: willActivate ? "ACTIVE" : "SUSPENDED", allowFuelAccess: willActivate }
      })
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setOrgs((prev) => prev.filter((o) => o.id !== deleteTarget.id))
    if (selectedId === deleteTarget.id) setSelectedId(null)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-stone-50/60 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Organizations</h1>
            <p className="mt-1 text-sm text-stone-500">
              Manage fuel access, quota allocation, and consumption for every registered organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setQuotaModalOrgId("NEW")} disabled={orgs.length === 0}>
              <ClipboardList className="mr-1.5 h-4 w-4" />
              Allocate quota
            </Button>
            <Button className="bg-stone-900 hover:bg-stone-800" onClick={() => setFormModal({ mode: "create" })}>
              <Plus className="mr-1.5 h-4 w-4" />
              Register organization
            </Button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Organizations" value={String(orgs.length)} hint={`${stats.activeAccess} with active fuel access`} />
          <StatCard icon={Gauge} label="Allocated this cycle" value={fmtLiters(stats.totalAllocated)} hint="Across all active quotas" />
          <StatCard
            icon={Fuel}
            label="Consumed this cycle"
            value={fmtLiters(stats.totalConsumed)}
            hint={stats.totalAllocated > 0 ? `${fmtPct((stats.totalConsumed / stats.totalAllocated) * 100)} of total allocation` : "No quotas allocated yet"}
          />
          <StatCard icon={Clock} label="Needs review" value={String(stats.needsReview)} hint="Suspended or pending organizations" />
        </div>

        {/* ================= FILTERS ================= */}
        <Card className="border-stone-200 p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or registration No."
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-stone-400" />
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
                </button>
              ))}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as OrgType | "ALL")}
                className="ml-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 hover:border-stone-300 focus:outline-none"
              >
                <option value="ALL">All types</option>
                {(Object.keys(ORG_TYPE_CONFIG) as OrgType[]).map((t) => (
                  <option key={t} value={t}>{ORG_TYPE_CONFIG[t].label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* ================= TABLE ================= */}
        <Card className="overflow-visible border-stone-200 p-0">
          <div className="grid grid-cols-12 gap-3 border-b border-stone-200 bg-stone-50/80 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
            <div className="col-span-3">Organization</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Fuel access</div>
            <div className="col-span-2">Quota consumption</div>
            <div className="col-span-2 text-right">Max / transaction</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-stone-600">No organizations match these filters.</p>
              <p className="mt-1 text-xs text-stone-400">Try a different search term or clear a filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filtered.map((org) => {
                const TypeIcon = ORG_TYPE_CONFIG[org.type].icon
                const totalAllocated = org.quotas.reduce((s, q) => s + q.allocatedLiters, 0)
                const totalConsumed = org.quotas.reduce((s, q) => s + q.consumedLiters, 0)
                const pct = totalAllocated > 0 ? (totalConsumed / totalAllocated) * 100 : null

                return (
                  <div
                    key={org.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(org.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedId(org.id)
                    }}
                    className="grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="rounded-lg bg-stone-100 p-2 text-stone-500">
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{org.name}</p>
                        <p className="font-mono text-[11px] text-stone-400">{org.registrationNumber}</p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <StatusBadge status={org.status} />
                    </div>

                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${org.allowFuelAccess ? "text-emerald-600" : "text-rose-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${org.allowFuelAccess ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {org.allowFuelAccess ? "Allowed" : "Blocked"}
                      </span>
                    </div>

                    <div className="col-span-2">
                      {pct === null ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setQuotaModalOrgId(org.id)
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline"
                        >
                          <Plus className="h-3 w-3" />
                          Allocate
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-100">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                backgroundColor: pct >= 95 ? "#E11D48" : pct >= 80 ? "#D97706" : "#059669",
                              }}
                            />
                          </div>
                          <span className="font-mono text-xs text-stone-500">{fmtPct(pct)}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="font-mono text-xs text-stone-600">{fmtLiters(org.maxTransactionLiters)}</span>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <ActionsMenu
                        status={org.status}
                        onView={() => setSelectedId(org.id)}
                        onEdit={() => setFormModal({ mode: "edit", orgId: org.id })}
                        onToggleActive={() => handleToggleActive(org.id)}
                        onDelete={() => setDeleteTarget(org)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* ================= FOOTER NOTE ================= */}
        <Card className="border-stone-200 bg-stone-50 p-4 text-center">
          <p className="text-sm text-stone-500">
            This module controls <b className="text-stone-700">government fleets, factories, and bulk fuel systems.</b>
            <br />
            Every feature here is built for enterprise-grade fuel governance.
          </p>
        </Card>
      </div>

      {selectedOrg && (
        <OrgDetailPanel
          org={selectedOrg}
          onClose={() => setSelectedId(null)}
          onAssignQuota={(orgId) => setQuotaModalOrgId(orgId)}
          onEdit={(orgId) => setFormModal({ mode: "edit", orgId })}
          onToggleActive={handleToggleActive}
          onDelete={(org) => setDeleteTarget(org)}
        />
      )}

      {formModal && (
        <OrgFormModal
          mode={formModal.mode}
          initial={editingOrg ?? undefined}
          onClose={() => setFormModal(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {quotaModalOrgId && (
        <AllocateQuotaModal
          orgs={orgs}
          lockedOrgId={quotaModalOrgId === "NEW" ? undefined : quotaModalOrgId}
          onClose={() => setQuotaModalOrgId(null)}
          onSubmit={handleQuotaSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete organization"
          message={`This permanently removes "${deleteTarget.name}" along with its quotas and transaction history. This can't be undone.`}
          confirmLabel="Delete organization"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default OrginazationsControllingPage