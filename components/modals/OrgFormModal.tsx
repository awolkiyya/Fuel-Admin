"use client"

import { useState } from "react"

import {
  Building2,
  Pencil,
} from "lucide-react"

import { Modal } from "./Modal"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

import {
  fieldClass,
  FieldLabel,
  ORG_TYPE_CONFIG,
  STATUS_CONFIG,
  Toggle,
} from "../ActionsMenu"

import type {
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrgStatus,
  OrgType,
} from "@/types/organization.types"

// ============================================================================
// PROPS
// ============================================================================

interface OrgFormModalProps {
  mode: "create" | "edit"

  initial?: Organization

  onClose: () => void

  onSubmit: (
    data:
      | CreateOrganizationPayload
      | UpdateOrganizationPayload,
  ) => void
}

// ============================================================================
// FORM VALUES
// ============================================================================
//
// IMPORTANT:
// registrationNumber is intentionally NOT included.
//
// The server is responsible for generating the
// organization registration number.
// ============================================================================

interface OrganizationFormState {
  name: string

  type: OrgType

  contactPerson: string

  phone: string

  email: string

  address: string

  allowFuelAccess: boolean

  requiresQuota: boolean

  maxTransactionLiters: number
}

// ============================================================================
// DEFAULT FORM
// ============================================================================

