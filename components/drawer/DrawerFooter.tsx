import { FuelRequestStatus } from "@/types/fuel-reques";
import { Button } from "../ui/button";
import {
  ShieldCheck,
  XCircle,
  Droplets,
  PlayCircle,
} from "lucide-react";

export function DrawerFooter({
  status,
  isVerified,
  onVerifyClick,
  onStartClick,
  onRejectClick,
}: {
  status: FuelRequestStatus;
  isVerified: boolean;
  onVerifyClick: () => void;
  onStartClick: () => void;
  onRejectClick: () => void;
}) {
  const isTerminal = ["COMPLETED", "REJECTED", "CANCELLED"].includes(status);

  if (isTerminal) return null;

  return (
    <div className="shrink-0 border-t px-5 py-4">
      <div className="flex gap-2">

        {/* =====================================================
            CASE 1: NOT VERIFIED → VERIFY FIRST
        ===================================================== */}
        {!isVerified && (
          <Button
            className="flex-1 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onVerifyClick}
          >
            <ShieldCheck className="w-4 h-4" />
            Confirm Verification
          </Button>
        )}

        {/* =====================================================
            CASE 2: VERIFIED → START PROCESS
        ===================================================== */}
        {isVerified && (
          <Button
            className="flex-1 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={onStartClick}
          >
            <PlayCircle className="w-4 h-4" />
            Start Now
          </Button>
        )}

        {/* =====================================================
            REJECT (ALWAYS AVAILABLE)
        ===================================================== */}
        <Button
          className="flex-1 gap-1.5"
          variant="destructive"
          onClick={onRejectClick}
        >
          <XCircle className="w-4 h-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}