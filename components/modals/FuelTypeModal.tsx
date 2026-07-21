"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type FuelForm = {
  name: string;
  price: number;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  editMode: boolean;

  form: FuelForm;
  setForm: (v: FuelForm) => void;

  onSave: () => void;
  isLoading?: boolean;
};

const SUGGESTIONS = ["Petrol", "Diesel", "Kerosene"];

export const FuelTypeModal = ({
  open,
  setOpen,
  editMode,
  form,
  setForm,
  onSave,
  isLoading = false,
}: Props) => {
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    const name = form.name?.trim();

    if (!name) {
      newErrors.name = "Fuel name is required";
    } else if (name.length < 2) {
      newErrors.name = "Fuel name is too short";
    }

    if (!form.price || form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = () => {
    if (!validate()) return;

    setForm({
      ...form,
      name: form.name.trim(),
    });

    onSave();
  };

  const isDisabled = useMemo(() => {
    return (
      isLoading ||
      !form.name?.trim() ||
      !form.price ||
      form.price <= 0
    );
  }, [form, isLoading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update Fuel Type" : "Create Fuel Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          {/* NAME INPUT */}
          <Input
            placeholder="Fuel type (e.g. Petrol, Diesel...)"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name}
            </p>
          )}

          {/* HELP TEXT */}
          <div className="text-xs text-muted-foreground">
            💡 Use standard fuel names for system consistency.
          </div>

          {/* SUGGESTIONS */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((item) => (
              <Badge
                key={item}
                className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() =>
                  setForm({
                    ...form,
                    name: item,
                  })
                }
              >
                {item}
              </Badge>
            ))}
          </div>

          {/* PRICE */}
          <Input
            type="number"
            placeholder="Price per liter (ETB)"
            value={form.price || ""}
            onChange={(e) =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
          />

          {errors.price && (
            <p className="text-sm text-red-500">
              {errors.price}
            </p>
          )}

          {/* SAVE */}
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isDisabled}
          >
            {isLoading ? "Saving..." : "Save Fuel Type"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};