"use client"

import { useState } from "react"

import { Gauge } from "lucide-react"

import { Modal } from "./Modal"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import {
  fieldClass,
  FieldLabel,
  FuelGaugeArc,
} from "../ActionsMenu"

import {
  fmtLiters,
  todayISO,
} from "@/lib/utils"

import type {
  Organization,
} from "@/types/organization.types"

import {
  PERIOD_LABEL,
  PERIOD_TYPES,
  type QuotaFormState,
  type QuotaPeriodType,
} from "@/types/quota.types"

import { FuelTypeDropdown } from "../inputs/FuelTypeDropdown"
import { OrganizationDropdown } from "../inputs/OrganizationDropdown"
import { EthiopianDatePicker } from "../inputs/EthiopianDatePicker"

// ============================================================================
// DATE HELPERS
// ============================================================================

/**
 * Calculate the end date for predefined quota periods.
 *
 * CUSTOM does not calculate an end date because
 * the administrator selects it manually.
 */
function addPeriod(
  startDate: string,
  periodType: QuotaPeriodType,
): string {
  if (!startDate) {
    return ""
  }

  if (periodType === "CUSTOM") {
    return ""
  }

  const date = new Date(
    `${startDate}T00:00:00`,
  )

  switch (periodType) {
    case "DAILY":
      date.setDate(
        date.getDate() + 1,
      )
      break

    case "WEEKLY":
      date.setDate(
        date.getDate() + 7,
      )
      break

    case "MONTHLY":
      date.setMonth(
        date.getMonth() + 1,
      )
      break

    case "QUARTERLY":
      date.setMonth(
        date.getMonth() + 3,
      )
      break

    case "ANNUAL":
      date.setFullYear(
        date.getFullYear() + 1,
      )
      break
  }

  return date
    .toISOString()
    .split("T")[0]
}

/**
 * Convert an ISO date string:
 *
 * YYYY-MM-DD
 *
 * into a local JavaScript Date.
 *
 * We intentionally avoid:
 *
 * new Date("YYYY-MM-DD")
 *
 * because that is interpreted as UTC
 * and can cause timezone-related date shifts.
 */
function isoToDate(
  value: string,
): Date | undefined {
  if (!value) {
    return undefined
  }

  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number)

  if (
    !year ||
    !month ||
    !day
  ) {
    return undefined
  }

  return new Date(
    year,
    month - 1,
    day,
  )
}

/**
 * Convert a JavaScript Date into:
 *
 * YYYY-MM-DD
 *
 * using local date components.
 */
