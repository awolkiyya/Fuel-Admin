"use client"

import { useEffect, useState } from "react"

// -----------------------------
// Role
// -----------------------------
type Role = "admin" | "station_manager" | "station_staff"

// -----------------------------
// MOCK DATA
// -----------------------------
const MOCK_ADMIN_STATS = {
  totalStations: 42,
  totalDrivers: 1280,
  totalUsers: 3420,
  totalRequests: 9850,
  activeRequests: 120,
  completedRequests: 9420,
  revenue: 125000,

  // 📷 CAMERA SYSTEM
  cameraActive: 28,
  cameraInactive: 10,
  cameraMissing: 4,

  // ❌ REJECTION
  rejectedTotal: 410,
  rejectedToday: 32,

  // 🚨 RISK
  fraudAlerts: 18,
  highRiskUsers: 7,
  blockedAccounts: 23,
}

// -----------------------------
// AUTH MOCK
// -----------------------------
function useUserRole(): Role | null {
  return "station_manager"
}

// -----------------------------
// CARD COMPONENT
// -----------------------------
function Card({
  title,
  value,
  hint,
  danger,
}: {
  title: string
  value: number | string
  hint: string
  danger?: boolean
}) {
  return (
    <div
      className={`h-28 rounded-xl flex flex-col items-center justify-center text-sm text-center
      ${danger ? "bg-red-100 text-red-700" : "bg-muted/50"}`}
    >
      <p className="text-xs opacity-60">{title}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] opacity-50 px-2 leading-tight">{hint}</p>
    </div>
  )
}


// -----------------------------
// ADMIN DASHBOARD
// -----------------------------
function AdminDashboard() {
  const [data, setData] = useState<typeof MOCK_ADMIN_STATS | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setData(MOCK_ADMIN_STATS), 400)
    return () => clearTimeout(t)
  }, [])

  if (!data) return <div className="p-4">Loading...</div>

  return (
    <div className="grid gap-3 md:grid-cols-3">

      {/* CORE SYSTEM */}
      <Card title="Users" value={data.totalUsers}
        hint="Total registered platform users"
      />
      <Card title="Drivers" value={data.totalDrivers}
        hint="Active drivers using the system"
      />
      <Card title="Stations" value={data.totalStations}
        hint="Registered service/fuel stations"
      />

      <Card title="Requests" value={data.totalRequests}
        hint="All-time service requests created"
      />
      <Card title="Active Requests" value={data.activeRequests}
        hint="Requests currently being processed"
      />
      <Card title="Completed Requests" value={data.completedRequests}
        hint="Successfully completed service requests"
      />

      <Card title="Revenue" value={`$${data.revenue}`}
        hint="Total system-generated revenue"
      />

      {/* 📷 CAMERA AI SYSTEM */}
      <Card title="AI Camera Active" value={data.cameraActive}
        hint="Stations sending live AI queue data"
      />
      <Card title="Camera Inactive" value={data.cameraInactive} danger
        hint="Camera installed but not connected to AI"
      />
      <Card title="No Camera" value={data.cameraMissing} danger
        hint="Stations without camera hardware"
      />

      {/* ❌ REJECTION SYSTEM */}
      <Card title="Total Rejected" value={data.rejectedTotal} danger
        hint="All rejected service requests"
      />
      <Card title="Rejected Today" value={data.rejectedToday} danger
        hint="Requests rejected in last 24 hours"
      />

      {/* 🚨 FRAUD / RISK SYSTEM */}
      <Card title="Fraud Alerts" value={data.fraudAlerts} danger
        hint="Detected suspicious system activities"
      />
      <Card title="High Risk Users" value={data.highRiskUsers} danger
        hint="Users flagged by risk scoring engine"
      />
      <Card title="Blocked Accounts" value={data.blockedAccounts} danger
        hint="Users restricted from system access"
      />
    </div>
  )
}

// -----------------------------
// STATION ADMIN
// -----------------------------
function StationAdminDashboard() {
  const m = {
    queue: 12,
    today: 45,
    staff: 8,
    fuel: "82%",
    done: 390,
    pending: 6,
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card title="Queue" value={m.queue} hint="Vehicles waiting in line" />
      <Card title="Today Requests" value={m.today} hint="Today's station workload" />
      <Card title="Staff" value={m.staff} hint="Active station employees" />

      <Card title="Fuel Level" value={m.fuel} hint="Current fuel availability" />
      <Card title="Completed" value={m.done} hint="Finished station operations" />
      <Card title="Pending" value={m.pending} hint="Waiting admin approval" />

    </div>
  )
}

// -----------------------------
// STAFF
// -----------------------------
function StationStaffDashboard() {
  const m = {
    tasks: 5,
    queue: 9,
    done: 32,
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card title="Assigned Tasks" value={m.tasks}
        hint="Tasks assigned to you"
      />
      <Card title="Queue" value={m.queue}
        hint="Vehicles currently waiting"
      />
      <Card title="Completed Today" value={m.done}
        hint="Your completed operations today"
      />

      <div className="md:col-span-3 h-[250px] rounded-xl bg-muted/50 flex items-center justify-center">
        Quick Actions Panel
      </div>
    </div>
  )
}

// -----------------------------
// ROUTER
// -----------------------------
export default function DashboardPage() {
  const role = useUserRole()

  if (!role) return <div>Loading...</div>

  switch (role) {
    case "admin":
      return <AdminDashboard />
    case "station_manager":
      return <StationAdminDashboard />
    case "station_staff":
      return <StationStaffDashboard />
    default:
      return <div>Unauthorized</div>
  }
}