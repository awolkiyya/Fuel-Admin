"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Eye, MoreHorizontal } from "lucide-react"
import { TableSkeleton } from "@/components/tables/TableSkeleton"
import { TableEmpty } from "./table-empty"
import { queryClient } from "@/providers/query-client"
import { getInitials } from "@/utils/getInitials"
import { DriverUser } from "@/types/driver"

/* -----------------------------
   TYPES
------------------------------ */
type DriverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED"
type RiskLevel = "low" | "medium" | "high"

interface DriversTableProps {
  data: DriverUser[]
  isLoading: boolean
  hasFilters?: boolean
  onView?: (driver: DriverUser) => void


}

/* -----------------------------
   HELPERS
------------------------------ */
function getStatusVariant(status: DriverStatus) {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "INACTIVE":
      return "secondary"
    case "SUSPENDED":
      return "outline"
    case "BLOCKED":
      return "destructive"
  }
}

function getRiskVariant(risk: RiskLevel) {
  switch (risk) {
    case "low":
      return "default"
    case "medium":
      return "secondary"
    case "high":
      return "destructive"
  }
}

/* -----------------------------
   COMPONENT
------------------------------ */
export function DriversTable({
  data,
  isLoading,
  hasFilters,
  onView,
}: DriversTableProps) {
  if (isLoading) {
    return (
      <TableSkeleton
        rows={8}
        columnsConfig={[
          { width: "40px" },
          { width: "2fr", type: "avatar" },
          { width: "120px" },
          { width: "120px", type: "badge" },
          { width: "120px", type: "badge" },
          { width: "60px", type: "actions" },
        ]}
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Vehicles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((driver: DriverUser, index: number) => (
              <TableRow key={driver.id}>
                <TableCell>{index + 1}</TableCell>

                {/* DRIVER */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                      {getInitials(driver.full_name)}

                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium">
                        {driver.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {driver.phone}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {driver.vehicleCount ?? 0} vehicle(s)
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(driver.status)}>
                    {driver.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={getRiskVariant(driver.riskSummary.level)}>
                    {driver.riskSummary.level}
                  </Badge>
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right">
                <Button onClick={() => onView?.(driver)}>
                  <Eye/>
                  View Driver
                  </Button>

                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmpty
              colSpan={6}
              title={hasFilters ? "No matching drivers" : "No drivers yet"}
              description={
                hasFilters
                  ? "Try adjusting filters or search."
                  : "Drivers will appear once they register."
              }
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["drivers"],
                    })
                  }
                >
                  Refresh
                </Button>
              }
            />
          )}
        </TableBody>
      </Table>
    </div>
  )
}