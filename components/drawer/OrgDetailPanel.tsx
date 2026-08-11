"use client"

import { useState } from "react"

import {
  ArrowUpRight,
  Ban,
  Calendar,
  Copy,
  Eye,
  EyeOff,
  Fuel,
  Gauge,
  Key,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Power,
  Receipt,
  RefreshCw,
  Trash2,
  UserIcon,
  X,
} from "lucide-react"

import {
  FuelGaugeArc,
  ORG_TYPE_CONFIG,
  OrgTypeBadge,
  PAYMENT_CONFIG,
  StatusBadge,
} from "../ActionsMenu"

import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { Button } from "../ui/button"

import {
  cn,
  fmtBirr,
  fmtLiters,
  formatEthiopianDate,
} from "@/lib/utils"

import type {
  Organization,
  OrganizationTransactionSummary,
} from "@/types/organization.types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"


// ============================================================================
// PROPS
// ============================================================================

interface OrgDetailPanelProps {
  org: Organization

  onClose: () => void

  onAssignQuota: (
    orgId: string,
  ) => void

  onEdit: (
    organization: Organization,
  ) => void

  onToggleActive: (
    organization: Organization,
  ) => void

  onDelete: (
    organization: Organization,
  ) => void
}


// ============================================================================
// DETAIL PANEL
// ============================================================================

