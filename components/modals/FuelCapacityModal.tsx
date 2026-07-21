import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { X, Check, Fuel } from "lucide-react"
import { FuelInventory, FuelItem, Station } from "@/types/station"
import { useEffect, useMemo, useState } from "react"
import { BaseModal } from "./BaseModal"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"

type FuelType = {
  id: string
  name: string
}

type Props = {
  station: Station
  fuel: FuelInventory[]

  fuelTypes: FuelType[]
  fuelTypesLoading: boolean
  fuelTypesPagination?: {
    page: number
    totalPages: number
  }

  fuelTypesPage: number
  onFuelTypesPageChange: (p: number) => void

  fuelTypesSearch: string
  onFuelTypesSearchChange: (v: string) => void

  onUpdateFuel: (
    stationId: string,
    fuelTypes: FuelItem[]
  ) => void

  trigger: React.ReactNode
}

export function FuelCapacityModal({
  station,
  fuel,
  fuelTypes,
  fuelTypesLoading,
  fuelTypesPagination,
  fuelTypesPage,
  onFuelTypesPageChange,
  fuelTypesSearch,
  onFuelTypesSearchChange,
  onUpdateFuel,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  /* =========================
     INIT FROM DB
  ========================= */
  const initialFuel = useMemo<FuelItem[]>(() => {
    return (
      fuel?.map((f: any) => ({
        fuelTypeId: f.fuelTypeId,
        type: f.type,
        maxCapacity: f.maxCapacity ?? 0,
        isActive: true, // 🔥 IMPORTANT
      })) ?? []
    )
  }, [fuel])

  const [localFuel, setLocalFuel] = useState<FuelItem[]>(initialFuel)

  useEffect(() => {
    setLocalFuel(initialFuel)
  }, [initialFuel])

  /* =========================
     TOGGLE FUEL TYPE
  ========================= */
  const toggleFuelType = (id: string, name: string) => {
    setLocalFuel((prev) => {
      const exists = prev.find((f) => f.fuelTypeId === id)

      if (exists) {
        // 🚫 prevent removing DB-existing fuel
        if (exists.isActive) return prev

        return prev.filter((f) => f.fuelTypeId !== id)
      }

      return [
        ...prev,
        {
          fuelTypeId: id,
          type: name,
          maxCapacity: 0,
          isActive: true,
        },
      ]
    })
  }

  /* =========================
     UPDATE CAPACITY
  ========================= */
  const updateCapacity = (id: string, value: string) => {
    const num = Number(value)

    setLocalFuel((prev) =>
      prev.map((f) =>
        f.fuelTypeId === id
          ? { ...f, maxCapacity: isNaN(num) ? 0 : num }
          : f
      )
    )
  }

  /* =========================
     SAVE
  ========================= */
  const handleSave = () => {
    onUpdateFuel(station.id, localFuel)
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <BaseModal
        open={open}
        onOpenChange={setOpen}
        title="Fuel Capacity Management"
      >
        <div className="space-y-5">

          {/* ================= SELECT ================= */}
          <Popover open={selectOpen} onOpenChange={setSelectOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Fuel className="w-4 h-4 mr-2" />
                Select Fuel Types
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] p-0">
              <Command>
                <CommandInput
                  value={fuelTypesSearch}
                  onValueChange={onFuelTypesSearchChange}
                  placeholder="Search fuel types..."
                />

                {fuelTypesLoading && (
                  <div className="p-3 text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}

                <CommandEmpty>No fuel found</CommandEmpty>

                <CommandGroup>
                  {fuelTypes.map((t) => {
                    const selected = localFuel.some(
                      (f) => f.fuelTypeId === t.id
                    )

                    return (
                      <CommandItem
                        key={t.id}
                        onSelect={() => toggleFuelType(t.id, t.name)}
                      >
                        <Check
                          className={`mr-2 w-4 h-4 ${
                            selected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {t.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* ================= SELECTED ================= */}
          <div className="flex flex-wrap gap-2">
            {localFuel.map((f) => (
              <Badge
                key={f.fuelTypeId}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {f.type}

                {/* ✅ ONLY allow remove if NOT persisted */}
                {!f.isActive && (
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      setLocalFuel((prev) =>
                        prev.filter(
                          (x) => x.fuelTypeId !== f.fuelTypeId
                        )
                      )
                    }
                  />
                )}
              </Badge>
            ))}
          </div>

          {/* ================= INPUT ================= */}
          <div className="space-y-3">
            {localFuel.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">
                No fuel types selected
              </div>
            )}

            {localFuel.map((f) => (
              <div
                key={f.fuelTypeId}
                className="flex items-center justify-between p-3 border rounded-xl"
              >
                <div className="text-sm font-medium">
                  {f.type}
                </div>

                <Input
                  type="number"
                  value={f.maxCapacity}
                  onChange={(e) =>
                    updateCapacity(f.fuelTypeId, e.target.value)
                  }
                  className="w-28 text-center"
                />
              </div>
            ))}
          </div>

          {/* ================= SAVE ================= */}
          <Button className="w-full" onClick={handleSave}>
            Save Fuel Configuration
          </Button>

        </div>
      </BaseModal>
    </>
  )
}