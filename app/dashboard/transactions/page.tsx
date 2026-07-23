"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import {
  Fuel,
  Building2,
  Car,
  Gauge,
  Receipt,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  MapPin,
  User as UserIcon,
  CreditCard,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Hash,
  Droplets,
} from "lucide-react"

/* =========================================================================
   TYPES — mirrors the Prisma Transaction model + its relations
   ========================================================================= */

// enum FuelTransactionType
const TX_TYPES = ["VEHICLE", "ORGANIZATION"]
// enum PaymentStatus
const PAYMENT_STATUSES = ["PAID", "PARTIAL", "UNPAID"]

const STATIONS = [
  { id: "st-1", name: "Bole Road Station", location: "Bole, Addis Ababa" },
  { id: "st-2", name: "Adama Terminal", location: "Adama, Oromia" },
  { id: "st-3", name: "Hawassa Junction", location: "Hawassa, Sidama" },
]

const FUEL_TYPES = [
  { id: "ft-diesel", name: "Diesel", basePrice: 58.8 },
  { id: "ft-petrol", name: "Petrol", basePrice: 62.4 },
]

const OPERATORS = ["Alemu Bekele", "Selam Tesfaye", "Dawit Girma", "Hana Kebede"]

const ORGANIZATIONS = [
  "Adama City Administration",
  "Ethio Electric",
  "Ministry of Transport",
  "ABC Construction PLC",
]

/* =========================================================================
   SEEDED MOCK DATA — deterministic so numbers don't jump on re-render
   ========================================================================= */

function mulberry32(seed:any) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildTransactions(count:any) {
  const rows = []
  for (let i = 0; i < count; i++) {
    const rand = mulberry32(i * 7919 + 13)
    const isOrg = i % 5 === 0 || i % 5 === 2
    const type = isOrg ? "ORGANIZATION" : "VEHICLE"
    const fuel = FUEL_TYPES[i % 2]
    const station = STATIONS[i % STATIONS.length]
    const priceJitter = (rand() - 0.5) * 1.4
    const pricePerLiter = Math.round((fuel.basePrice + priceJitter) * 100) / 100
    const litersGiven = isOrg
      ? Math.round(400 + rand() * 2600)
      : Math.round(10 + rand() * 75)
    const totalCost = Math.round(litersGiven * pricePerLiter * 100) / 100

    const statusRoll = rand()
    const paymentStatus =
      statusRoll < 0.62 ? "PAID" : statusRoll < 0.82 ? "PARTIAL" : "UNPAID"

    rows.push({
      id: `TXN-${String(2400 + i).padStart(5, "0")}`,
      fuelRequestId: rand() > 0.35 ? `REQ-${String(9000 + i)}` : null,
      type,
      user: OPERATORS[i % OPERATORS.length],
      organization: isOrg ? ORGANIZATIONS[i % ORGANIZATIONS.length] : null,
      vehicle: isOrg
        ? null
        : { plateNumber: `ETH-${3100 + i}`, driverName: `Driver ${(i % 40) + 1}` },
      station,
      fuelType: fuel.name,
      litersGiven,
      pricePerLiter,
      totalCost,
      paymentStatus,
      createdAt: new Date(Date.now() - i * 41 * 60000).toISOString(),
    })
  }
  return rows
}

const PAGE_SIZE = 9

/* =========================================================================
   HELPERS
   ========================================================================= */

