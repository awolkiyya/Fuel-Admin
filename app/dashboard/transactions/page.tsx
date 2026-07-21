"use client"

import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  ReceiptText,
  Car,
  User,
  Search,
  Calendar,
} from "lucide-react"

/* ---------------------------------------
   TYPES (REAL WORLD SIMPLIFIED)
----------------------------------------*/
type TransactionStatus = "completed" | "pending" | "rejected"

type VehicleType = "Car" | "Bajaj" | "Minibus" | "Truck"

type Transaction = {
  id: string
  requestDate: string
  requestTime: string

  dispenser: string
  nozzle: string

  vehicleNumber: string
  vehicleType: VehicleType

  fuelType: "Petrol" | "Diesel"

  requestedLiters: number
  dispensedLiters: number

  unitPrice: number

  attendant: string

  status: TransactionStatus

  note?: string
}

/* ---------------------------------------
   MOCK DATA (REALISTIC ERP STYLE)
----------------------------------------*/
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    requestDate: "2026-04-20",
    requestTime: "08:15 AM",
    dispenser: "Dispenser A",
    nozzle: "Nozzle 1",
    vehicleNumber: "ETH-12345",
    vehicleType: "Car",
    fuelType: "Petrol",
    requestedLiters: 20,
    dispensedLiters: 20,
    unitPrice: 120,
    attendant: "Abel",
    status: "completed",
  },
  {
    id: "t2",
    requestDate: "2026-04-20",
    requestTime: "09:05 AM",
    dispenser: "Dispenser A",
    nozzle: "Nozzle 2",
    vehicleNumber: "ETH-77881",
    vehicleType: "Bajaj",
    fuelType: "Diesel",
    requestedLiters: 15,
    dispensedLiters: 15,
    unitPrice: 110,
    attendant: "Miki",
    status: "completed",
  },
  {
    id: "t3",
    requestDate: "2026-04-20",
    requestTime: "10:30 AM",
    dispenser: "Dispenser B",
    nozzle: "Nozzle 1",
    vehicleNumber: "ETH-44552",
    vehicleType: "Truck",
    fuelType: "Diesel",
    requestedLiters: 40,
    dispensedLiters: 0,
    unitPrice: 110,
    attendant: "Sara",
    status: "rejected",
    note: "Vehicle not authorized for fueling. License mismatch detected.",
  },
  {
    id: "t4",
    requestDate: "2026-04-20",
    requestTime: "11:20 AM",
    dispenser: "Dispenser C",
    nozzle: "Nozzle 1",
    vehicleNumber: "ETH-99881",
    vehicleType: "Minibus",
    fuelType: "Petrol",
    requestedLiters: 30,
    dispensedLiters: 30,
    unitPrice: 122,
    attendant: "Dani",
    status: "pending",
  },
  {
    id: "t5",
    requestDate: "2026-04-20",
    requestTime: "12:10 PM",
    dispenser: "Dispenser B",
    nozzle: "Nozzle 2",
    vehicleNumber: "ETH-55221",
    vehicleType: "Car",
    fuelType: "Diesel",
    requestedLiters: 25,
    dispensedLiters: 25,
    unitPrice: 115,
    attendant: "Kebede",
    status: "completed",
  },
]

/* ---------------------------------------
   STATUS BADGE
----------------------------------------*/
function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  }

  return (
    <Badge className={`${styles[status]} border-0 capitalize`}>
      {status}
    </Badge>
  )
}

/* ---------------------------------------
   PAGE
----------------------------------------*/
export default function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"all" | TransactionStatus>("all")
  const [fuelFilter, setFuelFilter] =
    useState<"all" | "Petrol" | "Diesel">("all")
  const [vehicleFilter, setVehicleFilter] =
    useState<"all" | VehicleType>("all")

  const [selected, setSelected] = useState<Transaction | null>(null)

  /* ---------------------------------------
     FILTER ENGINE
  ----------------------------------------*/
  const filtered = useMemo(() => {
    const q = search.toLowerCase()

    return MOCK_TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.dispenser.toLowerCase().includes(q) ||
        t.nozzle.toLowerCase().includes(q) ||
        t.vehicleNumber.toLowerCase().includes(q) ||
        t.attendant.toLowerCase().includes(q)

      return (
        matchSearch &&
        (statusFilter === "all" || t.status === statusFilter) &&
        (fuelFilter === "all" || t.fuelType === fuelFilter) &&
        (vehicleFilter === "all" || t.vehicleType === vehicleFilter)
      )
    })
  }, [search, statusFilter, fuelFilter, vehicleFilter])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-orange-500" />
          Transactions Ledger
        </h1>
        <p className="text-sm text-muted-foreground">
          Fuel station operations with request tracking & dispensing control
        </p>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">

          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicle, dispenser, attendant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value as any)}
          >
            <option value="all">All Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value as any)}
          >
            <option value="all">All Vehicles</option>
            <option value="Car">Car</option>
            <option value="Bajaj">Bajaj</option>
            <option value="Minibus">Minibus</option>
            <option value="Truck">Truck</option>
          </select>

          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date
          </Button>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Dispenser</TableHead>
                <TableHead>Nozzle</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Req</TableHead>
                <TableHead>Disp</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Attendant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((t, i) => {
                const total = t.dispensedLiters * t.unitPrice

                return (
                  <TableRow key={t.id}>

                    <TableCell>#{i + 1}</TableCell>
                    <TableCell>{t.requestDate}</TableCell>
                    <TableCell>{t.requestTime}</TableCell>

                    <TableCell>{t.dispenser}</TableCell>
                    <TableCell>{t.nozzle}</TableCell>

                    <TableCell>{t.vehicleNumber}</TableCell>

                    <TableCell>{t.requestedLiters}</TableCell>
                    <TableCell>{t.dispensedLiters}</TableCell>

                    <TableCell className="text-blue-600">${t.unitPrice}</TableCell>

                    <TableCell className="font-semibold">${total}</TableCell>

                    <TableCell>{t.attendant}</TableCell>

                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(t)}>
                        View
                      </Button>
                    </TableCell>

                  </TableRow>
                )
              })}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-2 text-sm">

              <p><b>Date:</b> {selected.requestDate}</p>
              <p><b>Time:</b> {selected.requestTime}</p>
              <p><b>Vehicle:</b> {selected.vehicleNumber}</p>
              <p><b>Dispenser:</b> {selected.dispenser}</p>
              <p><b>Nozzle:</b> {selected.nozzle}</p>
              <p><b>Attendant:</b> {selected.attendant}</p>
              <p><b>Status:</b> {selected.status}</p>

              {selected.note && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-xs">
                  <b>Reason:</b> {selected.note}
                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}