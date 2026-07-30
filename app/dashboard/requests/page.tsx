"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Car,
  Eye,
  CheckCircle,
  XCircle,
  Fuel,
  Search,
  Droplets,
  FileX,
  MoreVertical,

} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FuelTypeDropdown } from "@/components/inputs/FuelTypeDropdown";
import { VehicleTypeDropdown } from "@/components/inputs/VehicleTypeDropdown";
import { VehicleType } from "@/types/vehicle";
import { useFuelRequests, useRejectFuelRequest, useVerifyFuelRequest } from "@/hooks/station/operation.hook";
import { FuelRequest } from "@/types/fuel-reques";
import { DataTablePagination } from "@/components/tables/data-pagination";
import { RejectFuelRequestDialog } from "@/components/modals/RejectFuelRequestDialog";
import { toast } from "sonner";
import { RequestDrawer } from "@/components/modals/RequestDrawer";


/* ─────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────── */
type Status = "PENDING" | "APPROVED" | "REJECTED";
type FuelType = "PETROL" | "DIESEL";



function EmptyQueue({ fuel }: { fuel: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <FileX className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No {fuel.toLowerCase()} requests</p>
      <p className="text-xs text-muted-foreground max-w-xs">All {fuel.toLowerCase()} requests have been processed or none match your current filters.</p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ET", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function VerificationBadge({ isVerified }: { isVerified: boolean }) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <XCircle className="w-3.5 h-3.5" />
      Unverified
    </span>
  );
}

