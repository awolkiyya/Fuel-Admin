"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Fuel, Plus, SearchX } from "lucide-react";

import {
  useAdjustTank,
  useCreateTank,
  useRefillTank,
  useStationFuelTypes,
} from "@/hooks/tank/useTanks";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";

import AddTankDialog from "@/components/modals/AddTankDialog";
import RefillTankDialog from "@/components/modals/RefillTankDialog";
import AdjustTankDialog from "@/components/modals/AdjustTankDialog";
import { AdjustmentType } from "@/types/tank";

/* ---------------- EMPTY STATE ---------------- */
function EmptyState({
  type = "empty",
  onAction,
}: {
  type?: "empty" | "search";
  onAction?: () => void;
}) {
  const isSearch = type === "search";

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-14 text-center space-y-4">
        <div className="p-3 rounded-full bg-muted">
          {isSearch ? (
            <SearchX className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Fuel className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold">
            {isSearch ? "No matching tanks found" : "No fuel tanks available"}
          </h3>

          <p className="text-sm text-muted-foreground max-w-sm">
            {isSearch
              ? "Try adjusting your search or filters."
              : "Create your first fuel tank to start managing station storage."}
          </p>
        </div>

        {!isSearch && onAction && (
          <Button onClick={onAction}>
            <Plus className="w-4 h-4 mr-2" />
            Create Tank
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- SKELETON ---------------- */
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 p-3 border rounded-md">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function TanksPage() {
  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  );

  const { data, isLoading } = useStationFuelTypes(stationId || "");

  const createTank = useCreateTank(stationId || "");
  const refillTank = useRefillTank(stationId || "");
  const adjustTank = useAdjustTank(stationId || "");

  /* ---------------- UI STATE ---------------- */
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const [refillTankId, setRefillTankId] = useState<string | null>(null);
  const [adjustTankId, setAdjustTankId] = useState<string | null>(null);

  const [refillLiters, setRefillLiters] = useState(0);

  const [adjustLevel, setAdjustLevel] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustType, setAdjustType] = useState<AdjustmentType>("MANUAL_FIX");

  const [newTank, setNewTank] = useState({
    stationFuelTypeId: "",
    name: "",
    capacity: 0,
  });

  /* ---------------- DATA ---------------- */
  const tanks = useMemo(() => {
    if (!data) return [];

    return data.data!.flatMap((fuel) =>
      fuel.tanks.map((t) => ({
        ...t,
        fuelType: fuel.fuelType.name,
      }))
    );
  }, [data]);

  const filtered = useMemo(() => {
    return tanks.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tanks, search]);

  /* ---------------- KPI ---------------- */
  const summary = useMemo(() => {
    const totalCapacity = filtered.reduce((a, b) => a + b.capacity, 0);
    const totalCurrent = filtered.reduce((a, b) => a + b.currentLevel, 0);

    return {
      totalCapacity,
      totalCurrent,
      utilization:
        totalCapacity > 0
          ? Math.round((totalCurrent / totalCapacity) * 100)
          : 0,
    };
  }, [filtered]);

  /* ---------------- ACTIONS ---------------- */
  const handleRefill = () => {
    if (!stationId || !refillTankId || refillLiters <= 0) return;

    refillTank.mutate({
      stationId,
      tankId: refillTankId,
      amount: refillLiters,
    });

    setRefillTankId(null);
    setRefillLiters(0);
  };

  const handleAdjust = () => {
    if (!stationId || !adjustTankId) return;
    if (!adjustReason.trim() || !adjustType) return;

    adjustTank.mutate({
      stationId,
      tankId: adjustTankId,
      newLevel: adjustLevel,
      reason: adjustReason,
      adjustmentType: adjustType,
    });

    setAdjustTankId(null);
    setAdjustLevel(0);
    setAdjustReason("");
    setAdjustType("MANUAL_FIX");
  };

  const handleSubmit = () => {
    if (!newTank.stationFuelTypeId || !newTank.name || newTank.capacity <= 0)
      return;

    createTank.mutate(newTank, {
      onSuccess: () => {
        setOpenAdd(false);
        setNewTank({
          stationFuelTypeId: "",
          name: "",
          capacity: 0,
        });
      },
    });
  };

  const hasNoData = !isLoading && tanks.length === 0;
  const hasNoSearchResults =
    !isLoading && tanks.length > 0 && filtered.length === 0;

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold flex gap-2 items-center">
            <Fuel className="w-5 h-5" />
            Fuel Tanks
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage station fuel storage & allocation
          </p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tank
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalCapacity} L</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Stock</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalCurrent} L</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Utilization</CardTitle>
          </CardHeader>
          <CardContent>{summary.utilization}%</CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search tanks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : hasNoData ? (
        <EmptyState onAction={() => setOpenAdd(true)} />
      ) : hasNoSearchResults ? (
        <EmptyState type="search" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Tank</th>
                <th className="p-3">Fuel</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Current</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((tank, i) => (
                <tr key={tank.id} className="border-t">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{tank.name}</td>
                  <td className="p-3">
                    <Badge>{tank.fuelType}</Badge>
                  </td>
                  <td className="p-3">{tank.capacity} L</td>
                  <td className="p-3">{tank.currentLevel} L</td>

                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setRefillTankId(tank.id);
                            setRefillLiters(0);
                          }}
                        >
                          Refill
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setAdjustTankId(tank.id);
                            setAdjustLevel(tank.currentLevel);
                            setAdjustReason("");
                            setAdjustType("MANUAL_FIX");
                          }}
                        >
                          Adjust Level
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DIALOGS */}

      <RefillTankDialog
        open={!!refillTankId}
        onOpenChange={(open) => {
          if (!open) setRefillTankId(null);
        }}
        liters={refillLiters}
        onLitersChange={setRefillLiters}
        onSubmit={handleRefill}
        isPending={refillTank.isPending}
      />

      <AdjustTankDialog
        open={!!adjustTankId}
        onOpenChange={(open) => {
          if (!open) setAdjustTankId(null);
        }}
        currentLevel={adjustLevel}
        onLevelChange={setAdjustLevel}
        reason={adjustReason}
        onReasonChange={setAdjustReason}
        adjustmentType={adjustType}
        onTypeChange={setAdjustType}
        onSubmit={handleAdjust}
        isPending={adjustTank.isPending}
      />

      <AddTankDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        data={data}
        newTank={newTank}
        setNewTank={setNewTank}
        createTank={createTank}
        onSubmit={handleSubmit}
      />
    </div>
  );
}