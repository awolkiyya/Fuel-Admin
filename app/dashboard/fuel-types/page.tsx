"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Fuel, Plus, Search } from "lucide-react";

import {
  useFuels,
  useCreateFuel,
  useUpdateFuel,
  useUpdateFuelStatus,
} from "@/hooks/fuel/useFuels";

import { DataTablePagination } from "@/components/tables/data-pagination";
import { FuelTypeModal } from "@/components/modals/FuelTypeModal";
import { FuelTypesTable } from "@/components/tables/FuelTypesTable";

import { FuelConfig } from "@/types/commen";
import { toast } from "sonner";
import { formatApiError } from "@/utils/apiError";

export default function FuelTypesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<Partial<FuelConfig>>({
    name: "Petrol",
    price: 0,
    status: "ACTIVE",
  });

  /* ---------------------------------------
     QUERY
  ----------------------------------------*/
  const { data, isLoading } = useFuels({
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const fuels = data?.data || [];
  const meta = data?.meta;

  /* ---------------------------------------
     MUTATIONS
  ----------------------------------------*/
  const createFuel = useCreateFuel();
  const updateFuel = useUpdateFuel();
  const toggleStatusMutation = useUpdateFuelStatus();

  /* ---------------------------------------
     ACTIONS
  ----------------------------------------*/
  const openAdd = () => {
    setEditMode(false);
    setForm({
      name: "Petrol",
      price: 0,
      status: "ACTIVE",
    });
    setOpen(true);
  };

  const openEdit = (fuel: FuelConfig) => {
    setEditMode(true);

    // IMPORTANT: clone to avoid mutation bugs
    setForm({
      id: fuel.id,
      name: fuel.name,
      price: fuel.price,
      status: fuel.status,
    });

    setOpen(true);
  };

  /* ---------------------------------------
     SAVE (CREATE / UPDATE)
  ----------------------------------------*/
  const saveFuel = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      if (editMode && form.id) {
        await updateFuel.mutateAsync({
          id: form.id,
          data: form,
        });

        toast.success("Fuel updated successfully");
      } else {
        await createFuel.mutateAsync(form);

        toast.success("Fuel created successfully");
      }

      setOpen(false);
    } catch (err) {
      toast.error(formatApiError(err).message);
    }
  };

  /* ---------------------------------------
     TOGGLE STATUS
  ----------------------------------------*/
  const toggleStatus = async (fuel: FuelConfig) => {
    await toggleStatusMutation.mutateAsync({
      id: fuel.id,
      status: fuel.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  /* ---------------------------------------
     UI
----------------------------------------*/
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Fuel className="w-5 h-5 text-orange-500" />
            Fuel Types & Pricing
          </h1>
          <p className="text-sm text-muted-foreground">
            System-controlled fuel definitions
          </p>
        </div>

        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Fuel
        </Button>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-2 flex flex-wrap gap-3 items-center">

          {/* SEARCH */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fuel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* STATUS FILTER */}
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <FuelTypesTable
        data={fuels}
        isLoading={isLoading}
        hasFilters={search.length > 0 || statusFilter !== "all"}
        onEdit={openEdit}
        onToggleStatus={toggleStatus}
        onAdd={openAdd}
      />

      {/* PAGINATION */}
      <DataTablePagination
        page={meta?.page || 1}
        pageSize={meta?.limit || 10}
        total={meta?.total || 0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      {/* MODAL */}
      <FuelTypeModal
        open={open}
        setOpen={setOpen}
        editMode={editMode}
        form={form as any}
        setForm={setForm as any}
        onSave={saveFuel}
        isLoading={
          createFuel.isPending || updateFuel.isPending
        }
      />

    </div>
  );
}