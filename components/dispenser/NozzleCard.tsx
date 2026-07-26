import { Fuel, Wrench } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { EquipmentBadge } from "./EquipmentBadge";
import { Nozzle } from "@/types/pump.types";

interface Props {
  nozzle: Nozzle;
  onToggle?: (id: string) => void;
}

/* =========================
   STATUS ACCENT
   Mirrors the same left-border language used on DispenserCard
   so the two stay visually consistent as a system.
========================= */
const ACCENT: Record<Nozzle["status"], string> = {
  ACTIVE: "border-l-emerald-400",
  INACTIVE: "border-l-transparent",
  MAINTENANCE: "border-l-amber-400",
};

export function NozzleCard({ nozzle, onToggle }: Props) {
  const isActive = nozzle.status === "ACTIVE";
  const isMaintenance = nozzle.status === "MAINTENANCE";

  return (
    <Card
      className={cn(
        "flex items-center justify-between gap-3 p-4 border-l-4 transition-colors",
        ACCENT[nozzle.status]
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
          <Fuel className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <p className="font-medium truncate">Nozzle #{nozzle.number}</p>
          <p className="text-xs text-muted-foreground truncate">
            {nozzle.fuelType.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <EquipmentBadge status={nozzle.status} />

        {isMaintenance ? (
          // A binary switch can't safely represent "come out of
          // maintenance into what?" — so instead of a misleading
          // enabled/disabled toggle, show why control is unavailable here.
          <span
            className="flex h-5 w-5 items-center justify-center text-amber-600"
            title="Under maintenance — resolve at the dispenser level to change this nozzle's status"
          >
            <Wrench className="h-4 w-4" />
          </span>
        ) : (
          <Switch
            checked={isActive}
            disabled={!onToggle}
            onCheckedChange={() => onToggle?.(nozzle.id)}
            aria-label={
              isActive
                ? `Deactivate nozzle #${nozzle.number}`
                : `Activate nozzle #${nozzle.number}`
            }
          />
        )}
      </div>
    </Card>
  );
}