function dateToISO(
  date: Date,
): string {
  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0")

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// ============================================================================
// PROPS
// ============================================================================

interface AllocateQuotaModalProps {
  /**
   * Organizations already available to the parent.
   *
   * This is still accepted for compatibility and
   * for resolving locked organizations.
   *
   * Normal organization searching is handled by
   * OrganizationDropdown through organizationService.
   */
  organizations: Organization[]

  /**
   * When supplied, organization selection is locked.
   *
   * Normally used when opening the modal from a
   * specific organization row/detail panel.
   */
  lockedOrganizationId?: string

  onClose: () => void

  onSubmit: (
    data: QuotaFormState,
  ) => void
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AllocateQuotaModal({
  organizations,
  lockedOrganizationId,
  onClose,
  onSubmit,
}: AllocateQuotaModalProps) {
  // ==========================================================================
  // DEFAULT ORGANIZATION
  // ==========================================================================

  const defaultOrganizationId =
    lockedOrganizationId ??
    ""

  // ==========================================================================
  // INITIAL DATES
  // ==========================================================================

  const initialStartDate =
    todayISO()

  const initialEndDate =
    addPeriod(
      initialStartDate,
      "MONTHLY",
    )

  // ==========================================================================
  // FORM STATE
  // ==========================================================================

  const [form, setForm] =
    useState<QuotaFormState>({
      organizationId:
        defaultOrganizationId,

      fuelTypeId: "",

      periodType: "MONTHLY",

      startDate:
        initialStartDate,

      endDate:
        initialEndDate,

      allocatedLiters:
        "10000",

      remarks:
        "",
    })

  // ==========================================================================
  // VALIDATION STATE
  // ==========================================================================

  const [touched, setTouched] =
    useState(false)

  const [endDateError, setEndDateError] =
    useState<string | undefined>()

  // ==========================================================================
  // SELECTED ORGANIZATION
  // ==========================================================================

  /**
   * Keep the complete organization object returned
   * by OrganizationDropdown.
   *
   * This is important because the selected organization
   * may have been loaded from the server but may NOT
   * exist inside the parent's organizations array.
   */
  const [
    selectedOrganization,
    setSelectedOrganization,
  ] = useState<Organization | undefined>(() =>
    organizations.find(
      (organization) =>
        organization.id ===
        defaultOrganizationId,
    ),
  )

  // ==========================================================================
  // ALLOCATION VALUE
  // ==========================================================================

  const allocated =
    Number(
      form.allocatedLiters,
    )

  // ==========================================================================
  // CUSTOM PERIOD
  // ==========================================================================

  const isCustomPeriod =
    form.periodType === "CUSTOM"

  // ==========================================================================
  // TODAY
  // ==========================================================================

  const currentDate =
    todayISO()

  // ==========================================================================
  // END DATE VALIDATION
  // ==========================================================================

  /**
   * End date rules:
   *
   * 1. End date must exist.
   * 2. Start date must exist.
   * 3. End date must be after start date.
   * 4. CUSTOM end date cannot be before today.
   */
  const isEndDateValid =
    form.endDate !== "" &&
    form.startDate !== "" &&
    form.endDate > form.startDate &&
    (
      !isCustomPeriod ||
      form.endDate >= currentDate
    )

  // ==========================================================================
  // FORM VALIDATION
  // ==========================================================================

  const isValid =
    form.organizationId !== "" &&
    form.fuelTypeId !== "" &&
    Number.isFinite(allocated) &&
    allocated > 0 &&
    form.startDate !== "" &&
    isEndDateValid

  // ==========================================================================
  // GENERIC FIELD UPDATE
  // ==========================================================================

  const updateField = <
    K extends keyof QuotaFormState,
  >(
    field: K,
    value: QuotaFormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // ==========================================================================
  // ORGANIZATION CHANGE
  // ==========================================================================

  const handleOrganizationChange = (
    value: string,
    organization: Organization,
  ) => {
    updateField(
      "organizationId",
      value,
    )

    setSelectedOrganization(
      organization,
    )
  }

  // ==========================================================================
  // PERIOD CHANGE
  // ==========================================================================

  const handlePeriodChange = (
    periodType: QuotaPeriodType,
  ) => {
    setEndDateError(undefined)

    setForm((previous) => ({
      ...previous,

      periodType,

      /**
       * CUSTOM:
       *
       * Keep the existing manually selected
       * end date when possible.
       *
       * If no end date exists, use today.
       *
       * PREDEFINED:
       *
       * Automatically calculate the end date.
       */
      endDate:
        periodType === "CUSTOM"
          ? previous.endDate ||
            currentDate
          : addPeriod(
              previous.startDate,
              periodType,
            ),
    }))
  }

  // ==========================================================================
  // START DATE CHANGE
  // ==========================================================================

  const handleStartChange = (
    startDate: string,
  ) => {
    setEndDateError(undefined)

    setForm((previous) => ({
      ...previous,

      startDate,

      /**
       * CUSTOM:
       *
       * Do not automatically modify
       * the manually selected end date.
       *
       * PREDEFINED:
       *
       * Automatically recalculate it.
       */
      endDate:
        previous.periodType === "CUSTOM"
          ? previous.endDate
          : addPeriod(
              startDate,
              previous.periodType,
            ),
    }))
  }

  // ==========================================================================
  // END DATE CHANGE
  // ==========================================================================

  const handleEndChange = (
    endDate: string,
  ) => {
    // ------------------------------------------------------------------------
    // CUSTOM END DATE CANNOT BE BEFORE TODAY
    // ------------------------------------------------------------------------

    if (
      isCustomPeriod &&
      endDate < currentDate
    ) {
      setEndDateError(
        "Custom end date cannot be before today.",
      )

      return
    }

    // ------------------------------------------------------------------------
    // END DATE MUST BE AFTER START DATE
    // ------------------------------------------------------------------------

    if (
      form.startDate &&
      endDate <= form.startDate
    ) {
      setEndDateError(
        "End date must be after start date.",
      )

      return
    }

    // ------------------------------------------------------------------------
    // VALID DATE
    // ------------------------------------------------------------------------

    setEndDateError(undefined)

    updateField(
      "endDate",
      endDate,
    )
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  const handleSubmit = () => {
    setTouched(true)

    // ------------------------------------------------------------------------
    // CUSTOM END DATE VALIDATION
    // ------------------------------------------------------------------------

    if (
      isCustomPeriod &&
      form.endDate < currentDate
    ) {
      setEndDateError(
        "Custom end date cannot be before today.",
      )

      return
    }

    // ------------------------------------------------------------------------
    // START / END VALIDATION
    // ------------------------------------------------------------------------

    if (
      !form.startDate ||
      !form.endDate ||
      form.endDate <=
        form.startDate
    ) {
      setEndDateError(
        "End date must be after start date.",
      )

      return
    }

    // ------------------------------------------------------------------------
    // GENERAL VALIDATION
    // ------------------------------------------------------------------------

    if (!isValid) {
      return
    }

    /**
     * Submit only allocation input.
     *
     * The backend is responsible for:
     *
     * - organization validation
     * - fuel validation
     * - date validation
     * - reference number generation
     * - consumedLiters initialization
     * - remainingLiters calculation
     * - quota status
     */
    onSubmit(form)
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <Modal
      title="Allocate fuel quota"

      subtitle={
        selectedOrganization
          ? `For ${selectedOrganization.name}`
          : "Select an organization"
      }

      icon={Gauge}

      onClose={onClose}

      footer={
        <>
          {/* ================================================================
              CANCEL
              ================================================================ */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>

          {/* ================================================================
              SUBMIT
              ================================================================ */}

          <Button
            type="button"
            size="sm"
            className="bg-stone-900 hover:bg-stone-800"
            onClick={handleSubmit}
          >
            Allocate quota
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        {/* ================================================================
            ORGANIZATION
            ================================================================ */}

        {!lockedOrganizationId && (
          <div>
            <FieldLabel required>
              Organization
            </FieldLabel>

            <OrganizationDropdown
              value={
                form.organizationId ||
                null
              }

              onChange={
                handleOrganizationChange
              }
            />

            {touched &&
              form.organizationId ===
                "" && (
                <p className="mt-1 text-xs text-rose-500">
                  Organization is required.
                </p>
              )}
          </div>
        )}

        {/* ================================================================
            QUOTA WARNING
            ================================================================ */}

        {selectedOrganization &&
          !selectedOrganization.requiresQuota && (
            <Card className="border-amber-200 bg-amber-50/60 p-3">
              <p className="text-xs leading-5 text-amber-800">
                Quota enforcement is off
                for this organization.
                Allocating a quota will
                not cap consumption until
                quota enforcement is
                enabled.
              </p>
            </Card>
          )}

        {/* ================================================================
            FUEL + PERIOD
            ================================================================ */}

        <div className="grid grid-cols-2 gap-3">

          {/* ==============================================================
              FUEL TYPE
              ============================================================== */}

          <div>
            <FieldLabel required>
              Fuel type
            </FieldLabel>

            <FuelTypeDropdown
              value={
                form.fuelTypeId ||
                null
              }

              onChange={(value) => {
                updateField(
                  "fuelTypeId",
                  value,
                )
              }}
            />

            {touched &&
              form.fuelTypeId ===
                "" && (
                <p className="mt-1 text-xs text-rose-500">
                  Fuel type is required.
                </p>
              )}
          </div>

          {/* ==============================================================
              PERIOD
              ============================================================== */}

          <div>
            <FieldLabel required>
              Period
            </FieldLabel>

            <select
              value={
                form.periodType
              }

              onChange={(event) =>
                handlePeriodChange(
                  event.target
                    .value as QuotaPeriodType,
                )
              }

              className={fieldClass}
            >
              {PERIOD_TYPES.map(
                (period) => (
                  <option
                    key={period}
                    value={period}
                  >
                    {
                      PERIOD_LABEL[
                        period
                      ]
                    }
                  </option>
                ),
              )}
            </select>
          </div>

        </div>

        {/* ================================================================
            DATES
            ================================================================ */}

        <div className="grid grid-cols-2 gap-3">

          {/* ==============================================================
              START DATE
              ============================================================== */}

          <div>
            <FieldLabel required>
              Start date
            </FieldLabel>

            <EthiopianDatePicker
              value={isoToDate(
                form.startDate,
              )}

              onChange={(date) => {
                handleStartChange(
                  dateToISO(date),
                )
              }}

              placeholder="Select start date"
            />
          </div>

          {/* ==============================================================
              END DATE
              ============================================================== */}

          <div>
            <FieldLabel required>
              End date
            </FieldLabel>

            <EthiopianDatePicker
              value={isoToDate(
                form.endDate,
              )}

              onChange={(date) => {
                handleEndChange(
                  dateToISO(date),
                )
              }}

              placeholder="Select end date"

              disabled={
                !isCustomPeriod
              }

              error={
                endDateError ??
                (
                  touched &&
                  !isEndDateValid
                    ? "End date must be after start date."
                    : undefined
                )
              }
            />

            {/* ============================================================
                PREDEFINED PERIOD MESSAGE
                ============================================================ */}

            {!isCustomPeriod && (
              <p className="mt-1 text-[11px] text-stone-400">
                Automatically calculated
                from the selected period.
              </p>
            )}

            {/* ============================================================
                CUSTOM PERIOD MESSAGE
                ============================================================ */}

            {isCustomPeriod && (
              <p className="mt-1 text-[11px] text-stone-400">
                Custom end date must be
                today or later and after
                the start date.
              </p>
            )}
          </div>

        </div>

        {/* ================================================================
            ALLOCATION
            ================================================================ */}

        <div>
          <FieldLabel required>
            Allocated liters
          </FieldLabel>

          <Input
            type="number"
            min="1"
            step="0.01"
            value={
              form.allocatedLiters
            }
            onChange={(event) =>
              updateField(
                "allocatedLiters",
                event.target.value,
              )
            }
            className={`${fieldClass} font-mono`}
          />

          {touched &&
            allocated <= 0 && (
              <p className="mt-1 text-xs text-rose-500">
                Enter a liters amount
                greater than zero.
              </p>
            )}
        </div>

        {/* ================================================================
            REMARKS
            ================================================================ */}

        <div>
          <FieldLabel>
            Remarks
          </FieldLabel>

          <textarea
            value={
              form.remarks
            }
            onChange={(event) =>
              updateField(
                "remarks",
                event.target.value,
              )
            }
            placeholder="Optional note for this allocation"
            rows={2}
            className={fieldClass}
          />
        </div>

        {/* ================================================================
            PREVIEW
            ================================================================ */}

        {allocated > 0 && (
          <div className="flex items-center gap-3 rounded-md bg-stone-50 p-3">

            <FuelGaugeArc
              percent={0}
              size={64}
            />

            <p className="text-xs leading-5 text-stone-500">
              Preview — this quota
              opens at{" "}

              <span className="font-mono font-semibold text-stone-700">
                0%
              </span>{" "}

              consumed of{" "}

              <span className="font-mono font-semibold text-stone-700">
                {fmtLiters(
                  allocated,
                )}
              </span>
              .
            </p>

          </div>
        )}

      </div>
    </Modal>
  )
}