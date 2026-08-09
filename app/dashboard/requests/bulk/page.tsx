"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Droplets,
  Fuel,
  Info,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserRound,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock3,
  Minus,
  Plus,
  RotateCcw,
  Receipt,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// =====================================================
// TYPES
// =====================================================

type OrgType = "GOVERNMENT" | "PRIVATE" | "NGO" | "PUBLIC_ENTERPRISE" | "OTHER";
type OrgStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

type FuelTypeId = "fuel-001" | "fuel-002" | "fuel-003";

type FuelType = {
  id: FuelTypeId;
  name: string;
  code: string;
  pricePerLiter: number;
};

type Quota = {
  fuelTypeId: FuelTypeId;
  allocatedLiters: number;
  consumedLiters: number;
  remainingLiters: number;
  utilizationPercentage: number;
  period: string;
  expiresAt: string;
};

type Transaction = {
  id: string;
  fuelType: string;
  liters: number;
  date: string;
  status: "COMPLETED" | "PENDING";
};

type Organization = {
  id: string;
  name: string;
  type: OrgType;
  registrationNumber: string;
  contactPerson: string;
  phone: string;
  status: OrgStatus;
  allowFuelAccess: boolean;
  quotaEnabled: boolean;
  maxTransactionLiters: number;
  quota: Quota[];
  recentTransactions: Transaction[];
};

type StepId = "org" | "fuel" | "confirm" | "success";

type Receipt = {
  id: string;
  orgName: string;
  fuelName: string;
  liters: number;
  unitPrice: number;
  total: number;
  time: string;
};

// =====================================================
// HELPERS
// =====================================================

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
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

// =====================================================
// MOCK DATA
// =====================================================

const FUEL_TYPES: FuelType[] = [
  { id: "fuel-001", name: "Diesel", code: "DIESEL", pricePerLiter: 74.5 },
  { id: "fuel-002", name: "Benzene", code: "BENZENE", pricePerLiter: 78.25 },
  { id: "fuel-003", name: "Kerosene", code: "KEROSENE", pricePerLiter: 72.8 },
];

// Color coding mirrors the pump-nozzle convention attendants already use at
// the physical dispensers, so the UI reuses a visual language they know.
const FUEL_STYLE: Record<FuelTypeId, { border: string; bgSoft: string; dot: string }> = {
  "fuel-001": { border: "border-slate-500", bgSoft: "bg-slate-50", dot: "bg-slate-500" },
  "fuel-002": { border: "border-emerald-500", bgSoft: "bg-emerald-50", dot: "bg-emerald-500" },
  "fuel-003": { border: "border-sky-500", bgSoft: "bg-sky-50", dot: "bg-sky-500" },
};

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-001",
    name: "Adama City Administration",
    type: "GOVERNMENT",
    registrationNumber: "GOV-ADM-001",
    contactPerson: "Finance Department",
    phone: "+251 22 111 2233",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 5000,
    quota: [
      {
        fuelTypeId: "fuel-001",
        allocatedLiters: 30000,
        consumedLiters: 12450,
        remainingLiters: 17550,
        utilizationPercentage: 41.5,
        period: "August 2026",
        expiresAt: "2026-08-31",
      },
      {
        fuelTypeId: "fuel-002",
        allocatedLiters: 5000,
        consumedLiters: 1200,
        remainingLiters: 3800,
        utilizationPercentage: 24,
        period: "August 2026",
        expiresAt: "2026-08-31",
      },
    ],
    recentTransactions: [
      { id: "TXN-10021", fuelType: "Diesel", liters: 850, date: "Today, 09:32", status: "COMPLETED" },
      { id: "TXN-10004", fuelType: "Diesel", liters: 1200, date: "Yesterday, 14:18", status: "COMPLETED" },
    ],
  },
  {
    id: "org-002",
    name: "Adama Public Transport Enterprise",
    type: "PUBLIC_ENTERPRISE",
    registrationNumber: "PTE-ADM-024",
    contactPerson: "Operations Office",
    phone: "+251 91 223 4455",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: true,
    maxTransactionLiters: 3000,
    quota: [
      {
        fuelTypeId: "fuel-001",
        allocatedLiters: 18000,
        consumedLiters: 15400,
        remainingLiters: 2600,
        utilizationPercentage: 85.6,
        period: "August 2026",
        expiresAt: "2026-08-31",
      },
    ],
    recentTransactions: [
      { id: "TXN-9911", fuelType: "Diesel", liters: 700, date: "Today, 08:10", status: "COMPLETED" },
    ],
  },
  {
    id: "org-003",
    name: "Oromia Development Organization",
    type: "NGO",
    registrationNumber: "NGO-ORO-782",
    contactPerson: "Logistics Department",
    phone: "+251 92 334 5566",
    status: "ACTIVE",
    allowFuelAccess: true,
    quotaEnabled: false,
    maxTransactionLiters: 1000,
    quota: [],
    recentTransactions: [
      { id: "TXN-9731", fuelType: "Diesel", liters: 450, date: "Aug 07, 11:40", status: "COMPLETED" },
    ],
  },
  {
    id: "org-004",
    name: "Abdi Private Logistics",
    type: "PRIVATE",
    registrationNumber: "PRV-ADM-902",
    contactPerson: "Abdi Mohammed",
    phone: "+251 94 556 7788",
    status: "SUSPENDED",
    allowFuelAccess: false,
    quotaEnabled: true,
    maxTransactionLiters: 1000,
    quota: [],
    recentTransactions: [],
  },
];