const DEFAULT_FORM_VALUES: OrganizationFormState = {
  name: "",

  type: "GOVERNMENT",

  contactPerson: "",

  phone: "",

  email: "",

  address: "",

  allowFuelAccess: true,

  requiresQuota: true,

  maxTransactionLiters: 5000,
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OrgFormModal({
  mode,

  initial,

  onClose,

  onSubmit,
}: OrgFormModalProps) {
  // ==========================================================================
  // FORM STATE
  // ==========================================================================

  const [form, setForm] =
    useState<OrganizationFormState>(
      initial
        ? {
            name:
              initial.name ?? "",

            type:
              initial.type,

            contactPerson:
              initial.contactPerson ?? "",

            phone:
              initial.phone ?? "",

            email:
              initial.email ?? "",

            address:
              initial.address ?? "",

            allowFuelAccess:
              initial.allowFuelAccess,

            requiresQuota:
              initial.requiresQuota,

            maxTransactionLiters:
              Number(
                initial.maxTransactionLiters ??
                  5000,
              ),
          }
        : DEFAULT_FORM_VALUES,
    )

  const [touched, setTouched] =
    useState(false)

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const isValid =
    form.name.trim() !== "" &&
    form.contactPerson.trim() !== "" &&
    form.phone.trim() !== "" &&
    Number(form.maxTransactionLiters) > 0

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const updateField = <
    K extends keyof OrganizationFormState,
  >(
    field: K,

    value: OrganizationFormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }))
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  const handleSubmit = () => {
    setTouched(true)

    if (!isValid) {
      return
    }

    // ========================================================================
    // CREATE
    // ========================================================================

    if (mode === "create") {
      const payload: CreateOrganizationPayload = {
        name: form.name.trim(),

        type: form.type,

        contactPerson:
          form.contactPerson.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim() || null,

        address:
          form.address.trim() || null,

        allowFuelAccess:
          form.allowFuelAccess,

        requiresQuota:
          form.requiresQuota,

        maxTransactionLiters:
          Number(
            form.maxTransactionLiters,
          ),
      }

      onSubmit(payload)

      return
    }

    // ========================================================================
    // EDIT
    // ========================================================================

    const payload: UpdateOrganizationPayload = {
      name: form.name.trim(),

      type: form.type,

      contactPerson:
        form.contactPerson.trim(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim() || null,

      address:
        form.address.trim() || null,

      allowFuelAccess:
        form.allowFuelAccess,

        requiresQuota:
        form.requiresQuota,

      maxTransactionLiters:
        Number(
          form.maxTransactionLiters,
        ),
    }

    onSubmit(payload)
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <Modal
      title={
        mode === "create"
          ? "Register organization"
          : "Edit organization"
      }

      subtitle={
        mode === "create"
          ? "New organizations start in Pending review until approved"
          : `Updating ${
              initial?.name ??
              "organization"
            }`
      }

      icon={
        mode === "create"
          ? Building2
          : Pencil
      }

      onClose={onClose}

      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            className="bg-stone-900 hover:bg-stone-800"
            onClick={handleSubmit}
          >
            {mode === "create"
              ? "Submit for review"
              : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        {/* ================================================================
            ORGANIZATION NAME
            ================================================================ */}

        <div>
          <FieldLabel required>
            Organization name
          </FieldLabel>

          <Input
            value={form.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            placeholder="e.g. Adama Water Supply Authority"
            className={fieldClass}
          />

          {touched &&
            form.name.trim() === "" && (
              <p className="mt-1 text-xs text-rose-500">
                Organization name is required.
              </p>
            )}
        </div>

        {/* ================================================================
            TYPE
            ================================================================ */}

        <div>
          <FieldLabel>
            Organization type
          </FieldLabel>

          <select
            value={form.type}
            onChange={(event) =>
              updateField(
                "type",
                event.target.value as OrgType,
              )
            }
            className={fieldClass}
          >
            {(
              Object.keys(
                ORG_TYPE_CONFIG,
              ) as OrgType[]
            ).map((type) => (
              <option
                key={type}
                value={type}
              >
                {
                  ORG_TYPE_CONFIG[type]
                    .label
                }
              </option>
            ))}
          </select>
        </div>

        {/* ================================================================
            REGISTRATION NUMBER
            ================================================================
            
            Server-generated.
            
            CREATE:
            Registration number does not exist yet.
            
            EDIT:
            Show the existing server-generated number as read-only.
            
            It is NEVER submitted from this form.
            ================================================================ */}

        {mode === "edit" &&
          initial?.registrationNumber && (
            <div>
              <FieldLabel>
                Registration No.
              </FieldLabel>

              <Input
                value={
                  initial.registrationNumber
                }
                readOnly
                disabled
                className={`${fieldClass} font-mono bg-stone-50`}
              />

              <p className="mt-1 text-[11px] text-stone-400">
                Registration number is
                generated and managed by
                the server.
              </p>
            </div>
          )}

        {mode === "create" && (
          <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5">
            <p className="text-xs font-medium text-stone-600">
              Registration number
            </p>

            <p className="mt-0.5 text-[11px] text-stone-400">
              A registration number will
              be generated automatically
              when the organization is
              created.
            </p>
          </div>
        )}

        {/* ================================================================
            STATUS — EDIT ONLY
            ================================================================ */}

        {mode === "edit" && (
          <div>
            <FieldLabel>
              Status
            </FieldLabel>

            <select
              value={
                initial?.status ??
                "PENDING"
              }
              disabled
              className={fieldClass}
            >
              {(
                Object.keys(
                  STATUS_CONFIG,
                ) as OrgStatus[]
              ).map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {
                    STATUS_CONFIG[
                      status
                    ].label
                  }
                </option>
              ))}
            </select>

            <p className="mt-1 text-[11px] text-stone-400">
              Organization status is
              managed separately.
            </p>
          </div>
        )}

        {/* ================================================================
            CONTACT
            ================================================================ */}

        <div className="grid grid-cols-2 gap-3">

          {/* CONTACT PERSON */}

          <div>
            <FieldLabel required>
              Contact person
            </FieldLabel>

            <Input
              value={
                form.contactPerson
              }
              onChange={(event) =>
                updateField(
                  "contactPerson",
                  event.target.value,
                )
              }
              placeholder="Full name"
              className={fieldClass}
            />

            {touched &&
              form.contactPerson.trim() ===
                "" && (
                <p className="mt-1 text-xs text-rose-500">
                  Contact person is
                  required.
                </p>
              )}
          </div>

          {/* PHONE */}

          <div>
            <FieldLabel required>
              Phone
            </FieldLabel>

            <Input
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="+251 9xx xxx xxx"
              className={`${fieldClass} font-mono`}
            />

            {touched &&
              form.phone.trim() === "" && (
                <p className="mt-1 text-xs text-rose-500">
                  Phone is required.
                </p>
              )}
          </div>

        </div>

        {/* ================================================================
            EMAIL
            ================================================================ */}

        <div>
          <FieldLabel>
            Email
          </FieldLabel>

          <Input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value,
              )
            }
            placeholder="contact@organization.et"
            className={`${fieldClass} font-mono`}
          />
        </div>

        {/* ================================================================
            ADDRESS
            ================================================================ */}

        <div>
          <FieldLabel>
            Address
          </FieldLabel>

          <textarea
            value={form.address}
            onChange={(event) =>
              updateField(
                "address",
                event.target.value,
              )
            }
            placeholder="Street, city"
            rows={2}
            className={fieldClass}
          />
        </div>

        {/* ================================================================
            MAX TRANSACTION
            ================================================================ */}

        <div>
          <FieldLabel>
            Max liters per transaction
          </FieldLabel>

          <Input
            type="number"
            min="1"
            value={
              form.maxTransactionLiters
            }
            onChange={(event) =>
              updateField(
                "maxTransactionLiters",
                Number(
                  event.target.value,
                ),
              )
            }
            className={`${fieldClass} font-mono`}
          />

          {touched &&
            Number(
              form.maxTransactionLiters,
            ) <= 0 && (
              <p className="mt-1 text-xs text-rose-500">
                Maximum transaction
                liters must be greater
                than zero.
              </p>
            )}
        </div>

        {/* ================================================================
            FUEL SETTINGS
            ================================================================ */}

        <div className="space-y-2">

          <Toggle
            checked={
              form.allowFuelAccess
            }
            onChange={(value) =>
              updateField(
                "allowFuelAccess",
                value,
              )
            }
            title="Allow fuel access"
            description={
              mode === "create"
                ? "Organization can fuel once approved"
                : "Organization can fuel right now"
            }
          />

          <Toggle
            checked={
              form.requiresQuota
            }
            onChange={(value) =>
              updateField(
                "requiresQuota",
                value,
              )
            }
            title="Enforce quota"
            description="Fueling is capped by allocated quota"
          />

        </div>

      </div>
    </Modal>
  )
}
