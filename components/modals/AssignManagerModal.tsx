"use client"

import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ManagerProps } from "@/types/station"
import { BaseModal } from "./BaseModal"
import { X } from "lucide-react"

export function AssignManagerModal({
  station,
  managers,
  trigger,
  page = 1,
  totalPages = 1,
  onPageChange,
  search = "",
  onSearchChange,
  loadingManagers = false,
  onAssign,
}: ManagerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [localSearch, setLocalSearch] = useState(search)

  const hasManager = Boolean(station?.managerId)

  /* ================= SYNC ================= */
  useEffect(() => {
    setSelected(station?.managerId || "")
  }, [station?.managerId])

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      onSearchChange?.(localSearch)
      onPageChange?.(1)
    }, 400)

    return () => clearTimeout(t)
  }, [localSearch])

  /* ================= OPEN ================= */
  const handleOpen = () => {
    setSelected(station?.managerId || "")
    setLocalSearch("")
    onSearchChange?.("")
    onPageChange?.(1)
    setOpen(true)
  }

  /* ================= ASSIGN / UPDATE ================= */
  const handleAssign = async () => {
    try {
      setSubmitting(true)

      await onAssign?.(station.id, selected)

      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  /* ================= REMOVE MANAGER ================= */
  const handleRemoveManager = async () => {
    try {
      setSubmitting(true)

      // send null → backend must support unassign
      await onAssign?.(station.id, null as any)

      setSelected("")
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedManager = managers.find((m) => m.id === selected)

  return (
    <>
      <div onClick={handleOpen}>{trigger}</div>

      <BaseModal
        open={open}
        onOpenChange={setOpen}
        title={hasManager ? "Manage Manager" : "Assign Manager"}
      >
        <div className="space-y-5">

          {/* ================= SEARCH ================= */}
          <Input
            placeholder="Search by name or phone..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />

          {/* ================= CURRENT MANAGER ================= */}
          {station?.managerId && (
            <div className="p-3 rounded-lg border bg-muted/40 flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground">
                  Current Manager
                </div>
                <div className="text-sm font-medium">
                  {station.manager?.name || "Assigned Manager"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {station.manager?.phone || ""}
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveManager}
                disabled={submitting}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}

          {/* ================= SELECTED PREVIEW ================= */}
          {/* {selected && (
            <div className="p-3 rounded-lg border bg-muted/40">
              <div className="text-xs text-muted-foreground mb-1">
                Selected Manager
              </div>
              <div className="text-sm font-medium">
                {selectedManager?.full_name || "Selected"}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedManager?.phone || ""}
              </div>
            </div>
          )} */}

          {/* ================= LIST ================= */}
          <div className="border rounded-xl overflow-hidden">
            <div className="max-h-64 overflow-auto divide-y">

              {loadingManagers ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : managers.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No managers found
                </div>
              ) : (
                managers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`p-3 cursor-pointer flex justify-between items-center transition ${
                      selected === m.id
                        ? "bg-primary/5 border-l-4 border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {m.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.phone || "No phone"}
                      </div>
                    </div>

                    {selected === m.id && (
                      <div className="text-xs text-primary font-medium">
                        Selected
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-between text-xs">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => onPageChange?.(page - 1)}
              >
                Prev
              </Button>

              <span>
                Page {page} / {totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => onPageChange?.(page + 1)}
              >
                Next
              </Button>
            </div>
          )}

          {/* ================= ACTION ================= */}
          <Button
            className="w-full"
            disabled={!selected || submitting}
            onClick={handleAssign}
          >
            {submitting
              ? "Processing..."
              : hasManager
              ? "Update Manager"
              : "Assign Manager"}
          </Button>

        </div>
      </BaseModal>
    </>
  )
}