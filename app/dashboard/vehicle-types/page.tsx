"use client";

import { useState, useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Car, Plus } from "lucide-react";

import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useToggleVehicleStatus,
} from "@/hooks/vehicle/useVehicles";

import { DataTablePagination } from "@/components/tables/data-pagination";
import { VehicleTypesTable } from "@/components/tables/VehicleTypesTable";

import {
  VehicleTypeModal,
  VehicleTypeForm,
} from "@/components/modals/VehicleTypeModal";

import { useFuels } from "@/hooks/fuel/useFuels";
import { VehicleType } from "@/types/vehicle";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



export default function VehicleTypesPage() {

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
  useState<VehicleType | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  /* ---------------- UPDATED EMPTY FORM ---------------- */
  const emptyForm: VehicleTypeForm = {
    name: "",
    fuelTypes: [],

    // ================= RULE SYSTEM =================
    maxLitersPerHour: 0,
    minRefillIntervalMinutes: 60,
    maxRefillsPerDay: 0,

    description: "",
    status: "ACTIVE",
    requiresBusinessLicense: false,
    code: 1
  };

  const [form, setForm] = useState<VehicleTypeForm>(emptyForm);

  /* ---------------- VEHICLES ---------------- */
  const { data, isLoading } = useVehicles({
    page: 1,
    limit: 50,
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const vehicles = data?.data || [];

  const openView = (v: VehicleType) => {
    setSelectedVehicle(v);
    setViewOpen(true);
  };


  

  /* ---------------- FUEL TYPES ---------------- */
  const { data: fuelData, isLoading: fuelLoading } = useFuels({
    status: "ACTIVE",
    page: 1,
    limit: 100,
  });

  const fuelOptions = useMemo(() => {
    return (
      fuelData?.data?.map((f: any) => ({
        id: f.id,
        label: f.name,
      })) || []
    );
  }, [fuelData]);

  /* ---------------- MUTATIONS ---------------- */
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const toggleMutation = useToggleVehicleStatus();

  /* ---------------- ACTIONS ---------------- */
  const openAdd = () => {
    setEditMode(false);
    setForm(emptyForm); // reset clean
    setOpen(true);
  };

  const openEdit = (v: VehicleType) => {
    setEditMode(true);
  
    setForm({
      id: v.id,
      name: v.name,
    
      // ================= FUEL TYPES =================
      fuelTypes: v.fuelTypes.map((f) => f.id),
    
      // ================= PLATE CONFIG =================
      code: v.code,
    
      // ================= BUSINESS RULE =================
      requiresBusinessLicense:v.requiresBusinessLicense??false,
    
      // ================= LIMIT RULES =================
      maxLitersPerHour: v.maxLitersPerHour ?? 0,
      minRefillIntervalMinutes: v.minRefillIntervalMinutes ?? 60,
      maxRefillsPerDay: v.maxRefillsPerDay ?? undefined,
      maxDailyLiters: v.maxDailyLiters ?? undefined,
    
      // ================= META =================
      description: v.description || "",
      status: v.status,
    });
  
    setOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    const isValid =
      form.name.trim().length > 0 &&
      form.fuelTypes.length > 0 &&
      form.maxLitersPerHour > 0 &&
      form.minRefillIntervalMinutes > 0;

    if (!isValid) return;

    if (editMode && form.id) {
      await updateMutation.mutateAsync({
        id: form.id,
        data: form,
      });
    } else {
      await createMutation.mutateAsync(form);
    }

    setOpen(false);
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleStatus = async (vehicleType: VehicleType) => {
    await toggleMutation.mutateAsync({
      id: vehicleType.id,
      status:
        vehicleType.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Car className="w-5 h-5 text-orange-500" />
            Vehicle Types
          </h1>
          <p className="text-sm text-muted-foreground">
            Define fuel rules and vehicle behavior
          </p>
        </div>

        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* FILTER */}
      <Card>
        <CardContent className="p-4 flex gap-3">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as any)
            }
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </CardContent>
      </Card>

      {/* TABLE */}
      <VehicleTypesTable
      data={vehicles}
      isLoading={isLoading}
      hasFilters={!!search || statusFilter !== "all"}
      onEdit={openEdit}
      onToggleStatus={toggleStatus}
      onView={openView}
    />

      {/* PAGINATION */}
      <DataTablePagination
        page={1}
        pageSize={10}
        total={data?.meta?.total || 0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      {/* MODAL */}
      <VehicleTypeModal
        open={open}
        setOpen={setOpen}
        editMode={editMode}
        form={form}
        setForm={setForm}
        fuelOptions={fuelOptions}
        fuelLoading={fuelLoading}
        onSave={save}
        isLoading={
          createMutation.isPending || updateMutation.isPending
        }
      />

<Dialog open={viewOpen} onOpenChange={setViewOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Vehicle Type Details</DialogTitle>
    </DialogHeader>

    {selectedVehicle && (
      <div className="space-y-6 text-sm">
        {/* ================= BASIC INFO GRID ================= */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Vehicle Name" value={selectedVehicle.name} />
          <InfoItem label="Plate Code Type" value={selectedVehicle.code} />
          <InfoItem label="Status" value={selectedVehicle.status} />

          <InfoItem
            label="Business License"
            value={
              selectedVehicle.requiresBusinessLicense
                ? "Required"
                : "Not required"
            }
          />

          <InfoItem
            label="Max L/hr Used"
            value={selectedVehicle.maxLitersPerHour}
          />

          <InfoItem
            label="Refill Interval"
            value={`${selectedVehicle.minRefillIntervalMinutes} min`}
          />

          <InfoItem
            label="Max Refills"
            value={selectedVehicle.maxRefillsPerDay ?? "—"}
          />

          <InfoItem
            label="Max Daily Use"
            value={selectedVehicle.maxDailyLiters ?? "—"}
          />
        </div>

        {/* ================= FUEL TYPES ================= */}
        <Section title="Fuel Types">
          <div className="flex flex-wrap gap-1">
            {selectedVehicle.fuelTypes.length > 0 ? (
              selectedVehicle.fuelTypes.map((f) => (
                <span
                  key={f.id}
                  className="px-2 py-1 text-xs rounded-md bg-muted"
                >
                  {f.name}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">
                No fuel types assigned
              </span>
            )}
          </div>
        </Section>

        {/* ================= DESCRIPTION ================= */}
        {selectedVehicle.description && (
          <Section title="Description">
            <p className="text-muted-foreground leading-relaxed">
              {selectedVehicle.description}
            </p>
          </Section>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>

    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}