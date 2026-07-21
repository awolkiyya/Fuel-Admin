import React from "react";
import { Search, ClipboardList } from "lucide-react";

interface RequestRow {
  driver: string;
  plate: string;
  vol: string;
  status: string;
  color: string;
}

const REQUESTS: RequestRow[] = [
  { driver: "Tolosa B.", plate: "OR-4471", vol: "50 L", status: "Dispensing", color: "text-orange-400" },
  { driver: "Sara M.", plate: "AA-1092", vol: "35 L", status: "Approved", color: "text-blue-400" },
  { driver: "Getu K.", plate: "OR-2208", vol: "80 L", status: "Completed", color: "text-teal-400" },
];

/**
 * Mock "pump requests" table shown inside the BrowserFrame on the
 * product preview section.
 */
export const StationDashboardScreen: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-white">Pump requests</p>
      <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/40">
        <Search className="h-3 w-3" />
        Search
      </div>
    </div>

    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="grid grid-cols-[1fr_1fr_1fr_0.8fr] bg-white/[0.04] px-3 py-1.5 text-[9px] font-medium uppercase tracking-wide text-white/35">
        <span>Driver</span>
        <span>Vehicle</span>
        <span>Volume</span>
        <span>Status</span>
      </div>

      {REQUESTS.map((row) => (
        <div
          key={row.plate}
          className="grid grid-cols-[1fr_1fr_1fr_0.8fr] items-center border-t border-white/[0.06] px-3 py-2 text-[10px] text-white/70"
        >
          <span className="font-medium text-white">{row.driver}</span>
          <span className="text-white/45">{row.plate}</span>
          <span>{row.vol}</span>
          <span className={`font-medium ${row.color}`}>{row.status}</span>
        </div>
      ))}
    </div>

    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-white/40">
      <ClipboardList className="h-3.5 w-3.5" />
      3 requests awaiting verification
    </div>
  </div>
);

export default StationDashboardScreen;