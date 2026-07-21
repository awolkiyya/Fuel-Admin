"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StationFuelType } from "@/types/tanks.types"

type FuelType = {
  id: string
  name: string
}

type Props = {
  open: boolean
  onClose: () => void
  pumpName: string | null

  fuelTypes: StationFuelType[]
  fuelTypesLoading: boolean

  onSave: (data: {
    number: number
    fuelType: string
  }) => void
}

export function NozzleModal({
  open,
  onClose,
  pumpName,
  fuelTypes,
  fuelTypesLoading,
  onSave,
}: Props) {
  const [number, setNumber] = useState("")
  const [fuelType, setFuelType] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Nozzle {pumpName ? `to ${pumpName}` : ""}
          </DialogTitle>
        </DialogHeader>

        {/* Nozzle Number */}
        <Input
          placeholder="Nozzle number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        {/* Fuel Types (SERVER DRIVEN) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Fuel Type
          </label>

          <select
            className="w-full border rounded p-2"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            disabled={fuelTypesLoading}
          >
            <option value="">Select fuel type</option>

            {fuelTypes.map((f) => (
              <option key={f.id} value={f.fuelType.name}>
                {f.fuelType.name}
              </option>
            ))}
          </select>

          {fuelTypesLoading && (
            <p className="text-xs text-muted-foreground">
              Loading fuel types...
            </p>
          )}
        </div>

        {/* Actions */}
        <Button
          onClick={() => {
            if (!number || !fuelType) return

            onSave({
              number: Number(number),
              fuelType,
            })

            setNumber("")
            setFuelType("")
            onClose()
          }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}