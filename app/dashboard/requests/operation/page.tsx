"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn, formatEthiopianDate } from "@/lib/utils";
import {
  ArrowLeft,
  User,
  Car,
  Droplets,
  CheckCircle2,
  XCircle,
  Fuel,
  Gauge,
  ClipboardList,
  AlertTriangle,
  CircleDot,
  Loader2,
  RotateCcw,
  NotepadTextDashed,
  UserRound,
  ArrowRight,
  Coins,
  ChevronDown,
} from "lucide-react";
import { NozzleDropdown } from "@/components/inputs/NozzleDropDown";
import { RejectFuelRequestDialog } from "@/components/modals/RejectFuelRequestDialog";
import { FuelRequest, FuelRequestStatus, FuelRequest as req } from "@/types/fuel-reques";
import { toast } from "sonner";
import { useApproveFuelRequest, useCancelFuelRequest, useCompleteDispensingFuelRequest, useCurrentFuelRequest, useRejectFuelRequest, useStartDispensingFuelRequest } from "@/hooks/station/operation.hook";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



/* =========================================================
   HELPERS
========================================================= */

const STEPS: { key: FuelRequestStatus; label: string }[] = [
  { key: "APPROVED",   label: "Approve" },
  // { key: "ASSIGNED",   label: "Assign pump" },
  { key: "DISPENSING", label: "Dispense" },
  { key: "COMPLETED",  label: "Complete" },
];

function getStepIndex(status: FuelRequestStatus): number {
  const map: Record<FuelRequestStatus, number> = {
    PENDING:    -2, // queue only
    VERIFIED:   -3, // entry point — immediately show approve step (step 0)
    APPROVED:    0,
    DISPENSING:  1,
    COMPLETED:   2,
    REJECTED:   -1,
    CANCELLED:  -1,
  };
  // VERIFIED lands the operator on step 0 (Approve) with no prior done steps
  return status === "VERIFIED" ? 0 : map[status];
}


function statusLabel(s: FuelRequestStatus) {
  const labels: Partial<Record<FuelRequestStatus, string>> = {
    VERIFIED:   "Verified",
    DISPENSING: "Dispensing",
    COMPLETED:  "Completed",
    REJECTED:   "Rejected",
    CANCELLED:  "Cancelled",
  };
  return labels[s] ?? (s.charAt(0) + s.slice(1).toLowerCase());
}

function statusColor(status: FuelRequestStatus) {
  switch (status) {
    case "PENDING":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800";
    case "VERIFIED":
      return "text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/40 dark:border-sky-800";
    case "APPROVED":
      return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800";
    case "DISPENSING":
      return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/40 dark:border-orange-800";
    case "COMPLETED":
      return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800";
    case "REJECTED":
    case "CANCELLED":
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800";
  }
}
/* =========================================================
   SUB-COMPONENTS
========================================================= */

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-xs text-muted-foreground min-w-[120px]">
        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

