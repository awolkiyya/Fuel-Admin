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

import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Droplets,
  FileText,
  Wrench,
} from "lucide-react";
import { AdjustmentType } from "@/types/tank";

interface AdjustTankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  currentLevel: number;
  reason: string;
  adjustmentType: string;

  onLevelChange: (value: number) => void;
  onReasonChange: (value: string) => void;
  onTypeChange: (value: AdjustmentType) => void;

  onSubmit: () => void;
  isPending?: boolean;
}

export default function AdjustTankDialog({
  open,
  onOpenChange,
  currentLevel,
  reason,
  adjustmentType,
  onLevelChange,
  onReasonChange,
  onTypeChange,
  onSubmit,
  isPending = false,
}: AdjustTankDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Adjust Tank Level
          </DialogTitle>

          <p className="text-sm text-muted-foreground flex items-start gap-2 mt-1">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            This action will create an audit log in the system. Use only for verified corrections.
          </p>
        </DialogHeader>

        <div className="space-y-5">

          {/* LEVEL */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Current Fuel Level
            </label>

            <Input
              type="number"
              min={0}
              placeholder="Enter actual fuel level"
              value={currentLevel || ""}
              onChange={(e) => onLevelChange(Number(e.target.value))}
            />

            <p className="text-xs text-muted-foreground">
              Set the verified physical fuel level in the tank.
            </p>
          </div>

          {/* TYPE */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Adjustment Type
            </label>

            <select
              className="w-full border rounded-md p-2 text-sm"
              value={adjustmentType}
              onChange={(e) => onTypeChange(e.target.value as AdjustmentType)}
            >
              <option value="">Select reason type</option>
              <option value="LOSS">Loss</option>
              <option value="LEAK">Leak</option>
              <option value="CALIBRATION">Calibration</option>
              <option value="MANUAL_FIX">Manual Fix</option>
              <option value="CORRECTION">Correction</option>
            </select>

            <p className="text-xs text-muted-foreground">
              Categorize the adjustment for audit tracking.
            </p>
          </div>

          {/* REASON */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reason / Notes
            </label>

            <Textarea
              placeholder="Explain why this adjustment is being made (e.g. leak detected during inspection, calibration mismatch, manual correction after audit...)"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="min-h-[110px]"
            />

            <p className="text-xs text-muted-foreground">
              Provide a clear audit justification for this change.
            </p>
          </div>

          {/* ACTION */}
          <Button
            className="w-full"
            disabled={
              currentLevel < 0 ||
              !reason.trim() ||
              !adjustmentType ||
              isPending
            }
            onClick={onSubmit}
          >
            {isPending ? "Processing..." : "Confirm Adjustment"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}