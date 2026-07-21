"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  onClose: () => void
  onSave: (data: { number: number }) => void
}

export function PumpModal({ open, onClose, onSave }: Props) {
  const [number, setNumber] = useState<string>("")

  const handleSubmit = () => {
    const parsed = Number(number)

    /* validation */
    if (!parsed || parsed <= 0) return

    onSave({ number: parsed })

    setNumber("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Pump</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            type="number"
            placeholder="Pump number (e.g. 1, 2, 3)"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              Create Pump
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}