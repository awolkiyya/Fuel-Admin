"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { TableEmpty } from "./table-empty";
import { queryClient } from "@/providers/query-client";

import { VehicleType } from "@/types/vehicle";



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

/* ---------------------------------------
   STATUS BADGE
----------------------------------------*/
function StatusBadge({ status }: { status: VehicleType["status"] }) {
  const isActive = status === "ACTIVE";

  return (
    <Badge
      className={
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-700"
      }
    >
      {status}
    </Badge>
  );
}

/* ---------------------------------------
   FUEL LIST RENDER
----------------------------------------*/
function FuelList({ fuels }: { fuels: VehicleType["fuelTypes"] }) {
  if (!fuels || fuels.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        No fuels assigned
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {fuels.slice(0, 2).map((f) => (
        <Badge key={f.id} variant="secondary" className="text-xs">
          {f.name}
        </Badge>
      ))}

      {fuels.length > 2 && (
        <Badge variant="outline" className="text-xs">
          +{fuels.length - 2}
        </Badge>
      )}
    </div>
  );
}

/* ---------------------------------------
   COMPONENT
----------------------------------------*/
interface Props {
  data: VehicleType[];
  isLoading: boolean;
  hasFilters?: boolean;
  onEdit: (v: VehicleType) => void;
  onToggleStatus: (vehicleType: VehicleType) => void;
  onView:(vehicleType: VehicleType) => void;
}

export function VehicleTypesTable({
  data,
  isLoading,
  hasFilters,
  onEdit,
  onToggleStatus,
  onView
}: Props) {
  if (isLoading) {
    return (
      <TableSkeleton
        rows={8}
        columnsConfig={[
          { width: "60px" },
          { width: "2fr" },
          { width: "2fr" },
          { width: "140px" },
          { width: "140px" },
          { width: "140px" },
          { width: "2fr" },
          { width: "120px", type: "badge" },
          { width: "160px", type: "actions" },
        ]}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Fuel Compatibility</TableHead>

            {/* RULE ENGINE */}
            <TableHead>Max L/hr</TableHead>
            <TableHead>Refill Interval</TableHead>
            <TableHead>Max Refills</TableHead>
            <TableHead>Max Daily (opt)</TableHead>

            <TableHead>Code Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((v, index) => {
              const isActive = v.status === "ACTIVE";

              return (
                <TableRow key={v.id}>
                  {/* INDEX */}
                  <TableCell className="text-muted-foreground">
                    #{index + 1}
                  </TableCell>

                  {/* NAME */}
                  <TableCell className="font-medium">
                    {v.name}
                  </TableCell>

                  {/* FUELS */}
                  <TableCell>
                    <FuelList fuels={v.fuelTypes} />
                  </TableCell>

                  {/* RULES */}
                  <TableCell>
                    {v.maxLitersPerHour ?? 0} L/hr
                  </TableCell>

                  <TableCell>
                    {v.minRefillIntervalMinutes ?? 0} min
                  </TableCell>

                  <TableCell>
                    {v.maxRefillsPerDay ?? "—"}
                  </TableCell>

                  {/* OPTIONAL RULE */}
                  <TableCell>
                    {v.maxDailyLiters ?? "—"} L
                  </TableCell>

                  {/* DESCRIPTION */}
                  <TableCell className="text-muted-foreground text-sm">
                     Code {v.code || "—"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <StatusBadge status={v.status} />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      

                      <DropdownMenuContent align="end">

                      <DropdownMenuItem onClick={() => onView(v)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(v)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onToggleStatus(v)}>
                          {isActive ? "Disable" : "Enable"}
                        </DropdownMenuItem>

                      

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableEmpty
              colSpan={10}
              title={
                hasFilters
                  ? "No matching vehicle types"
                  : "No vehicle types yet"
              }
              description={
                hasFilters
                  ? "Try adjusting your search or filter."
                  : "Start by creating a new vehicle type."
              }
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["vehicle-types"],
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
  );
}