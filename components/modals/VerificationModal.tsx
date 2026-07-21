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
import { Badge } from "@/components/ui/badge";

import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* =========================================================
   TYPES
========================================================= */

interface VerificationState {
  vehicleVerified: boolean;
  driverVerified: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;

  request: {
    vehiclePlate: string;
    driverName: string;
    fuelType: string;
    requestedLiters: number;
  };

  verification: VerificationState;
}

/* =========================================================
   COMPONENT
========================================================= */

export const VerificationModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  request,
  verification,
}) => {
  const isVerified =
    verification.vehicleVerified && verification.driverVerified;

  const StatusRow = ({
    label,
    ok,
  }: {
    label: string;
    ok: boolean;
  }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>

      {ok ? (
        <Badge className="bg-green-600 gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Verified
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3.5 h-3.5" />
          Not Verified
        </Badge>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Vehicle & Driver Verification
          </DialogTitle>
        </DialogHeader>

        {/* STATUS */}
        <div className="pt-3 space-y-2">
          <p className="text-sm font-medium">Verification Status</p>

          <StatusRow
            label="Vehicle Status"
            ok={verification.vehicleVerified}
          />
          <StatusRow
            label="Driver Status"
            ok={verification.driverVerified}
          />
        </div>

        {/* WARNING / INFO */}
        {!isVerified && (
          <div className="flex items-start gap-2 p-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md mt-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <div>
              You must verify both vehicle and driver before proceeding.
              Ensure all details match physical and system records.
            </div>
          </div>
        )}

        {isVerified && (
          <div className="flex items-start gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md mt-2">
            <CheckCircle className="w-4 h-4 mt-0.5" />
            Vehicle and driver are already verified. You can proceed to approval.
          </div>
        )}

        {/* ACTIONS */}
        <DialogFooter className="gap-2 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "gap-1.5",
              isVerified
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-orange-600 hover:bg-orange-700"
            )}
          >
            {isVerified ? (
              <>
                <ArrowRight className="w-4 h-4" />
                Continue
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Confirm Verification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};