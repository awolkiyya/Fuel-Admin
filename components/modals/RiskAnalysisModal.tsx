"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/* -----------------------------
   MOCK DATA (simulate backend)
------------------------------ */
const MOCK_RISKS = [
  {
    id: "1",
    userId: "u1",
    level: "high",
    status: "flagged",
    reason: "Fuel usage exceeded normal threshold by 42% within 24 hours",
    note: "Multiple fuel requests detected across different stations within short interval.",
    detectedBy: "system",
    createdAt: "2026-04-24T10:20:00Z",
  },
  {
    id: "2",
    userId: "u1",
    level: "medium",
    status: "active",
    reason: "Repeated refueling detected in short time window",
    note: "Driver behavior matches possible duplicate fueling pattern.",
    detectedBy: "system",
    createdAt: "2026-04-23T15:10:00Z",
  },
  {
    id: "3",
    userId: "u1",
    level: "low",
    status: "active",
    reason: "Normal fuel usage pattern observed",
    note: "No anomalies detected in last 7 days.",
    detectedBy: "system",
    createdAt: "2026-04-22T09:00:00Z",
  },
  {
    id: "4",
    userId: "u1",
    level: "medium",
    status: "flagged",
    reason: "Fuel request frequency higher than average drivers",
    note: "Slight deviation above fleet average usage pattern.",
    detectedBy: "station_manager",
    createdAt: "2026-04-21T12:30:00Z",
  },
  {
    id: "5",
    userId: "u1",
    level: "high",
    status: "blocked",
    reason: "Suspicious fuel consumption pattern + manual review confirmation",
    note: "Confirmed abuse pattern after admin review and system alerts.",
    detectedBy: "admin",
    createdAt: "2026-04-20T08:45:00Z",
  },
]

/* -----------------------------
   TYPES
------------------------------ */
type UserRisk = (typeof MOCK_RISKS)[0]

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
}

/* -----------------------------
   HELPERS
------------------------------ */
function levelVariant(level: string) {
  switch (level) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    default:
      return "default"
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "blocked":
      return "destructive"
    case "flagged":
      return "secondary"
    default:
      return "default"
  }
}

/* -----------------------------
   COMPONENT
------------------------------ */
export function RiskAnalysisModal({
  open,
  onOpenChange,
}: Props) {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const limit = 2

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit
    return MOCK_RISKS.slice(start, start + limit)
  }, [page])

  const totalPages = Math.ceil(MOCK_RISKS.length / limit)

  const latestRisk = MOCK_RISKS[0]

  useEffect(() => {
    if (!open) return
    setLoading(true)

    const t = setTimeout(() => setLoading(false), 250)

    return () => clearTimeout(t)
  }, [open, page])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw] sm:max-w-3xl 
          max-h-[85vh] overflow-hidden
          flex flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>Risk Analysis</DialogTitle>
        </DialogHeader>

       

        <Separator />

        {/* =========================
            HISTORY
        ========================== */}
        <div className="flex-1 overflow-y-auto pr-1">
          <h3 className="text-sm font-semibold mb-3">
            Risk History
          </h3>

          <div className="space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading history...
              </div>
            ) : (
              paginatedData.map((risk) => (
                <div
                  key={risk.id}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={levelVariant(risk.level)}>
                      {risk.level}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {new Date(risk.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Reason:
                    </span>{" "}
                    {risk.reason}
                  </div>

                  {/* NOTE */}
                  <div className="text-xs text-muted-foreground">
                    Note: {risk.note}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Detected by:{" "}
                    <span className="font-medium">
                      {risk.detectedBy}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            PAGINATION
        ========================== */}
        <div className="flex items-center justify-between pt-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}