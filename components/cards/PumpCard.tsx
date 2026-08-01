import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dispenser } from "@/types/pump.types"

export function PumpCard({
  pump,
  onToggle,
  onAddNozzle,
  onExpand,
  isExpanded,
}: {
  pump: Dispenser
  isExpanded: boolean
  onToggle: (id: string) => void
  onAddNozzle: (pump: Dispenser) => void
  onExpand: (id: string) => void
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Pump #{pump.number}</h2>
        <Badge>{pump.status}</Badge>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onExpand(pump.id)}
        >
          Nozzles
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddNozzle(pump)}
        >
          Add Nozzle
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onToggle(pump.id)}>
              Toggle Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}