const STEPS: { id: StepId; label: string }[] = [
  { id: "org", label: "Organization" },
  { id: "fuel", label: "Fuel & Quantity" },
  { id: "confirm", label: "Confirm" },
];

// =====================================================
// PAGE
// =====================================================

export default function OrganizationFuelingPage() {
  const [step, setStep] = useState<StepId>("org");
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelTypeId>(FUEL_TYPES[0].id);
  const [liters, setLiters] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_ORGANIZATIONS;
    return MOCK_ORGANIZATIONS.filter(
      (o) =>
        o.name.toLowerCase().includes(query) ||
        o.registrationNumber.toLowerCase().includes(query) ||
        o.contactPerson.toLowerCase().includes(query),
    );
  }, [search]);

  // ---------------------------------------------------
  // DROPDOWN LIFECYCLE — this is the part that used to be unmanaged.
  // The dropdown now closes itself on outside click, on Escape, and
  // whenever it stops making sense to show it (no query, no results,
  // org already chosen, or the user has moved to a later step).
  // ---------------------------------------------------

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!searchContainerRef.current) return;
      if (!searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowResults(false);
        searchInputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Leaving the "org" step, or having a confirmed selection, always
  // collapses the dropdown — it should never persist open in the background.
  useEffect(() => {
    if (step !== "org" || selectedOrg) {
      setShowResults(false);
    }
  }, [step, selectedOrg]);

  // Reset keyboard highlight whenever the visible result set changes,
  // so a stale index never points at a row that no longer exists.
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search, showResults]);

  useEffect(() => {
    if (!showResults) return;
    const activeItem = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlightedIndex}"]`,
    );
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, showResults]);

  const selectedFuel = FUEL_TYPES.find((f) => f.id === selectedFuelType);
  const selectedQuota = selectedOrg?.quota.find((q) => q.fuelTypeId === selectedFuelType);
  const requestedLiters = Number(liters) || 0;
  const transactionAmount = requestedLiters * (selectedFuel?.pricePerLiter ?? 0);

  const accessDenied =
    !!selectedOrg && (selectedOrg.status !== "ACTIVE" || !selectedOrg.allowFuelAccess);

  const quotaExceeded =
    !!selectedOrg?.quotaEnabled &&
    (!selectedQuota || requestedLiters > selectedQuota.remainingLiters);

  const transactionLimitExceeded =
    !!selectedOrg && requestedLiters > selectedOrg.maxTransactionLiters;

  const maxAllowed = useMemo(() => {
    if (!selectedOrg) return 0;
    let max = selectedOrg.maxTransactionLiters;
    if (selectedOrg.quotaEnabled) {
      max = Math.min(max, selectedQuota ? selectedQuota.remainingLiters : 0);
    }
    return Math.max(0, Math.floor(max));
  }, [selectedOrg, selectedQuota]);

  const presets = useMemo(() => {
    const base = [100, 200, 500].filter((v) => v > 0 && v < maxAllowed);
    const values = [...base];
    if (maxAllowed > 0) values.push(maxAllowed);
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [maxAllowed]);

  const canFuel =
    !!selectedOrg &&
    !accessDenied &&
    requestedLiters > 0 &&
    !transactionLimitExceeded &&
    (!selectedOrg.quotaEnabled || !quotaExceeded);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const fuelStyle = FUEL_STYLE[selectedFuelType];

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------

  const handleSelectOrganization = (organization: Organization) => {
    setSelectedOrg(organization);
    setSearch(organization.name);
    setShowResults(false);
    setLiters("");
    setShowHistory(false);
  };

  const handleClearOrganization = () => {
    setSelectedOrg(null);
    setSearch("");
    setShowResults(false);
    setLiters("");
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || filteredOrganizations.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filteredOrganizations.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const match = filteredOrganizations[highlightedIndex];
      if (match) handleSelectOrganization(match);
    }
  };

  const handleAdjustLiters = (delta: number) => {
    setLiters((prev) => {
      const next = Math.max(0, (Number(prev) || 0) + delta);
      return String(next);
    });
  };

  const handleConfirmDispense = () => {
    if (!canFuel || !selectedOrg || !selectedFuel) return;

    const id = "TXN-" + Math.floor(10000 + Math.random() * 89999);

    // TODO: replace with the real transaction mutation
    setReceipt({
      id,
      orgName: selectedOrg.name,
      fuelName: selectedFuel.name,
      liters: requestedLiters,
      unitPrice: selectedFuel.pricePerLiter,
      total: transactionAmount,
      time: "Just now",
    });
    setStep("success");
  };

  const handleStartNewTransaction = () => {
    setReceipt(null);
    handleClearOrganization();
    setSelectedFuelType(FUEL_TYPES[0].id);
    setStep("org");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Fuel className="h-3.5 w-3.5" />
              <span>Fuel Dispenser</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Organization Fueling</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Organization Fueling
            </h1>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Station Online
          </Badge>
        </div>

        {/* STEPPER */}
        {step !== "success" && (
          <div className="relative z-10 mb-6 flex items-center gap-2">
            {STEPS.map((s, i) => {
              const isDone = i < stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    disabled={i > stepIndex}
                    onClick={() => i < stepIndex && setStep(s.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isDone
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "bg-background text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
                        isCurrent
                          ? "bg-primary-foreground text-primary"
                          : isDone
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={cn("h-px flex-1", isDone ? "bg-primary/30" : "bg-border")} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ============================================= */}
        {/* STEP 1 — ORGANIZATION                          */}
        {/* ============================================= */}
        {step === "org" && (
          <div className="space-y-4">
            <Card className="relative z-20 overflow-visible">
              <CardHeader>
                <CardTitle>Find Organization</CardTitle>
                <CardDescription>
                  Search by name, registration number, or contact person.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={searchContainerRef} className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    value={search}
                    role="combobox"
                    aria-expanded={showResults && !selectedOrg}
                    aria-controls="organization-results-listbox"
                    aria-autocomplete="list"
                    autoComplete="off"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowResults(true);
                      if (selectedOrg && e.target.value !== selectedOrg.name) {
                        setSelectedOrg(null);
                      }
                    }}
                    onFocus={() => {
                      if (!selectedOrg) setShowResults(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Type organization name..."
                    className="h-14 pl-12 pr-12 text-base"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={handleClearOrganization}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}

                  {showResults && !selectedOrg && (
                    <div
                      id="organization-results-listbox"
                      ref={listRef}
                      role="listbox"
                      className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border bg-popover p-1.5 shadow-xl"
                    >
                      {filteredOrganizations.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                          <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                          <p className="text-sm font-medium">No organization found</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Try another name or registration number.
                          </p>
                        </div>
                      ) : (
                        filteredOrganizations.map((organization, index) => (
                          <button
                            key={organization.id}
                            type="button"
                            data-index={index}
                            role="option"
                            aria-selected={index === highlightedIndex}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => handleSelectOrganization(organization)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg p-3.5 text-left transition",
                              index === highlightedIndex ? "bg-muted" : "hover:bg-muted",
                            )}
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold">{organization.name}</p>
                                <Badge
                                  variant={organization.status === "ACTIVE" ? "default" : "destructive"}
                                  className="shrink-0 text-[10px]"
                                >
                                  {organization.status}
                                </Badge>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {organization.registrationNumber} · {getOrganizationTypeLabel(organization.type)}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedOrg && (
              <Card className="relative z-0">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{selectedOrg.name}</h3>
                        <Badge
                          variant={selectedOrg.status === "ACTIVE" ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {selectedOrg.status}
                        </Badge>
                      </div>
                      <div className="mt-2 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                        <div>
                          Reg. no: <span className="font-medium text-foreground">{selectedOrg.registrationNumber}</span>
                        </div>
                        <div>
                          Type: <span className="font-medium text-foreground">{getOrganizationTypeLabel(selectedOrg.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserRound className="h-3.5 w-3.5" /> {selectedOrg.contactPerson}
                        </div>
                        <div>{selectedOrg.phone}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearOrganization}
                      aria-label="Remove organization"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  {/* ACCESS BANNER */}
                  {accessDenied ? (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>Fueling not authorized</AlertTitle>
                      <AlertDescription>
                        {selectedOrg.status !== "ACTIVE"
                          ? `This organization's account is ${selectedOrg.status.toLowerCase()}.`
                          : "Fuel access has been disabled for this organization."}{" "}
                        Choose a different organization to continue.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Cleared to fuel</AlertTitle>
                      <AlertDescription className="text-emerald-700">
                        Account active and fuel access is allowed. Maximum{" "}
                        {formatNumber(selectedOrg.maxTransactionLiters)} L per transaction.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* QUOTA PREVIEW */}
                  {!accessDenied && selectedOrg.quotaEnabled && (
                    <>
                      <Separator className="my-4" />
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Quota by fuel type
                      </p>
                      <div className="space-y-3">
                        {selectedOrg.quota.map((q) => {
                          const fuel = FUEL_TYPES.find((f) => f.id === q.fuelTypeId);
                          return (
                            <div key={q.fuelTypeId} className="rounded-lg border p-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold">{fuel?.name}</span>
                                <span className="text-muted-foreground">
                                  {formatNumber(q.remainingLiters)} L left of {formatNumber(q.allocatedLiters)} L
                                </span>
                              </div>
                              <Progress
                                value={Math.min(q.utilizationPercentage, 100)}
                                className="mt-2 h-1.5"
                              />
                            </div>
                          );
                        })}
                        {selectedOrg.quota.length === 0 && (
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
                    onClick={() => setShowHistory((v) => !v)}
                    className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      Recent activity ({selectedOrg.recentTransactions.length})
                    </span>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", showHistory && "rotate-90")} />
                  </button>
                  {showHistory && (
                    <div className="mt-3 space-y-2">
                      {selectedOrg.recentTransactions.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No recent transactions.</p>
                      ) : (
                        selectedOrg.recentTransactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs"
                          >
                            <span className="text-muted-foreground">
                              {t.fuelType} · {t.date}
                            </span>
                            <span className="font-semibold">{formatNumber(t.liters)} L</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ============================================= */}
        {/* STEP 2 — FUEL & QUANTITY                       */}
        {/* ============================================= */}
        {step === "fuel" && selectedOrg && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
              <Building2 className="h-4 w-4 shrink-0 text-primary" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{selectedOrg.name}</p>
              <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setStep("org")}>
                Change
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select fuel type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {FUEL_TYPES.map((fuel) => {
                    const style = FUEL_STYLE[fuel.id];
                    const active = selectedFuelType === fuel.id;
                    return (
                      <button
                        key={fuel.id}
                        type="button"
                        onClick={() => setSelectedFuelType(fuel.id)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition",
                          active ? cn(style.border, style.bgSoft) : "border-border hover:border-muted-foreground/30",
                        )}
                      >
                        <span className={cn("h-3 w-3 rounded-full", style.dot)} />
                        <span className="text-sm font-bold">{fuel.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(fuel.pricePerLiter)} ETB / L
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Enter quantity</CardTitle>
                <span className="text-xs font-medium text-muted-foreground">
                  Max {formatNumber(maxAllowed)} L allowed
                </span>
              </CardHeader>
              <CardContent>
                {/* pump-style readout */}
                <div className="rounded-2xl bg-slate-950 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        value={liters}
                        onChange={(e) => setLiters(e.target.value)}
                        placeholder="0"
                        className="w-40 bg-transparent font-mono text-5xl font-bold tabular-nums text-amber-400 outline-none placeholder:text-slate-700 sm:w-56 sm:text-6xl"
                      />
                      <span className="pb-1 font-mono text-lg font-semibold text-amber-400/70">L</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Button
                        type="button"
                        size="icon"
                        className="h-9 w-9 bg-slate-800 text-amber-400 hover:bg-slate-700"
                        onClick={() => handleAdjustLiters(10)}
                        aria-label="Add 10 liters"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        className="h-9 w-9 bg-slate-800 text-amber-400 hover:bg-slate-700"
                        onClick={() => handleAdjustLiters(-10)}
                        aria-label="Subtract 10 liters"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* quick presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant={Number(liters) === p ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setLiters(String(p))}
                    >
                      {p === maxAllowed ? `Max · ${formatNumber(p)} L` : `${formatNumber(p)} L`}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-full text-muted-foreground"
                    onClick={() => setLiters("")}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Clear
                  </Button>
                </div>

                {/* validation */}
                {transactionLimitExceeded && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Maximum transaction is {formatNumber(selectedOrg.maxTransactionLiters)} L.
                    </AlertDescription>
                  </Alert>
                )}
                {selectedOrg.quotaEnabled && selectedQuota && requestedLiters > selectedQuota.remainingLiters && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Only {formatNumber(selectedQuota.remainingLiters)} L remain in this quota.
                    </AlertDescription>
                  </Alert>
                )}
                {selectedOrg.quotaEnabled && !selectedQuota && requestedLiters > 0 && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>No active quota for {selectedFuel?.name}.</AlertDescription>
                  </Alert>
                )}

                {/* running total */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(requestedLiters)} L × {formatCurrency(selectedFuel?.pricePerLiter ?? 0)} ETB
                  </span>
                  <span className="font-mono text-lg font-bold tabular-nums">
                    {formatCurrency(transactionAmount)} ETB
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ============================================= */}
        {/* STEP 3 — CONFIRM                                */}
        {/* ============================================= */}
        {step === "confirm" && selectedOrg && selectedFuel && (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-primary px-5 py-4 text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  Review before dispensing
                </p>
                <h2 className="mt-0.5 text-lg font-bold">Confirm transaction</h2>
              </div>

              <div className="divide-y">
                <SummaryRow label="Organization" value={selectedOrg.name} icon={Building2} />
                <SummaryRow
                  label="Fuel type"
                  value={
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", fuelStyle.dot)} />
                      {selectedFuel.name}
                    </span>
                  }
                  icon={Droplets}
                />
                <SummaryRow label="Quantity" value={`${formatNumber(requestedLiters)} L`} icon={Fuel} />
                <SummaryRow label="Unit price" value={`${formatCurrency(selectedFuel.pricePerLiter)} ETB / L`} />
                {selectedOrg.quotaEnabled && selectedQuota && (
                  <SummaryRow
                    label="Quota remaining after"
                    value={`${formatNumber(selectedQuota.remainingLiters - requestedLiters)} L`}
                  />
                )}
              </div>

              <div className="flex items-center justify-between bg-muted/50 px-5 py-4">
                <span className="text-sm font-semibold text-muted-foreground">Total due</span>
                <span className="font-mono text-2xl font-bold tabular-nums">
                  {formatCurrency(transactionAmount)} ETB
                </span>
              </div>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Confirming will dispense fuel and deduct it from the organization's quota immediately.
                This action cannot be undone from this screen.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* ============================================= */}
        {/* SUCCESS                                        */}
        {/* ============================================= */}
        {step === "success" && receipt && (
          <Card className="border-emerald-200">
            <CardContent className="pt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold">Fuel dispensed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Transaction {receipt.id} · {receipt.time}
              </p>

              <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-muted/50 p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization</span>
                  <span className="font-medium">{receipt.orgName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel</span>
                  <span className="font-medium">{receipt.fuelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{formatNumber(receipt.liters)} L</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Total</span>
                  <span className="font-mono font-bold">{formatCurrency(receipt.total)} ETB</span>
                </div>
              </div>

              <Button className="mt-6 gap-2" onClick={handleStartNewTransaction}>
                <Receipt className="h-4 w-4" />
                Start new transaction
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

     {/* ============================================= */}
{/* STICKY BOTTOM ACTION BAR                      */}
{/* ============================================= */}

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
    <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      {/* ----------------------------------------- */}
      {/* BACK BUTTON                               */}
      {/* ----------------------------------------- */}

      {step !== "org" && (
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-1.5"
          onClick={() =>
            setStep(step === "confirm" ? "fuel" : "org")
          }
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* ----------------------------------------- */}
      {/* ORGANIZATION → FUEL                       */}
      {/* ----------------------------------------- */}

      {step === "org" && (
        <Button
          type="button"
          disabled={!selectedOrg || accessDenied}
          className="h-12 flex-1 gap-2"
          onClick={() => setStep("fuel")}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {/* ----------------------------------------- */}
      {/* FUEL → CONFIRM                            */}
      {/* ----------------------------------------- */}

      {step === "fuel" && (
        <Button
          type="button"
          disabled={!canFuel}
          className="h-12 flex-1 gap-2"
          onClick={() => setStep("confirm")}
        >
          Review transaction
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {/* ----------------------------------------- */}
      {/* CONFIRM → DISPENSE                        */}
      {/* ----------------------------------------- */}

      {step === "confirm" && (
        <Button
          type="button"
          disabled={!canFuel}
          className="h-12 flex-1 gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
          onClick={handleConfirmDispense}
        >
          <Fuel className="h-4 w-4" />
          Approve & Dispense
        </Button>
      )}
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
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}