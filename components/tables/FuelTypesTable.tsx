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
import { Fuel } from "lucide-react";

import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { TableEmpty } from "@/components/tables/table-empty";
import { FuelConfig } from "@/types/commen";

interface FuelTableProps {
  data: FuelConfig[];
  isLoading: boolean;
  hasFilters?: boolean;

  onEdit?: (fuel: FuelConfig) => void;
  onToggleStatus?: (fuel: FuelConfig) => void;
  onAdd?: () => void;
}

/* ---------------------------------------
   COMPONENT
----------------------------------------*/
export function FuelTypesTable({
  data,
  isLoading,
  hasFilters,
  onEdit,
  onToggleStatus,
  onAdd,
}: FuelTableProps) {
  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <TableSkeleton
        rows={6}
        columnsConfig={[
          { width: "60px" },
          { width: "2fr" },
          { width: "120px" },
          { width: "120px" },
          { width: "140px" },
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
            <TableHead>Fuel</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((fuel, index) => (
              <TableRow key={fuel.id}>

                {/* ROW NUMBER */}
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>

                {/* NAME */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-orange-500" />
                    {fuel.name}
                  </div>
                </TableCell>

                {/* PRICE */}
                <TableCell>
                  {fuel.price} ETB
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <Badge
                    className={
                      fuel.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {fuel.status}
                  </Badge>
                </TableCell>

                {/* UPDATED */}
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(fuel.updatedAt).toLocaleString()}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(fuel)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleStatus?.(fuel)}
                  >
                    {fuel.status === "ACTIVE" ? "Disable" : "Enable"}
                  </Button>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableEmpty
              colSpan={6}
              title={hasFilters ? "No matching fuels" : "No fuel types yet"}
              description={
                hasFilters
                  ? "Try adjusting search or filters."
                  : "Add your first fuel type to start managing pricing."
              }
              action={
                onAdd && (
                  <Button size="sm" onClick={onAdd}>
                    <Fuel className="w-4 h-4 mr-2" />
                    Add Fuel
                  </Button>
                )
              }
            />
          )}
        </TableBody>
      </Table>

    </div>
  );
}