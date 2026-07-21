"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldAlert,
  Fingerprint,
  Clock,
  CheckCheck,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../EmptyState";

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */

const MOCK_RISKS = Array.from({ length: 18 }).map((_, i) => ({
  id: `risk_${i + 1}`,
  level: (["low", "medium", "high"] as const)[i % 3],
  status: (["active", "flagged", "blocked"] as const)[i % 3],
  reason:
    i % 2 === 0
      ? "Repeated fuel request cancellations within 24 hours."
      : "Detected irregular fuel request pattern outside assigned region.",
  detectedBy: i % 2 === 0 ? "system" : "station_manager",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

/* ───────────────────────────────────────────── */

type Props = {
  RISK_CLS: Record<string, string>;
  fmt: (v?: string) => string;
  InfoCell: any;
  Pill: any;
  limit?: number;
};

export function DriverRisks({
  RISK_CLS,
  fmt,
  InfoCell,
  Pill,
  limit = 5,
}: Props) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ─── FILTER STATE ───────────────────── */
  const [levelFilter, setLevelFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "flagged" | "blocked"
  >("all");

  /* ─── FILTER DATA FIRST ──────────────── */
  const filteredData = useMemo(() => {
    return MOCK_RISKS.filter((r) => {
      const levelOk = levelFilter === "all" || r.level === levelFilter;
      const statusOk =
        statusFilter === "all" || r.status === statusFilter;

      return levelOk && statusOk;
    });
  }, [levelFilter, statusFilter]);

  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);

  /* ─── PAGINATION ─────────────────────── */
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  /* reset page when filter changes */
  useEffect(() => {
    setPage(1);
  }, [levelFilter, statusFilter]);

  const counts = {
    low: paginated.filter((r) => r.level === "low").length,
    medium: paginated.filter((r) => r.level === "medium").length,
    high: paginated.filter((r) => r.level === "high").length,
  };

  if (!loading && paginated.length === 0) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="No risk flags found."
      />
    );
  }

  return (
    <div className="space-y-4">

      {/* ─── FILTER BAR ───────────────────── */}
      <div className="flex gap-2 flex-wrap">

        <select
          className="border rounded px-2 py-1 text-sm"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as any)}
        >
          <option value="all">All Levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
        </select>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setLevelFilter("all");
            setStatusFilter("all");
          }}
        >
          Reset
        </Button>
      </div>

      {/* ─── LIST ─────────────────────────── */}
      {paginated.map((risk) => (
        <div key={risk.id} className="bg-background border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold">Risk flag</span>
            </div>

            <div className="flex items-center gap-2">
              <Pill label={risk.level} cls={RISK_CLS[risk.level]} />
              <Pill
                label={risk.status}
                cls={
                  risk.status === "blocked"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : risk.status === "flagged"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }
              />
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="text-sm bg-muted/30 border rounded-lg px-4 py-3">
              {risk.reason}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCell icon={Fingerprint} label="Detected by" value={risk.detectedBy} />
              <InfoCell icon={Clock} label="Flagged on" value={fmt(risk.createdAt)} />
            </div>
          </div>
        </div>
      ))}

      {/* ─── PAGINATION ───────────────────── */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}