"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { FuelMultiSelect } from "./FuelMultiSelect";
import { OptionalNumberInput } from "../inputs/OptionalNumberInput";


/* ---------------- TYPES ---------------- */
export type FuelOption = {
  id: string;
  label: string;
};

export type VehicleTypeForm = {
  id?: string;
  name: string;
  fuelTypes: string[];

  // ================= PLATE CONFIG =================
  code: number;

  // ================= BUSINESS RULE =================
  requiresBusinessLicense: boolean;

  // ================= LIMIT RULES =================
  maxDailyLiters?: number;
  maxLitersPerHour: number;
  minRefillIntervalMinutes: number;
  maxRefillsPerDay?: number;

  description?: string;

  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  editMode: boolean;

  form: VehicleTypeForm;
  setForm: React.Dispatch<React.SetStateAction<VehicleTypeForm>>;

  fuelOptions: FuelOption[];
  fuelLoading: boolean;

  onSave: () => void;
  isLoading?: boolean;
};

/* ================= COMPONENT ================= */

export const VehicleTypeModal = ({
  open,
  setOpen,
  editMode,
  form,
  setForm,
  fuelOptions,
  fuelLoading,
  onSave,
  isLoading,
}: Props) => {
  const isValid =
    form.name?.trim()?.length > 0 &&
    form.fuelTypes?.length > 0 &&
    form.maxLitersPerHour > 0 &&
    form.minRefillIntervalMinutes > 0;

  const plateCodes = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-4">

        {/* ================= HEADER ================= */}
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update Vehicle Type" : "Create Vehicle Type"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Configure vehicle rules, access control, and fuel limits.
          </p>
        </DialogHeader>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">

          {/* ================= ROW: IDENTITY ================= */}
          <Section title="Vehicle Identity">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <Input
                placeholder="Vehicle name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Select
                value={form.code.toString()}
                onValueChange={(val) =>
                  setForm({ ...form, code: Number(val) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Plate Code (1–5)" />
                </SelectTrigger>

                <SelectContent>
                  {plateCodes.map((c) => (
                    <SelectItem key={c} value={String(c)}>
                      Code {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </Section>

          {/* ================= ROW: ACCESS ================= */}
          <Section title="Access Rules">

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">
                  Requires Business License
                </p>
                <p className="text-xs text-muted-foreground">
                  Restrict this vehicle type to licensed users only
                </p>
              </div>

              <Switch
                checked={form.requiresBusinessLicense}
                onCheckedChange={(val) =>
                  setForm({
                    ...form,
                    requiresBusinessLicense: val,
                  })
                }
              />
            </div>

          </Section>

          {/* ================= ROW: FUEL ================= */}
          <Section title="Fuel Configuration">

            <FuelMultiSelect
              value={form.fuelTypes}
              onChange={(val) =>
                setForm({ ...form, fuelTypes: val })
              }
              options={fuelOptions}
              loading={fuelLoading}
            />

          </Section>

          {/* ================= ROW: LIMITS (RESPONSIVE GRID) ================= */}
          <Section title="Usage Limits">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <OptionalNumberInput
                label="Max Liters / Hour"
                value={form.maxLitersPerHour}
                onChange={(val) =>
                  setForm({
                    ...form,
                    maxLitersPerHour: val ?? 0,
                  })
                }
              />

              <OptionalNumberInput
                label="Min Refill Interval (min)"
                value={form.minRefillIntervalMinutes}
                onChange={(val) =>
                  setForm({
                    ...form,
                    minRefillIntervalMinutes: val ?? 0,
                  })
                }
              />

              <OptionalNumberInput
                label="Max Daily Liters"
                value={form.maxDailyLiters}
                onChange={(val) =>
                  setForm({
                    ...form,
                    maxDailyLiters: val,
                  })
                }
              />

              <OptionalNumberInput
                label="Max Refills / Day"
                value={form.maxRefillsPerDay}
                onChange={(val) =>
                  setForm({
                    ...form,
                    maxRefillsPerDay: val,
                  })
                }
              />

            </div>
          </Section>

          {/* ================= ROW: NOTES ================= */}
          <Section title="Notes">

            <Textarea
              placeholder="Internal description..."
              value={form.description || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              rows={3}
            />

          </Section>

        </div>

        {/* ================= FIXED ACTION FOOTER ================= */}
        <div className="pt-4 border-t mt-4">
          <Button
            className="w-full"
            disabled={!isValid || isLoading}
            onClick={onSave}
          >
            {isLoading
              ? "Saving..."
              : editMode
              ? "Update Vehicle Type"
              : "Create Vehicle Type"}
          </Button>

          {!isValid && (
            <p className="text-xs text-center text-red-500 mt-2">
              Please complete required fields
            </p>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
};

/* ================= SECTION COMPONENT ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}