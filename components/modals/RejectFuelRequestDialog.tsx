"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fuel, Truck, XCircle } from "lucide-react";
import { RejectionReasonDropDown } from "../inputs/RejectionReasonDropDown";


interface FuelRequestTarget {
  id: string;
  vehicle: {
    plateNumber: string;
  };
  requested: number;
  fuelType: {
    name: string;
  };
}

interface RejectFuelRequestDialogProps {
  open: boolean;
  onClose: () => void;

  rejectTarget: FuelRequestTarget | null;

  rejectionReasonId: string | null;
  setRejectionReasonId: (id: string) => void;

  rejectNote: string;
  setRejectNote: (value: string) => void;

  loading?: boolean;

  onConfirm: () => void;
}

export const RejectFuelRequestDialog: React.FC<
  RejectFuelRequestDialogProps
> = ({
  open,
  onClose,
  rejectTarget,
  rejectionReasonId,
  setRejectionReasonId,
  rejectNote,
  setRejectNote,
  loading = false,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <DialogTitle className="text-base font-semibold">
              Reject fuel request
            </DialogTitle>
          </div>

          {rejectTarget && (
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {rejectTarget.vehicle?.plateNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                <span>
                  {Number(rejectTarget.requested).toLocaleString()}L{" "}
                  {rejectTarget.fuelType?.name}
                </span>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* =========================================
            FORM
        ========================================= */}
        <div className="space-y-4 py-2">
          {/* Rejection Reason Dropdown */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Rejection reason <span className="text-red-500">*</span>
            </label>

            <div className="mt-1.5">
              <RejectionReasonDropDown
                value={rejectionReasonId}
                onChange={(id) => setRejectionReasonId(id)}
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Additional note (optional)
            </label>

            <textarea
              className="mt-1.5 w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-border bg-muted/30 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Add extra details (optional)..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
        </div>

        {/* =========================================
            ACTIONS
        ========================================= */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={!rejectionReasonId || loading}
            onClick={onConfirm}
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Confirm rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};