"use client"

import { useState } from "react"
import { Plus, Pencil } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

import { Button } from "../ui/button"

import { useCreateStation, useUpdateStation } from "@/hooks/station/useStations"
import { StationFormValues } from "@/lib/schemas/stationSchema"
import { StationForm } from "../forms/station-form"
import { Station } from "@/types/station"

type Props = {
  mode?: "create" | "edit"
  defaultValues?: Station
  trigger?: React.ReactNode
}

export function StationDialog({
  mode = "create",
  defaultValues,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false)

  const createMutation = useCreateStation()
  const updateMutation = useUpdateStation();

  const isEdit = mode === "edit"

  const handleSubmit = (data: StationFormValues) => {
    const formData = new FormData()

    // ================= CORE DATA =================
    formData.append("name", data.name)
    formData.append("city", data.city)
    formData.append("region", data.region)
    formData.append("lat", String(data.lat))
    formData.append("lng", String(data.lng))

    if (data.address) {
      formData.append("address", data.address)
    }

    if (data.image) {
      formData.append("image", data.image)
    }

    console.log("data incoming",data);

    if (isEdit && defaultValues?.id) {
      updateMutation.mutate(
        {
          id: defaultValues.id,
          data: formData,
        },
        {
          onSuccess: () => {
            setOpen(false)
          },
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setOpen(false)
        },
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!createMutation.isPending) {
          setOpen(val)
        }
      }}
    >
      {/* ================= TRIGGER ================= */}
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            {isEdit ? (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Station
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Register Station
              </>
            )}
          </Button>
        )}
      </DialogTrigger>

      {/* ================= MODAL ================= */}
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Station" : "Create Station"}
          </DialogTitle>
        </DialogHeader>

        <StationForm
          loading={createMutation.isPending}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}