import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Power,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { EquipmentBadge } from "./EquipmentBadge";
import { NozzleCard } from "./NozzleCard";
import { Dispenser, EquipmentStatus } from "@/types/pump.types";

interface Props {
  dispenser: Dispenser;
  expanded: boolean;
  onExpand: () => void;
  onAddNozzle: (dispenserId: string) => void;
  onStatusChange: (status: EquipmentStatus) => void;
  /** Wired through to each NozzleCard's switch. Omit to render nozzles read-only. */
  onToggleNozzle?: (nozzleId: string) => void;
}

/* =========================
   STATUS PRESENTATION
   Single source of truth for how each status looks/reads,
   so the trigger button, dropdown items, and card accent
   never drift out of sync with each other.
========================= */
const STATUS_META: Record<
  EquipmentStatus,
  { label: string; icon: typeof Power; accent: string }
> = {
  ACTIVE: {
    label: "Active",
    icon: Power,
    accent: "text-emerald-600",
  },
  INACTIVE: {
    label: "Inactive",
    icon: Power,
    accent: "text-muted-foreground",
  },
  MAINTENANCE: {
    label: "Maintenance",
    icon: Wrench,
    accent: "text-amber-600",
  },
};

const CARD_ACCENT: Record<EquipmentStatus, string> = {
  ACTIVE: "border-l-emerald-400",
  INACTIVE: "border-l-transparent",
  MAINTENANCE: "border-l-amber-400",
};

export function DispenserCard({
  dispenser,
  expanded,
  onExpand,
  onAddNozzle,
  onStatusChange,
  onToggleNozzle,
}: Props) {
  const isActive = dispenser.status === "ACTIVE";
  const isMaintenance = dispenser.status === "MAINTENANCE";

  const currentStatus = STATUS_META[dispenser.status];
  const StatusIcon = currentStatus.icon;

  const contentId = `dispenser-${dispenser.id}-content`;

  return (
    <Card
      className={cn(
        "overflow-hidden border border-l-4 shadow-sm transition-colors",
        CARD_ACCENT[dispenser.status]
      )}
    >
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center justify-between gap-3 p-4 border-b">
        <div className="space-y-2 min-w-0">
          <h3 className="font-semibold text-base truncate">
            Dispenser #{dispenser.number}
          </h3>

          <div className="flex items-center gap-2">
            <EquipmentBadge status={dispenser.status} />
            <span className="text-xs text-muted-foreground">
              {dispenser.nozzles.length} nozzle
              {dispenser.nozzles.length !== 1 && "s"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* STATUS CONTROL */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <StatusIcon className={cn("h-4 w-4", currentStatus.accent)} />
                {currentStatus.label}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onStatusChange("ACTIVE")}
                disabled={isActive}
                className="gap-2"
              >
                <Power className="h-4 w-4 text-emerald-600" />
                Activate
                {isActive && <Check className="h-3.5 w-3.5 ml-auto" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onStatusChange("INACTIVE")}
                disabled={dispenser.status === "INACTIVE"}
                className="gap-2"
              >
                <Power className="h-4 w-4 text-muted-foreground" />
                Deactivate
                {dispenser.status === "INACTIVE" && (
                  <Check className="h-3.5 w-3.5 ml-auto" />
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onStatusChange("MAINTENANCE")}
                disabled={isMaintenance}
                className="gap-2"
              >
                <Wrench className="h-4 w-4 text-amber-600" />
                Set to Maintenance
                {isMaintenance && <Check className="h-3.5 w-3.5 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* EXPAND TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpand}
            aria-label={expanded ? "Collapse dispenser details" : "Expand dispenser details"}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      {expanded && (
        <div
          id={contentId}
          className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* NOZZLE HEADER */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Nozzles</p>

            <Button
              size="sm"
              className="gap-2"
              disabled={!isActive}
              onClick={() => onAddNozzle(dispenser.id)}
            >
              <Plus className="h-4 w-4" />
              Add Nozzle
            </Button>
          </div>

          {/* STATUS-AWARE NOTICE */}
          {!isActive && (
            <div
              className={cn(
                "rounded-md border p-3 text-xs flex items-center gap-2",
                isMaintenance
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "bg-muted/40 text-muted-foreground"
              )}
            >
              <Wrench className="h-4 w-4 shrink-0" />
              {isMaintenance
                ? "This dispenser is under maintenance. Reactivate it to manage nozzles."
                : "Activate dispenser before adding nozzles."}
            </div>
          )}

          {/* NOZZLE LIST */}
          {dispenser.nozzles.length === 0 ? (
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
              No nozzles configured for this dispenser.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dispenser.nozzles.map((nozzle) => (
                <NozzleCard
                  key={nozzle.id}
                  nozzle={nozzle}
                  onToggle={onToggleNozzle}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}