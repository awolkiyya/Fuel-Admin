"use client";

import React, { useMemo, useState } from "react";

import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Fuel,
  Info,
  ShieldCheck,
  ShieldAlert,
  UserRound,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock3,
  Minus,
  Plus,
  RotateCcw,
  Receipt,
  PauseCircle,
  Ban,
  Search,
  Copy,
  Check,
  Printer,
  Gauge,
  Wallet,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

import { OrganizationDropdown } from "@/components/inputs/OrganizationDropdown";
import { FuelTypeDropdown } from "@/components/inputs/FuelTypeDropdown";

import type { FuelConfig } from "@/types/commen";

import type {
  CreateOrganizationTransactionPayload,
  Transaction,
} from "@/types/transaction.types";

import { useCreateOrganizationTransaction } from "@/hooks/transaction/createOrganizationTransaction..hook";
import { OrgStatus, OrgType } from "@/types/organization.types";

// =====================================================
// TYPES
// =====================================================




type DropdownOrganization = {
  id: string;
  name: string;
  type: OrgType;
  status: OrgStatus;
  registrationNumber?: string | null;
  contactPerson?: string | null;
  phone?: string | null;

  email?: string | null;

  address?: string | null;
  // Optional fueling information if returned
  // directly by OrganizationDropdown.
  allowFuelAccess?: boolean;
  maxTransactionLiters?: number;
  quotaEnabled?: boolean;
  quota?: Quota[];
  recentTransactions?: RecentTransaction[];
};

type Quota = {
  fuelTypeId: string;
  allocatedLiters: number;
  consumedLiters: number;
  remainingLiters: number;
  utilizationPercentage: number;
  period: string;
  expiresAt: string;
};

type RecentTransaction = {
  id: string;
  fuelType: string;
  liters: number;
  date: string;
  status: "COMPLETED" | "PENDING";
};

type FuelingOrganization = DropdownOrganization & {
  allowFuelAccess: boolean;
  maxTransactionLiters: number;
  quotaEnabled: boolean;
  quota: Quota[];
  recentTransactions: RecentTransaction[];
};

type StepId =
  | "org"
  | "fuel"
  | "confirm"
  | "success";

type FuelReceipt = {
  id: string;
  orgName: string;
  fuelName: string;
  liters: number;
  unitPrice: number;
  total: number;
  paymentStatus: string;
  time: string;
};


// =====================================================
// HELPERS
// =====================================================

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getOrganizationTypeLabel(type: OrgType) {
  switch (type) {
    case "GOVERNMENT":
      return "Government";

    case "PRIVATE":
      return "Private";

    case "NGO":
      return "NGO";

    case "PUBLIC_ENTERPRISE":
      return "Public Enterprise";

    default:
      return "Other";
  }
}

function getStatusMeta(status: OrgStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        icon: CheckCircle2,
        badgeClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "SUSPENDED":
      return {
        label: "Suspended",
        icon: Ban,
        badgeClass:
          "border-red-200 bg-red-50 text-red-700",
      };

    case "INACTIVE":
    default:
      return {
        label: "Inactive",
        icon: PauseCircle,
        badgeClass:
          "border-slate-200 bg-slate-100 text-slate-600",
      };
  }
}

function getFuelPrice(
  fuel: FuelConfig | null,
) {
  if (!fuel) {
    return 0;
  }

  const fuelRecord = fuel as FuelConfig & {
    pricePerLiter?: number;
    price?: number;
    unitPrice?: number;
    currentPrice?: number;
  };

  return (
    fuelRecord.pricePerLiter ??
    fuelRecord.price ??
    fuelRecord.unitPrice ??
    fuelRecord.currentPrice ??
    0
  );
}


// =====================================================
// FUEL STYLE
// =====================================================

function getFuelStyle(
  fuel: FuelConfig | null,
) {
  const value =
    (fuel?.name || "").toLowerCase();

  if (value.includes("diesel")) {
    return {
      border: "border-slate-500",
      bgSoft: "bg-slate-50",
      dot: "bg-slate-500",
      text: "text-slate-600",
    };
  }

  if (
    value.includes("benzene") ||
    value.includes("gasoline") ||
    value.includes("petrol")
  ) {
    return {
      border: "border-emerald-500",
      bgSoft: "bg-emerald-50",
      dot: "bg-emerald-500",
      text: "text-emerald-600",
    };
  }

  if (value.includes("kerosene")) {
    return {
      border: "border-sky-500",
      bgSoft: "bg-sky-50",
      dot: "bg-sky-500",
      text: "text-sky-600",
    };
  }

  return {
    border: "border-primary",
    bgSoft: "bg-primary/5",
    dot: "bg-primary",
    text: "text-primary",
  };
}