function money(n:any) {
  return `Br ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}

function liters(n:any) {
  return `${n.toLocaleString("en-US")} L`
}

function fmtDate(iso:any) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function fmtTime(iso:any) {
  const d = new Date(iso)
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

const paymentMeta = {
  PAID: { label: "Paid", color: "var(--green)", bg: "var(--green-bg)", Icon: CheckCircle2 },
  PARTIAL: { label: "Partial", color: "var(--amber-dark)", bg: "var(--amber-bg)", Icon: Clock3 },
  UNPAID: { label: "Unpaid", color: "var(--red)", bg: "var(--red-bg)", Icon: AlertTriangle },
}

/* =========================================================================
   PRIMITIVES
   ========================================================================= */

function Pill({ tone, children }) {
  const meta = paymentMeta[tone]
  if (!meta) {
    return (
      <span className="pill" style={{ color: "var(--navy)", background: "#EEF1F5" }}>
        {children}
      </span>
    )
  }
  const { color, bg, Icon } = meta
  return (
    <span className="pill" style={{ color, background: bg }}>
      <Icon size={12} strokeWidth={2.5} />
      {children}
    </span>
  )
}

function TypeTag({ type }) {
  const isOrg = type === "ORGANIZATION"
  return (
    <span
      className="typetag"
      style={{
        color: isOrg ? "var(--navy)" : "var(--amber-dark)",
        background: isOrg ? "#E8ECF3" : "var(--amber-bg)",
      }}
    >
      {isOrg ? <Building2 size={12} /> : <Car size={12} />}
      {isOrg ? "Organization" : "Vehicle"}
    </span>
  )
}

/* Fuel-gauge arc — signature visual for the headline KPI */
function GaugeArc({ percent, label, sub }) {
  const clamped = Math.max(0, Math.min(100, percent))
  const angle = -90 + (clamped / 100) * 180
  const r = 46
  const cx = 60
  const cy = 60
  const describeArc = (startDeg, endDeg) => {
    const toXY = (deg) => {
      const rad = ((deg - 180) * Math.PI) / 180
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
    }
    const [sx, sy] = toXY(startDeg)
    const [ex, ey] = toXY(endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
  }
  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 120 68" width="120" height="68">
        <path d={describeArc(0, 180)} stroke="#E4E7EC" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path
          d={describeArc(0, (clamped / 100) * 180)}
          stroke="var(--amber)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - 34} stroke="var(--navy)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r="4.5" fill="var(--navy)" />
      </svg>
      <div className="gauge-label">
        <span className="gauge-value">{label}</span>
        <span className="gauge-sub">{sub}</span>
      </div>
    </div>
  )
}

function StatCard({ title, value, delta, icon: Icon, accent, gauge }) {
  const up = delta >= 0
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: accent.bg, color: accent.fg }}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        {typeof delta === "number" && (
          <span className={`stat-delta ${up ? "up" : "down"}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {gauge ? (
        gauge
      ) : (
        <>
          <p className="stat-value">{value}</p>
          <p className="stat-title">{title}</p>
        </>
      )}
      {gauge && <p className="stat-title" style={{ marginTop: 2 }}>{title}</p>}
    </div>
  )
}

/* =========================================================================
   DETAIL DRAWER
   ========================================================================= */