/* ─────────────────────────────────────────────────
   REQUEST CARD (UPDATED)
───────────────────────────────────────────────── */
function RequestCard({
  req,
  index,
  onView,
  onApprove,
  onReject,
}: {
  req: FuelRequest;
  index: number;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const canStart = req.vehicle.isVerified;

  return (
    <Card
      className={cn(
        "group border-l-4 rounded-md overflow-hidden transition-all duration-200 hover:shadow-md "
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 py-4 gap-4">

          {/* ───────── LEFT: MAIN INFO ───────── */}
          <div className="flex items-start gap-3 min-w-0 flex-1">

            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Car className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Core Info */}
            <div className="min-w-0 flex-1">

              {/* Top row */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm tracking-wide text-foreground">
                  {req.vehicle.plateNumber}
                </h3>

                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {req.fuelType.name}
                </span>
              </div>

              {/* Middle row */}
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <Droplets className="w-3.5 h-3.5" />
                  {req.requested} L
                </div>

                <span>{formatDate(req.createdAt)}</span>
              </div>

              {/* Verification */}
              <div className="mt-2">
                <VerificationBadge isVerified={req.vehicle.isVerified} />
              </div>
            </div>
          </div>

          {/* ───────── RIGHT: ACTIONS ───────── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* View */}
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9"
              onClick={onView}
            >
              <Eye className="w-4 h-4" />
            </Button>

            {/* Primary Action */}
            {canStart && (
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Start Now
              </Button>
            )}

            {/* More actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={onReject}
                  className="text-red-600 focus:text-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
/* ─────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────── */
export default function FuelRequestsPage() {
  const [requests, setRequests] = useState<FuelRequest[]>([]);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "ALL">("ALL");
  const [fuelFilter, setFuelFilter] = useState<FuelType | "ALL">("ALL");

  const [selected, setSelected] = useState<FuelRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<FuelRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [page,setPage]  = useState(1);
  const [pageSize,setPageSize]  = useState(10);

  const [rejectionReasonId, setRejectionReasonId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [loading, setLoading] = useState(false);


  // manage hook here
  const {data,isLoading,isError} = useFuelRequests({
    page: page,
    limit: pageSize,
    search: "",
    vehicleType: "",
    fuelType: "",
    status: "PENDING",
  });

  const verifyMutation = useVerifyFuelRequest();
  const rejectMutation = useRejectFuelRequest();



  const handleReject = async () => {
    if (!rejectTarget || !rejectionReasonId) return;
  
    setLoading(true);
  
    try {
      
      rejectMutation.mutate({
        id:rejectTarget.id,
        rejectionReasonId: rejectionReasonId,
        rejectionNote: rejectNote,
      });
      setRejectTarget(null);
      setRejectionReasonId(null);
      setRejectNote("");
    } finally {
      setLoading(false);
    }
  };


  // summary 
  const summary = data?.summary;
  const fuelRequests = data?.data||[];

  /* ── helpers ── */
  const updateStatus = (id: string, status: Status) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));


  return (
    <div className="max-w-4xl mx-auto  sm:p-6 space-y-5">

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/60 px-5 py-4">

      {/* Left — icon + title */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-amber-100 dark:bg-amber-900/60">
          <Fuel className="h-[18px] w-[18px] text-amber-700 dark:text-amber-300" />
        </div>
        <div>
          <p className="flex items-center text-sm font-medium text-amber-900 dark:text-amber-100">
            Live fuel queue
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-200 dark:bg-amber-800/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-amber-800 dark:text-amber-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600 dark:bg-amber-400" />
              Live
            </span>
          </p>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            Review and action pending fuel requests
          </p>
        </div>
      </div>

      {/* Right — stat cards */}
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="flex flex-1 sm:flex-none sm:min-w-[64px] flex-col items-center rounded-lg border border-amber-200 dark:border-amber-800/60 bg-white/70 dark:bg-amber-950/40 px-4 py-2">
          <span className="text-lg font-medium tabular-nums text-amber-900 dark:text-amber-100">
            {summary?.pendingCount||0}
          </span>
          <span className="mt-0.5 text-[10px] tracking-wide text-amber-700 dark:text-amber-400">
            Pending
          </span>
        </div>
        <div className="h-8 w-px bg-amber-200 dark:bg-amber-800" />
        <div className="flex flex-1 sm:flex-none sm:min-w-[64px] flex-col items-center rounded-lg border border-amber-200 dark:border-amber-800/60 bg-white/70 dark:bg-amber-950/40 px-4 py-2">
          <span className="text-lg font-medium tabular-nums text-amber-900 dark:text-amber-100">
            {summary?.totalRequestedLiters||0} L
          </span>
          <span className="mt-0.5 text-[10px] tracking-wide text-amber-700 dark:text-amber-400">
            Total
          </span>
        </div>
      </div>

      </div>

      <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center">

      {/* SEARCH (fluid, takes available space) */}
      <div className="relative w-full sm:flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />

        <Input
          placeholder="Search plate, driver, model…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11 text-sm w-full"
        />
      </div>

      {/* FILTERS (fixed but responsive width) */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

        <div className="w-full sm:w-[180px]">
          <FuelTypeDropdown
            value={null}
            onChange={(value, item) => {}}
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <VehicleTypeDropdown
            value={null}
            onChange={(value, item) => {}}
          />
        </div>
      </div>

      {/* CLEAR BUTTON */}
      {(search || vehicleFilter !== "ALL" || fuelFilter !== "ALL") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            setVehicleFilter("ALL");
            setFuelFilter("ALL");
          }}
          className="
            h-11
            w-full sm:w-auto
            sm:flex-shrink-0
            text-xs text-muted-foreground
          "
        >
          Clear
        </Button>
      )}
      </div>

      {/* ════════════════════════════════
          QUEUE
      ════════════════════════════════ */}
      <div className="space-y-2.5">
        {fuelRequests.length === 0 ? (
          <EmptyQueue fuel={fuelFilter === "ALL" ? "fuel" : fuelFilter} />
        ) : (
          fuelRequests.map((req, i) => (
            <RequestCard
              key={req.id}
              req={req}
              index={i}
              onView={() => setSelected(req)}
              onApprove={() => updateStatus(req.id, "APPROVED")}
              onReject={() => { setRejectTarget(req); setSelected(null); }}
            />
          ))
        )}
      </div>

      {/* ════════════════════════════════
          DETAIL SHEET
      ════════════════════════════════ */}
     {selected &&(
       <RequestDrawer
       request={selected}
       onClose={() => setSelected(null)}
       onVerify={() => {
        verifyMutation.mutate(selected.id);
       }}
       onReject={() => {
        
        setRejectTarget(selected);
        setSelected(null); }}

     />
     )}

      <DataTablePagination
         page={page}
         pageSize={pageSize}
         total={data?.meta?.total||0}
         onPageChange={(page)=>{
             setPage(page);
         } }
         onPageSizeChange={(size)=>{
              setPageSize(size);
              setPage(1)
         } }
      />

      <RejectFuelRequestDialog
        open={!!rejectTarget}
        onClose={() => {
          setRejectTarget(null);
          setRejectionReasonId(null);
          setRejectNote("");
        }}
        rejectTarget={rejectTarget}
        rejectionReasonId={rejectionReasonId}
        setRejectionReasonId={setRejectionReasonId}
        rejectNote={rejectNote}
        setRejectNote={setRejectNote}
        loading={loading}
        onConfirm={handleReject}
      />
    </div>
  );
}