/* =========================================================
   Smart collapsible Section
   - Click header to expand/collapse
   - Shows a lightweight preview in the header when collapsed
     so key info stays visible without opening it
========================================================= */
interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  preview?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  preview,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border overflow-hidden ">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "w-full flex items-center gap-2.5 px-3.5 py-3 text-left transition-colors",
          "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-muted/40"
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{title}</div>
          {!open && preview && (
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {preview}
            </div>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 pb-3.5 pt-0.5 space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STEPPER
========================================================= */

function Stepper({
  step,
  isTerminal,
  status,
}: {
  step: number;
  isTerminal: boolean;
  status: FuelRequestStatus;
}) {
  if (isTerminal) {
    const isRejected =
      status === "REJECTED" || status === "CANCELLED";
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl border px-5 py-3.5 text-sm font-medium",
          isRejected
            ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
            : "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400"
        )}
      >
        {isRejected ? (
          <XCircle className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        Request {status.toLowerCase()}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card px-5 py-4">
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = step > i;
          const active = step === i;
          const last = i === STEPS.length - 1;

          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors",
                    done
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-foreground border-foreground text-background"
                      : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : active ? (
                    <CircleDot className="w-3.5 h-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight whitespace-nowrap",
                    done
                      ? "text-green-600 dark:text-green-400"
                      : active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {!last && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mb-5 mx-1 rounded-full transition-colors",
                    done ? "bg-green-500" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   TIMELINE
========================================================= */

// function Timeline({ events }: { events: TimelineEvent[] }) {
//   return (
//     <div className="rounded-xl border bg-card">
//       <div className="flex items-center gap-2.5 px-5 py-3.5 border-b">
//         <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
//           <Clock className="w-3.5 h-3.5 text-muted-foreground" />
//         </div>
//         <span className="text-sm font-medium">Timeline</span>
//       </div>
//       <div className="px-5 py-4 space-y-0">
//         {events.map((e, i) => (
//           <div key={i} className="flex gap-3">
//             <div className="flex flex-col items-center">
//               <div
//                 className={cn(
//                   "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
//                   i === 0 ? "bg-foreground" : "bg-muted-foreground/40"
//                 )}
//               />
//               {i < events.length - 1 && (
//                 <div className="w-px flex-1 bg-border my-1" />
//               )}
//             </div>
//             <div className="pb-4">
//               <p className="text-sm font-medium leading-tight">{e.label}</p>
//               <p className="text-xs text-muted-foreground mt-0.5">
//                 {e.actor} · {e.timestamp}
//               </p>
//               {e.note && (
//                 <p className="text-xs text-muted-foreground mt-1 italic">
//                   "{e.note}"
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


/* =========================================================
   Fuel gauge arc (semi-circular dial)
========================================================= */
interface FuelGaugeProps {
  dispensed: number;
  target: number | null;
}

const FuelGaugeArc: React.FC<FuelGaugeProps> = ({ dispensed, target }) => {
  const pct = useMemo(() => {
    if (!target || target <= 0) return 0;
    return Math.min(100, Math.max(0, (dispensed / target) * 100));
  }, [dispensed, target]);

  // Semi-circle: 180deg arc, radius 54, so full arc length = PI * r
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const isOver = target != null && dispensed > target;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 140 78"
        className="w-full max-w-[180px] overflow-visible"
      >
        {/* track */}
        <path
          d="M 13 70 A 54 54 0 0 1 127 70"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-orange-200/60 dark:stroke-orange-900/40"
        />
        {/* fill */}
        <path
          d="M 13 70 A 54 54 0 0 1 127 70"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-500 ease-out",
            isOver ? "stroke-red-500" : "stroke-orange-500"
          )}
        />
        {/* needle-tip dot */}
        <circle
          cx={13 + (127 - 13) * (pct / 100)}
          cy={70 - Math.sin((pct / 100) * Math.PI) * 54}
          r="3.5"
          className={cn(isOver ? "fill-red-600" : "fill-orange-600")}
        />
      </svg>

      <div className="absolute bottom-0 flex flex-col items-center">
        <span
          className={cn(
            "text-lg font-bold leading-none tabular-nums",
            isOver
              ? "text-red-600 dark:text-red-500"
              : "text-orange-700 dark:text-orange-400"
          )}
        >
          {pct.toFixed(0)}%
        </span>
        <span className="text-[10px] text-orange-700/60 dark:text-orange-400/60 mt-0.5">
          {dispensed || 0} / {target ?? "—"} L
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   ACTION PANEL
========================================================= */

function ActionPanel({
  request,
  approvedLiters,
  setApprovedLiters,
  dispensed,
  setDispensed,
  // onAction,
  rejectAction,
  setNozzleId,
  cancleAction,
  approveAction,
  dispensingAction,
  complateAction,
}: {
  request: FuelRequest;
  approvedLiters: number;
  setApprovedLiters: (v: number) => void;
  dispensed: number;
  setDispensed: (v: number) => void;
  nozzleId: string;
  rejectAction: () => void;
  cancleAction: () => void;
  approveAction: () => void;
  dispensingAction: () => void;
  complateAction:()=>void;

  setNozzleId: (v: string) => void;

  // onAction: (status: FuelRequestStatus, patch?: Partial<FuelRequest>) => void;
  
}) {
  const { status } = request;
  const canCancel = ["VERIFIED", "APPROVED", "ASSIGNED"].includes(status);
  const handleDispensedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
  
    if (raw === "") {
      setDispensed(0);
      return;
    }
  
    let num = Number(raw);
    if (Number.isNaN(num) || num < 0) return;
  
    if (request.approved != null && num > request.approved) {
      num = request.approved;
    }
  
    setDispensed(num);
  };

  const stepLabel: Partial<Record<FuelRequestStatus, string>> = {
    VERIFIED:   "Approve request",
    APPROVED:   "Start Dispensing Now",
    DISPENSING: "Complete transaction",
    COMPLETED: "Transaction complete",
    REJECTED: "Request rejected",
    CANCELLED: "Request cancelled",
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
          Current step
        </p>
        <p className="text-sm font-semibold">{stepLabel[status]}</p>
      </div>

      <div className="px-5 py-4 space-y-3">

        {/* VERIFIED — operator opened from queue, immediately show approve form */}
        {status === "VERIFIED" && (
          <>
            <div className="flex items-center gap-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-3 py-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <span className="text-xs text-sky-700 dark:text-sky-400">
                Request verified · ready to approve
              </span>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Approved liters
                </label>

                <Input
                  type="number"
                  min={0}
                  max={request.requested}
                  placeholder={`Max ${request.requested} L`}
                  value={approvedLiters || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > request.requested) {
                      setApprovedLiters(request.requested);
                      return;
                    }

                    if (value < 0) {
                      setApprovedLiters(0);
                      return;
                    }

                    setApprovedLiters(value);
                  }}
                  className="h-9 text-sm"
                />
              </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Pump / Nozzle Number
              </label>
              <NozzleDropdown
                value={request.nozzle?.id ?? null}
                stationId={request.station.id}   // ✅ ADD THIS
                fuelType={request.fuelType.name}
                onChange={(value, item) => {
                  setNozzleId(value);
                }}
              />
            </div>

            <Button
              className="w-full h-9 text-sm"
              disabled={!approvedLiters || approvedLiters <= 0}
              onClick={approveAction}
            >
              {/* Approve request */}
              Approve & Start
            </Button>

            <Separator />

            <Button
              variant="destructive"
              className="w-full h-9 text-sm"
              onClick={rejectAction}
            >
              Reject request
            </Button>
          </>
        )}


{/* ASSIGNED */}
{status === "APPROVED" && (
  <>
    <div className="relative overflow-hidden rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 dark:border-amber-900/40 px-3.5 py-3">
      {/* status pip */}
      <div className="mb-2.5 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-500">
          Ready to dispense
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
  <div className="flex items-center gap-2.5">

    <div className="
      flex h-8 w-8 shrink-0
      items-center justify-center
      rounded-lg
      bg-white/80
      dark:bg-white/10
      shadow-sm
    ">
      <Fuel className="
        h-4 w-4
        text-amber-600
        dark:text-amber-500
      " />
    </div>


    <div className="min-w-0">

      <div className="
        text-[10px]
        text-muted-foreground
        leading-tight
      ">
        Pump / Nozzle
      </div>


      <div className="
        text-sm
        font-semibold
        leading-tight
        truncate
      ">
        {request.nozzle
          ? `D-${request.nozzle.dispenser?.number ?? "?"} / N-${request.nozzle.number}`
          : "—"
        }
      </div>


      <div className="
        text-[11px]
        text-muted-foreground
        truncate
      ">
        {request.nozzle?.fuelType?.name ?? "Fuel type unknown"}
      </div>


    </div>


  </div>
</div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-white/10 shadow-sm">
            <Gauge className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-muted-foreground leading-tight">
              Volume
            </div>
            <div className="text-sm font-semibold leading-tight truncate">
              {request.approved != null ? `${request.approved} L` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Button
      className="w-full h-9 text-sm gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
      disabled={false}
      onClick={dispensingAction}
    >
      {false ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          Start dispensing
          <ArrowRight className="h-3.5 w-3.5" />
        </>
      )}
    </Button>
  </>
)}


{/* DISPENSING */}
{status === "DISPENSING" && (
  <>
<div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 px-3.5 py-3">
  <div className="flex items-center gap-2">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
    </span>
    <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
      Dispensing in progress
    </span>
  </div>

  <div className="mt-1 flex justify-center">
    <FuelGaugeArc dispensed={dispensed || 0} target={request.approved ?? null} />
  </div>

  {dispensed > 0 && request.approved != null && dispensed > request.approved && (
    <div className="mb-2 flex items-center justify-center gap-1.5 text-[11px] text-red-600 dark:text-red-500">
      <AlertTriangle className="h-3 w-3" />
      Exceeds target by {(dispensed - request.approved).toFixed(1)} L
    </div>
  )}

  {/* cost breakdown */}
  <div className="flex items-center justify-between border-t border-orange-200/60 dark:border-orange-900/40 pt-2 text-[11px]">
    <span className="text-orange-700/70 dark:text-orange-400/70">
      {request.fuelType?.price != null
        ? `${request.fuelType.price.toFixed(2)} ETB/L`
        : "— ETB/L"}
    </span>
    <span className="font-semibold text-orange-700 dark:text-orange-400">
      {request.fuelType?.price != null
        ? `${((dispensed || 0) * request.fuelType.price).toFixed(2)} ETB`
        : "—"}
    </span>
  </div>
</div>

    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Droplets className="h-3.5 w-3.5" />
        Actual liters dispensed
      </label>
      <div className="relative">
      <Input
        type="number"
        min={0}
        max={request.approved ?? undefined}
        placeholder={`Target: ${request.approved} L`}
        value={dispensed || ""}
        onChange={handleDispensedChange}
        className="h-9 text-sm pr-8"
      />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          L
        </span>
      </div>

      {dispensed > 0 && request.approved != null && dispensed > request.approved && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-500">
          <AlertTriangle className="h-3 w-3" />
          Exceeds approved volume by {(dispensed - request.approved).toFixed(1)} L
        </div>
      )}
    </div>

    <Button
      className="w-full h-9 text-sm gap-1.5"
      disabled={!dispensed || dispensed <= 0}
      onClick={complateAction}
    >
      <CheckCircle2 className="h-4 w-4" />
      Complete transaction
    </Button>
  </>
)}

        {/* COMPLETED */}
        {status === "COMPLETED" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium">Transaction complete</p>
            <p className="text-xs text-muted-foreground">
              {request.dispensed} L dispensed successfully
            </p>
          </div>
        )}

        {/* REJECTED */}
        {status === "REJECTED" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm font-medium">Request rejected</p>
          </div>
        )}

        {/* CANCELLED */}
        {status === "CANCELLED" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Request cancelled</p>
          </div>
        )}

        {/* CANCEL (always available while active) */}
        {canCancel && (
          <>
            <Separator />
            <Button
              variant="outline"
              className="w-full h-9 text-sm text-muted-foreground"
              onClick={ cancleAction}
            >
              Cancel request
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ SHARED STATE CARD ═══════════════════════ */

function StateCard({
  icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "neutral" | "error";
}) {
  return (
    <Card className="rounded-2xl border bg-background/60 backdrop-blur m-5">
      <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            tone === "error" ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </span>

        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="max-w-xs text-xs text-muted-foreground">{description}</p>}
        </div>

        {action}
      </CardContent>
    </Card>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function FuelRequestOperationPage() {

  // get here current user data
  const stationStaff = useSelector(
    (state: RootState) => state.auth.user
  );
  const [approvedLiters, setApprovedLiters] = useState(0);
  const [dispensed, setDispensed] = useState(0);
  const [nozzleId, setNozzleId] = useState("");
  const [openModal,setOpenModal] = useState(false);
  const [rejectNote,setRejectNote] = useState("");
  const [openCancleModal,setOpenCancleModal] = useState(false);


  const [rejectionReasonId, setRejectionReasonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);



  // so here provide the hook for approve,reject,cancel request

  const rejectMutation = useRejectFuelRequest();
 
  

  const handleReject = async () => {
    if (!rejectNote || !rejectionReasonId || !currentFuelRequest) return;
  
    setLoading(true);
  
    try {
      rejectMutation.mutate({
        id:currentFuelRequest.id,
        rejectionReasonId: rejectionReasonId,
        rejectionNote: rejectNote,
      });
  
      setRejectNote("");
      setRejectionReasonId(null);
      setOpenModal(false);
    } finally {
      setLoading(false);
      setRejectNote("");
      setRejectionReasonId(null);
      setOpenModal(false);
    }
  };
  const { mutate: cancelFuelRequest, isPending: isCancelling } =
  useCancelFuelRequest();

  const { mutate: approveFuelRequest, isPending: isApproving } =
    useApproveFuelRequest();

  const { mutate: startDispensingFuelRequest, isPending: isStartingDispensing } =
  useStartDispensingFuelRequest();

  const { mutate: completeDispensingFuelRequest, isPending: isCompletingDispensing } =
  useCompleteDispensingFuelRequest();



  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCurrentFuelRequest();
  
  const currentFuelRequest = data?.data;
  
  // Safe value even when request doesn't exist
  const status = currentFuelRequest?.status;
  
  const step = useMemo(
    () => (status ? getStepIndex(status) : -1),
    [status]
  );
  
  const isTerminal = step === -1;

  if (isLoading) {
    return (
      <StateCard
        icon={<Loader2 className="h-6 w-6 animate-spin" />}
        title={""}
      />
    );
  }

  if (isError) {
    return (
      <StateCard
        tone="error"
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Something went wrong"
        description={ "Failed to load this data. Please try again."}
        action={
          refetch && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={()=>refetch()}>
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </Button>
          )
        }
      />
    );
  }
  if (!currentFuelRequest) {
    return (
      <StateCard
        icon={<NotepadTextDashed />}
        title="No Active Fuel Request"
        description="There is currently no fuel request assigned or available. Create a new request or wait until one is submitted."
      />
    );
  }



  const handleCancel = () => {
    cancelFuelRequest(currentFuelRequest.id);
  };


  const handleApprove = () => {
    approveFuelRequest({
      id: currentFuelRequest.id,
      approvedLiters,
      nozzleId: nozzleId,
    });
  };

  const handleStartDispensing = () => {
    startDispensingFuelRequest(currentFuelRequest.id);
  };

  const handleComplateTransaction = () => {
    if (!currentFuelRequest?.id || !dispensed) return;
  
    completeDispensingFuelRequest({
      id: currentFuelRequest.id,
      dispensedLiters: Number(dispensed),
    });
  };

  

  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-5xl mx-auto sm:px-6 py-6 space-y-5">

        {/* ── TOP HEADER ─────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold leading-none">
                  {currentFuelRequest.id}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border",
                    statusColor(currentFuelRequest.status)
                  )}
                >
                  {statusLabel(currentFuelRequest.status)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submitted {formatEthiopianDate(currentFuelRequest.createdAt)}
              </p>
            </div>
          </div>


          {stationStaff && (
            <div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2 shadow-sm w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/10">
                {stationStaff.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" />
                   Station Staff Dispensor
                </div>

                <p className="truncate text-sm font-medium text-foreground">
                  {stationStaff.fullName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── STEPPER ────────────────────────────────────── */}
        <Stepper step={step} isTerminal={isTerminal} status={currentFuelRequest.status} />

        {/* ── MAIN LAYOUT ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT ─ 70% */}
          <div className="lg:col-span-2 space-y-4">

            {/* Request Summary */}
            <Section title="Request summary" icon={ClipboardList}>
              <InfoRow
                label="Request ID"
                value={
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {currentFuelRequest.id}
                  </span>
                }
              />
              <InfoRow
                label="Driver"
                value={currentFuelRequest.user?.full_name}
                icon={User}
              />
            </Section>

            {/* Vehicle Information */}
            <Section title="Vehicle Information" icon={Car}>
              <InfoRow
                label="Plate Number"
                value={ currentFuelRequest.vehicle.plateNumber}
                icon={Car}
              />
               <InfoRow
                label="Code"
                value={currentFuelRequest.vehicle.regionCode}
              />


              <InfoRow
                label="Vehicle Type"
                value={currentFuelRequest.vehicle.vehicleType.name}
              />

              <InfoRow
                label="Fuel Type"
                value={currentFuelRequest.vehicle.fuelType.name}
              />

              <InfoRow
                label="Tank Capacity"
                value={`${currentFuelRequest.vehicle.fuelCapacity} L`}
              />
            </Section>

            {/* Fuel Information */}
            <Section title="Fuel information" icon={Fuel}>
              <InfoRow
                label="Fuel type"
                value={currentFuelRequest.fuelType.name}
                icon={Droplets}
              />

              <InfoRow
                label="Price per liter"
                value={
                  currentFuelRequest.fuelType?.price != null
                    ? `${currentFuelRequest.fuelType.price.toFixed(2)} ETB/L`
                    : "—"
                }
                icon={Coins}
              />
              <InfoRow
                label="Requested"
                value={
                  <span className="font-semibold">
                    {currentFuelRequest.requested} L
                  </span>
                }
              />
              {currentFuelRequest.approved != null && (
                <InfoRow
                  label="Approved"
                  value={
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {currentFuelRequest.approved} L
                    </span>
                  }
                />
              )}
              {currentFuelRequest.dispensed != null && (
                <InfoRow
                  label="Dispensed"
                  value={
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {currentFuelRequest.dispensed} L
                    </span>
                  }
                />
              )}
              {currentFuelRequest.nozzle && (
                <InfoRow label="Pump / nozzle" value={currentFuelRequest.nozzle.number} />
              )}
            </Section>

            {/* Timeline */}
            {/* <Timeline events={request.timeline} /> */}
          </div>

          {/* RIGHT ─ 30% */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ActionPanel
                request={currentFuelRequest}
                approvedLiters={approvedLiters}
                setApprovedLiters={setApprovedLiters}
                dispensed={dispensed}
                setDispensed={setDispensed}
                nozzleId={nozzleId}
                setNozzleId={setNozzleId}
                // onAction={updateStatus}
                rejectAction={()=>{
                  toast.success("i'm here")
                  setOpenModal(true);                    
                }}
                cancleAction={()=>{
                  setOpenCancleModal(true);

                }}
                approveAction={handleApprove}
                dispensingAction={handleStartDispensing}
                complateAction={handleComplateTransaction}
              />
            </div>
          </div>


      <RejectFuelRequestDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        rejectTarget={currentFuelRequest}
        rejectionReasonId={rejectionReasonId}
        setRejectionReasonId={setRejectionReasonId}
        rejectNote={rejectNote}
        setRejectNote={setRejectNote}
        loading={loading}
        onConfirm={handleReject}
      />

      <AlertDialog open={openCancleModal} onOpenChange={(open)=>setOpenCancleModal(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel Fuel Request?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to cancel this fuel request?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Keep Request
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleCancel}
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </div>
    </div>
  );
}