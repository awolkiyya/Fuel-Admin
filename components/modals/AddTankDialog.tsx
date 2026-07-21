"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  data: any;

  newTank: {
    stationFuelTypeId: string;
    name: string;
    capacity: number;
  };

  setNewTank: React.Dispatch<
    React.SetStateAction<{
      stationFuelTypeId: string;
      name: string;
      capacity: number;
    }>
  >;

  createTank: {
    isPending: boolean;
  };

  onSubmit: () => void;
}

export default function AddTankDialog({
  open,
  onOpenChange,
  data,
  newTank,
  setNewTank,
  createTank,
  onSubmit,
}: AddTankDialogProps) {
  const selectedFuel = data?.data?.find(
    (fuel: any) => fuel.id === newTank.stationFuelTypeId
  );

  const remainingCapacity = selectedFuel
    ? selectedFuel.remaining ??
      selectedFuel.maxCapacity - (selectedFuel.allocatedCapacity ?? 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Allocate Fuel Storage Capacity</DialogTitle>

          <p className="text-sm text-muted-foreground mt-1">
            Assign storage space to a fuel type. You cannot exceed available
            capacity.
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {/* Fuel Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fuel Type</label>

            <p className="text-xs text-muted-foreground">
              Choose which fuel this tank will store
            </p>

            <select
              className="w-full border rounded-md p-2"
              value={newTank.stationFuelTypeId}
              onChange={(e) =>
                setNewTank((prev) => ({
                  ...prev,
                  stationFuelTypeId: e.target.value,
                }))
              }
            >
              <option value="">Select fuel type</option>

              {data?.data?.map((fuel: any) => (
                <option key={fuel.id} value={fuel.id}>
                  {fuel.fuelType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity Overview */}
          {selectedFuel && (
            <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Capacity Overview
              </p>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Max</p>
                  <p className="font-semibold">
                    {selectedFuel.maxCapacity} L
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Used</p>
                  <p className="font-semibold">
                    {selectedFuel.allocatedCapacity ?? 0} L
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-semibold text-green-600">
                    {remainingCapacity} L
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Remaining capacity updates automatically based on current
                allocations.
              </p>
            </div>
          )}

          {/* Tank Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tank Name</label>

            <Input
              placeholder="e.g. Diesel Tank A"
              value={newTank.name}
              onChange={(e) =>
                setNewTank((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Storage Capacity (Liters)
            </label>

            <p className="text-xs text-muted-foreground">
              Maximum allowed depends on remaining capacity
            </p>

            <Input
              type="number"
              placeholder="Enter capacity"
              value={newTank.capacity || ""}
              max={remainingCapacity}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (value > remainingCapacity) return;

                setNewTank((prev) => ({
                  ...prev,
                  capacity: value,
                }));
              }}
            />

            {newTank.capacity > remainingCapacity && (
              <p className="text-xs text-red-500">
                Capacity exceeds available space
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={
              !newTank.stationFuelTypeId ||
              !newTank.name ||
              newTank.capacity <= 0 ||
              createTank.isPending
            }
            onClick={onSubmit}
          >
            {createTank.isPending
              ? "Creating..."
              : "Create Tank Allocation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}