"use client"

import { Clock, AlertTriangle, UserX } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockShifts = [
  { staff: "Abel", role: "Attendant", time: "08:00 - 16:00", status: "active" },
  { staff: "Sara", role: "Cashier", time: "16:00 - 00:00", status: "missed" },
]

export default function ShiftPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Shifts
      </h1>

      <div className="space-y-3">

        {mockShifts.map((s, i) => (
          <Card key={i} className="p-4 flex justify-between">

            <div>
              <p className="font-semibold">{s.staff}</p>
              <p className="text-sm text-muted-foreground">{s.role}</p>
              <p className="text-xs text-muted-foreground">{s.time}</p>
            </div>

            <div className="text-right space-y-2">

              <Badge
                className={
                  s.status === "active"
                    ? "bg-green-100 text-green-700"
                    : s.status === "missed"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {s.status}
              </Badge>

              {/* ACTION SYSTEM */}
              {s.status === "missed" && (
                <div className="bg-red-50 p-2 rounded text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Missing shift detected
                  <div className="mt-2 flex gap-2">
                    <Button size="sm">Mark Absence</Button>
                    <Button size="sm" variant="outline">Replace Staff</Button>
                  </div>
                </div>
              )}

            </div>

          </Card>
        ))}

      </div>
    </div>
  )
}