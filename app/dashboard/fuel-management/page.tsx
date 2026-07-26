"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Fuel,
  DollarSign,
  Lock,
  Activity,
  Save,
  Check,
  ArrowBigDown,
  ArrowBigUp,
  AlertTriangle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";

import {
  useFuelConfig,
  useUpdateFuelConfig,
} from "@/hooks/fuel/useFuels";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import type { FuelConfigItem } from "@/types/fuel";

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
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
function FuelManagementPage() {
  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  );

  // NOTE: assumes useFuelConfig exposes an `isError` flag (standard for
  // react-query style hooks). Remove if your hook doesn't provide it.
  const { data: config, isLoading, isError } = useFuelConfig(stationId ?? "");

  const updateMutation = useUpdateFuelConfig();

  const [items, setItems] = useState<FuelConfigItem[]>([]);
  const [originalItems, setOriginalItems] = useState<FuelConfigItem[]>([]);
  const [saved, setSaved] = useState(false);

  /*
    SYSTEM CONTROLLED MODE
    FIXED:    prices locked
    OVERRIDE: price can be edited
  */
  const priceControlMode = config?.priceControlMode ?? "FIXED";
  const allowPriceEditing = priceControlMode === "OVERRIDE";

  /*
    HYDRATE STATE
  */
  useEffect(() => {
    if (!config) {
      setItems([]);
      setOriginalItems([]);
      return;
    }

    const fuels = config.fuelTypes ?? [];

    setItems(fuels);
    setOriginalItems(JSON.parse(JSON.stringify(fuels)));
  }, [config]);

  /*
    DIRTY CHECK
  */
  const hasChanges = useMemo(() => {
    return JSON.stringify(items) !== JSON.stringify(originalItems);
  }, [items, originalItems]);

  /*
    LIVE VALIDATION (drives inline warnings + disables Save)
  */
    const hasInvalidItems = useMemo(() => {
      return items.some(
        (item) =>
          item.minRequestLiters > item.maxRequestLiters ||
          item.maxRequestLiters > item.maxCapacity ||
          item.price < 0
      );
    }, [items]);

  const isEmpty = !isLoading && !isError && items.length === 0;

  /*
    UPDATE ACTIVE STATUS
  */
  const toggleFuel = (fuelTypeId: string) => {
    setItems((previous) =>
      previous.map((fuel) =>
        fuel.fuelTypeId === fuelTypeId
          ? { ...fuel, isActive: !fuel.isActive }
          : fuel
      )
    );
  };

  /*
    UPDATE LIMIT FIELDS (maxCapacity / minRequestLiters / maxRequestLiters)
  */
  const updateLimitField = (
    fuelTypeId: string,
    field: "maxCapacity" | "minRequestLiters" | "maxRequestLiters",
    value: number
  ) => {
    setItems((previous) =>
      previous.map((fuel) =>
        fuel.fuelTypeId === fuelTypeId
          ? { ...fuel, [field]: clampToZero(value) }
          : fuel
      )
    );
  };

  /*
    UPDATE PRICE (nested under fuel.fuelType.price)
  */
    const updatePrice = (
      fuelTypeId: string,
      value: number
    ) => {
      const price = clampToZero(value);
    
      setItems((previous) =>
        previous.map((fuel) =>
          fuel.fuelTypeId === fuelTypeId
            ? {
                ...fuel,
    
                // update backend field
                price,
    
                // keep UI display synced
                fuelType: {
                  ...fuel.fuelType,
                  price,
                },
              }
            : fuel
        )
      );
    };

  /*
    VALIDATION (blocking, with toasts)
  */
  const validateItems = () => {
    for (const item of items) {
      if (item.fuelType.price < 0) {
        toast.error(`${item.fuelType.name}: Invalid price`);
        return false;
      }

      if (item.minRequestLiters < 0) {
        toast.error(`${item.fuelType.name}: Invalid minimum`);
        return false;
      }

      if (item.maxRequestLiters < item.minRequestLiters) {
        toast.error(
          `${item.fuelType.name}: Maximum must be greater than minimum`
        );
        return false;
      }

      if (item.maxCapacity < item.maxRequestLiters) {
        toast.error(`${item.fuelType.name}: Maximum exceeds tank capacity`);
        return false;
      }
    }

    return true;
  };

  /*
    SAVE CONFIGURATION
  */
  const handleSave = () => {
    if (!stationId || !config) return;

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    if (!validateItems()) return;

    updateMutation.mutate(
      {
        stationId,
        payload: {
          stationId: config.stationId,
          priceControlMode: config.priceControlMode,
          fuelTypes: items,
        },
      },
    );
  };

  /*
    LOADING STATE
  */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-5 space-y-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-5 space-y-4 animate-pulse">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  /*
    ERROR STATE
  */
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold">
          Unable to Load Fuel Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Something went wrong while fetching this station&apos;s fuel setup.
          Please try again.
        </p>
      </div>
    );
  }

  /*
    EMPTY STATE
  */
  if (isEmpty) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <Fuel className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">No Fuel Configuration</h2>
        <p className="text-sm text-muted-foreground">
          This station has no fuel configuration assigned yet.
        </p>
      </div>
    );
  }

  /*
    PAGE UI
  */
  return (
    <div className="max-w-3xl mx-auto p-5 space-y-5">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Fuel className="h-5 w-5 text-blue-600" />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Fuel Management</h1>

            <p className="text-sm text-muted-foreground">
              Configure station fuel availability, limits and pricing.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="secondary">
                {items.length} Fuel{items.length !== 1 && "s"}
              </Badge>

              <Badge
                variant={priceControlMode === "OVERRIDE" ? "default" : "outline"}
              >
                Price Mode: {priceControlMode}
              </Badge>

              {!allowPriceEditing && (
                <Badge
                  variant="outline"
                  className="border-amber-300 text-amber-600"
                >
                  Prices Managed By System
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          className="gap-2 h-9"
          onClick={handleSave}
          disabled={
            updateMutation.isPending ||
            !stationId ||
            !hasChanges ||
            hasInvalidItems
          }
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {updateMutation.isPending
                ? "Saving..."
                : hasChanges
                ? "Save Changes"
                : "Saved"}
            </>
          )}
        </Button>
      </div>

      {/* =========================
          UNSAVED / INVALID WARNINGS
      ========================= */}
      {hasChanges && !hasInvalidItems && (
        <Card className="border-amber-300 bg-amber-50">
          <div className="px-4 py-3 text-sm text-amber-700">
            You have unsaved changes.
          </div>
        </Card>
      )}

      {hasInvalidItems && (
        <Card className="border-red-300 bg-red-50">
          <div className="px-4 py-3 text-sm text-red-700">
            Some fuel entries have invalid values. Fix them before saving.
          </div>
        </Card>
      )}

      {/* =========================
          FUEL CARDS
      ========================= */}
      <div className="space-y-4">
        {items.map((item) => {
          const canEditPrice = allowPriceEditing;
          const invalidRange = item.minRequestLiters > item.maxRequestLiters;
          const exceedsCapacity = item.maxRequestLiters > item.maxCapacity;

          return (
            <Card
              key={item.fuelTypeId}
              className="overflow-hidden border shadow-sm"
            >
              {/* =========================
                  CARD HEADER
              ========================= */}
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Fuel className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.fuelType.name}</h3>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <Badge variant="outline">
                        Capacity {item.maxCapacity.toLocaleString()} L
                      </Badge>
                    </div>
                  </div>
                </div>

                <Switch
                  checked={item.isActive}
                  onCheckedChange={() => toggleFuel(item.fuelTypeId)}
                  aria-label={`Toggle ${item.fuelType.name} availability`}
                />
              </div>

              {/* =========================
                  CARD BODY
              ========================= */}
              <div className="space-y-5 p-5">
                {/* PRICE */}
                <div>
                  <FieldLabel icon={DollarSign} label="Price Per Litre" />

                  <Input
                    className="mt-2"
                    type="number"
                    min={0}
                    step="0.01"
                    value={
                      canEditPrice
                        ? item.price ?? item.fuelType.price
                        : item.fuelType.price
                    }
                    disabled={!canEditPrice}
                    onChange={(e) =>
                      updatePrice(
                        item.fuelTypeId,
                        Number(e.target.value)
                      )
                    }
                  />

                  {!allowPriceEditing && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                      <Lock className="h-3 w-3" />
                      Price controlled by system settings.
                    </p>
                  )}
                </div>

                {/* LIMITS */}
                <div className="grid gap-4 md:grid-cols-2">

                  <div>
                    <FieldLabel icon={ArrowBigDown} label="Minimum Sale (L)" />
                    <Input
                      className="mt-2"
                      type="number"
                      min={0}
                      value={item.minRequestLiters}
                      onChange={(e) =>
                        updateLimitField(
                          item.fuelTypeId,
                          "minRequestLiters",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel icon={ArrowBigUp} label="Maximum Sale (L)" />
                    <Input
                      className="mt-2"
                      type="number"
                      min={0}
                      value={item.maxRequestLiters}
                      onChange={(e) =>
                        updateLimitField(
                          item.fuelTypeId,
                          "maxRequestLiters",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                {invalidRange && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    Maximum sale quantity must be greater than or equal to
                    minimum quantity.
                  </div>
                )}

                {!invalidRange && exceedsCapacity && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    Maximum sale quantity cannot exceed tank capacity.
                  </div>
                )}
              </div>

              {/* =========================
                  CARD FOOTER
              ========================= */}
              <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  {item.isActive
                    ? "Available for transactions"
                    : "Disabled at station level"}
                </div>

                <Badge variant={canEditPrice ? "default" : "outline"}>
                  {canEditPrice ? "Price Editable" : "Locked By System"}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default FuelManagementPage;