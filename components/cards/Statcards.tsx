"use client"

import React from "react"
import { Gauge, Wallet, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { StationTransactionSummary } from "@/types/station-transaction"
import GaugeArc from "../Gaugearc"
import { liters, money } from "@/lib/utils"

function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  accent,
  gauge,
}: {
  title: string
  value?: string
  delta?: number
  icon: any
  accent: { bg: string; fg: string }
  gauge?: React.ReactNode
}) {
  const up = typeof delta === "number" ? delta >= 0 : true
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: accent.bg, color: accent.fg }}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        {typeof delta === "number" && (
          <span className={`stat-delta ${up ? "up" : "down"}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {gauge ? (
        gauge
      ) : (
        <>
          <p className="stat-value">{value}</p>
          <p className="stat-title">{title}</p>
        </>
      )}
      {gauge && (
        <p className="stat-title" style={{ marginTop: 2 }}>
          {title}
        </p>
      )}
    </div>
  )
}

export default function StatCards({ summary }: { summary?: StationTransactionSummary }) {
  return (
    <div className="stat-grid">
      <StatCard
        title="Liters dispensed"
        accent={{ bg: "var(--amber-bg)", fg: "var(--amber-dark)" }}
        icon={Gauge}
        gauge={
          <GaugeArc
            percent={summary ? Math.min(100, (summary.liters / 40000) * 100) : 0}
            label={liters(summary?.liters ?? 0)}
            sub="of 40,000 L daily plan"
          />
        }
      />
      <StatCard
        title="Revenue collected"
        value={money(summary?.revenue ?? 0)}
        icon={Wallet}
        accent={{ bg: "var(--green-bg)", fg: "var(--green)" }}
      />
      <StatCard
        title="Transactions"
        value={(summary?.transactions ?? 0).toLocaleString()}
        icon={Receipt}
        accent={{ bg: "#E8ECF3", fg: "var(--navy)" }}
      />
    </div>
  )
}