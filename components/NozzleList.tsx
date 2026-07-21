import { Button } from "@/components/ui/button"
import { Pump } from "@/types/pump.types"
import { Wrench } from "lucide-react"

export function NozzleList({
  pump,
  onToggleNozzle,
}: {
  pump: Pump
  onToggleNozzle: (pumpId: string, nozzleId: string) => void
}) {
  return (
    <div className="mt-4 border-l pl-3 space-y-2">
      {pump.nozzles.map((n) => (
        <div
          key={n.id}
          className="flex justify-between p-2 bg-muted rounded"
        >
          <div>
            <p className="font-medium text-sm">
              Nozzle #{n.number}
            </p>
            <p className="text-xs text-muted-foreground">
              {n.fuelType} • {n.status}
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleNozzle(pump.id, n.id)}
          >
            <Wrench className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}