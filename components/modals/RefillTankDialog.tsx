"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RefillTankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  liters: number;

  onLitersChange: (value: number) => void;

  onSubmit: () => void;

  isPending?: boolean;
}

export default function RefillTankDialog({
  open,
  onOpenChange,
  liters,
  onLitersChange,
  onSubmit,
  isPending = false,
}: RefillTankDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refill Tank</DialogTitle>

          <p className="text-sm text-muted-foreground">
            Add fuel to the selected storage tank.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="number"
            min={1}
            placeholder="Enter liters to add"
            value={liters || ""}
            onChange={(e) =>
              onLitersChange(Number(e.target.value))
            }
          />

          <Button
            className="w-full"
            disabled={liters <= 0 || isPending}
            onClick={onSubmit}
          >
            {isPending ? "Processing..." : "Confirm Refill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}