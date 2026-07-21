import React from "react";
import { Bell, MapPin, Droplets } from "lucide-react";

/**
 * Mock "in progress fuel request" screen shown inside the PhoneFrame
 * on the product preview section.
 */
export const DriverAppScreen: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] text-white/40">Good afternoon</p>
        <p className="text-sm font-semibold text-white">Tolosa B.</p>
      </div>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06]">
        <Bell className="h-3.5 w-3.5 text-white/50" />
      </div>
    </div>

    <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
        </span>
        <span className="text-[10px] font-medium text-orange-400">
          Dispensing in progress
        </span>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-orange-500/15">
        <div className="h-full w-[64%] rounded-full bg-orange-500" />
      </div>
      <div className="mt-1.5 flex justify-between text-[9px] text-white/40">
        <span>32 L dispensed</span>
        <span>Target 50 L</span>
      </div>
    </div>

    <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/35">
        Request summary
      </p>
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-white/50">
          <MapPin className="h-3 w-3" /> Pump
        </span>
        <span className="font-medium text-white">A-04</span>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-white/50">
          <Droplets className="h-3 w-3" /> Fuel type
        </span>
        <span className="font-medium text-white">Diesel</span>
      </div>
    </div>

    <button className="w-full rounded-lg bg-teal-600 py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-teal-700">
      Find nearest station
    </button>
  </div>
);

export default DriverAppScreen;