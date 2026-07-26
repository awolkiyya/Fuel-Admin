"use client"

import React from "react"
import { Building2, Car } from "lucide-react"
import type { FuelTransactionType } from "@/types/station-transaction"
import { getPaymentMeta } from "@/lib/utils"

export function Pill({ status }: { status?: string }) {
  const { color, bg, Icon, label } = getPaymentMeta(status)
  return (
    <span className="pill" style={{ color, background: bg }}>
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  )
}

export function TypeTag({ type }: { type: FuelTransactionType }) {
  const isOrg = type === "ORGANIZATION"
  return (
    <span
      className="typetag"
      style={{
        color: isOrg ? "var(--navy)" : "var(--amber-dark)",
        background: isOrg ? "#E8ECF3" : "var(--amber-bg)",
      }}
    >
      {isOrg ? <Building2 size={12} /> : <Car size={12} />}
      {isOrg ? "Organization" : "Normal"}
    </span>
  )
}