export function OrgDetailPanel({
  org,
  onClose,
  onAssignQuota,
  onEdit,
  onToggleActive,
  onDelete,
}: OrgDetailPanelProps) {
  const [showKey, setShowKey] =
    useState(false)

  const [copied, setCopied] =
    useState(false)

  // ==========================================================================
  // ORGANIZATION TYPE ICON
  // ==========================================================================

  const TypeIcon =
    ORG_TYPE_CONFIG[org.type]?.icon

  const isActive =
    org.status === "ACTIVE"


  // ==========================================================================
  // QUOTAS
  // ==========================================================================

  const quotas =
    Array.isArray(org.fuelQuotas)
      ? org.fuelQuotas
      : []


  // ==========================================================================
  // TRANSACTIONS
  // ==========================================================================

  const transactions =
    Array.isArray(
      org.fuelTransactions,
    )
      ? org.fuelTransactions
      : []


  // ==========================================================================
  // QUOTA TOTALS
  // ==========================================================================

  const totalAllocated =
    quotas.reduce(
      (sum, quota) =>
        sum +
        Number(
          quota.allocatedLiters ?? 0,
        ),
      0,
    )


  const totalConsumed =
    quotas.reduce(
      (sum, quota) =>
        sum +
        Number(
          quota.consumedLiters ?? 0,
        ),
      0,
    )


  // ==========================================================================
  // COPY API KEY
  // ==========================================================================

  const handleCopy = async () => {
    if (!org.apiKey) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        org.apiKey,
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setCopied(false)
    }
  }


  // ==========================================================================
  // FORMAT DATE
  // ==========================================================================

  const formatDate = (
    value?: string | null,
  ) => {
    if (!value) {
      return "—"
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return new Intl.DateTimeFormat(
      "en",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    ).format(date)
  }


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="fixed inset-0 z-40 flex justify-end">

      {/* ================================================================
          BACKDROP
          ================================================================ */}

      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />


      {/* ================================================================
          PANEL
          ================================================================ */}

      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">

        {/* ================================================================
            HEADER
            ================================================================ */}

        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 rounded-xl bg-stone-900 p-2.5 text-amber-400">

              {TypeIcon ? (
                <TypeIcon className="h-5 w-5" />
              ) : (
                <Building2Fallback />
              )}

            </div>

            <div className="min-w-0">

              <h2 className="truncate text-lg font-semibold text-stone-900">
                {org.name}
              </h2>

              <div className="mt-1 flex items-center gap-2">

                <OrgTypeBadge
                  type={org.type}
                />

                <span className="text-stone-300">
                  ·
                </span>

                <span className="font-mono text-xs text-stone-400">
                  {org.registrationNumber ||
                    "Registration pending"}
                </span>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="Close organization details"
          >
            <X className="h-4 w-4" />
          </button>

        </div>


        {/* ================================================================
            CONTENT
            ================================================================ */}

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">

          {/* ==============================================================
              STATUS
              ============================================================== */}

          <div className="flex flex-wrap items-center gap-2">

            <StatusBadge
              status={org.status}
            />

            <Badge
              variant="outline"
              className={
                org.allowFuelAccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }
            >

              <Fuel className="mr-1 h-3 w-3" />

              {org.allowFuelAccess
                ? "Fuel access allowed"
                : "Fuel access blocked"}

            </Badge>


            <Badge
              variant="outline"
              className={
                org.requiresQuota
                  ? "border-stone-200 bg-stone-100 text-stone-700"
                  : "border-stone-200 bg-stone-50 text-stone-400"
              }
            >

              <Gauge className="mr-1 h-3 w-3" />

              {org.requiresQuota
                ? "Quota enforced"
                : "Quota disabled"}

            </Badge>

          </div>


          {/* ==============================================================
              CONTACT
              ============================================================== */}

          <div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              Contact
            </h3>

            <div className="grid grid-cols-1 gap-2.5 text-sm">

              <div className="flex items-center gap-2.5 text-stone-700">

                <UserIcon className="h-3.5 w-3.5 shrink-0 text-stone-400" />

                {org.contactPerson || "—"}

              </div>


              <div className="flex items-center gap-2.5 text-stone-700">

                <Phone className="h-3.5 w-3.5 shrink-0 text-stone-400" />

                <span className="font-mono text-[13px]">
                  {org.phone || "—"}
                </span>

              </div>


              <div className="flex items-center gap-2.5 text-stone-700">

                <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />

                <span className="font-mono text-[13px]">
                  {org.email || "—"}
                </span>

              </div>


              <div className="flex items-center gap-2.5 text-stone-700">

                <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />

                {org.address || "—"}

              </div>

            </div>

          </div>


          {/* ==============================================================
              FUEL ACCESS CONTROL
              ============================================================== */}

          <div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              Fuel access control
            </h3>

            <Card className="grid grid-cols-2 divide-x divide-stone-200 border-stone-200 p-0">

              <div className="p-3.5">

                <p className="text-xs text-stone-500">
                  Max per transaction
                </p>

                <p className="font-mono text-base font-semibold text-stone-900">
                  {fmtLiters(
                    Number(
                      org.maxTransactionLiters ??
                        0,
                    ),
                  )}
                </p>

              </div>


              <div className="p-3.5">

                <p className="text-xs text-stone-500">
                  Member since
                </p>

                <p className="font-mono text-base font-semibold text-stone-900">
                  {formatDate(
                    org.createdAt,
                  )}
                </p>

              </div>

            </Card>

          </div>


          {/* ==============================================================
              API INTEGRATION
              ============================================================== */}

          <div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              API integration
            </h3>

            <Card className="flex items-center justify-between gap-2 border-stone-200 p-3">

              <div className="flex min-w-0 items-center gap-2">

                <Key className="h-3.5 w-3.5 shrink-0 text-stone-400" />

                <span className="truncate font-mono text-xs text-stone-700">

                  {!org.apiKey
                    ? "No API key configured"
                    : showKey
                      ? org.apiKey
                      : "•".repeat(20)}

                </span>

              </div>


              {org.apiKey && (
                <div className="flex shrink-0 items-center gap-1">

                  <button
                    type="button"
                    onClick={() =>
                      setShowKey(
                        (value) =>
                          !value,
                      )
                    }
                    className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                    aria-label={
                      showKey
                        ? "Hide API key"
                        : "Show API key"
                    }
                  >
                    {showKey ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>


                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                    aria-label="Copy API key"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>


                  {copied && (
                    <span className="text-[11px] text-emerald-600">
                      Copied
                    </span>
                  )}

                </div>
              )}

            </Card>

          </div>


          {/* ==============================================================
              FUEL QUOTAS
              ============================================================== */}

          <div>

            <div className="mb-3 flex items-center justify-between">

              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Fuel quotas
              </h3>

              {quotas.length > 0 && (
                <span className="font-mono text-[11px] text-stone-400">
                  {fmtLiters(
                    totalConsumed,
                  )}{" "}
                  /{" "}
                  {fmtLiters(
                    totalAllocated,
                  )}{" "}
                  this cycle
                </span>
              )}

            </div>


            {quotas.length === 0 ? (

              <Card className="border-dashed border-stone-300 p-5 text-center">

                <p className="text-sm text-stone-500">
                  No quota has been assigned
                  to this organization.
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() =>
                    onAssignQuota(
                      org.id,
                    )
                  }
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Assign a quota
                </Button>

              </Card>

            ) : (

              <div className="space-y-2.5">

                {quotas.map((quota) => {

                  const pct =
                    Number(
                      quota.allocatedLiters ??
                        0,
                    ) > 0
                      ? (Number(
                          quota.consumedLiters ??
                            0,
                        ) /
                          Number(
                            quota.allocatedLiters ??
                              0,
                          )) *
                        100
                      : 0

                  return (
                   <Card
                    key={quota.id}
                    className="border-stone-200 p-3.5 transition-colors hover:border-stone-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* ================================================= */}
                      {/* QUOTA GAUGE */}
                      {/* ================================================= */}

                      <FuelGaugeArc
                        percent={pct}
                        size={80}
                      />

                      {/* ================================================= */}
                      {/* QUOTA INFORMATION */}
                      {/* ================================================= */}

                      <div className="min-w-0 flex-1">
                        {/* ================================================= */}
                        {/* FUEL TYPE + STATUS */}
                        {/* ================================================= */}

                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-stone-900">
                            {quota.fuelType?.name ?? "Unknown fuel"}
                          </p>

                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium",

                              quota.status === "ACTIVE" &&
                                "bg-emerald-50 text-emerald-700",

                              quota.status === "EXHAUSTED" &&
                                "bg-amber-50 text-amber-700",

                              quota.status === "EXPIRED" &&
                                "bg-stone-100 text-stone-600",

                              quota.status === "CANCELLED" &&
                                "bg-red-50 text-red-700",
                            )}
                          >
                            {quota.status}
                          </span>
                        </div>

                        {/* ================================================= */}
                        {/* USAGE */}
                        {/* ================================================= */}

                        <p className="mt-1 font-mono text-xs text-stone-500">
                          {fmtLiters(
                            Number(quota.consumedLiters ?? 0),
                          )}{" "}
                          used of{" "}
                          {fmtLiters(
                            Number(quota.allocatedLiters ?? 0),
                          )}
                        </p>

                        {/* ================================================= */}
                        {/* REMAINING */}
                        {/* ================================================= */}

                        <p className="mt-0.5 text-xs text-stone-600">
                          <span className="font-medium text-stone-900">
                            {fmtLiters(
                              Math.max(
                                0,
                                Number(quota.allocatedLiters ?? 0) -
                                  Number(quota.consumedLiters ?? 0),
                              ),
                            )}
                          </span>{" "}
                          remaining
                        </p>

                        {/* ================================================= */}
                        {/* PERIOD + DATE */}
                        {/* ================================================= */}

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />

                            {formatEthiopianDate(quota.startDate)}

                            <span>→</span>

                            {formatEthiopianDate(quota.endDate)}
                          </span>

                          <span className="capitalize">
                            {quota.periodType
                              ?.toLowerCase()
                              .replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* UTILIZATION */}
                      {/* ================================================= */}

                      <div className="hidden text-right sm:block">
                        <p className="font-mono text-sm font-semibold text-stone-900">
                          {pct.toFixed(0)}%
                        </p>

                        <p className="text-[10px] text-stone-400">
                          utilized
                        </p>
                      </div>

                      {/* ================================================= */}
                      {/* ACTIONS */}
                      {/* ================================================= */}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                            aria-label="Quota actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-48"
                        >
                          {/* ================================================= */}
                          {/* EDIT */}
                          {/* ================================================= */}

                          {quota.status === "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => {
                                // setEditingQuota(quota);
                                // setQuotaDialogOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit quota
                            </DropdownMenuItem>
                          )}

                          {/* ================================================= */}
                          {/* REFRESH STATUS */}
                          {/* ================================================= */}

                          {quota.status !== "CANCELLED" && (
                            <DropdownMenuItem
                              onClick={() => {
                                // handleRefreshQuotaStatus(quota.id);
                              }}
                              className="gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Refresh status
                            </DropdownMenuItem>
                          )}

                          {/* ================================================= */}
                          {/* CANCEL */}
                          {/* ================================================= */}

                          {quota.status === "ACTIVE" &&
                            Number(quota.consumedLiters ?? 0) === 0 && (
                              <>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => {
                                    // setCancellingQuota(quota);
                                    // setCancelDialogOpen(true);
                                  }}
                                  className="gap-2 text-amber-700 focus:text-amber-700"
                                >
                                  <Ban className="h-4 w-4" />
                                  Cancel quota
                                </DropdownMenuItem>
                              </>
                            )}

                          {/* ================================================= */}
                          {/* DELETE */}
                          {/* ================================================= */}

                          {Number(quota.consumedLiters ?? 0) === 0 && (
                            <>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => {
                                  // setDeletingQuota(quota);
                                  // setDeleteDialogOpen(true);
                                }}
                                className="gap-2 text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete quota
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                  )
                })}

              </div>

            )}

          </div>


          {/* ==============================================================
              RECENT TRANSACTIONS
              ============================================================== */}

          <div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              Recent transactions
            </h3>

            {transactions.length === 0 ? (

              <Card className="border-dashed border-stone-300 p-5 text-center">

                <p className="text-sm text-stone-500">
                  No fueling activity
                  recorded yet.
                </p>

              </Card>

            ) : (

              <Card className="divide-y divide-stone-100 border-stone-200 p-0">

                {transactions.map(
                  (
                    transaction,
                  ) => (
                    <TransactionRow
                      key={
                        transaction.id
                      }
                      transaction={
                        transaction
                      }
                    />
                  ),
                )}

              </Card>

            )}

          </div>

        </div>


        {/* ================================================================
            FOOTER ACTIONS
            ================================================================ */}

        <div className="flex items-center justify-between gap-2 border-t border-stone-200 px-6 py-4">

          <Button
            variant="outline"
            size="sm"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={() =>
              onDelete(org)
            }
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>


          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onToggleActive(org)
              }
            >
              <Power className="mr-1.5 h-3.5 w-3.5" />

              {isActive
                ? "Deactivate"
                : "Activate"}

            </Button>


            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onEdit(org)
              }
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>


            <Button
              size="sm"
              className="bg-stone-900 hover:bg-stone-800"
              onClick={() =>
                onAssignQuota(org.id)
              }
            >
              Allocate quota

              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>

          </div>

        </div>

      </div>
    </div>
  )
}


// ============================================================================
// TRANSACTION ROW
// ============================================================================

function TransactionRow({
  transaction,
}: {
  transaction: OrganizationTransactionSummary
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5">

      <div className="flex items-center gap-3">

        <div className="rounded-md bg-stone-100 p-2 text-stone-500">
          <Receipt className="h-3.5 w-3.5" />
        </div>

        <div>

          <p className="text-sm font-medium text-stone-800">
            Fuel transaction
          </p>

          <p className="font-mono text-[11px] text-stone-400">
            {fmtLiters(
              Number(
                transaction.liters ?? 0,
              ),
            )}
          </p>

        </div>

      </div>


      <div className="text-right">

        <p className="text-[10px] text-stone-400">
          {new Date(
            transaction.createdAt,
          ).toLocaleString()}
        </p>

        {transaction.status && (
          <Badge
            variant="outline"
            className="mt-0.5 px-1.5 py-0 text-[10px]"
          >
            {transaction.status}
          </Badge>
        )}

      </div>

    </div>
  )
}


// ============================================================================
// FALLBACK ICON
// ============================================================================

function Building2Fallback() {
  return (
    <span className="text-sm font-semibold">
      ORG
    </span>
  )
}