function DetailDrawer({ tx, onClose, onMarkPaid }) {
  const ref = useRef(null)
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!tx) return null
  const meta = paymentMeta[tx.paymentStatus]

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer" ref={ref}>
        <div className="drawer-head">
          <div>
            <p className="drawer-eyebrow">Transaction</p>
            <h3 className="drawer-title">{tx.id}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <div className="drawer-hero" style={{ background: meta.bg }}>
              <div>
                <p className="drawer-hero-label" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="drawer-hero-amount">{money(tx.totalCost)}</p>
              </div>
              <meta.Icon size={28} style={{ color: meta.color }} />
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Request</p>
            <div className="kv-row">
              <span className="kv-key"><Hash size={14} /> Fuel request</span>
              <span className="kv-val mono">{tx.fuelRequestId ?? "— walk-in —"}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Type</span>
              <span className="kv-val"><TypeTag type={tx.type} /></span>
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Party</p>
            {tx.type === "ORGANIZATION" ? (
              <div className="kv-row">
                <span className="kv-key"><Building2 size={14} /> Organization</span>
                <span className="kv-val">{tx.organization}</span>
              </div>
            ) : (
              <>
                <div className="kv-row">
                  <span className="kv-key"><Car size={14} /> Vehicle</span>
                  <span className="kv-val mono">{tx.vehicle.plateNumber}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-key"><UserIcon size={14} /> Driver</span>
                  <span className="kv-val">{tx.vehicle.driverName}</span>
                </div>
              </>
            )}
            <div className="kv-row">
              <span className="kv-key"><UserIcon size={14} /> Attendant</span>
              <span className="kv-val">{tx.user}</span>
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Station & fuel</p>
            <div className="kv-row">
              <span className="kv-key"><MapPin size={14} /> Station</span>
              <span className="kv-val">{tx.station.name}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key"><Droplets size={14} /> Fuel type</span>
              <span className="kv-val">{tx.fuelType}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Liters given</span>
              <span className="kv-val mono">{liters(tx.litersGiven)}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">Price / liter</span>
              <span className="kv-val mono">Br {tx.pricePerLiter.toFixed(2)}</span>
            </div>
            <div className="kv-row total">
              <span className="kv-key">Total cost</span>
              <span className="kv-val mono">{money(tx.totalCost)}</span>
            </div>
          </section>

          <section className="drawer-section">
            <p className="section-label">Timeline</p>
            <div className="kv-row">
              <span className="kv-key"><CalendarClock size={14} /> Created</span>
              <span className="kv-val">
                {fmtDate(tx.createdAt)} · {fmtTime(tx.createdAt)}
              </span>
            </div>
          </section>
        </div>

        {tx.paymentStatus !== "PAID" && (
          <div className="drawer-footer">
            <button className="btn btn-primary" onClick={() => onMarkPaid(tx.id)}>
              <CreditCard size={15} />
              Mark as paid
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   MAIN PAGE
   ========================================================================= */

export default function StationFuelTransactions() {
  const [transactions, setTransactions] = useState(() => buildTransactions(64))
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [fuelFilter, setFuelFilter] = useState("ALL")
  const [payFilter, setPayFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return transactions.filter((tx) => {
      const searchMatch =
        !q ||
        tx.id.toLowerCase().includes(q) ||
        tx.fuelType.toLowerCase().includes(q) ||
        tx.user.toLowerCase().includes(q) ||
        (tx.organization ?? "").toLowerCase().includes(q) ||
        (tx.vehicle?.plateNumber ?? "").toLowerCase().includes(q) ||
        tx.station.name.toLowerCase().includes(q)

      const typeMatch = typeFilter === "ALL" || tx.type === typeFilter
      const fuelMatch = fuelFilter === "ALL" || tx.fuelType.toUpperCase() === fuelFilter
      const payMatch = payFilter === "ALL" || tx.paymentStatus === payFilter

      return searchMatch && typeMatch && fuelMatch && payMatch
    })
  }, [transactions, search, typeFilter, fuelFilter, payFilter])

  const totals = useMemo(() => {
    const totalLiters = filtered.reduce((s, t) => s + t.litersGiven, 0)
    const revenue = filtered.filter((t) => t.paymentStatus === "PAID").reduce((s, t) => s + t.totalCost, 0)
    const outstanding = filtered
      .filter((t) => t.paymentStatus !== "PAID")
      .reduce((s, t) => s + t.totalCost, 0)
    return { totalLiters, revenue, outstanding, count: filtered.length }
  }, [filtered])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  function handleMarkPaid(id) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, paymentStatus: "PAID" } : t))
    )
    setSelected((prev) => (prev && prev.id === id ? { ...prev, paymentStatus: "PAID" } : prev))
  }

  const typeTabs = [
    { key: "ALL", label: "All" },
    { key: "VEHICLE", label: "Vehicle" },
    { key: "ORGANIZATION", label: "Organization" },
  ]
  const payTabs = [
    { key: "ALL", label: "All" },
    { key: "PAID", label: "Paid" },
    { key: "PARTIAL", label: "Partial" },
    { key: "UNPAID", label: "Unpaid" },
  ]

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .page {
          --navy: #0E2436;
          --navy-2: #16324A;
          --amber: #E8A33D;
          --amber-dark: #B9761F;
          --amber-bg: #FDF3E2;
          --green: #1F9D6C;
          --green-bg: #E7F7EF;
          --red: #DC4C4C;
          --red-bg: #FCEAEA;
          --bg: #F1F4F8;
          --surface: #FFFFFF;
          --border: #E4E7EC;
          --text: #16212B;
          --muted: #64748B;
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }
        .page .mono { font-family: 'JetBrains Mono', monospace; }

        .topbar {
          background: linear-gradient(135deg, var(--navy), var(--navy-2));
          color: #fff;
          padding: 28px 32px 40px;
        }
        .topbar-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(232,163,61,0.18); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
        }
        .brand h1 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
        .brand p { margin: 2px 0 0; font-size: 13px; color: rgba(255,255,255,0.65); }
        .station-chip {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
          padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 500;
        }

        .content { max-width: 1180px; margin: -26px auto 0; padding: 0 32px 48px; }

        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .stat-grid { grid-template-columns: 1fr; } }

        .stat-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
          padding: 18px 20px; box-shadow: 0 1px 2px rgba(16,24,40,0.04);
        }
        .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .stat-delta { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; }
        .stat-delta.up { color: var(--green); }
        .stat-delta.down { color: var(--red); }
        .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
        .stat-title { font-size: 12.5px; color: var(--muted); margin: 3px 0 0; }

        .gauge-wrap { display: flex; flex-direction: column; align-items: center; margin-top: -6px; }
        .gauge-label { text-align: center; margin-top: -6px; }
        .gauge-value { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; }
        .gauge-sub { font-size: 11.5px; color: var(--muted); }

        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 2px rgba(16,24,40,0.04); }
        .filters { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
        .filter-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: space-between; }
        .seg-group { display: flex; gap: 6px; flex-wrap: wrap; }
        .seg-btn {
          border: 1px solid var(--border); background: #fff; color: var(--muted);
          font-size: 12.5px; font-weight: 600; padding: 7px 13px; border-radius: 9px; cursor: pointer;
          transition: all .12s ease;
        }
        .seg-btn:hover { border-color: var(--navy-2); }
        .seg-btn.active { background: var(--navy); color: #fff; border-color: var(--navy); }
        .seg-btn.active.pay-PAID { background: var(--green); border-color: var(--green); }
        .seg-btn.active.pay-PARTIAL { background: var(--amber-dark); border-color: var(--amber-dark); }
        .seg-btn.active.pay-UNPAID { background: var(--red); border-color: var(--red); }

        .search-box { position: relative; max-width: 340px; flex: 1; min-width: 220px; }
        .search-box svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); }
        .search-box input {
          width: 100%; box-sizing: border-box; padding: 9px 12px 9px 34px; border-radius: 9px;
          border: 1px solid var(--border); font-size: 13.5px; font-family: 'Inter', sans-serif; outline: none;
        }
        .search-box input:focus { border-color: var(--navy-2); box-shadow: 0 0 0 3px rgba(22,50,74,0.08); }

        .select-wrap { position: relative; }
        .select-wrap select {
          appearance: none; border: 1px solid var(--border); background: #fff; color: var(--text);
          font-size: 12.5px; font-weight: 600; padding: 7px 28px 7px 12px; border-radius: 9px; cursor: pointer;
        }
        .select-wrap svg { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--muted); }

        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 880px; }
        thead th {
          text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--muted); font-weight: 600; padding: 12px 16px; border-bottom: 1px solid var(--border);
          background: #FAFBFC; position: sticky; top: 0;
        }
        tbody td { padding: 13px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        tbody tr { cursor: pointer; transition: background .1s ease; }
        tbody tr:hover { background: #F7F9FB; }
        tbody tr:last-child td { border-bottom: none; }

        .tx-id { font-weight: 600; }
        .tx-sub { font-size: 11.5px; color: var(--muted); margin-top: 1px; }
        .party-main { font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .party-sub { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
        .cell-muted { color: var(--muted); font-size: 12.5px; }
        .amount { font-weight: 700; }

        .pill {
          display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 700;
          padding: 4px 9px; border-radius: 999px;
        }
        .typetag {
          display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600;
          padding: 4px 9px; border-radius: 7px;
        }

        .empty { padding: 64px 20px; text-align: center; }
        .empty h4 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; margin: 12px 0 4px; }
        .empty p { color: var(--muted); font-size: 13.5px; margin: 0; }

        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
        .pagination p { font-size: 12.5px; color: var(--muted); margin: 0; }
        .page-btns { display: flex; gap: 6px; }
        .icon-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text);
        }
        .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .icon-btn:hover:not(:disabled) { border-color: var(--navy-2); }

        .drawer-backdrop {
          position: fixed; inset: 0; background: rgba(14,36,54,0.4); backdrop-filter: blur(2px);
          display: flex; justify-content: flex-end; z-index: 50;
        }
        .drawer {
          width: 380px; max-width: 92vw; height: 100%; background: var(--surface);
          display: flex; flex-direction: column; box-shadow: -8px 0 30px rgba(16,24,40,0.15);
          animation: slidein .18s ease;
        }
        @keyframes slidein { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .drawer-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 20px 14px; border-bottom: 1px solid var(--border); }
        .drawer-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 0 0 2px; }
        .drawer-title { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600; margin: 0; }
        .drawer-body { padding: 16px 20px 8px; overflow-y: auto; flex: 1; }
        .drawer-section { margin-bottom: 20px; }
        .drawer-hero { border-radius: 14px; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; }
        .drawer-hero-label { font-size: 12px; font-weight: 700; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.03em; }
        .drawer-hero-amount { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0; color: var(--navy); }
        .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 700; margin: 0 0 8px; }
        .kv-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: 13px; }
        .kv-row:last-child { border-bottom: none; }
        .kv-row.total .kv-key, .kv-row.total .kv-val { font-weight: 700; }
        .kv-key { color: var(--muted); display: flex; align-items: center; gap: 6px; }
        .kv-val { font-weight: 500; text-align: right; }
        .drawer-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
        .btn { border: none; border-radius: 10px; padding: 11px 16px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }
        .btn-primary { background: var(--navy); color: #fff; }
        .btn-primary:hover { background: var(--navy-2); }
      `}</style>

      {/* HEADER */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <Fuel size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h1>Fuel Transaction Ledger</h1>
              <p>Dispensing &amp; payment activity across every station</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {/* KPIs */}
        <div className="stat-grid">
          <StatCard
            title="Liters dispensed"
            accent={{ bg: "var(--amber-bg)", fg: "var(--amber-dark)" }}
            icon={Gauge}
            gauge={<GaugeArc
              percent={Math.min(100, (totals.totalLiters / 40000) * 100)}
              label={liters(totals.totalLiters)}
              sub="of 40,000 L daily plan" />} value={undefined} delta={undefined}          />
          <StatCard
            title="Revenue collected"
            value={money(totals.revenue)}
            delta={8}
            icon={Wallet}
            accent={{ bg: "var(--green-bg)", fg: "var(--green)" }} gauge={undefined}          />
          <StatCard
            title="Transactions"
            value={totals.count.toLocaleString()}
            delta={3}
            icon={Receipt}
            accent={{ bg: "#E8ECF3", fg: "var(--navy)" }} gauge={undefined}          />
        </div>

        {/* FILTERS */}
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="filters">
            <div className="filter-row">
              <div className="seg-group">
                {typeTabs.map((t) => (
                  <button
                    key={t.key}
                    className={`seg-btn ${typeFilter === t.key ? "active" : ""}`}
                    onClick={() => {
                      setTypeFilter(t.key)
                      setPage(1)
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="seg-group">
                {payTabs.map((t) => (
                  <button
                    key={t.key}
                    className={`seg-btn ${payFilter === t.key ? `active pay-${t.key}` : ""}`}
                    onClick={() => {
                      setPayFilter(t.key)
                      setPage(1)
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="select-wrap">
                <select
                  value={fuelFilter}
                  onChange={(e) => {
                    setFuelFilter(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="ALL">All fuel types</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="PETROL">Petrol</option>
                </select>
                <ChevronDown size={13} />
              </div>
            </div>

            <div className="search-box">
              <Search size={15} />
              <input
                placeholder="Search transaction, request, plate, organization, station…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Type</th>
                  <th>Party</th>
                  <th>Station</th>
                  <th>Fuel</th>
                  <th>Liters</th>
                  <th>Price / L</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="empty">
                        <Search size={26} style={{ color: "var(--muted)" }} />
                        <h4>No transactions match these filters</h4>
                        <p>Try clearing the search or switching the payment filter back to “All”.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx) => (
                    <tr key={tx.id} onClick={() => setSelected(tx)}>
                      <td>
                        <p className="tx-id mono">{tx.id}</p>
                        <p className="tx-sub mono">{tx.fuelRequestId ?? "walk-in"}</p>
                      </td>
                      <td>
                        <TypeTag type={tx.type} />
                      </td>
                      <td>
                        {tx.type === "ORGANIZATION" ? (
                          <div className="party-main">
                            <Building2 size={13} />
                            {tx.organization}
                          </div>
                        ) : (
                          <>
                            <div className="party-main mono">
                              <Car size={13} />
                              {tx.vehicle.plateNumber}
                            </div>
                            <p className="party-sub">{tx.vehicle.driverName}</p>
                          </>
                        )}
                      </td>
                      <td className="cell-muted">{tx.station.name}</td>
                      <td className="cell-muted">{tx.fuelType}</td>
                      <td className="mono">{liters(tx.litersGiven)}</td>
                      <td className="mono cell-muted">Br {tx.pricePerLiter.toFixed(2)}</td>
                      <td className="amount mono">{money(tx.totalCost)}</td>
                      <td>
                        <Pill tone={tx.paymentStatus}>{paymentMeta[tx.paymentStatus].label}</Pill>
                      </td>
                      <td className="cell-muted">
                        {fmtDate(tx.createdAt)}
                        <br />
                        <span style={{ fontSize: 11 }}>{fmtTime(tx.createdAt)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <p>
              Showing {paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="page-btns">
              <button className="icon-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              <button
                className="icon-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <DetailDrawer tx={selected} onClose={() => setSelected(null)} onMarkPaid={handleMarkPaid} />
      )}
    </div>
  )
}