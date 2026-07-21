"use client"

import React, { useMemo, useState } from "react"
import { Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

/* ================= MOCK ================= */
const MOCK_TRANSACTIONS = Array.from({ length: 57 }).map((_, i) => {
  const types = ["NORMAL", "TRANSIT", "BULK"]
  const fuels = ["DIESEL", "PETROL"]
  const orgs = ["Ethio Electric", "Ministry of Transport", "ABC Factory", null]

  return {
    id: `TX-${1000 + i}`,
    organizationName: orgs[i % orgs.length],
    plateNumber: `ETH-${100 + i}`,
    driverName: `Driver ${i + 1}`,
    fuelType: fuels[i % fuels.length],
    type: types[i % types.length],
    liters: Math.floor(Math.random() * 80) + 10,
    status: i % 3 === 0 ? "PENDING" : "COMPLETED",
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }
})

/* ================= HELPERS ================= */
const typeColor = (t: string) => {
  switch (t) {
    case "NORMAL":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "TRANSIT":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "BULK":
      return "bg-purple-50 text-purple-700 border-purple-200"
    default:
      return ""
  }
}

const statusColor = (s: string) => {
  return s === "COMPLETED"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-yellow-50 text-yellow-700 border-yellow-200"
}

/* ================= COMPONENT ================= */
function StationFuelTransactions() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] =
    useState<"ALL" | "NORMAL" | "TRANSIT" | "BULK">("ALL")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()

    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(q) ||
        tx.plateNumber.toLowerCase().includes(q) ||
        tx.driverName.toLowerCase().includes(q) ||
        tx.fuelType.toLowerCase().includes(q) ||
        (tx.organizationName?.toLowerCase().includes(q) ?? false)

      const matchesTab = activeTab === "ALL" || tx.type === activeTab

      return matchesSearch && matchesTab
    })
  }, [search, activeTab])

  const totalLiters = filtered.reduce((a, b) => a + b.liters, 0)

  return (
    <div className="p-6 space-y-5 max-w-5xl m-auto  min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Fuel className="w-5 h-5" />
            Fuel Transactions Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Operational monitoring & audit trail
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Liters</p>
          <p className="text-lg font-bold text-blue-600">
            {totalLiters} L
          </p>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-2">
        {["ALL", "NORMAL", "TRANSIT", "BULK"].map((t) => (
          <Button
            key={t}
            size="sm"
            variant={activeTab === t ? "default" : "outline"}
            onClick={() => setActiveTab(t as any)}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* ================= SEARCH ================= */}
      <Card className="p-3">
        <Input
          placeholder="Search transaction, plate, driver, organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* ================= TABLE ================= */}
      <Card className="overflow-hidden border shadow-sm">

        <div className="overflow-auto">
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Transaction</th>
                <th className="text-left">Organization</th>
                <th className="text-left">Vehicle</th>
                <th className="text-left">Type</th>
                <th className="text-left">Fuel</th>
                <th className="text-left">Liters</th>
                <th className="text-left">Status</th>
                <th className="text-left">Time</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {filtered.map((tx, idx) => (
                <tr
                  key={tx.id}
                  className={`
                    border-b transition
                    hover:bg-blue-50
                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  `}
                >

                  {/* ID */}
                  <td className="p-3 font-medium text-gray-700">
                    {tx.id}
                  </td>

                  {/* ORGANIZATION */}
                  <td>
                    {tx.organizationName ? (
                      <Badge className="bg-indigo-50 text-indigo-700">
                        {tx.organizationName}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* VEHICLE */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{tx.plateNumber}</span>
                      <span className="text-xs text-gray-500">
                        {tx.driverName}
                      </span>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td>
                    <Badge className={typeColor(tx.type)}>
                      {tx.type}
                    </Badge>
                  </td>

                  {/* FUEL */}
                  <td>
                    <Badge variant="outline">{tx.fuelType}</Badge>
                  </td>

                  {/* LITERS */}
                  <td className="font-semibold">
                    {tx.liters} L
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge className={statusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </td>

                  {/* TIME */}
                  <td className="text-gray-500 text-xs">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </Card>

      {/* ================= FOOTER ================= */}
      <div className="text-sm text-muted-foreground flex justify-between">
        <span>{filtered.length} transactions</span>
        <span>Live audit view</span>
      </div>

    </div>
  )
}

export default StationFuelTransactions