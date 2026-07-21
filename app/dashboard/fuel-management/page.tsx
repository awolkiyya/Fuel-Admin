"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Fuel,
  DollarSign,
  Lock,
  Activity,
  Save,
  Check,
  ArrowBigDown,
  ArrowBigUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { useFuelConfig, useUpdateFuelConfig } from "@/hooks/fuel/useFuels";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import type { FuelConfigApiResponse, FuelConfigItem, FuelConfigPayload } from "@/types/fuel";

/* =========================
   SAFE NUMBER GUARD
========================= */
const clampToZero = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, value);
};

/* =========================
   LABEL COMPONENT
========================= */
function FieldLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

/* =========================
   MAIN
========================= */
function FuelManagementPage() {
  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  );

  const { data, isLoading } = useFuelConfig(stationId || "");
  const updateMutation = useUpdateFuelConfig();

  const [items, setItems] = useState<FuelConfigItem[]>([]);
  const [saved, setSaved] = useState(false);

  /* =========================
     SAFE HYDRATION
  ========================== */
  useEffect(() => {
    const res = data as FuelConfigPayload | undefined;

    const fuels = res?.fuelTypes;

    if (Array.isArray(fuels)) {
      setItems(fuels);
    } else {
      setItems([]);
    }
  }, [data]);

  /* =========================
     DERIVED STATE
  ========================== */
  const fuelItems = useMemo(() => items, [items]);

  const isEmpty = !isLoading && fuelItems.length === 0;

  /* =========================
     UPDATE HELPERS
  ========================== */
  const toggleFuel = (fuelTypeId: string) => {
    setItems((prev) =>
      prev.map((f) =>
        f.fuelTypeId === fuelTypeId
          ? { ...f, isActive: !f.isActive }
          : f
      )
    );
  };

  const updateField = (
    fuelTypeId: string,
    field: keyof FuelConfigItem,
    value: number
  ) => {
    setItems((prev) =>
      prev.map((f) =>
        f.fuelTypeId === fuelTypeId
          ? {
              ...f,
              [field]: clampToZero(value),
            }
          : f
      )
    );
  };

  /* =========================
     SAVE
  ========================== */
  const handleSave = () => {
    if (!stationId) return;

    updateMutation.mutate(
      {
        stationId,
        payload: {
          stationId: (data as any)?.data?.stationId ?? stationId,
          priceControlMode:
            (data as any)?.data?.priceControlMode ?? "FIXED",
            fuelTypes: items,
        },
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      }
    );
  };

  /* =========================
     LOADING STATE
  ========================== */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 animate-pulse space-y-3"
          >
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  /* =========================
     EMPTY STATE
  ========================== */
  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center space-y-3">
        <Fuel className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No fuel configuration found for this station.
        </p>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="max-w-3xl mx-auto p-5 space-y-5">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Fuel className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-base font-semibold">
              Fuel Management
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure pricing & limits per fuel type
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="h-8 gap-2 text-xs"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* CARDS */}
      <div className="space-y-2.5">
        {fuelItems.map((item) => (
          <Card
            key={item.fuelTypeId}
            className="overflow-hidden border shadow-none"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Fuel className="h-4 w-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {item.fuelType.name}
                  </p>
                  <Badge variant="outline">
                    {item.fuelType.name}
                  </Badge>
                </div>
              </div>

              <Switch
                checked={item.isActive}
                onCheckedChange={() =>
                  toggleFuel(item.fuelTypeId)
                }
              />
            </div>

            {/* PRICE */}
            <div className="p-4 space-y-1.5">
              <FieldLabel icon={DollarSign} label="Price per litre" />

              <Input
                type="number"
                min={0} // ✅ UI LEVEL SAFETY
                value={item.price}
                disabled={!item.priceOverrideAllowed}
                onChange={(e) =>
                  updateField(
                    item.fuelTypeId,
                    "price",
                    Number(e.target.value)
                  )
                }
              />

              {!item.priceOverrideAllowed && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Locked by system admin
                </p>
              )}
            </div>

            {/* LIMITS */}
            <div className="grid grid-cols-2 gap-3 p-4 border-t">
              <div>
                <FieldLabel icon={ArrowBigDown} label="Min (L)" />
                <Input
                  type="number"
                  min={0} // ✅ NO NEGATIVE INPUT
                  value={item.min}
                  onChange={(e) =>
                    updateField(
                      item.fuelTypeId,
                      "min",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <FieldLabel icon={ArrowBigUp} label="Max (L)" />
                <Input
                  type="number"
                  min={0} // ✅ NO NEGATIVE INPUT
                  value={item.max}
                  onChange={(e) =>
                    updateField(
                      item.fuelTypeId,
                      "max",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="px-4 py-2 text-xs text-muted-foreground flex items-center gap-1 border-t">
              <Activity className="h-3 w-3" />
              {item.isActive
                ? "Active for transactions"
                : "Disabled at station level"}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FuelManagementPage;