function getQuotaBarTone(
  pct: number,
) {
  if (pct >= 90) {
    return "[&>div]:bg-red-500";
  }

  if (pct >= 70) {
    return "[&>div]:bg-amber-500";
  }

  return "[&>div]:bg-emerald-500";
}


// =====================================================
// STEPS
// =====================================================

const STEPS: {
  id: StepId;
  label: string;
}[] = [
  {
    id: "org",
    label: "Organization",
  },
  {
    id: "fuel",
    label: "Fuel & Quantity",
  },
  {
    id: "confirm",
    label: "Confirm",
  },
];


// =====================================================
// PAGE
// =====================================================

export default function OrganizationFuelingPage() {
  // ===================================================
  // STATE
  // ===================================================

  const [step, setStep] =
    useState<StepId>("org");

  const [selectedOrg, setSelectedOrg] =
    useState<FuelingOrganization | null>(
      null,
    );

  const [selectedFuel, setSelectedFuel] =
    useState<FuelConfig | null>(null);

  const [liters, setLiters] =
    useState("");

  const [showHistory, setShowHistory] =
    useState(false);

  const [receipt, setReceipt] =
    useState<FuelReceipt | null>(null);

  const [copied, setCopied] =
    useState(false);


  // ===================================================
  // MUTATION
  // ===================================================

  const createTransactionMutation =
    useCreateOrganizationTransaction();

  const isSubmitting =
    createTransactionMutation.isPending;


  // ===================================================
  // DERIVED VALUES
  // ===================================================

  const selectedFuelId =
    selectedFuel?.id ?? null;

  const selectedQuota =
    selectedOrg?.quota?.find(
      (quota) =>
        quota.fuelTypeId ===
        selectedFuelId,
    );

  const requestedLiters =
    Number(liters) || 0;

  const unitPrice =
    getFuelPrice(selectedFuel);

  /*
   * Frontend preview only.
   *
   * The final amount must come from
   * the backend transaction response.
   */
  const transactionAmount =
    requestedLiters * unitPrice;


  // ===================================================
  // ACCESS
  // ===================================================

  const accessDenied =
    !!selectedOrg &&
    (
      selectedOrg.status !== "ACTIVE" ||
      !selectedOrg.allowFuelAccess
    );


  // ===================================================
  // QUOTA
  // ===================================================

  const quotaExceeded =
    !!selectedOrg?.quotaEnabled &&
    (
      !selectedQuota ||
      requestedLiters >
        selectedQuota.remainingLiters
    );


  // ===================================================
  // TRANSACTION LIMIT
  // ===================================================

  const transactionLimitExceeded =
    !!selectedOrg &&
    requestedLiters >
      selectedOrg.maxTransactionLiters;


  // ===================================================
  // MAX ALLOWED
  // ===================================================

  const maxAllowed = useMemo(() => {
    if (!selectedOrg) {
      return 0;
    }

    let max =
      selectedOrg.maxTransactionLiters;

    if (selectedOrg.quotaEnabled) {
      max = Math.min(
        max,
        selectedQuota
          ? selectedQuota.remainingLiters
          : 0,
      );
    }

    return Math.max(
      0,
      Math.floor(max),
    );
  }, [
    selectedOrg,
    selectedQuota,
  ]);


  // ===================================================
  // QUICK PRESETS
  // ===================================================

  const presets = useMemo(() => {
    const base = [
      100,
      200,
      500,
    ].filter(
      (value) =>
        value > 0 &&
        value < maxAllowed,
    );

    const values = [
      ...base,
    ];

    if (maxAllowed > 0) {
      values.push(maxAllowed);
    }

    return Array.from(
      new Set(values),
    ).sort(
      (a, b) => a - b,
    );
  }, [
    maxAllowed,
  ]);


  // ===================================================
  // CAN FUEL
  // ===================================================

  const canFuel =
    !!selectedOrg &&
    !!selectedFuel &&
    !accessDenied &&
    requestedLiters > 0 &&
    requestedLiters <= maxAllowed &&
    !transactionLimitExceeded &&
    (
      !selectedOrg.quotaEnabled ||
      !quotaExceeded
    );


  // ===================================================
  // BLOCKING REASON
  // ===================================================

  const blockingReason =
    useMemo(() => {
      if (step === "org") {
        if (!selectedOrg) {
          return "Select an organization to continue.";
        }

        if (accessDenied) {
          return "This organization cannot be fueled right now.";
        }

        return null;
      }

      if (step === "fuel") {
        if (!selectedFuel) {
          return "Select a fuel type to continue.";
        }

        if (requestedLiters <= 0) {
          return "Enter a quantity greater than zero.";
        }

        if (transactionLimitExceeded) {
          return `Quantity exceeds the ${formatNumber(
            selectedOrg?.maxTransactionLiters ??
              0,
          )} L transaction limit.`;
        }

        if (
          selectedOrg?.quotaEnabled &&
          quotaExceeded
        ) {
          if (!selectedQuota) {
            return "This fuel type has no active quota.";
          }

          return `Quantity exceeds the remaining quota of ${formatNumber(
            selectedQuota.remainingLiters,
          )} L.`;
        }

        return null;
      }

      if (step === "confirm") {
        if (!canFuel) {
          return "The transaction is not valid for submission.";
        }

        return null;
      }

      return null;
    }, [
      step,
      selectedOrg,
      selectedFuel,
      requestedLiters,
      accessDenied,
      transactionLimitExceeded,
      quotaExceeded,
      selectedQuota,
      canFuel,
    ]);


  // ===================================================
  // STEPPER
  // ===================================================

  const stepIndex =
    STEPS.findIndex(
      (currentStep) =>
        currentStep.id === step,
    );


  // ===================================================
  // FUEL STYLE
  // ===================================================

  const fuelStyle =
    getFuelStyle(selectedFuel);


  // ===================================================
  // ORGANIZATION
  // ===================================================

  const handleSelectOrganization = (
    _value: string,
    organization: DropdownOrganization,
  ) => {
    const fuelingOrganization:
      FuelingOrganization = {
      ...organization,

      /*
       * Prefer values supplied by the API.
       * Fall back to safe defaults until the
       * organization endpoint exposes them.
       */
      allowFuelAccess:
        organization.allowFuelAccess ??
        true,

      maxTransactionLiters:
        organization.maxTransactionLiters ??
        5000,

      quotaEnabled:
        organization.quotaEnabled ??
        false,

      quota:
        organization.quota ??
        [],

      recentTransactions:
        organization.recentTransactions ??
        [],
    };

    setSelectedOrg(
      fuelingOrganization,
    );

    setSelectedFuel(null);
    setLiters("");
    setShowHistory(false);
    setReceipt(null);
    setCopied(false);

    createTransactionMutation.reset();

    setStep("org");
  };


  const handleClearOrganization =
    () => {
      setSelectedOrg(null);
      setSelectedFuel(null);
      setLiters("");
      setShowHistory(false);
      setReceipt(null);
      setCopied(false);

      createTransactionMutation.reset();

      setStep("org");
    };


  // ===================================================
  // FUEL
  // ===================================================

  const handleSelectFuel = (
    _value: string,
    fuel: FuelConfig,
  ) => {
    setSelectedFuel(fuel);
    setLiters("");
    createTransactionMutation.reset();
  };


  const handleClearFuel = () => {
    setSelectedFuel(null);
    setLiters("");

    createTransactionMutation.reset();
  };


  // ===================================================
  // LITERS
  // ===================================================

  const handleAdjustLiters = (
    delta: number,
  ) => {
    if (!selectedFuel) {
      return;
    }

    setLiters((previous) => {
      const current =
        Number(previous) || 0;

      const next =
        Math.max(
          0,
          current + delta,
        );

      /*
       * Do not allow quick adjustment
       * to exceed the maximum.
       */
      const bounded =
        maxAllowed > 0
          ? Math.min(
              next,
              maxAllowed,
            )
          : next;

      return String(bounded);
    });
  };


  // ===================================================
  // CREATE TRANSACTION
  // ===================================================

  const handleConfirmDispense =
    async () => {
      if (
        !canFuel ||
        !selectedOrg ||
        !selectedFuel
      ) {
        return;
      }

      try {
        /*
         * IMPORTANT:
         *
         * The frontend does NOT decide the
         * final transaction amount.
         *
         * Backend validates:
         * - organization
         * - station
         * - fuel type
         * - quantity
         * - quota
         * - price
         * - total
         * - payment
         */
        const payload:
          CreateOrganizationTransactionPayload =
          {
            type: "ORGANIZATION",

            organizationId:
              selectedOrg.id,

            /*
             * Keep this according to your
             * station context.
             *
             * If your hook automatically adds
             * the authenticated station, remove
             * stationId from the payload type/API.
             */
            stationId: "",

            fuelTypeId:
              selectedFuel.id,

            litersGiven:
              requestedLiters,

            /*
             * This is intentionally consistent
             * with the confirmation UI.
             */
            paymentStatus: "PAID",
          };

        const response =
          await createTransactionMutation
            .mutateAsync(payload);

        /*
         * Safely extract the transaction.
         *
         * This avoids:
         *
         * "transaction is possibly undefined"
         */
        const transaction:
          | Transaction
          | undefined =
          response?.data;

        if (!transaction) {
          throw new Error(
            "Transaction was not returned by the server.",
          );
        }

        /*
         * Server values are authoritative.
         */
        setReceipt({
          id: transaction.id,

          orgName:
            selectedOrg.name,

          fuelName:
            selectedFuel.name,

          liters:
            transaction.litersGiven,

          unitPrice:
            transaction.pricePerLiter,

          total:
            transaction.totalCost,

          paymentStatus:
            transaction.paymentStatus,

          time:
            new Date(
              transaction.createdAt,
            ).toLocaleString(),
        });

        setCopied(false);

        setStep("success");
      } catch (error) {
        console.error(
          "Organization fuel transaction failed:",
          error,
        );
      }
    };


  // ===================================================
  // START NEW TRANSACTION
  // ===================================================

  const handleStartNewTransaction =
    () => {
      setReceipt(null);
      setSelectedOrg(null);
      setSelectedFuel(null);
      setLiters("");
      setShowHistory(false);
      setCopied(false);

      createTransactionMutation.reset();

      setStep("org");
    };


  // ===================================================
  // COPY RECEIPT ID
  // ===================================================

  const handleCopyReceiptId =
    async () => {
      if (!receipt) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          receipt.id,
        );

        setCopied(true);

        window.setTimeout(
          () => setCopied(false),
          1800,
        );
      } catch {
        // Clipboard unavailable.
      }
    };


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Fuel className="h-3.5 w-3.5" />

              <span>
                Fuel Dispenser
              </span>

              <ChevronRight className="h-3.5 w-3.5" />

              <span className="text-foreground">
                Organization Fueling
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Organization Fueling
            </h1>

            <p className="mt-0.5 text-sm text-muted-foreground">
              Dispense fuel to a registered organization and track it against their quota.
            </p>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Station Online
          </Badge>
        </div>


        {/* ================================================= */}
        {/* STEPPER */}
        {/* ================================================= */}

        {step !== "success" && (
          <ol
            className="relative z-10 mb-6 flex items-center gap-2"
            aria-label="Progress"
          >
            {STEPS.map(
              (
                currentStep,
                index,
              ) => {
                const isDone =
                  index < stepIndex;

                const isCurrent =
                  index === stepIndex;

                return (
                  <React.Fragment
                    key={
                      currentStep.id
                    }
                  >
                    <li>
                      <button
                        type="button"
                        disabled={
                          index >
                          stepIndex
                        }
                        aria-current={
                          isCurrent
                            ? "step"
                            : undefined
                        }
                        onClick={() =>
                          index <
                            stepIndex &&
                          setStep(
                            currentStep.id,
                          )
                        }
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          "disabled:cursor-not-allowed",

                          isCurrent &&
                            "bg-primary text-primary-foreground shadow-sm",

                          !isCurrent &&
                            isDone &&
                            "bg-primary/10 text-primary hover:bg-primary/15",

                          !isCurrent &&
                            !isDone &&
                            "bg-background text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",

                            isCurrent &&
                              "bg-primary-foreground text-primary",

                            !isCurrent &&
                              isDone &&
                              "bg-primary text-primary-foreground",

                            !isCurrent &&
                              !isDone &&
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            index + 1
                          )}
                        </span>

                        {
                          currentStep.label
                        }
                      </button>
                    </li>

                    {index <
                      STEPS.length -
                        1 && (
                      <div
                        className={cn(
                          "h-px flex-1",

                          isDone
                            ? "bg-primary/30"
                            : "bg-border",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                );
              },
            )}
          </ol>
        )}


        {/* ================================================= */}
        {/* STEP 1 — ORGANIZATION */}
        {/* ================================================= */}

        {step === "org" && (
          <div className="space-y-4">

            <Card className="relative z-20 overflow-visible">
              <CardHeader>
                <CardTitle>
                  Find organization
                </CardTitle>

                <CardDescription>
                  Search by name, registration number, or contact person.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <OrganizationDropdown
                  value={
                    selectedOrg?.id ??
                    null
                  }
                  onChange={
                    handleSelectOrganization
                  }
                  disabled={
                    isSubmitting
                  }
                />
              </CardContent>
            </Card>


            {!selectedOrg && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-background/60 px-6 py-12 text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="text-sm font-medium">
                  No organization selected
                </p>

                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Search above to look up the organization you're fueling for. Their access and quota details will appear here.
                </p>
              </div>
            )}


            {selectedOrg && (
              <Card className="relative z-0">
                <CardContent className="pt-6">

                  {/* ORGANIZATION HEADER */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold">
                          {
                            selectedOrg.name
                          }
                        </h3>

                        {(() => {
                          const meta =
                            getStatusMeta(
                              selectedOrg.status,
                            );

                          const StatusIcon =
                            meta.icon;

                          return (
                            <Badge
                              variant="outline"
                              className={cn(
                                "gap-1 text-[10px]",
                                meta.badgeClass,
                              )}
                            >
                              <StatusIcon className="h-3 w-3" />

                              {
                                meta.label
                              }
                            </Badge>
                          );
                        })()}
                      </div>

                      <div className="mt-2.5 grid gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-2">

                        <div>
                          Reg. no:{" "}
                          <span className="font-medium text-foreground">
                            {
                              selectedOrg.registrationNumber
                            }
                          </span>
                        </div>

                        <div>
                          Type:{" "}
                          <span className="font-medium text-foreground">
                            {getOrganizationTypeLabel(
                              selectedOrg.type,
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5" />

                          {
                            selectedOrg.contactPerson
                          }
                        </div>

                        <div>
                          {
                            selectedOrg.phone
                          }
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={
                        handleClearOrganization
                      }
                      aria-label="Remove organization"
                      disabled={
                        isSubmitting
                      }
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>


                  <Separator className="my-4" />


                  {/* ACCESS */}

                  {accessDenied ? (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />

                      <AlertTitle>
                        Fueling not authorized
                      </AlertTitle>

                      <AlertDescription>
                        {selectedOrg.status !==
                        "ACTIVE"
                          ? `This organization's account is ${selectedOrg.status.toLowerCase()}.`
                          : "Fuel access has been disabled for this organization."}{" "}
                        Choose a different organization to continue.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />

                      <AlertTitle>
                        Cleared to fuel
                      </AlertTitle>

                      <AlertDescription className="text-emerald-700">
                        Account active and fuel access is allowed. Maximum{" "}
                        {
                          formatNumber(
                            selectedOrg.maxTransactionLiters,
                          )
                        }{" "}
                        L per transaction.
                      </AlertDescription>
                    </Alert>
                  )}


                  {/* QUOTA */}

                  {!accessDenied &&
                    selectedOrg.quotaEnabled && (
                      <>
                        <Separator className="my-4" />

                        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Gauge className="h-3.5 w-3.5" />

                          Quota by fuel type
                        </div>

                        <div className="space-y-3">
                          {selectedOrg.quota.map(
                            (quota) => {
                              const pct =
                                Math.min(
                                  quota.utilizationPercentage,
                                  100,
                                );

                              return (
                                <div
                                  key={
                                    quota.fuelTypeId
                                  }
                                  className="rounded-lg border p-3"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold">
                                      {
                                        quota.fuelTypeId
                                      }
                                    </span>

                                    <span className="text-muted-foreground">
                                      {
                                        formatNumber(
                                          quota.remainingLiters,
                                        )
                                      }{" "}
                                      L left of{" "}
                                      {
                                        formatNumber(
                                          quota.allocatedLiters,
                                        )
                                      }{" "}
                                      L
                                    </span>
                                  </div>

                                  <Progress
                                    value={pct}
                                    className={cn(
                                      "mt-2 h-1.5",
                                      getQuotaBarTone(
                                        pct,
                                      ),
                                    )}
                                  />
                                </div>
                              );
                            },
                          )}

                          {selectedOrg.quota
                            .length ===
                            0 && (
                            <Alert className="border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600">
                              <AlertTriangle className="h-4 w-4" />

                              <AlertDescription className="text-amber-700">
                                Quota policy is enabled but no allocation has been set up yet.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </>
                    )}


                  {/* RECENT ACTIVITY */}

                  <Separator className="my-4" />

                  <button
                    type="button"
                    onClick={() =>
                      setShowHistory(
                        (value) =>
                          !value,
                      )
                    }
                    aria-expanded={
                      showHistory
                    }
                    className="flex w-full items-center justify-between rounded-md text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />

                      Recent activity (
                      {
                        selectedOrg
                          .recentTransactions
                          .length
                      }
                      )
                    </span>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        showHistory &&
                          "rotate-90",
                      )}
                    />
                  </button>

                  {showHistory && (
                    <div className="mt-3 space-y-2">
                      {selectedOrg
                        .recentTransactions
                        .length === 0 ? (
                        <p className="rounded-lg bg-muted/50 px-3 py-4 text-center text-xs text-muted-foreground">
                          No recent transactions for this organization.
                        </p>
                      ) : (
                        selectedOrg.recentTransactions.map(
                          (
                            transaction,
                          ) => (
                            <div
                              key={
                                transaction.id
                              }
                              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs"
                            >
                              <span className="text-muted-foreground">
                                {
                                  transaction.fuelType
                                }{" "}
                                ·{" "}
                                {
                                  transaction.date
                                }
                              </span>

                              <span className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {
                                    formatNumber(
                                      transaction.liters,
                                    )
                                  }{" "}
                                  L
                                </span>

                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px]",

                                    transaction.status ===
                                      "COMPLETED"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-amber-200 bg-amber-50 text-amber-700",
                                  )}
                                >
                                  {transaction.status ===
                                  "COMPLETED"
                                    ? "Completed"
                                    : "Pending"}
                                </Badge>
                              </span>
                            </div>
                          ),
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}


        {/* ================================================= */}
        {/* STEP 2 — FUEL & QUANTITY */}
        {/* ================================================= */}

        {step === "fuel" &&
          selectedOrg && (
            <div className="space-y-4">

              {/* ORGANIZATION */}

              <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
                <Building2 className="h-4 w-4 shrink-0 text-primary" />

                <p className="min-w-0 flex-1 truncate text-sm font-medium">
                  {
                    selectedOrg.name
                  }
                </p>

                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() =>
                    setStep("org")
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  Change
                </Button>
              </div>


              {/* FUEL TYPE */}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Select fuel type
                  </CardTitle>

                  <CardDescription>
                    Select the fuel available at this station.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FuelTypeDropdown
                    value={
                      selectedFuel?.id ??
                      null
                    }
                    onChange={
                      handleSelectFuel
                    }
                    disabled={
                      isSubmitting
                    }
                  />

                  {selectedFuel && (
                    <div
                      className={cn(
                        "mt-3 flex items-center gap-3 rounded-xl border-l-4 bg-muted/30 p-3",
                        fuelStyle.border,
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          fuelStyle.bgSoft,
                        )}
                      >
                        <Droplets
                          className={cn(
                            "h-5 w-5",
                            fuelStyle.text,
                          )}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {
                            selectedFuel.name
                          }
                        </p>

                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Wallet className="h-3 w-3" />

                          {
                            formatCurrency(
                              unitPrice,
                            )
                          }{" "}
                          ETB per liter
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 px-2 text-xs"
                        onClick={
                          handleClearFuel
                        }
                        disabled={
                          isSubmitting
                        }
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* QUANTITY */}

              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">
                    Enter quantity
                  </CardTitle>

                  <span className="text-xs font-medium text-muted-foreground">
                    Max{" "}
                    {
                      formatNumber(
                        maxAllowed,
                      )
                    }{" "}
                    L allowed
                  </span>
                </CardHeader>

                <CardContent>

                  {/* PUMP READOUT */}

                  <div className="rounded-2xl bg-slate-950 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex items-baseline gap-2">
                        <label
                          htmlFor="liters-input"
                          className="sr-only"
                        >
                          Liters to dispense
                        </label>

                        <input
                          id="liters-input"
                          type="number"
                          min="0"
                          max={
                            maxAllowed ||
                            undefined
                          }
                          step="0.01"
                          inputMode="decimal"
                          value={
                            liters
                          }
                          onChange={(
                            event,
                          ) => {
                            const value =
                              event
                                .target
                                .value;

                            if (
                              value === ""
                            ) {
                              setLiters(
                                "",
                              );
                              return;
                            }

                            const numeric =
                              Number(
                                value,
                              );

                            if (
                              Number.isNaN(
                                numeric,
                              )
                            ) {
                              return;
                            }

                            setLiters(
                              String(
                                Math.max(
                                  0,
                                  numeric,
                                ),
                              ),
                            );
                          }}
                          placeholder="0"
                          disabled={
                            !selectedFuel ||
                            isSubmitting
                          }
                          className="w-40 bg-transparent font-mono text-5xl font-bold tabular-nums text-amber-400 outline-none placeholder:text-slate-700 disabled:cursor-not-allowed sm:w-56 sm:text-6xl"
                        />

                        <span className="pb-1 font-mono text-lg font-semibold text-amber-400/70">
                          L
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Button
                          type="button"
                          size="icon"
                          disabled={
                            !selectedFuel ||
                            isSubmitting ||
                            requestedLiters >=
                              maxAllowed
                          }
                          className="h-9 w-9 bg-slate-800 text-amber-400 hover:bg-slate-700"
                          onClick={() =>
                            handleAdjustLiters(
                              10,
                            )
                          }
                          aria-label="Add 10 liters"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          disabled={
                            !selectedFuel ||
                            isSubmitting ||
                            requestedLiters <=
                              0
                          }
                          className="h-9 w-9 bg-slate-800 text-amber-400 hover:bg-slate-700"
                          onClick={() =>
                            handleAdjustLiters(
                              -10,
                            )
                          }
                          aria-label="Subtract 10 liters"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>


                  {/* PRESETS */}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {presets.map(
                      (preset) => (
                        <Button
                          key={
                            preset
                          }
                          type="button"
                          variant={
                            Number(
                              liters,
                            ) ===
                            preset
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={
                            !selectedFuel ||
                            isSubmitting
                          }
                          className="rounded-full"
                          onClick={() =>
                            setLiters(
                              String(
                                preset,
                              ),
                            )
                          }
                        >
                          {preset ===
                          maxAllowed
                            ? `Max · ${formatNumber(
                                preset,
                              )} L`
                            : `${formatNumber(
                                preset,
                              )} L`}
                        </Button>
                      ),
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={
                        !liters ||
                        isSubmitting
                      }
                      className="gap-1 rounded-full text-muted-foreground"
                      onClick={() =>
                        setLiters("")
                      }
                    >
                      <RotateCcw className="h-3.5 w-3.5" />

                      Clear
                    </Button>
                  </div>


                  {/* VALIDATION */}

                  <div aria-live="polite">
                    {!selectedFuel && (
                      <Alert className="mt-3 border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600">
                        <AlertTriangle className="h-4 w-4" />

                        <AlertDescription className="text-amber-700">
                          Select a fuel type before entering a quantity.
                        </AlertDescription>
                      </Alert>
                    )}

                    {transactionLimitExceeded && (
                      <Alert
                        variant="destructive"
                        className="mt-3"
                      >
                        <AlertTriangle className="h-4 w-4" />

                        <AlertDescription>
                          Maximum transaction is{" "}
                          {
                            formatNumber(
                              selectedOrg.maxTransactionLiters,
                            )
                          }{" "}
                          L.
                        </AlertDescription>
                      </Alert>
                    )}

                    {selectedOrg.quotaEnabled &&
                      selectedQuota &&
                      requestedLiters >
                        selectedQuota.remainingLiters && (
                        <Alert
                          variant="destructive"
                          className="mt-3"
                        >
                          <AlertTriangle className="h-4 w-4" />

                          <AlertDescription>
                            Only{" "}
                            {
                              formatNumber(
                                selectedQuota.remainingLiters,
                              )
                            }{" "}
                            L remain in this quota.
                          </AlertDescription>
                        </Alert>
                      )}

                    {selectedOrg.quotaEnabled &&
                      !selectedQuota &&
                      requestedLiters >
                        0 &&
                      selectedFuel && (
                        <Alert
                          variant="destructive"
                          className="mt-3"
                        >
                          <AlertTriangle className="h-4 w-4" />

                          <AlertDescription>
                            No active quota for{" "}
                            {
                              selectedFuel.name
                            }.
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>


                  {/* RUNNING TOTAL */}

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {
                        formatNumber(
                          requestedLiters,
                        )
                      }{" "}
                      L ×{" "}
                      {
                        formatCurrency(
                          unitPrice,
                        )
                      }{" "}
                      ETB
                    </span>

                    <span className="font-mono text-lg font-bold tabular-nums">
                      {
                        formatCurrency(
                          transactionAmount,
                        )
                      }{" "}
                      ETB
                    </span>
                  </div>

                </CardContent>
              </Card>
            </div>
          )}


        {/* ================================================= */}
        {/* STEP 3 — CONFIRM */}
        {/* ================================================= */}

        {step === "confirm" &&
          selectedOrg &&
          selectedFuel && (
            <div className="space-y-4">

              <Card className="overflow-hidden">
                <div className="bg-primary px-5 py-4 text-primary-foreground">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                    Review before dispensing
                  </p>

                  <h2 className="mt-0.5 text-lg font-bold">
                    Confirm transaction
                  </h2>
                </div>

                <div className="divide-y">

                  <SummaryRow
                    label="Organization"
                    value={
                      selectedOrg.name
                    }
                    icon={Building2}
                  />

                  <SummaryRow
                    label="Fuel type"
                    value={
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            fuelStyle.dot,
                          )}
                        />

                        {
                          selectedFuel.name
                        }
                      </span>
                    }
                    icon={Droplets}
                  />

                  <SummaryRow
                    label="Quantity"
                    value={`${formatNumber(
                      requestedLiters,
                    )} L`}
                    icon={Fuel}
                  />

                  <SummaryRow
                    label="Unit price"
                    value={`${formatCurrency(
                      unitPrice,
                    )} ETB / L`}
                    icon={Wallet}
                  />

                  {/* FIXED: PAID */}
                  <SummaryRow
                    label="Payment status"
                    value={
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        Paid
                      </Badge>
                    }
                    icon={Receipt}
                  />

                  {selectedOrg.quotaEnabled &&
                    selectedQuota && (
                      <SummaryRow
                        label="Quota remaining after"
                        value={`${formatNumber(
                          Math.max(
                            0,
                            selectedQuota.remainingLiters -
                              requestedLiters,
                          ),
                        )} L`}
                        icon={Gauge}
                      />
                    )}
                </div>

                <div className="flex items-center justify-between bg-muted/50 px-5 py-4">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Total paid
                  </span>

                  <span className="font-mono text-2xl font-bold tabular-nums">
                    {
                      formatCurrency(
                        transactionAmount,
                      )
                    }{" "}
                    ETB
                  </span>
                </div>
              </Card>


              {createTransactionMutation.isError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />

                  <AlertTitle>
                    Transaction failed
                  </AlertTitle>

                  <AlertDescription>
                    {createTransactionMutation.error instanceof
                    Error
                      ? createTransactionMutation
                          .error.message
                      : "Unable to create the fuel transaction. Please try again."}
                  </AlertDescription>
                </Alert>
              )}


              <Alert>
                <Info className="h-4 w-4" />

                <AlertDescription>
                  Confirming will create the organization fuel transaction. The transaction will record{" "}
                  {
                    formatNumber(
                      requestedLiters,
                    )
                  }{" "}
                  L of{" "}
                  {
                    selectedFuel.name
                  }{" "}
                  for{" "}
                  {
                    selectedOrg.name
                  }{" "}
                  with payment status{" "}
                  <strong>
                    PAID
                  </strong>
                  .
                </AlertDescription>
              </Alert>
            </div>
          )}


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {step === "success" &&
          receipt && (
            <Card className="border-emerald-200">
              <CardContent className="pt-8 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                </div>

                <h2 className="text-xl font-bold">
                  Fuel transaction created
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Payment has been recorded successfully.
                </p>

                <button
                  type="button"
                  onClick={
                    handleCopyReceiptId
                  }
                  className="mx-auto mt-2 flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Transaction{" "}
                  {receipt.id} ·{" "}
                  {receipt.time}

                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>


                <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-muted/50 p-4 text-left text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Organization
                    </span>

                    <span className="text-right font-medium">
                      {
                        receipt.orgName
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Fuel
                    </span>

                    <span className="font-medium">
                      {
                        receipt.fuelName
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Quantity
                    </span>

                    <span className="font-medium">
                      {
                        formatNumber(
                          receipt.liters,
                        )
                      }{" "}
                      L
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Unit price
                    </span>

                    <span className="font-medium">
                      {
                        formatCurrency(
                          receipt.unitPrice,
                        )
                      }{" "}
                      ETB / L
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment
                    </span>

                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      {
                        receipt.paymentStatus
                      }
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold text-muted-foreground">
                      Total
                    </span>

                    <span className="font-mono font-bold">
                      {
                        formatCurrency(
                          receipt.total,
                        )
                      }{" "}
                      ETB
                    </span>
                  </div>
                </div>


                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">

                  <Button
                    className="gap-2"
                    onClick={
                      handleStartNewTransaction
                    }
                  >
                    <Receipt className="h-4 w-4" />

                    Start new transaction
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      window.print()
                    }
                  >
                    <Printer className="h-4 w-4" />

                    Print receipt
                  </Button>

                </div>
              </CardContent>
            </Card>
          )}
      </div>


      {/* ================================================= */}
      {/* STICKY ACTION BAR */}
      {/* ================================================= */}

      {step !== "success" && (
        <div
          className="
            fixed
            inset-x-0
            bottom-0
            z-40
            border-t
            bg-background/95
            backdrop-blur
            supports-[backdrop-filter]:bg-background/80
            md:left-64
          "
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">

            {blockingReason && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />

                {
                  blockingReason
                }
              </p>
            )}

            <div className="flex items-center gap-3">

              {/* BACK */}

              {step !== "org" && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 gap-1.5"
                  disabled={
                    isSubmitting
                  }
                  onClick={() =>
                    setStep(
                      step ===
                        "confirm"
                        ? "fuel"
                        : "org",
                    )
                  }
                >
                  <ArrowLeft className="h-4 w-4" />

                  Back
                </Button>
              )}


              {/* ORGANIZATION → FUEL */}

              {step === "org" && (
                <Button
                  type="button"
                  disabled={
                    !selectedOrg ||
                    accessDenied ||
                    isSubmitting
                  }
                  className="h-12 flex-1 gap-2"
                  onClick={() =>
                    setStep("fuel")
                  }
                >
                  Continue

                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}


              {/* FUEL → CONFIRM */}

              {step === "fuel" && (
                <Button
                  type="button"
                  disabled={
                    !canFuel ||
                    isSubmitting
                  }
                  className="h-12 flex-1 gap-2"
                  onClick={() =>
                    setStep(
                      "confirm",
                    )
                  }
                >
                  Review transaction

                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}


              {/* CONFIRM → CREATE TRANSACTION */}

              {step === "confirm" && (
                <Button
                  type="button"
                  disabled={
                    !canFuel ||
                    isSubmitting
                  }
                  className="h-12 flex-1 gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={
                    handleConfirmDispense
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Creating transaction...
                    </>
                  ) : (
                    <>
                      <Fuel className="h-4 w-4" />

                      Approve & create transaction
                    </>
                  )}
                </Button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// =====================================================
// SMALL COMPONENTS
// =====================================================

function SummaryRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">

      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}

        {label}
      </span>

      <span className="text-right text-sm font-semibold">
        {value}
      </span>

    </div>
  );
}